from deep_translator import GoogleTranslator
from langdetect import detect
import asyncio
from typing import Dict

class TranslationService:
    def __init__(self):
        # Language mapping for display names to codes
        self.language_map = {
            'hindi': 'hi',
            'tamil': 'ta',
            'telugu': 'te',
            'bengali': 'bn',
            'marathi': 'mr',
            'gujarati': 'gu',
            'kannada': 'kn',
            'malayalam': 'ml',
            'punjabi': 'pa',
            'odia': 'or',
            'english': 'en',
            'urdu': 'ur',
            'assamese': 'as',
            'sanskrit': 'sa'
        }
        
        # Reverse mapping for code to name
        self.code_to_language = {v: k for k, v in self.language_map.items()}
    
    def get_language_code(self, language: str) -> str:
        """Convert language name to code"""
        return self.language_map.get(language.lower(), language.lower())
    
    def get_language_name(self, code: str) -> str:
        """Convert language code to name"""
        return self.code_to_language.get(code.lower(), code)
    
    def detect_language(self, text: str) -> str:
        """Detect language from text and return language name"""
        try:
            detected_code = detect(text)
            return self.get_language_name(detected_code)
        except Exception as e:
            print(f"Language detection error: {e}")
            return 'english'
    
    async def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translate text using deep-translator (Google Translate API)
        """
        try:
            # Convert language names to codes
            source_code = self.get_language_code(source_lang)
            target_code = self.get_language_code(target_lang)
            
            # If same language, return original
            if source_code == target_code:
                return text
            
            # Run translation in executor to avoid blocking
            loop = asyncio.get_event_loop()
            translation = await loop.run_in_executor(
                None,
                lambda: GoogleTranslator(source=source_code, target=target_code).translate(text)
            )
            
            return translation
            
        except Exception as e:
            print(f"Translation error: {e}")
            # Return original text if translation fails
            return text
    
    async def translate_with_detection(self, text: str, target_lang: str) -> Dict[str, str]:
        """Detect source language and translate to target language"""
        try:
            # Detect source language
            source_lang = self.detect_language(text)
            
            # Translate text
            translated_text = await self.translate_text(text, source_lang, target_lang)
            
            return {
                'original_text': text,
                'source_language': source_lang,
                'translated_text': translated_text,
                'target_language': target_lang
            }
        except Exception as e:
            print(f"Translation with detection error: {e}")
            return {
                'original_text': text,
                'source_language': 'unknown',
                'translated_text': text,
                'target_language': target_lang
            }
    
    async def translate_batch(self, texts: list, source_lang: str, target_lang: str) -> list:
        """Translate multiple texts at once"""
        try:
            source_code = self.get_language_code(source_lang)
            target_code = self.get_language_code(target_lang)
            
            if source_code == target_code:
                return texts
            
            loop = asyncio.get_event_loop()
            translations = []
            
            for text in texts:
                translation = await loop.run_in_executor(
                    None,
                    lambda t=text: GoogleTranslator(source=source_code, target=target_code).translate(t)
                )
                translations.append(translation)
            
            return translations
        except Exception as e:
            print(f"Batch translation error: {e}")
            return texts

# Create singleton instance
translation_service = TranslationService()