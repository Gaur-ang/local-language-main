from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from .api import auth, chat

# Create FastAPI app
app = FastAPI(
    title="Local Language Integrator API",
    version="2.0.0",
    description="Real-time translation with sentiment analysis"
)

# Create Socket.IO server with proper CORS
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Wrap with Socket.IO
socket_app = socketio.ASGIApp(sio, app)

# CORS middleware - MUST be after Socket.IO wrap
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)

# Track online users
online_users = {}

@app.get("/")
async def root():
    return {
        "message": "Local Language Integrator API",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Real-time translation",
            "Sentiment analysis",
            "Voice input/output",
            "Read receipts",
            "Typing indicators",
            "Online status"
        ]
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "online_users": len(online_users)}

# Socket.IO events
@sio.event
async def connect(sid, environ):
    print(f"✅ Client connected: {sid}")
    await sio.emit('connection_response', {'status': 'connected', 'sid': sid}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")
    if sid in online_users:
        user_id = online_users[sid]
        del online_users[sid]
        await sio.emit('user_offline', {'user_id': user_id})

@sio.event
async def user_online(sid, data):
    """Track user online status"""
    user_id = data.get('user_id')
    online_users[sid] = user_id
    print(f"👤 User {user_id} is online (sid: {sid})")
    await sio.emit('user_online', {'user_id': user_id})

@sio.event
async def join_conversation(sid, data):
    """User joins a conversation room"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    
    await sio.enter_room(sid, conversation_id)
    print(f"👤 User {user_id} joined conversation {conversation_id}")
    
    await sio.emit('joined_conversation', {
        'conversation_id': conversation_id,
        'user_id': user_id
    }, room=conversation_id)

@sio.event
async def leave_conversation(sid, data):
    """User leaves a conversation room"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    
    await sio.leave_room(sid, conversation_id)
    print(f"👤 User {user_id} left conversation {conversation_id}")

@sio.event
async def send_message(sid, data):
    """Handle real-time message"""
    conversation_id = data.get('conversation_id')
    print(f"📨 Message sent to conversation {conversation_id}")
    print(f"Message data: {data}")
    await sio.emit('new_message', data, room=conversation_id)

@sio.event
async def typing(sid, data):
    """Handle typing indicator"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    is_typing = data.get('is_typing', True)
    
    await sio.emit('user_typing', {
        'conversation_id': conversation_id,
        'user_id': user_id,
        'is_typing': is_typing
    }, room=conversation_id, skip_sid=sid)
    
    print(f"⌨️ User {user_id} typing: {is_typing}")

@sio.event
async def message_read(sid, data):
    """Handle read receipt"""
    conversation_id = data.get('conversation_id')
    message_id = data.get('message_id')
    user_id = data.get('user_id')
    
    await sio.emit('message_read', {
        'message_id': message_id,
        'user_id': user_id
    }, room=conversation_id)
    
    print(f"✓✓ Message {message_id} read by {user_id}")

@sio.event
async def voice_call_request(sid, data):
    """Handle voice call request"""
    conversation_id = data.get('conversation_id')
    caller_id = data.get('caller_id')
    
    await sio.emit('incoming_call', {
        'conversation_id': conversation_id,
        'caller_id': caller_id
    }, room=conversation_id, skip_sid=sid)
    
    print(f"📞 Call request from {caller_id}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000, reload=True)