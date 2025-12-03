from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Local Language Integrator"
    VERSION: str = "1.0.0"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "firebase-credentials-local-language.json"
    
    # JWT
    JWT_SECRET: str = "your-super-secret-key-change-this"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = "../.env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()