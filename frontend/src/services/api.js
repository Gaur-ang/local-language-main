import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  searchUser: async (email) => {
    const response = await api.get(`/auth/search/${email}`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  createConversation: async (participant1_id, participant2_id) => {
    const response = await api.post('/chat/conversations', {
      participant1_id,
      participant2_id,
    });
    return response.data;
  },
  
  getConversation: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },
  
  sendMessage: async (messageData) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },
  
  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  },
};

// Translation API
export const translationAPI = {
  translate: async (text, targetLanguage, sourceLanguage = null) => {
    const response = await api.post('/chat/translate', {
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
    });
    return response.data;
  },

  getSupportedLanguages: async () => {
    const response = await api.get('/chat/languages');
    return response.data;
  },
};

export default api;