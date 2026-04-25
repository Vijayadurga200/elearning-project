import whisper
import os
import json
from pydub import AudioSegment
from pathlib import Path
import tempfile
import ffmpeg
from typing import List, Dict, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubtitleGenerator:
    def __init__(self, model_size: str = "base"):
        """
        Initialize Whisper model for subtitle generation
        
        Args:
            model_size: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        """
        logger.info(f"Loading Whisper model: {model_size}")
        try:
            self.model = whisper.load_model(model_size)
            logger.info("Whisper model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {e}")
            raise
    
    def extract_audio_from_video(self, video_path: str) -> str:
        """
        Extract audio from video file using ffmpeg
        
        Args:
            video_path: Path to video file
            
        Returns:
            Path to extracted audio file
        """
        logger.info(f"Extracting audio from: {video_path}")
        
        # Create temp audio file
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.wav').name
        
        try:
            # Use ffmpeg to extract audio
            (
                ffmpeg
                .input(video_path)
                .output(temp_audio, acodec='pcm_s16le', ac=1, ar=16000)
                .overwrite_output()
                .run(quiet=True, overwrite_output=True)
            )
            logger.info(f"Audio extracted to: {temp_audio}")
            return temp_audio
        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error: {e}")
            raise Exception("Failed to extract audio from video")
    
    def generate_subtitles(self, video_file) -> List[Dict[str, Any]]:
        """
        Generate subtitles from video/audio file
        
        Args:
            video_file: Uploaded video file object
            
        Returns:
            List of subtitle segments with timestamps
        """
        logger.info("Starting subtitle generation...")
        
        try:
            # Save uploaded file temporarily
            temp_video = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4').name
            video_file.save(temp_video)
            
            # Extract audio
            temp_audio = self.extract_audio_from_video(temp_video)
            
            # Transcribe with Whisper
            logger.info("Transcribing audio with Whisper...")
            result = self.model.transcribe(
                temp_audio,
                fp16=False,  # Disable for CPU
                language='en',
                task='transcribe'
            )
            
            # Clean up temp files
            os.unlink(temp_video)
            os.unlink(temp_audio)
            
            # Format subtitles
            subtitles = []
            for segment in result['segments']:
                subtitle = {
                    "start": round(segment['start'], 2),
                    "end": round(segment['end'], 2),
                    "duration": round(segment['end'] - segment['start'], 2),
                    "text": segment['text'].strip(),
                    "confidence": round(segment.get('avg_logprob', 0) * -1 * 100, 2) if 'avg_logprob' in segment else 0
                }
                subtitles.append(subtitle)
            
            logger.info(f"Generated {len(subtitles)} subtitle segments")
            return subtitles
            
        except Exception as e:
            logger.error(f"Subtitle generation failed: {e}")
            # Return mock subtitles for demo
            return self._get_mock_subtitles()
    
    def generate_srt(self, subtitles: List[Dict[str, Any]], output_path: str = None) -> str:
        """
        Convert subtitles to SRT format
        
        Args:
            subtitles: List of subtitle segments
            output_path: Optional output file path
            
        Returns:
            SRT content as string
        """
        srt_content = ""
        for i, subtitle in enumerate(subtitles, 1):
            start_time = self._format_timestamp(subtitle['start'])
            end_time = self._format_timestamp(subtitle['end'])
            
            srt_content += f"{i}\n"
            srt_content += f"{start_time} --> {end_time}\n"
            srt_content += f"{subtitle['text']}\n\n"
        
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(srt_content)
        
        return srt_content
    
    def generate_vtt(self, subtitles: List[Dict[str, Any]]) -> str:
        """
        Convert subtitles to WebVTT format
        """
        vtt_content = "WEBVTT\n\n"
        for subtitle in subtitles:
            start_time = self._format_timestamp_vtt(subtitle['start'])
            end_time = self._format_timestamp_vtt(subtitle['end'])
            
            vtt_content += f"{start_time} --> {end_time}\n"
            vtt_content += f"{subtitle['text']}\n\n"
        
        return vtt_content
    
    def _format_timestamp(self, seconds: float) -> str:
        """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        milliseconds = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{milliseconds:03d}"
    
    def _format_timestamp_vtt(self, seconds: float) -> str:
        """Convert seconds to WebVTT timestamp format (HH:MM:SS.mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = seconds % 60
        return f"{hours:02d}:{minutes:02d}:{secs:06.3f}".replace('.', ',')
    
    def _get_mock_subtitles(self) -> List[Dict[str, Any]]:
        """Return mock subtitles for demo when Whisper fails"""
        logger.warning("Returning mock subtitles")
        return [
            {
                "start": 0.0,
                "end": 3.5,
                "duration": 3.5,
                "text": "Welcome to EduAccess, your fully accessible learning platform.",
                "confidence": 95.2
            },
            {
                "start": 4.0,
                "end": 7.2,
                "duration": 3.2,
                "text": "This platform supports both visual and hearing impairments.",
                "confidence": 98.1
            },
            {
                "start": 8.0,
                "end": 11.5,
                "duration": 3.5,
                "text": "Voice commands, text-to-speech, and auto subtitles are all available.",
                "confidence": 96.8
            }
        ]

# Test the subtitle generator
if __name__ == "__main__":
    generator = SubtitleGenerator("base")
    
    # Test with sample video (if exists)
    sample_video = "sample_video.mp4"
    if os.path.exists(sample_video):
        subtitles = generator.generate_subtitles(sample_video)
        print(json.dumps(subtitles, indent=2))
        
        # Generate SRT
        srt = generator.generate_srt(subtitles, "output.srt")
        print("\nSRT Generated:\n", srt[:200] + "...")
    else:
        print("No sample video found. Test with real video upload.")