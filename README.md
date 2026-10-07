# AI JANILA Complete

A working AI smart document assistant (HTML + Node.js + Python + Gemini API),
based on the *ELAI* company profile presentation.

**Features:** upload a PDF/TXT once, then summarize, explain terms, generate
reviewer notes, quizzes, flashcards, and ask questions about the document.

## Setup

1. Get a Gemini API key from https://aistudio.google.com/apikey
2. Set it in your terminal:

```powershell
$env:GEMINI_API_KEY = "your-key-here"
```

## Features

- 🔐 Login / register (session auth, hashed passwords)
- 💾 SQLite storage (users, documents, chat history survive restarts)
- ⚡ Gemini streaming answers (word-by-word)
- 🌓 Dark / light theme toggle, drag & drop upload
- 🎓 Difficulty levels + model selector (flash / pro)
- 📝 Interactive quiz mode with live scoring
- ⬇ Export all history as `.md`
- 🎤 Voice input (Web Speech API) + 🔊 text-to-speech answers
- 📎 Upload PDF, DOCX, PPTX, TXT, and images (Gemini Vision)
- ✨ Markdown-rendered streaming answers
- 🧠 Mind Map view (collapsible tree)
- 🔍 Scanned-PDF OCR via Gemini vision (auto-detected)
- 🐳 Dockerfiles + docker-compose, `.env` support, `render.yaml`

## Structure

- `index.html` — frontend (served by both backends)
- `server-node/server.js` — Node/Express backend (port 5000)
- `server-python/app.py` — Flask backend (port 5001)
- `janila.db` — SQLite database (auto-created)

## Option A — Node.js server (port 5000)

```powershell
cd server-node
npm install
node server.js
```

Open http://127.0.0.1:5000

## Option B — Python server (port 5001)

```powershell
cd server-python
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5001

## Option C — Docker

```powershell
copy .env.example .env   # add your GEMINI_API_KEY
docker compose up --build
```

Both servers serve the same `index.html` and expose:
- `POST /upload` (multipart file)
- `POST /api/chat` (`{ "feature": "chat|summarize|terms|notes|quiz|flashcards", "question": "..." }`)
