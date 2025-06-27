from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, func
from datetime import datetime

db = SQLAlchemy()

# Create tables for expenses and budget

class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(50), nullable=False, unique=True)
        password = db.Column(db.String, nullable=False)
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

        #OTM relationships
        expenses = db.relationship("Expenses", back_populates="user")
        budgets = db.relationship("Budget", back_populates="user")
        
class Expenses(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
        budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
        name = db.Column(db.String(30))
        amount = db.Column(db.Numeric(10,2), nullable=False)
        date = db.Column(db.Date)
        description = db.Column(db.Text)
        type = db.Column(db.String(50))
        
        #Relationship to User
        user = db.relationship("User", back_populates="expenses")
        #Relationship to Budget
        budget = db.relationship("Budget", back_populates="expenses")
    
        __table_args__ = (
            CheckConstraint("amount >= 0", name="check_amount_not_negative"),
            CheckConstraint(
            "type IN ('Subscription', 'Transportation', 'Food', 'Entertainment', 'Bills/Utilities', 'Groceries/Necessities', 'Vacation', 'Other')",
            name="check_valid_type"
            )
        )
    
class Budget(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
        name = db.Column(db.String(30))
        amount = db.Column(db.Numeric(10,2), nullable=False)
        is_active = db.Column(db.Boolean, nullable=False, default=True)
        start_date = db.Column(db.Date)
        end_date = db.Column(db.Date)
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
        updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
        
        #Relationship to User
        user = db.relationship("User", back_populates="budgets")
        #Relationship to Expenses (Budget parent)
        expenses = db.relationship("Expenses", back_populates="budget")
        
        __table_args__ = (
            CheckConstraint("amount >= 0", name="check_amount_not_negative"),
        )
    
    

