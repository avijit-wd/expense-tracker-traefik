from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus 

# Load environment variables
load_dotenv()

# Load authentication DB credentials
AUTH_DB_USER = os.getenv("DATABASE_AUTH_USER", "auth_user")
AUTH_DB_PASSWORD = quote_plus(os.getenv("DATABASE_AUTH_PASSWORD", "secure-auth-password"))

# Load application DB credentials
APP_DB_USER = os.getenv("DATABASE_APP_USER", "app_user")
APP_DB_PASSWORD = quote_plus(os.getenv("DATABASE_APP_PASSWORD", "secure-app-password"))

# Load common DB settings
DB_HOST = os.getenv("DATABASE_HOST", "localhost")
DB_NAME = os.getenv("DATABASE_NAME", "expense_tracker")

# Construct connection URLs
AUTH_DATABASE_URL = f"postgresql://{AUTH_DB_USER}:{AUTH_DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
APP_DATABASE_URL = f"postgresql://{APP_DB_USER}:{APP_DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# Create separate database engines
engine_auth = create_engine(AUTH_DATABASE_URL)
engine_app = create_engine(APP_DATABASE_URL)

# Create separate session factories
SessionLocalAuth = sessionmaker(autocommit=False, autoflush=False, bind=engine_auth)
SessionLocalApp = sessionmaker(autocommit=False, autoflush=False, bind=engine_app)

# Base class for models
Base = declarative_base()

# Dependency for Authentication Queries
def get_auth_db():
    """Provide a database session with auth_user permissions."""
    db = SessionLocalAuth()
    try:
        yield db
    finally:
        db.close()

# Dependency for Application Queries
def get_app_db():
    """Provide a database session with app_user permissions."""
    db = SessionLocalApp()
    try:
        yield db
    finally:
        db.close()