from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config


# Configure app with the config class that has database URI.
# Create instance of SQLAlch that connects to app/DB config
app = Flask(__name__)
app.config.from_object(Config)
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
    expenses = Expenses.query.all()
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
    new_expense = Expenses(name=name1, amount=amount1, date=date1, description=description1, type=type1)
    try:
        db.session.add(new_expense)
        db.session.commit()
        return "Successfully Added!"
    except:
        db.session.rollback()
        return "Error. Could not add to database"
        
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



    
    

if __name__ == '__main__':
    app.run(debug=True)