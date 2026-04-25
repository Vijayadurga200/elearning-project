import logging
from typing import List, Dict, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubtitleGenerator:
    def __init__(self):
        logger.warning("Whisper disabled — using mock subtitles")

    def generate_subtitles(self, video_file) -> List[Dict[str, Any]]:
        logger.info("Returning mock subtitles")
        return self._get_mock_subtitles()

    def generate_srt(self, subtitles: List[Dict[str, Any]]) -> str:
        srt_content = ""
        for i, subtitle in enumerate(subtitles, 1):
            start = self._format_time(subtitle["start"])
            end = self._format_time(subtitle["end"])

            srt_content += f"{i}\n{start} --> {end}\n{subtitle['text']}\n\n"

        return srt_content

    def _format_time(self, seconds):
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds % 1) * 1000)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"

    def _get_mock_subtitles(self):
        return [
            {"start": 0.0, "end": 3.0, "text": "Welcome to EduAccess."},
            {"start": 3.0, "end": 6.0, "text": "Accessible learning for everyone."},
            {"start": 6.0, "end": 9.0, "text": "AI-powered subtitle generation demo."}
        ]
