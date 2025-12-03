import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Languages } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferred_language: 'hinglish', // Default to Hinglish for Indian users
  });
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  // Extended list with Hinglish support
  const indianLanguages = [
    { code: 'hinglish', name: 'Hinglish 🇮🇳 ⭐ RECOMMENDED', description: 'Mix of Hindi & English - Best for Indian accent' },
    { code: 'english', name: 'English 🇬🇧', description: 'Standard English' },
    { code: 'hindi', name: 'Hindi (हिंदी) 🇮🇳', description: 'Standard Hindi' },
    { code: 'tamil', name: 'Tamil (தமிழ்) 🇮🇳', description: 'Tamil language' },
    { code: 'telugu', name: 'Telugu (తెలుగు) 🇮🇳', description: 'Telugu language' },
    { code: 'bengali', name: 'Bengali (বাংলা) 🇮🇳', description: 'Bengali language' },
    { code: 'marathi', name: 'Marathi (मराठी) 🇮🇳', description: 'Marathi language' },
    { code: 'gujarati', name: 'Gujarati (ગુજરાતી) 🇮🇳', description: 'Gujarati language' },
    { code: 'kannada', name: 'Kannada (ಕನ್ನಡ) 🇮🇳', description: 'Kannada language' },
    { code: 'malayalam', name: 'Malayalam (മലയാളം) 🇮🇳', description: 'Malayalam language' },
    { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ) 🇮🇳', description: 'Punjabi language' },
    { code: 'odia', name: 'Odia (ଓଡ଼ିଆ) 🇮🇳', description: 'Odia language' },
    { code: 'urdu', name: 'Urdu (اردو) 🇵🇰', description: 'Urdu language' },
    { code: 'assamese', name: 'Assamese (অসমীয়া) 🇮🇳', description: 'Assamese language' },
    { code: 'sanskrit', name: 'Sanskrit (संस्कृतम्) 🇮🇳', description: 'Sanskrit language' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Languages className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">Join Local Language Integrator</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {indianLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>{indianLanguages.find(l => l.code === formData.preferred_language)?.name}</strong>
                <br />
                {indianLanguages.find(l => l.code === formData.preferred_language)?.description}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login here
          </Link>
        </p>

        {/* Hinglish Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Why Hinglish is Recommended?
          </h4>
          <p className="text-sm text-orange-700">
            <strong>Hinglish</strong> is perfect for Indian users! It understands when you naturally mix Hindi and English:
            <br />
            <br />
            ✅ "Aaj main market jaa raha hoon"
            <br />
            ✅ "I'm going to market aaj"
            <br />
            ✅ "Yaar, this is so confusing"
            <br />
            <br />
            <strong>Best voice recognition for Indian accent!</strong>
          </p>
        </div>

        {/* Supported Languages Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold">15+ Languages Supported</span>
            <br />
            <span className="text-xs">Hinglish, English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, Assamese, Sanskrit</span>
          </p>
        </div>
      </div>
    </div>
  ); 
}



// // Register.jsx (separate file)
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import useAuthStore from '../store/authStore';
// import useThemeStore from '../store/themeStore';
// import { Languages, Moon, Sun } from 'lucide-react';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     preferred_language: 'hindi',
//   });
//   const { register, loading, error } = useAuthStore();
//   const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     initTheme();
//   }, []);

//   const indianLanguages = [
//     { code: 'english', name: 'English 🇬🇧' },
//     { code: 'hindi', name: 'Hindi (हिंदी) 🇮🇳' },
//     { code: 'tamil', name: 'Tamil (தமிழ்) 🇮🇳' },
//     { code: 'telugu', name: 'Telugu (తెలుగు) 🇮🇳' },
//     { code: 'bengali', name: 'Bengali (বাংলা) 🇮🇳' },
//     { code: 'marathi', name: 'Marathi (मराठी) 🇮🇳' },
//     { code: 'gujarati', name: 'Gujarati (ગુજરાતી) 🇮🇳' },
//     { code: 'kannada', name: 'Kannada (ಕನ್ನಡ) 🇮🇳' },
//     { code: 'malayalam', name: 'Malayalam (മലയാളം) 🇮🇳' },
//     { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ) 🇮🇳' },
//     { code: 'odia', name: 'Odia (ଓଡ଼ିଆ) 🇮🇳' },
//     { code: 'urdu', name: 'Urdu (اردو) 🇵🇰' },
//     { code: 'assamese', name: 'Assamese (অসমীয়া) 🇮🇳' },
//     { code: 'sanskrit', name: 'Sanskrit (संस्कृतम्) 🇮🇳' },
//   ];

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await register(formData);
//     if (success) {
//       navigate('/home');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//             title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//           >
//             {isDarkMode ? (
//               <Sun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <Moon className="w-5 h-5 text-gray-700" />
//             )}
//           </button>
//         </div>

//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
//             <Languages className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Create Account
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Join Local Language Integrator</p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="John Doe"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="your@email.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="••••••••"
//               required
//               minLength={6}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Preferred Language
//             </label>
//             <select
//               name="preferred_language"
//               value={formData.preferred_language}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {indianLanguages.map((lang) => (
//                 <option key={lang.code} value={lang.code}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//               Messages you receive will be translated to this language
//             </p>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
//           >
//             {loading ? 'Creating Account...' : 'Register'}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
//             Login here
//           </Link>
//         </p>

//         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg">
//           <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
//             <span className="font-semibold">14+ Languages Supported</span>
//             <br />
//             <span className="text-xs">Voice input with auto-translation • Dark mode • Real-time messaging</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }