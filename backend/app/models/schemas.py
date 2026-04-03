from pydantic import BaseModel, condecimal
from typing import Annotated, Optional
from datetime import date as dt_date

# Define constrained decimal separately to avoid Pylance issues
ConstrainedDecimal = condecimal(max_digits=10, decimal_places=2)

# ==============================
# Expense Schemas
# ==============================

class ExpenseCreate(BaseModel):
    """Schema for creating a new expense."""
    description: str
    amount: Annotated[float, condecimal(max_digits=10, decimal_places=2)]  # Pylance-friendly
    category: str
    date: dt_date

class ExpenseUpdate(BaseModel):
    """Schema for updating an expense (partial updates allowed)."""
    description: Optional[str] = None
    amount: Optional[Annotated[float, ConstrainedDecimal]] = None  # Consistent with ExpenseCreate
    category: Optional[str] = None
    date: Optional[dt_date] = None

# ==============================
# Authentication Schemas
# ==============================

class LoginRequest(BaseModel):
    """Schema for user login request."""
    email: str
    password: str

class SignupRequest(BaseModel):
    """Schema for user signup request."""
    email: str
    password: str