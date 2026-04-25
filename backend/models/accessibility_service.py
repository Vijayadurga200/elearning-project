import re
import json
import logging
from typing import Dict, List, Any, Optional
from flask import jsonify

logger = logging.getLogger(__name__)

class AccessibilityService:
    def __init__(self):
        """Initialize accessibility command processor"""
        self.commands = {
            # Navigation commands
            'navigation': {
                'open dashboard': self._navigate_dashboard,
                'go home': self._navigate_dashboard,
                'dashboard': self._navigate_dashboard,
                'courses': self._navigate_courses,
                'open courses': self._navigate_courses,
                'profile': self._navigate_profile,
                'go to profile': self._navigate_profile,
                'settings': self._navigate_settings,
                'accessibility': self._navigate_settings,
                'back': self._navigate_back,
                'go back': self._navigate_back,
            },
            # Accessibility toggles
            'toggles': {
                'high contrast': self._toggle_high_contrast,
                'high contrast on': self._toggle_high_contrast,
                'high contrast off': self._toggle_high_contrast_off,
                'voice mode': self._toggle_voice_mode,
                'voice on': self._toggle_voice_mode_on,
                'voice off': self._toggle_voice_mode_off,
                'screen reader': self._toggle_screen_reader,
            },
            # Content actions
            'content': {
                'read aloud': self._read_current_content,
                'read lesson': self._read_current_content,
                'play video': self._play_video,
                'pause video': self._pause_video,
                'next lesson': self._next_lesson,
                'previous lesson': self._previous_lesson,
                'start quiz': self._start_quiz,
            },
            # Help & info
            'help': {
                'help': self._show_help,
                'commands': self._show_help,
                'what can you do': self._show_help,
            }
        }
        
        # User session state (in production, use Redis/database)
        self.user_sessions = {}
    
    def process_voice_command(self, command: str) -> Dict[str, Any]:
        """
        Process voice command and return response
        
        Args:
            command: Raw voice command text
            
        Returns:
            Dict with action, response, and success status
        """
        command_lower = command.lower().strip()
        logger.info(f"Processing voice command: '{command_lower}'")
        
        # Initialize session if new user
        session_id = "demo_user"  # In production: get from request
        if session_id not in self.user_sessions:
            self.user_sessions[session_id] = {
                'current_page': 'dashboard',
                'high_contrast': False,
                'voice_mode': False,
                'current_lesson': 0
            }
        
        session = self.user_sessions[session_id]
        
        # Try exact matches first
        for category, cmd_dict in self.commands.items():
            for trigger, handler in cmd_dict.items():
                if trigger in command_lower:
                    logger.info(f"Matched command: {trigger}")
                    result = handler(session, command_lower)
                    return {
                        'success': True,
                        'command': trigger,
                        'category': category,
                        'action': result.get('action', 'executed'),
                        'response': result.get('response', 'Command executed'),
                        'session': {
                            'page': session.get('current_page'),
                            'high_contrast': session.get('high_contrast'),
                            'voice_mode': session.get('voice_mode')
                        }
                    }
        
        # Fuzzy matching for common intents
        response = self._handle_fuzzy_command(command_lower, session)
        if response:
            return response
        
        # Default help response
        return {
            'success': False,
            'command': 'unknown',
            'response': "I didn't understand that. Say 'help' for available commands.",
            'suggestions': ['dashboard', 'courses', 'high contrast', 'read aloud', 'help']
        }
    
    def _navigate_dashboard(self, session: dict, command: str) -> dict:
        session['current_page'] = 'dashboard'
        return {
            'action': 'navigate',
            'response': "Navigating to dashboard. Welcome home!"
        }
    
    def _navigate_courses(self, session: dict, command: str) -> dict:
        session['current_page'] = 'courses'
        return {
            'action': 'navigate',
            'response': "Opening courses page. Here are your learning options."
        }
    
    def _navigate_profile(self, session: dict, command: str) -> dict:
        session['current_page'] = 'profile'
        return {
            'action': 'navigate',
            'response': "Opening your profile. Your learning stats are ready."
        }
    
    def _navigate_settings(self, session: dict, command: str) -> dict:
        session['current_page'] = 'accessibility'
        return {
            'action': 'navigate',
            'response': "Opening accessibility settings. Customize your experience."
        }
    
    def _navigate_back(self, session: dict, command: str) -> dict:
        previous_pages = ['courses', 'dashboard', 'profile']
        current_idx = previous_pages.index(session.get('current_page', 'dashboard'))
        session['current_page'] = previous_pages[max(0, current_idx - 1)]
        return {
            'action': 'navigate',
            'response': f"Going back to {session['current_page']}."
        }
    
    def _toggle_high_contrast(self, session: dict, command: str) -> dict:
        session['high_contrast'] = not session.get('high_contrast', False)
        status = "on" if session['high_contrast'] else "off"
        return {
            'action': 'toggle',
            'response': f"High contrast mode turned {status}. Screen updated."
        }
    
    def _toggle_high_contrast_off(self, session: dict, command: str) -> dict:
        session['high_contrast'] = False
        return {
            'action': 'toggle',
            'response': "High contrast mode turned off."
        }
    
    def _toggle_voice_mode(self, session: dict, command: str) -> dict:
        session['voice_mode'] = not session.get('voice_mode', False)
        status = "on" if session['voice_mode'] else "off"
        return {
            'action': 'toggle',
            'response': f"Voice mode turned {status}. Speak your commands!"
        }
    
    def _toggle_voice_mode_on(self, session: dict, command: str) -> dict:
        session['voice_mode'] = True
        return {
            'action': 'toggle',
            'response': "Voice mode activated. I'm listening!"
        }
    
    def _toggle_voice_mode_off(self, session: dict, command: str) -> dict:
        session['voice_mode'] = False
        return {
            'action': 'toggle',
            'response': "Voice mode deactivated."
        }
    
    def _toggle_screen_reader(self, session: dict, command: str) -> dict:
        # Simulate screen reader toggle
        return {
            'action': 'toggle',
            'response': "Screen reader optimization enabled for all content."
        }
    
    def _read_current_content(self, session: dict, command: str) -> dict:
        return {
            'action': 'tts',
            'response': "Reading current lesson content aloud.",
            'tts_text': "This is the lesson content. HTML CSS JavaScript React. Fully accessible learning platform."
        }
    
    def _play_video(self, session: dict, command: str) -> dict:
        return {
            'action': 'media',
            'response': "Playing current video lesson."
        }
    
    def _pause_video(self, session: dict, command: str) -> dict:
        return {
            'action': 'media',
            'response': "Video paused."
        }
    
    def _next_lesson(self, session: dict, command: str) -> dict:
        session['current_lesson'] = min(session.get('current_lesson', 0) + 1, 10)
        return {
            'action': 'navigate',
            'response': f"Moving to lesson {session['current_lesson'] + 1}."
        }
    
    def _previous_lesson(self, session: dict, command: str) -> dict:
        session['current_lesson'] = max(session.get('current_lesson', 0) - 1, 0)
        return {
            'action': 'navigate',
            'response': f"Moving to lesson {session['current_lesson'] + 1}."
        }
    
    def _start_quiz(self, session: dict, command: str) -> dict:
        return {
            'action': 'content',
            'response': "Starting quiz. First question loading."
        }
    
    def _show_help(self, session: dict, command: str) -> dict:
        help_text = """
Available commands:
Navigation: dashboard, courses, profile, settings, back
Accessibility: high contrast, voice mode, screen reader
Content: read aloud, play video, next lesson, start quiz
Say 'help' anytime for assistance.
        """.strip()
        return {
            'action': 'help',
            'response': help_text,
            'tts_text': "Available commands: dashboard, courses, profile, settings, high contrast, voice mode, read aloud, next lesson, help."
        }
    
    def _handle_fuzzy_command(self, command: str, session: dict) -> Optional[Dict[str, Any]]:
        """Handle fuzzy command matching"""
        command_words = command.split()
        
        # Course-related
        if any(word in command_words for word in ['course', 'lesson', 'class']):
            return {
                'success': True,
                'command': 'courses',
                'response': "Opening courses. Which course interests you?"
            }
        
        # Search intent
        if 'search' in command_words or 'find' in command_words:
            return {
                'success': True,
                'command': 'search',
                'response': "What would you like to search for?"
            }
        
        return None
    
    def get_session_stats(self, session_id: str) -> Dict[str, Any]:
        """Get user session statistics"""
        if session_id in self.user_sessions:
            return self.user_sessions[session_id]
        return {}

# Global instance for Flask app
accessibility_service = AccessibilityService()

# Test commands
if __name__ == "__main__":
    service = AccessibilityService()
    
    test_commands = [
        "open dashboard",
        "go to courses", 
        "high contrast on",
        "read aloud",
        "next lesson",
        "help"
    ]
    
    print("🧠 Accessibility Service Test:")
    for cmd in test_commands:
        result = service.process_voice_command(cmd)
        print(f"\nCommand: '{cmd}'")
        print(f"Response: {result['response']}")
        print(f"Action: {result['action']}")