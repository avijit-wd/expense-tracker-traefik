from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

# SQLAlchemy ORM Model for Database
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    expenses = relationship("Expense", back_populates="owner")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String, nullable=False)
    date = Column(DateTime, nullable=False, default=func.now())
    created_at = Column(DateTime, default=func.now(), nullable=False)

    owner = relationship("User", back_populates="expenses")