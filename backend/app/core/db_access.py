from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.db import get_app_db
from app.core.auth import get_current_user

# Secure RLS database session
def get_db_for_user(db: Session = Depends(get_app_db), current_user=Depends(get_current_user)):
    """
    Ensures that Row-Level Security (RLS) is enforced by setting the current user's ID 
    in the database session. 

    This makes sure that any queries executed within this session are restricted 
    to the authenticated user's data based on PostgreSQL RLS policies.
    """
    try:
        db.execute(text("SET app.current_user_id TO :user_id"), {"user_id": str(current_user.id)})
        yield db
    finally:
        db.close()  # Ensures DB connection is closed properly