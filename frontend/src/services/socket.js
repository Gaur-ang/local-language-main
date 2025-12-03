import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket?.connected) {
      console.log('Already connected to socket server');
      return this.socket;
    }

    console.log('Connecting to socket server:', SOCKET_URL);
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server, socket ID:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server, reason:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('connection_response', (data) => {
      console.log('Connection response:', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Disconnected from socket server');
    }
  }

  userOnline(userId) {
    if (this.socket && this.isConnected) {
      console.log('Sending user_online:', userId);
      this.socket.emit('user_online', { user_id: userId });
    }
  }

  joinConversation(conversationId, userId) {
    if (this.socket && this.isConnected) {
      console.log('Joining conversation:', conversationId);
      this.socket.emit('join_conversation', {
        conversation_id: conversationId,
        user_id: userId,
      });
    }
  }

  leaveConversation(conversationId, userId) {
    if (this.socket && this.isConnected) {
      console.log('Leaving conversation:', conversationId);
      this.socket.emit('leave_conversation', {
        conversation_id: conversationId,
        user_id: userId,
      });
    }
  }

  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      console.log('Sending message via socket:', messageData);
      this.socket.emit('send_message', messageData);
    }
  }

  sendTyping(conversationId, userId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        conversation_id: conversationId,
        user_id: userId,
        is_typing: isTyping,
      });
    }
  }

  markMessageRead(conversationId, messageId, userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_read', {
        conversation_id: conversationId,
        message_id: messageId,
        user_id: userId,
      });
    }
  }

  requestVoiceCall(conversationId, callerId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('voice_call_request', {
        conversation_id: conversationId,
        caller_id: callerId,
      });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onJoinedConversation(callback) {
    if (this.socket) {
      this.socket.on('joined_conversation', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on('message_read', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  onIncomingCall(callback) {
    if (this.socket) {
      this.socket.on('incoming_call', callback);
    }
  }

  // Remove specific event listeners
  offNewMessage() {
    if (this.socket) {
      this.socket.off('new_message');
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();