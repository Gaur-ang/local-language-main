from datetime import datetime
from typing import Optional
from ..models.user import UserCreate, UserLogin, User, UserInDB, Token
from ..core.security import verify_password, get_password_hash, create_access_token
from .firebase_service import firebase_service

class AuthService:
    async def register_user(self, user_data: UserCreate) -> Optional[Token]:
        """Register a new user"""
        try:
            print(f"Attempting to register user: {user_data.email}")
            
            # Check if user exists
            existing_user = await firebase_service.get_user_by_email(user_data.email)
            if existing_user:
                print(f"User already exists: {user_data.email}")
                raise Exception("Email already registered")
            
            # Hash password
            print("Hashing password...")
            hashed_password = get_password_hash(user_data.password)
            
            # Create user document
            user_dict = {
                'email': user_data.email,
                'name': user_data.name,
                'preferred_language': user_data.preferred_language,
                'hashed_password': hashed_password,
                'created_at': datetime.utcnow(),
                'is_active': True
            }
            
            # Save to Firebase
            print("Saving user to Firebase...")
            created_user = await firebase_service.create_user(user_dict)
            
            if created_user:
                print(f"User created successfully: {created_user['id']}")
                
                # Create access token
                access_token = create_access_token(
                    data={"sub": created_user['email'], "id": created_user['id']}
                )
                
                # Remove password from response
                user_response = User(
                    id=created_user['id'],
                    email=created_user['email'],
                    name=created_user['name'],
                    preferred_language=created_user['preferred_language'],
                    created_at=created_user['created_at'],
                    is_active=created_user['is_active']
                )
                
                return Token(
                    access_token=access_token,
                    user=user_response
                )
            
            raise Exception("Failed to create user")
        except Exception as e:
            print(f"Registration error: {e}")
            return None
    
    async def login_user(self, login_data: UserLogin) -> Optional[Token]:
        """Login user"""
        try:
            print(f"Attempting to login user: {login_data.email}")
            
            # Get user from database
            user = await firebase_service.get_user_by_email(login_data.email)
            
            if not user:
                print(f"User not found: {login_data.email}")
                return None
            
            print("User found, verifying password...")
            
            # Verify password
            if not verify_password(login_data.password, user['hashed_password']):
                print("Password verification failed")
                return None
            
            print("Password verified successfully")
            
            # Create access token
            access_token = create_access_token(
                data={"sub": user['email'], "id": user['id']}
            )
            
            # Remove password from response
            user_response = User(
                id=user['id'],
                email=user['email'],
                name=user['name'],
                preferred_language=user['preferred_language'],
                created_at=user['created_at'],
                is_active=user['is_active']
            )
            
            print(f"Login successful for user: {user['email']}")
            
            return Token(
                access_token=access_token,
                user=user_response
            )
        except Exception as e:
            print(f"Login error: {e}")
            return None

# Create singleton instance
auth_service = AuthService()