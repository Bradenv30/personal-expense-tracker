from sqlalchemy import CheckConstraint
from datetime import datetime


# Create tables for expenses and budget
def init_models(db):
    class Expenses(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(15))
        amount = db.Column(db.Numeric(10,2), nullable=False)
        date = db.Column(db.Date)
        description = db.Column(db.Text)
        type = db.Column(db.String(50))
    
        __table_args__ = (
            CheckConstraint("amount >= 0", name="check_amount_not_negative"),
            CheckConstraint(
            "type IN ('Subscription', 'Transportation', 'Food', 'Entertainment', 'Bills/Utilities', 'Groceries/Necessities', 'Vacation', 'Other')",
            name="check_valid_type"
            )
        )
    
    class Budget(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(15))
        amount = db.Column(db.Numeric(10,2), nullable=False)
        is_active = db.Column(db.Boolean, nullable=False, default=True)
        start_date = db.Column(db.Date)
        end_date = db.Column(db.Date)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        
        __table_args__ = (
            CheckConstraint("amount >= 0", name="check_amount_not_negative"),
        )
    
    return Expenses, Budget





"""
# Old code from app.py
#Store data in variables for in memory testing
expenses = []
budget = {"monthly limit": 500}
expenses_type = ["Subscription", "Travel/Transportation", "Food", "Entertainment", "Bills/Utilities", "Groceries/Neccesities"]
expense1 = {
    "id": 1,
    "amount": 25,
    "type": "Entertainment",
    "description": "Went to the movies",
    "date" : "05/25/2025",
}
expense2 = {
    "id": 2,
    "amount": 1200,
    "type": "Bills/Utilities",
    "description": "Paid rent",
}
expenses.append(expense1)
expenses.append(expense2)

#Set up home page route
@app.route('/', methods=['GET'])
def home():
    return "<p>Hello!<p>"
    
#Create a route for 'budget' that displays the current values in budget
@app.route('/budget', methods=['GET'])
def get_budget():
    return jsonify(budget)

# Route that returns expenses list
@app.route('/expenses', methods=['GET'])
def get_expenses():
    return jsonify(expenses)

#end old code

"""