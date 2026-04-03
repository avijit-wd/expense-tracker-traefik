from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db import get_auth_db
from app.models.models import User
from app.models.schemas import LoginRequest, SignupRequest
from app.core.auth import verify_password, create_access_token, get_current_user

router = APIRouter()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    return pwd_context.hash(password)

@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_auth_db)):
    """Registers a new user with a hashed password."""
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(email=request.email, password_hash=hash_password(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_auth_db)):
    """Authenticates a user and returns an access token."""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token({"user_id": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", summary="Get Authenticated User")
def get_me(current_user=Depends(get_current_user)):
    """Returns details of the authenticated user."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at
    }