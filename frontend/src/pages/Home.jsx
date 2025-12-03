import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useChatStore from '../store/chatStore';
import api, { authAPI } from '../services/api';
import { Languages, LogOut, MessageSquare, Plus, User, RefreshCw, Globe, Moon, Sun } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { createConversation } = useChatStore();
  const navigate = useNavigate();
  const [showNewChat, setShowNewChat] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadUserConversations();
    }
  }, [user, navigate]);

  const loadUserConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/chat/conversations/user/${user.id}`);
      setConversations(response.data);
      
      for (const conv of response.data) {
        const partnerId = conv.participant1_id === user.id 
          ? conv.participant2_id 
          : conv.participant1_id;
        
        try {
          const partnerData = await authAPI.getUserById(partnerId);
          setPartners(prev => ({ ...prev, [partnerId]: partnerData }));
        } catch (error) {
          console.error('Error loading partner:', error);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartChat = async () => {
    if (partnerEmail.trim()) {
      try {
        const partner = await authAPI.searchUser(partnerEmail);
        const conversation = await createConversation(user.id, partner.id);
        
        if (conversation) {
          setShowNewChat(false);
          setPartnerEmail('');
          await loadUserConversations();
          navigate(`/chat/${conversation.id}`);
        }
      } catch (error) {
        alert(error.response?.data?.detail || 'User not found. Please check the email.');
      }
    }
  };

  const getLanguageEmoji = (language) => {
    const emojiMap = {
      'hindi': '🇮🇳', 'tamil': '🇮🇳', 'telugu': '🇮🇳', 'bengali': '🇮🇳',
      'marathi': '🇮🇳', 'gujarati': '🇮🇳', 'kannada': '🇮🇳', 'malayalam': '🇮🇳',
      'punjabi': '🇮🇳', 'odia': '🇮🇳', 'english': '🇬🇧', 'urdu': '🇵🇰',
      'assamese': '🇮🇳', 'sanskrit': '🇮🇳',
    };
    return emojiMap[language?.toLowerCase()] || '🌐';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Local Language Integrator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <div className="text-right">
                <p className="text-sm font-medium dark:text-white">{user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                  <span>{getLanguageEmoji(user.preferred_language)}</span>
                  <span>Language: {user.preferred_language}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Translation Feature Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Real-Time Translation</h2>
              <p className="text-blue-100">
                Chat in your language ({getLanguageEmoji(user.preferred_language)} {user.preferred_language}), 
                messages are automatically translated for your partner!
              </p>
            </div>
          </div>
        </div>

        {/* My Conversations Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold dark:text-white">My Conversations</h2>
            <button
              onClick={loadUserConversations}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading && conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No conversations yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start a new conversation to begin chatting!</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Your First Chat
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversations.map((conv) => {
                const partnerId = conv.participant1_id === user.id 
                  ? conv.participant2_id 
                  : conv.participant1_id;
                const partner = partners[partnerId];

                return (
                  <div
                    key={conv.id}
                    onClick={() => navigate(`/chat/${conv.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {partner ? partner.name[0].toUpperCase() : '?'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-white">
                          {partner ? partner.name : 'Loading...'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          {partner && (
                            <>
                              <span>{getLanguageEmoji(partner.preferred_language)}</span>
                              <span>Speaks {partner.preferred_language}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="border-t dark:border-gray-700 pt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {conv.last_message_at 
                          ? `Last message: ${new Date(conv.last_message_at).toLocaleString()}`
                          : 'No messages yet'}
                      </p>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                      Open Chat
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Start New Chat</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect with someone and start translating in real-time
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              New Conversation
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Voice Call</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Make a voice call with live translation
            </p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Your Profile</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              View and edit your profile settings
            </p>
            <button 
              onClick={() => navigate('/profile')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Supported Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎤</div>
              <p className="font-semibold dark:text-white">Voice Input</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Live now!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="font-semibold dark:text-white">Text Chat</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Live now!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌓</div>
              <p className="font-semibold dark:text-white">Dark Mode</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Enabled!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🇮🇳</div>
              <p className="font-semibold dark:text-white">14+ Languages</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Supported!</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">Start New Conversation</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter the email of the person you want to chat with. Messages will be automatically translated!
            </p>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
              placeholder="partner@email.com"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowNewChat(false);
                  setPartnerEmail('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStartChat}
                disabled={!partnerEmail.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}