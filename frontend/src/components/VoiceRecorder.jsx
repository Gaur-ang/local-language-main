// import React, { useState, useEffect } from 'react';
// import { Mic, MicOff, Volume2 } from 'lucide-react';

// export default function VoiceRecorder({ onTranscript, language = 'en-US' }) {
//   const [isListening, setIsListening] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [transcript, setTranscript] = useState('');
//   const [isSupported, setIsSupported] = useState(true);

//   const languageMap = {
//     'english': 'en-IN', // Changed to Indian English for better accent recognition
//     'hindi': 'hi-IN',
//     'hinglish': 'en-IN', // Hinglish uses Indian English
//     'tamil': 'ta-IN',
//     'telugu': 'te-IN',
//     'bengali': 'bn-IN',
//     'marathi': 'mr-IN',
//     'gujarati': 'gu-IN',
//     'kannada': 'kn-IN',
//     'malayalam': 'ml-IN',
//     'punjabi': 'pa-IN',
//     'odia': 'or-IN',
//     'urdu': 'ur-IN',
//     'assamese': 'as-IN',
//     'sanskrit': 'sa-IN'
//   };

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
//     if (!SpeechRecognition) {
//       setIsSupported(false);
//       return;
//     }

//     const recognitionInstance = new SpeechRecognition();
//     recognitionInstance.continuous = false; // Changed to false for better accuracy
//     recognitionInstance.interimResults = true;
//     recognitionInstance.maxAlternatives = 3; // Get multiple alternatives
    
//     // Use the correct language code
//     const langCode = languageMap[language] || 'en-IN';
//     recognitionInstance.lang = langCode;
    
//     console.log('Speech recognition language set to:', langCode);

//     recognitionInstance.onstart = () => {
//       console.log('Speech recognition started');
//       setIsListening(true);
//     };

//     recognitionInstance.onresult = (event) => {
//       let interimTranscript = '';
//       let finalTranscript = '';

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
        
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript + ' ';
//           console.log('Final transcript:', transcript);
//         } else {
//           interimTranscript += transcript;
//           console.log('Interim transcript:', transcript);
//         }
//       }

//       if (finalTranscript) {
//         setTranscript(prev => prev + finalTranscript);
//         onTranscript(finalTranscript.trim());
        
//         // Restart listening for continuous input
//         if (isListening) {
//           setTimeout(() => {
//             if (recognitionInstance && isListening) {
//               try {
//                 recognitionInstance.start();
//               } catch (e) {
//                 console.log('Recognition already started');
//               }
//             }
//           }, 100);
//         }
//       }
//     };

//     recognitionInstance.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
      
//       if (event.error === 'no-speech') {
//         console.log('No speech detected, restarting...');
//         if (isListening) {
//           setTimeout(() => {
//             try {
//               recognitionInstance.start();
//             } catch (e) {
//               console.log('Recognition already started');
//             }
//           }, 100);
//         }
//       } else if (event.error !== 'aborted') {
//         setIsListening(false);
//       }
//     };

//     recognitionInstance.onend = () => {
//       console.log('Speech recognition ended');
//       if (isListening) {
//         // Auto-restart if still supposed to be listening
//         setTimeout(() => {
//           try {
//             recognitionInstance.start();
//           } catch (e) {
//             console.log('Could not restart recognition');
//             setIsListening(false);
//           }
//         }, 100);
//       }
//     };

//     setRecognition(recognitionInstance);

//     return () => {
//       if (recognitionInstance) {
//         try {
//           recognitionInstance.stop();
//         } catch (e) {
//           console.log('Recognition already stopped');
//         }
//       }
//     };
//   }, [language]);

//   const toggleListening = () => {
//     if (!recognition) return;

//     if (isListening) {
//       recognition.stop();
//       setIsListening(false);
//       console.log('Stopped listening');
//     } else {
//       setTranscript('');
//       try {
//         recognition.start();
//         console.log('Started listening');
//       } catch (e) {
//         console.error('Error starting recognition:', e);
//       }
//     }
//   };

//   if (!isSupported) {
//     return null;
//   }

//   return (
//     <button
//       onClick={toggleListening}
//       className={`p-3 rounded-lg transition-all ${
//         isListening
//           ? 'bg-red-500 text-white animate-pulse'
//           : 'hover:bg-gray-100 text-gray-600'
//       }`}
//       title={isListening ? 'Stop recording' : 'Start voice input'}
//     >
//       {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
//     </button>
//   );
// }

// export function TextToSpeech({ text, language = 'en-US' }) {
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const languageMap = {
//     'english': 'en-IN',
//     'hindi': 'hi-IN',
//     'hinglish': 'en-IN',
//     'tamil': 'ta-IN',
//     'telugu': 'te-IN',
//     'bengali': 'bn-IN',
//     'marathi': 'mr-IN',
//     'gujarati': 'gu-IN',
//     'kannada': 'kn-IN',
//     'malayalam': 'ml-IN',
//     'punjabi': 'pa-IN',
//     'odia': 'or-IN',
//     'urdu': 'ur-IN'
//   };

//   const speak = () => {
//     if (!text || !window.speechSynthesis) return;

//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = languageMap[language] || 'en-IN';
//     utterance.rate = 0.9;
//     utterance.pitch = 1.0;

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);
//     utterance.onerror = () => setIsSpeaking(false);

//     window.speechSynthesis.speak(utterance);
//   };

//   const stop = () => {
//     window.speechSynthesis.cancel();
//     setIsSpeaking(false);
//   };

//   if (!window.speechSynthesis) return null;

//   return (
//     <button
//       onClick={isSpeaking ? stop : speak}
//       className={`p-1 rounded transition-all ${
//         isSpeaking ? 'text-blue-600 animate-pulse' : 'text-gray-500 hover:text-blue-600'
//       }`}
//       title={isSpeaking ? 'Stop' : 'Read aloud'}
//     >
//       <Volume2 className="w-4 h-4" />
//     </button>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { translationAPI } from '../services/api';

export default function VoiceRecorder({ onTranscript, language = 'en-US', autoTranslate = false }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  const languageMap = {
    'english': 'en-US',
    'hindi': 'hi-IN',
    'tamil': 'ta-IN',
    'telugu': 'te-IN',
    'bengali': 'bn-IN',
    'marathi': 'mr-IN',
    'gujarati': 'gu-IN',
    'kannada': 'kn-IN',
    'malayalam': 'ml-IN',
    'punjabi': 'pa-IN',
    'odia': 'or-IN',
    'urdu': 'ur-IN'
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    // Always recognize in English first for better accuracy
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = async (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        const trimmedTranscript = finalTranscript.trim();
        setTranscript(trimmedTranscript);
        
        // If autoTranslate is enabled and target language is not English, translate
        if (autoTranslate && language !== 'english' && language !== 'en-US') {
          setIsTranslating(true);
          try {
            const translationResult = await translationAPI.translate(
              trimmedTranscript,
              language,
              'english'
            );
            onTranscript(translationResult.translated_text);
          } catch (error) {
            console.error('Translation error:', error);
            // Fall back to original text if translation fails
            onTranscript(trimmedTranscript);
          } finally {
            setIsTranslating(false);
          }
        } else {
          onTranscript(trimmedTranscript);
        }
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      setIsTranslating(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [language, autoTranslate]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isTranslating}
      className={`p-3 rounded-lg transition-all relative ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
      } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      {isTranslating && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
      )}
    </button>
  );
}

export function TextToSpeech({ text, language = 'en-US' }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const languageMap = {
    'english': 'en-US',
    'hindi': 'hi-IN',
    'tamil': 'ta-IN',
    'telugu': 'te-IN',
    'bengali': 'bn-IN',
    'marathi': 'mr-IN',
    'gujarati': 'gu-IN',
    'kannada': 'kn-IN',
    'malayalam': 'ml-IN',
    'punjabi': 'pa-IN'
  };

  const speak = () => {
    if (!text || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language] || 'en-US';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!window.speechSynthesis) return null;

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className={`p-1 rounded transition-all ${
        isSpeaking ? 'text-blue-600 animate-pulse' : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
      }`}
      title={isSpeaking ? 'Stop' : 'Read aloud'}
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
}