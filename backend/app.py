from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename

# Your modules
from backend.models.speech_handler import SpeechHandler
from backend.models.subtitle_generator import SubtitleGenerator

app = Flask(__name__)

# ✅ CORS FIX (important for other devices)
CORS(app, resources={r"/*": {"origins": "*"}})

client = None

# ------------------ PATHS ------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, "data")

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static/uploads')
TTS_FOLDER = os.path.join(BASE_DIR, 'static/tts')

os.makedirs(DATA_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TTS_FOLDER, exist_ok=True)

USERS_FILE = os.path.join(DATA_FOLDER, "users.json")
COURSES_FILE = os.path.join(DATA_FOLDER, "courses.json")

# Create users file if missing
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

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

# ------------------ INIT ------------------

speech_handler = SpeechHandler()
subtitle_gen = SubtitleGenerator()

# ------------------ ROUTES ------------------

@app.route('/')
def home():
    return jsonify({"message": "API running", "status": "ok"})

# ------------------ USERS ------------------

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(read_json(USERS_FILE))

@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json(force=True)

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

        return jsonify({"success": True})

    except Exception as e:
        print("USER ERROR:", e)
        return jsonify({"error": str(e)}), 500

# ------------------ COURSES ------------------

@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        courses = read_json(COURSES_FILE)

        # 🔥 MAIN FIX: NEVER return empty
        if not courses:
            courses = [
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
                    "description": "Learn Python and ML basics",
                    "duration": "15 hours",
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
            ]

        return jsonify(courses)

    except Exception as e:
        print("COURSE ERROR:", e)
        return jsonify([]), 500

# ------------------ SPEECH ------------------

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

# ------------------ HEALTH ------------------

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

# ------------------ RUN ------------------

if __name__ == '__main__':
    app.run(debug=True, port=5000)
