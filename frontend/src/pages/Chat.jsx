import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI, chatAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import useThemeStore from '../store/themeStore';
import socketService from '../services/socket';
import VoiceRecorder, { TextToSpeech } from '../components/VoiceRecorder';
import { Send, ArrowLeft, Phone, Video, MoreVertical, Languages, Moon, Sun } from 'lucide-react';

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, loadMessages, sendMessage, addMessage } = useChatStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [partner, setPartner] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const initChat = async () => {
      const socket = socketService.connect();
      setIsConnected(true);
      socketService.userOnline(user.id);
      socketService.joinConversation(conversationId, user.id);

      try {
        const conversation = await chatAPI.getConversation(conversationId);
        const partnerId = conversation.participant1_id === user.id 
          ? conversation.participant2_id 
          : conversation.participant1_id;
        const partnerData = await authAPI.getUserById(partnerId);
        setPartner(partnerData);
      } catch (error) {
        console.error('Error loading conversation:', error);
      }

      loadMessages(conversationId);

      socketService.onNewMessage((data) => {
        addMessage(data);
        if (data.sender_id !== user.id) {
          socketService.markMessageRead(conversationId, data.id, user.id);
        }
      });

      socketService.onUserTyping((data) => {
        if (data.user_id !== user.id) {
          setPartnerTyping(data.is_typing);
        }
      });

      socketService.onUserOnline((data) => {
        if (partner && data.user_id === partner.id) {
          setPartnerOnline(true);
        }
      });

      socketService.onUserOffline((data) => {
        if (partner && data.user_id === partner.id) {
          setPartnerOnline(false);
        }
      });

      socketService.onJoinedConversation((data) => {
        console.log('Joined conversation:', data);
      });
    };

    initChat();

    return () => {
      socketService.disconnect();
    };
  }, [conversationId, user, navigate, partner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (isTyping) => {
    socketService.sendTyping(conversationId, user.id, isTyping);
  };

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    handleTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  };

  const handleVoiceTranscript = (transcript) => {
    setMessageText(prev => (prev + ' ' + transcript).trim());
    handleTyping(true);
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        text: messageText,
        language: user.preferred_language,
        translated_language: partner?.preferred_language || 'english',
      };

      setMessageText('');
      setIsTranslating(true);
      handleTyping(false);

      try {
        const savedMessage = await sendMessage(messageData);
        socketService.sendMessage({
          ...savedMessage,
          timestamp: savedMessage.timestamp || new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error sending message:', error);
        setMessageText(messageData.text);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getLanguageEmoji = (language) => {
    const emojiMap = {
      'hindi': '🇮🇳', 'tamil': '🇮🇳', 'telugu': '🇮🇳', 'bengali': '🇮🇳',
      'marathi': '🇮🇳', 'gujarati': '🇮🇳', 'kannada': '🇮🇳', 'malayalam': '🇮🇳',
      'punjabi': '🇮🇳', 'odia': '🇮🇳', 'english': '🇬🇧', 'urdu': '🇵🇰',
    };
    return emojiMap[language?.toLowerCase()] || '🌐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6 dark:text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {partner ? partner.name[0].toUpperCase() : 'P'}
                  </div>
                  {partnerOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">{partner ? partner.name : 'Partner'}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {partner && (
                      <span className="flex items-center gap-1">
                        <span>{getLanguageEmoji(partner.preferred_language)}</span>
                        <span>Speaks {partner.preferred_language}</span>
                      </span>
                    )}
                    {' • '}
                    {partnerOnline ? '🟢 Online' : '⚫ Offline'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={`p-2 rounded-lg transition-all ${showTranslation ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Languages className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Translation Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm">
          <Languages className="w-4 h-4" />
          <span>
            Auto-translating: You ({getLanguageEmoji(user?.preferred_language)} {user?.preferred_language}) 
            ↔️ 
            {partner && `${partner.name} (${getLanguageEmoji(partner.preferred_language)} ${partner.preferred_language})`}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">Start Your Conversation!</p>
            <p className="text-gray-500 dark:text-gray-400">Messages will be automatically translated between languages</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isSender = msg.sender_id === user?.id;
              const hasTranslation = msg.translated_text && msg.translated_text !== msg.text;
              
              return (
                <div key={msg.id || index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md rounded-2xl p-4 shadow-md ${
                      isSender
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {msg.sentiment_emoji && (
                      <div className="text-2xl mb-2">{msg.sentiment_emoji}</div>
                    )}

                    <div className="mb-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs opacity-75">
                          {getLanguageEmoji(msg.language)} {msg.language}
                        </span>
                        {!isSender && (
                          <TextToSpeech text={msg.text} language={msg.language} />
                        )}
                      </div>
                      <p className="font-medium">{msg.text}</p>
                    </div>

                    {showTranslation && hasTranslation && (
                      <div
                        className={`text-sm italic border-t pt-2 mt-2 ${
                          isSender ? 'border-blue-400 text-blue-100' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <Languages className="w-3 h-3" />
                            <span className="text-xs opacity-75">
                              {getLanguageEmoji(msg.translated_language)} {msg.translated_language}
                            </span>
                          </div>
                          {isSender && (
                            <TextToSpeech text={msg.translated_text} language={msg.translated_language} />
                          )}
                        </div>
                        <p>{msg.translated_text}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end mt-2 text-xs opacity-70">
                      <span>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Now'}
                      </span>
                      {isSender && msg.read && <span className="ml-1">✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {partnerTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{partner?.name} is typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {isTranslating && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-t border-yellow-300 dark:border-yellow-700 py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
            <span>Translating your message...</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-end space-x-2">
            <VoiceRecorder 
              onTranscript={handleVoiceTranscript} 
              language={user?.preferred_language}
              autoTranslate={true}
            />
            <textarea
              value={messageText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder={`Type in ${user?.preferred_language}...`}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="1"
              style={{ maxHeight: '120px' }}
              disabled={isTranslating}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isTranslating}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
            <Languages className="w-3 h-3" />
            Voice input with auto-translation enabled • Speak in any language
          </p>
        </div>
      </div>
    </div>
  );
}