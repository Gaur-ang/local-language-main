from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageBase(BaseModel):
    text: str
    language: str
    translated_text: Optional[str] = None
    translated_language: Optional[str] = None

class MessageCreate(MessageBase):
    conversation_id: str
    sender_id: str

class Message(MessageBase):
    id: str
    conversation_id: str
    sender_id: str
    timestamp: datetime
    is_voice: bool = False
    voice_url: Optional[str] = None

class ConversationCreate(BaseModel):
    participant1_id: str
    participant2_id: str

class Conversation(BaseModel):
    id: str
    participant1_id: str
    participant2_id: str
    created_at: datetime
    last_message_at: Optional[datetime] = None