from textblob import TextBlob
from typing import Dict

class SentimentService:
    def __init__(self):
        pass
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analyze sentiment of text
        Returns polarity (-1 to 1) and subjectivity (0 to 1)
        """
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            # Classify sentiment
            if polarity > 0.1:
                sentiment = 'positive'
                emoji = '😊'
            elif polarity < -0.1:
                sentiment = 'negative'
                emoji = '😔'
            else:
                sentiment = 'neutral'
                emoji = '😐'
            
            return {
                'sentiment': sentiment,
                'emoji': emoji,
                'polarity': round(polarity, 2),
                'subjectivity': round(subjectivity, 2),
                'confidence': abs(polarity)
            }
        except Exception as e:
            print(f"Sentiment analysis error: {e}")
            return {
                'sentiment': 'neutral',
                'emoji': '😐',
                'polarity': 0,
                'subjectivity': 0,
                'confidence': 0
            }
    
    def get_emotion_suggestions(self, sentiment: str) -> list:
        """Get suggested responses based on sentiment"""
        suggestions = {
            'positive': [
                "That's wonderful! 🎉",
                "I'm so happy for you! 😊",
                "Amazing news! ⭐"
            ],
            'negative': [
                "I'm here for you 💙",
                "That's tough, I understand 🤗",
                "Sending you positive vibes ✨"
            ],
            'neutral': [
                "Tell me more 💬",
                "Interesting! 🤔",
                "I see 👀"
            ]
        }
        return suggestions.get(sentiment, [])

# Create singleton instance
sentiment_service = SentimentService()