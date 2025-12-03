import { create } from 'zustand';
import { chatAPI } from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,

  createConversation: async (participant1_id, participant2_id) => {
    set({ loading: true });
    try {
      const conversation = await chatAPI.createConversation(participant1_id, participant2_id);
      set((state) => ({
        conversations: [...state.conversations, conversation],
        currentConversation: conversation,
        loading: false,
      }));
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      set({ loading: false });
      return null;
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  loadMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const messages = await chatAPI.getMessages(conversationId);
      set({ messages, loading: false });
    } catch (error) {
      console.error('Error loading messages:', error);
      set({ loading: false });
    }
  },

  addMessage: (message) => {
    set((state) => {
      // Check if message already exists (by ID or by timestamp+text)
      const exists = state.messages.some(
        (m) => 
          m.id === message.id || 
          (m.text === message.text && 
          m.sender_id === message.sender_id && 
          Math.abs(new Date(m.timestamp) - new Date(message.timestamp)) < 1000)
      );
      
      if (exists) {
        return state; // Don't add duplicate
      }
      
      return {
        messages: [...state.messages, message],
      };
    });
  },

  sendMessage: async (messageData) => {
    try {
      const message = await chatAPI.sendMessage(messageData);
      get().addMessage(message);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },
}));

export default useChatStore;