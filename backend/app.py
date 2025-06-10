from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_cors import CORS

#MAKE SURE YOU UPDATE THE RESPONSES IN CRUD ROUTES TO RETURN JSON

# Configure app with the config class that has database URI.
# Create instance of SQLAlch that connects to app/DB config
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db = SQLAlchemy(app)

from model import init_models
Expenses, Budget = init_models(db)

# Define API routes to interact with Expenses and Budget databases
@app.route('/')
def home():
    return "You are on the homepage"

# Route to view all Expenses
@app.route('/expenses', methods=['GET'])
def getExpenses():
    expenses = Expenses.query.order_by(Expenses.id.desc()).all()
    expenses_list = [{
        "id": exp.id,
        "name": exp.name,
        "amount": exp.amount,
        "date": exp.date,
        "description": exp.description,
        "type": exp.type
    } for exp in expenses]
    
    return jsonify(expenses_list)
    

# Route to add new expense
@app.route('/expenses', methods=['POST'])
def createExpense():
    data = request.get_json()
    name1 = data.get("name")
    amount1 = data.get("amount")
    date1 = data.get("date")
    description1 = data.get("description")
    type1 = data.get("type")
    
    # Create instance of Expenses based on JSON data received and add it to the database if possible
    try:
        new_expense = Expenses(name=name1, amount=amount1, date=date1, description=description1, type=type1)
        db.session.add(new_expense)
        db.session.commit()
        
        return jsonify({
            "id": new_expense.id,
            "name": new_expense.name,
            "amount": str(new_expense.amount),
            "date": new_expense.date,
            "description":new_expense.description,
            "type": new_expense.type
        }), 201
    except:
        db.session.rollback()
        return jsonify({"Error":  "Could not add to database"}), 500
        
# Route to view one expense
@app.route('/expenses/<int:id>', methods=['GET'])
def get_expense_by_id(id):
    expense = Expenses.query.get(id)
    if not expense:
        return "Error, not found in database"
    expense_dict = {
        "id": expense.id,
        "name": expense.name,
        "amount": expense.amount,
        "date": expense.date,
        "description": expense.description,
        "type": expense.type
    }
    return jsonify(expense_dict)
    
# Route to delete one expense
@app.route('/expenses/<int:id>', methods=['DELETE'])
def deleteExpense(id):
    expense = Expenses.query.get(id)
    if not expense:
        return "Error, not a valid expense"
    try:
        db.session.delete(expense)
        db.session.commit()
        return "Successfully removed!"
    except:
        db.session.rollback()
        return "Error. Could not remove from database"
        
# Route to update existing expense
@app.route('/expenses/<int:id>', methods=['PUT'])
def updateExpense(id):
    expense = Expenses.query.get(id)
    
    if not expense:
        return "Not a valid expense"
    
    data = request.get_json()
    
    if "name" in data:
        expense.name = data["name"]
    if "amount" in data:
        expense.amount = data["amount"]
    if "date" in data:
        expense.date = data["date"]
    if "description" in data:
        expense.description = data["description"]
    if "type" in data:
        expense.type = data["type"]
        
    try:
        db.session.commit()
        return "Successfully updated"
    except:
        db.session.rollback()
        return "Error updating"
    
@app.route('/expenses/<int:id>', methods=['PATCH'])
def updateExpField(id):
    expense = Expenses.query.get(id)
    
    if not expense:
        return jsonify({"error": "Not a valid expense"}), 404
        
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(expense, key):
            setattr(expense, key, value)
    
    try:
        db.session.commit()
        return jsonify({
            "id": expense.id,
            "name": expense.name,
            "amount": str(expense.amount),
            "date": expense.date,
            "description": expense.description,
            "type": expense.type
        }), 200

    except:
        db.session.rollback()
        return jsonify({"error": "Error updating"}), 500
    

# BUDGET METHODS

@app.route('/budget', methods=['GET'])
def getBudgets():
    budget = Budget.query.all()
    budget_list = [{
        "id": bud.id,
        "name": bud.name,
        "amount": bud.amount,
        "is_active": bud.is_active,
        "start_date": bud.start_date,
        "end_date": bud.end_date,
        "created_at": bud.created_at,
        "updated_at": bud.updated_at
    } for bud in budget]
    
    return jsonify(budget_list)

@app.route('/budget', methods=['POST'])
def createBudget():
    data = request.get_json()
    name1 = data.get("name")
    amount1 = data.get("amount")
    is_active1 = data.get("is_active", True)
    start_date1 = data.get("start_date")
    end_date1 = data.get("end_date")
    
    try:
        new_budget = Budget(name=name1, amount=amount1, is_active=is_active1, start_date=start_date1, end_date=end_date1)
        db.session.add(new_budget)
        db.session.commit()
        return "Successfully Added!"
    except:
        db.session.rollback()
        return "Error. Could not add to database"
    
    
@app.route('/budget/<int:id>', methods=['GET'])
def getBudgetById(id):
    budget = Budget.query.get(id)
    if not budget:
        return "Error, not found in database"
    budget_dict = {
        "id": budget.id,
        "name": budget.name,
        "amount": budget.amount,
        "is_active": budget.is_active,
        "start_date": budget.start_date,
        "end_date": budget.end_date,
        "created_at": budget.created_at,
        "updated_at": budget.updated_at
    }
    return jsonify(budget_dict)

    
    
@app.route('/budget/<int:id>', methods=['PUT'])
def updateBudget(id):
    budget = Budget.query.get(id)
    
    if not budget:
        return "Not a valid expense"
    
    data = request.get_json()
    
    if "name" in data:
        budget.name = data["name"]
    if "amount" in data:
        budget.amount = data["amount"]
    if "is_active" in data:
        budget.is_active = data["is_active"]
    if "start_date" in data:
        budget.start_date = data["start_date"]
    if "end_date" in data:
        budget.end_date = data["end_date"]
        
    try:
        db.session.commit()
        return "Successfully updated"
    except:
        db.session.rollback()
        return "Error updating"
    
    
@app.route('/budget/<int:id>', methods=['DELETE'])
def deleteBudget(id):
    budget = Budget.query.get(id)
    if not budget:
        return "Error, not a valid expense"
    try:
        db.session.delete(budget)
        db.session.commit()
        return "Successfully removed!"
    except:
        db.session.rollback()
        return "Error. Could not remove from database"
    
@app.route('/budget/<int:id>', methods=['PATCH'])
def updateBudField(id):
    budget = Budget.query.get(id)
    
    if not budget:
        return "Not a valid expense"
        
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(budget, key):
            setattr(budget, key, value)
    
    try:
        db.session.commit()
        return "Successfully updated"
    except:
        db.session.rollback()
        return "Error updating"
    
    
if __name__ == '__main__':
    app.run(debug=True)