# 🌐 Local Language Integrator

Real-time translation chat application for Indian languages - **100% FREE!**

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🗣️ **Real-time messaging** with Socket.io
- 🌍 **Free translation** - MyMemory API (500 requests/day)
- ⌨️ **Typing indicators** - See when partner is typing
- ✓✓ **Read receipts** - Know when messages are read
- 🟢 **Online/offline status** - Real-time presence
- 😊 **Emoji picker** - Express yourself better
- 🎨 **Beautiful UI** - Gradient design with animations
- 📱 **Responsive** - Works on all devices
- 🔒 **Secure** - JWT authentication
- 🔥 **Firebase backend** - Fast and reliable

## 🌍 Supported Languages

- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Odia (ଓଡ଼ିଆ)
- English
- Urdu (اردو)

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Socket.io** - Real-time communication
- **Firebase Admin SDK** - Database & authentication
- **MyMemory Translation API** - Free translation service
- **Python 3.10+**

### Frontend
- **React 19** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Socket.io Client** - Real-time messaging
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- Firebase account (free tier)
- Git

## 🔧 Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/local-language.git
cd local-language
```

### 2️⃣ Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3️⃣ Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Go to **Project Settings** ⚙️ → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the file as `firebase-credentials-local-language.json` in `backend/` folder

### 4️⃣ Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update values
# Generate JWT secret with:
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Update Firebase config (optional)
# Edit src/firebase.js with your Firebase web config
```

## 🏃 Running the Application

### Start Backend Server
```bash
cd backend
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

python -m uvicorn app.main:socket_app --reload
```

Backend will run on: http://localhost:8000

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## 📖 Usage

1. **Register** - Create an account with email and password
2. **Choose Language** - Select your preferred Indian language
3. **Start Chat** - Search for users by email
4. **Real-time Translation** - Messages automatically translate!

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/search/{email}` - Search user by email
- `GET /auth/user/{user_id}` - Get user by ID

### Chat
- `POST /chat/conversations` - Create/get conversation
- `GET /chat/conversations/{id}` - Get conversation details
- `GET /chat/conversations/user/{user_id}` - Get user's conversations
- `POST /chat/messages` - Send message
- `GET /chat/messages/{conversation_id}` - Get messages
- `PUT /chat/messages/{message_id}/read` - Mark message as read

### Socket Events
- `join_conversation` - Join a chat room
- `send_message` - Send real-time message
- `typing` - Typing indicator
- `user_joined` - User online notification
- `user_left` - User offline notification

## 🔒 Security

**⚠️ NEVER commit these files:**
- `firebase-credentials-local-language.json`
- `.env`
- Any API keys or secrets

**🔐 Best Practices:**
- Always use `.gitignore` to exclude sensitive files
- Use environment variables for configuration
- Regenerate credentials if accidentally exposed
- Keep dependencies updated

## 🐛 Known Issues

- MyMemory API limited to 500 requests/day (free tier)
- Some translations may not be perfect
- Voice/video calls not yet implemented

## 🚀 Future Enhancements

- [ ] Voice messages with speech-to-text
- [ ] File and image sharing
- [ ] Group chats (3+ people)
- [ ] Voice and video calls (WebRTC)
- [ ] Push notifications
- [ ] Message search functionality
- [ ] Dark mode
- [ ] Message reactions
- [ ] User profiles with avatars

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- [MyMemory Translation API](https://mymemory.translated.net/) - Free translation service
- [Firebase](https://firebase.google.com/) - Backend infrastructure
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [React](https://react.dev/) - Frontend library
- [Socket.io](https://socket.io/) - Real-time communication

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Made with 💙 using 100% FREE services!# aviral-
