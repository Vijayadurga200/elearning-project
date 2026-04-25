from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
from datetime import datetime
from werkzeug.utils import secure_filename

# 🤖 OpenAI
#from openai import OpenAI

# Your existing modules
from backend.models.speech_handler import SpeechHandler
from backend.models.subtitle_generator import SubtitleGenerator
from backend.models.accessibility_service import accessibility_service

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# 🔐 API Key (replace with your real key)
client = OpenAI(api_key="sk-xxxx")

# Folders
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

# ✅ CREATE USERS FILE IF NOT EXISTS
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

# Init services
speech_handler = SpeechHandler()
subtitle_gen = SubtitleGenerator(model_size="base")

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
        users = read_json(USERS_FILE)

        new_user = {
            "id": str(len(users) + 1),
            "name": data.get("name"),
            "email": data.get("email"),
            "disability": data.get("disability"),
            "features": data.get("features"),
            "created_at": datetime.now().isoformat()
        }

        users.append(new_user)
        write_json(USERS_FILE, users)

        return jsonify({
            "success": True,
            "user": new_user,
            "total_users": len(users)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔥 NEW: LIVE USER COUNT API
@app.route('/api/users/count', methods=['GET'])
def get_user_count():
    users = read_json(USERS_FILE)
    return jsonify({
        "total_users": len(users)
    })

# ------------------ COURSES ------------------

@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        print("📁 Reading:", COURSES_FILE)

        courses = read_json(COURSES_FILE)

        print("✅ Loaded courses:", len(courses))

        return jsonify(courses)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify([])

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

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a simple AI tutor. Explain clearly."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        reply = response.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ Chat error:", str(e))
        return jsonify({"error": str(e)}), 500

# ------------------ HEALTH ------------------

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

# ------------------ RUN ------------------

if __name__ == '__main__':
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True, port=5000)
