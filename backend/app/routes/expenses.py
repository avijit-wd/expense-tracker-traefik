from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Expense
from app.models.schemas import ExpenseCreate, ExpenseUpdate
from app.core.db_access import get_db_for_user 
from app.core.auth import get_current_user
import uuid

router = APIRouter()

@router.get("/expenses")
def get_expenses(db: Session = Depends(get_db_for_user), current_user=Depends(get_current_user)):
    """
    Retrieve expenses for the authenticated user.

    Security Measures:
    - **Row-Level Security (RLS)** ensures users can only access their own data.
    - **Explicit application-level filtering** prevents exposure in case of misconfiguration.
    """
    return db.query(Expense).filter(Expense.user_id == current_user.id).all()

@router.post("/expenses", status_code=201)
def add_expense(
    expense_data: ExpenseCreate, 
    db: Session = Depends(get_db_for_user), 
    current_user=Depends(get_current_user)
):
    """
    Add a new expense for the authenticated user.

    Security Measures:
    - **RLS prevents unauthorized inserts.**
    - **Explicit user ID assignment** ensures expenses belong to the logged-in user.
    - **Pydantic validation** enforces correct input types.
    """
    new_expense = Expense(
        user_id=current_user.id,  
        description=expense_data.description,
        amount=expense_data.amount,
        category=expense_data.category,
        date=expense_data.date,
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {"message": "Expense added successfully", "expense_id": new_expense.id}

@router.patch("/expenses/{expense_id}")
def update_expense(
    expense_id: uuid.UUID,
    expense_data: ExpenseUpdate,  
    db: Session = Depends(get_db_for_user),
    current_user=Depends(get_current_user)
):
    """
    Update an existing expense.

    Security Measures:
    - **Ownership check** ensures users can only update their own expenses.
    - **Partial updates** allow modifying only provided fields.
    - **Explicit query filtering** adds an extra layer of security.
    """
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if expense.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to modify this expense")

    for key, value in expense_data.dict(exclude_unset=True).items():
        setattr(expense, key, value)  

    db.commit()
    db.refresh(expense)

    return {"message": "Expense updated successfully", "updated_expense": expense}

@router.delete("/expenses/{expense_id}", status_code=200)
def delete_expense(
    expense_id: uuid.UUID,
    db: Session = Depends(get_db_for_user),
    current_user=Depends(get_current_user)
):
    """
    Delete an expense.

    Security Measures:
    - **Ownership check** prevents unauthorized deletions.
    - **Explicit query filtering** ensures only the user's expenses are affected.
    """
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if str(expense.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="You are not allowed to delete this expense")

    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted successfully"}