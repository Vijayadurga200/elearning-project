from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
from datetime import datetime
from werkzeug.utils import secure_filename

from backend.models.speech_handler import SpeechHandler
from backend.models.subtitle_generator import SubtitleGenerator
from backend.models.accessibility_service import accessibility_service

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# ✅ FIXED CORS (important for other devices)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

client = None

# ------------------ FOLDERS ------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, "data")

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static/uploads')
TTS_FOLDER = os.path.join(BASE_DIR, 'static/tts')
SUBTITLES_FOLDER = os.path.join(BASE_DIR, 'static/subtitles')

os.makedirs(DATA_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TTS_FOLDER, exist_ok=True)
os.makedirs(SUBTITLES_FOLDER, exist_ok=True)

USERS_FILE = os.path.join(DATA_FOLDER, "users.json")
COURSES_FILE = os.path.join(DATA_FOLDER, "courses.json")

# Create users file if not exists
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

# ------------------ INIT SERVICES ------------------

speech_handler = SpeechHandler()
subtitle_gen = SubtitleGenerator()

# ------------------ HELPERS ------------------

def read_json(file):
    try:
        if not os.path.exists(file):
            return []
        with open(file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def write_json(file, data):
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

# ------------------ ROUTES ------------------

@app.route('/')
def home():
    return jsonify({
        "message": "EduAccess API Running ✅",
        "status": "active"
    })

# ------------------ USERS ------------------

@app.route('/api/users', methods=['GET'])
def get_users():
    users = read_json(USERS_FILE)
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        users = read_json(USERS_FILE)

        new_user = {
            "id": str(len(users) + 1),
            "name": data.get("name", ""),
            "email": data.get("email", ""),
            "disability": data.get("disability", ""),
            "features": data.get("features", []),
            "created_at": datetime.now().isoformat()
        }

        users.append(new_user)
        write_json(USERS_FILE, users)

        return jsonify({
            "success": True,
            "user": new_user
        })

    except Exception as e:
        print("USER ERROR:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/count', methods=['GET'])
def get_user_count():
    users = read_json(USERS_FILE)
    return jsonify({"total_users": len(users)})

# ------------------ COURSES ------------------

@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        courses = read_json(COURSES_FILE)

        # 🔥 MAIN FIX: fallback data if empty (this solves your issue)
        if not courses:
            return jsonify([
                {
                    "id": "web-dev",
                    "title": "Modern Web Development",
                    "description": "Learn HTML, CSS, JavaScript, React",
                    "duration": "12 hours",
                    "level": "Beginner",
                    "thumbnail": ""
                },
                {
                    "id": "data-science",
                    "title": "Data Science Fundamentals",
                    "description": "Learn Python, Pandas, ML basics",
                    "duration": "15 hours",
                    "level": "Intermediate",
                    "thumbnail": ""
                },
                {
                    "id": "ui-ux",
                    "title": "UI/UX Design",
                    "description": "Learn UI/UX principles",
                    "duration": "10 hours",
                    "level": "Beginner",
                    "thumbnail": ""
                },
                {
                    "id": "cyber-security",
                    "title": "Cyber Security",
                    "description": "Learn system security basics",
                    "duration": "14 hours",
                    "level": "Intermediate",
                    "thumbnail": ""
                },
                {
                    "id": "ai-ml",
                    "title": "AI & Machine Learning",
                    "description": "Learn AI concepts",
                    "duration": "18 hours",
                    "level": "Advanced",
                    "thumbnail": ""
                }
            ])

        return jsonify(courses)

    except Exception as e:
        print("COURSE ERROR:", e)
        return jsonify([]), 500

# ------------------ ANALYTICS ------------------

@app.route('/api/analytics', methods=['GET'])
def analytics():
    users = read_json(USERS_FILE)
    courses = read_json(COURSES_FILE)

    return jsonify({
        "users": len(users),
        "courses": len(courses),
        "active": len(users),
        "total_users": len(users)
    })

# ------------------ SPEECH ------------------

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file"}), 400

    try:
        text = speech_handler.recognize_speech(request.files['audio'])
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text', '')

        audio_path = speech_handler.text_to_speech(text)

        return jsonify({
            "audio_url": f"/static/tts/{os.path.basename(audio_path)}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ SUBTITLES ------------------

@app.route('/api/generate-subtitles', methods=['POST'])
def generate_subtitles():
    if 'video' not in request.files:
        return jsonify({"error": "No file"}), 400

    try:
        file = request.files['video']
        filename = secure_filename(file.filename)

        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        subtitles = subtitle_gen.generate_subtitles(file)

        return jsonify({
            "success": True,
            "subtitles": subtitles
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ CHATBOT ------------------

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "Message required"}), 400

        if client is None:
            return jsonify({"reply": "Chatbot is temporarily disabled"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ HEALTH ------------------

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

# ------------------ RUN ------------------

if __name__ == '__main__':
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True, port=5000)
