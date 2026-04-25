import speech_recognition as sr
from gtts import gTTS
import os
import io
import wave

class SpeechHandler:
    def __init__(self):
        self.recognizer = sr.Recognizer()
    
    def recognize_speech(self, audio_file):
        """Convert speech to text using Google Speech Recognition"""
        try:
            with sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
            text = self.recognizer.recognize_google(audio)
            return text.lower()
        except sr.UnknownValueError:
            return "Sorry, I didn't catch that."
        except sr.RequestError:
            return "Speech service unavailable."
    
    def text_to_speech(self, text):
        """Convert text to speech and save as MP3"""
        tts = gTTS(text=text, lang='en', slow=False)
        timestamp = int(os.times()[4] * 1000)
        filename = f"tts_{timestamp}.mp3"
        filepath = os.path.join('static/tts', filename)
        tts.save(filepath)
        return filepath