from datetime import datetime, timedelta, timezone
from typing import Optional, Dict
import os
import jwt
import uuid
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Header
from app.models.models import User
from app.db import get_auth_db
from sqlalchemy.orm import Session

# Load environment variables
load_dotenv()

# Get secret key and config
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Function to generate JWT token with a flexible payload
def create_access_token(payload: Dict[str, str], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = payload.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Function to decode JWT token and extract user ID
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_auth_db)):
    """
    Extracts and validates the JWT token from the 'Authorization' header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = authorization.partition("Bearer")[2].strip()
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        user_uuid = uuid.UUID(user_id)

        user = db.query(User).filter(User.id == user_uuid).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")