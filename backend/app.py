from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from config import Config


# Configure app with the config class that has database URI.
# Create instance of SQLAlch that connects to app/DB config
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

# Define API routes to interact with Expenses and Budget databases
@app.route('/', methods=['GET'])
def home():
    return "You are on the homepage"

@app.route('/expenses', methods=['GET'])
def getExpenses():
    return "Test"

#Create a Create method to add new expense to the database
@app.route('/expenses', methods=['POST'])
def createExpense():
    # Import model locally after app has been initialized to prevent callback error
    from model import Expenses
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
        
    
    

@app.route('/expenses', methods=['PUT'])
def updateExpense():
    return "hi"

@app.route('/expenses', methods=['DELETE'])
def deleteExpense():
    return "hi"




if __name__ == '__main__':
    app.run(debug=True)