from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_cors import CORS
from flask_migrate import Migrate
import jwt
from flask_bcrypt import Bcrypt
from model import db, User, Expenses, Budget, CategoryGoal

# Configure app with the config class that has database URI.
# Create instance of SQLAlch that connects to app/DB config
app = Flask(__name__)
app.config.from_object(Config)
#Had to change to allow cross server requests
CORS(app, origins=["http://localhost:5173",
                   "https://simply-spent.vercel.app"], 
     supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already taken"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    
    token = jwt.encode(
        {"user_id": new_user.id,
         "username": new_user.username,
        },
    app.config["SECRET_KEY"],
    algorithm="HS256" 
    )
    return jsonify({"message": "Account successfully created", "token": token}), 201 

    
@app.route('/login', methods=['POST'])
def login():
    # Take in the request
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    # See if user exists
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    existing_user = User.query.filter_by(username=username).first()
    if not existing_user:
        return jsonify({"error": "Username not found"}), 401
    
    if bcrypt.check_password_hash(existing_user.password, password):
        token = jwt.encode(
            {"user_id": existing_user.id,
             "username": existing_user.username
             },
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Invalid password"}), 401

@app.route('/account', methods=['PATCH'])
def updateAccount():
    try:
        user_id = getUserIdToken()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        if username:
            existing = User.query.filter_by(username=username).first()
            if existing and existing.id != user.id:
                return jsonify({"error": "Username already taken"}), 400
            user.username = username

        if password:
            user.password = bcrypt.generate_password_hash(password).decode("utf-8")

        db.session.commit()
        new_token = jwt.encode(
            {
                "user_id": user.id,
                "username": user.username,
            },
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        return jsonify({"message": "Account updated successfully", "token": new_token}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed", "details": str(e)}), 500
    

@app.route('/account', methods=['DELETE'])
def deleteAccount():
    try:
        user_id = getUserIdToken()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Optionally delete related data first if cascade isn't enabled
        Budget.query.filter_by(user_id=user_id).delete()
        Expenses.query.filter_by(user_id=user_id).delete()

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account successfully deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not delete account", "details": str(e)}), 500

# Function to get user id from token
def getUserIdToken():
    auth_header = request.headers.get("Authorization")
    
    try: 
        if not auth_header or not auth_header.startswith("Bearer "):
            raise ValueError("Authorization token missing or invalid format")

        token = auth_header.split(" ")[1]  # Get just the token part
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        user_id = decoded.get("user_id")

        if not user_id:
            raise ValueError("Invalid token payload: no user_id found")

        return user_id

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        raise ValueError(f"Authentication failied: {str(e)}")
    


# Define API routes to interact with Expenses and Budget databases
@app.route('/')
def home():
    return jsonify({"message": "You are on the homepage"})

# Route to view all Expenses
@app.route('/expenses', methods=['GET'])
def getExpenses():
    user_id = getUserIdToken()
    expenses = Expenses.query.filter_by(user_id=user_id).order_by(Expenses.id.desc()).all()
    expenses_list = [{
        "id": exp.id,
        "name": exp.name,
        "amount": exp.amount,
        "date": exp.date,
        "description": exp.description,
        "type": exp.type,
        "budget_id": exp.budget_id
    } for exp in expenses]
    
    return jsonify(expenses_list)
    

# Route to add new expense
@app.route('/expenses', methods=['POST'])
def createExpense():
    user_id = getUserIdToken()
    data = request.get_json()
    budget_id = data.get("budget_id")
    budget = Budget.query.get(budget_id)
    if not budget or budget.user_id != user_id:
        return jsonify({"error": "Invalid budget for this user"}), 403
    
    name1 = data.get("name")
    amount1 = data.get("amount")
    date1 = data.get("date")
    description1 = data.get("description")
    type1 = data.get("type") or "Other"
    budget_id = data.get("budget_id")
    
    # Create instance of Expenses based on JSON data received and add it to the database if possible
    try:
        new_expense = Expenses(user_id=user_id, budget_id=budget_id, name=name1, amount=amount1, date=date1, description=description1, type=type1)
        db.session.add(new_expense)
        db.session.commit()
        
        return jsonify({
            "id": new_expense.id,
            "name": new_expense.name,
            "amount": str(new_expense.amount),
            "date": new_expense.date,
            "description":new_expense.description,
            "type": new_expense.type,
            "budget_id": new_expense.budget_id
        }), 201
    except:
        db.session.rollback()
        return jsonify({"Error":  "Could not add to database"}), 500
        
# Route to view one expense
@app.route('/expenses/<int:id>', methods=['GET'])
def get_expense_by_id(id):
    user_id = getUserIdToken()
    expense = Expenses.query.get(id)
    if not expense:
        return jsonify({"error": "Not found in database"}), 404
    
    budget = Budget.query.get(expense.budget_id)
    if not budget or budget.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    expense_dict = {
        "id": expense.id,
        "name": expense.name,
        "amount": expense.amount,
        "date": expense.date,
        "description": expense.description,
        "type": expense.type,
        "budget_id": expense.budget_id
    }
    return jsonify(expense_dict)

# Route to update existing expense
@app.route('/expenses/<int:id>', methods=['PATCH'])
def updateExpField(id):
    user_id = getUserIdToken()
    expense = Expenses.query.get(id)
    if not expense:
        return jsonify({"error": "Not a valid expense"}), 404
        
    budget = Budget.query.get(expense.budget_id)
    if not budget or budget.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

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
            "type": expense.type,
            "budget_id": expense.budget_id,
            "user_id": expense.user_id
        }), 200

    except:
        db.session.rollback()
        return jsonify({"error": "Error updating"}), 500
    
    
# Route to delete one expense
@app.route('/expenses/<int:id>', methods=['DELETE'])
def deleteExpense(id):
    user_id = getUserIdToken()
    expense = Expenses.query.get(id)
    if not expense:
        return jsonify({"error": "Error, not a valid expense"}), 404
    
    budget = Budget.query.get(expense.budget_id)
    if not budget or budget.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Successfully removed!"}), 200
    except:
        db.session.rollback()
        return jsonify({"error": "Could not remove from database"}), 500




# BUDGET METHODS

@app.route('/budget', methods=['GET'])
def getBudgets():
    user_id = getUserIdToken()
    budget = Budget.query.filter_by(user_id=user_id).all()
    budget_list = [{
        "id": bud.id,
        "name": bud.name,
        "amount": bud.amount,
        "is_active": bud.is_active,
        "start_date": bud.start_date.strftime('%Y-%m-%d') if bud.start_date else None,
        "end_date": bud.end_date.strftime('%Y-%m-%d') if bud.end_date else None,
        "created_at": bud.created_at,
        "updated_at": bud.updated_at
    } for bud in budget]
    
    return jsonify(budget_list)

@app.route('/budget', methods=['POST'])
def createBudget():
    user_id = getUserIdToken()
    data = request.get_json()
    name1 = data.get("name")
    amount1 = data.get("amount")
    is_active1 = data.get("is_active", True)
    start_date1 = data.get("start_date")
    end_date1 = data.get("end_date")
    
    try:
        new_budget = Budget(user_id=user_id, name=name1, amount=amount1, is_active=is_active1, start_date=start_date1, end_date=end_date1)
        db.session.add(new_budget)
        db.session.commit()
        return jsonify({"message": "Successfully added!"}), 201

    except:
        db.session.rollback()
        return jsonify({"error": "Could not add to database"}), 500

    
    
@app.route('/budget/<int:id>', methods=['GET'])
def getBudgetById(id):
    user_id = getUserIdToken()
    budget = Budget.query.get(id)
    if not budget:
        return jsonify({"error": "Not found in database"}), 404
    if budget.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    

    budget_dict = {
        "id": budget.id,
        "name": budget.name,
        "amount": budget.amount,
        "is_active": budget.is_active,
        "start_date": budget.start_date.strftime('%Y-%m-%d') if budget.start_date else None,
        "end_date": budget.end_date.strftime('%Y-%m-%d') if budget.end_date else None,
        "created_at": budget.created_at,
        "updated_at": budget.updated_at
    }
    return jsonify(budget_dict)
    
    
@app.route('/budget/<int:id>', methods=['PATCH'])
def updateBudField(id):
    user_id = getUserIdToken()
    budget = Budget.query.get(id)
    
    if not budget:
        return jsonify({"error": "Not a valid budget"}), 404
    if budget.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
        
    data = request.get_json()
    for key, value in data.items():
        if hasattr(budget, key):
            setattr(budget, key, value)
    
    try:
        db.session.commit()
        return jsonify({
            "id": budget.id,
            "name": budget.name,
            "amount": str(budget.amount),
            "is_active": budget.is_active,
            "start_date": budget.start_date,
            "end_date": budget.end_date
            }), 200
    except:
        db.session.rollback()
        return jsonify({"error": "Error updating"}), 500
    
    
@app.route('/budget/<int:id>', methods=['DELETE'])
def deleteBudget(id):
    user_id = getUserIdToken()
    budget = Budget.query.get(id)
    if not budget:
        return jsonify({"error": "Not a valid budget"}), 404
    if budget.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    try:
        db.session.delete(budget)
        db.session.commit()
        return jsonify({"message": "Successfully removed!"}), 200
    except:
        db.session.rollback()
        return jsonify({"error": "Could not remove from database"}), 500
    
    
@app.route('/category-goals/<int:budget_id>', methods=['GET'])
def getCategoryGoals(budget_id):
    user_id = getUserIdToken()
    goals = CategoryGoal.query.filter_by(user_id=user_id, budget_id=budget_id).all()
    return jsonify([
        {
            "id": g.id,
            "type": g.type,
            "goal": float(g.goal)
        }
        for g in goals
    ])
    
@app.route('/category-goals', methods=['POST'])
def createCategoryGoal():
    user_id = getUserIdToken()
    data = request.get_json()
    type = data.get("type")
    goal = data.get("goal")
    budget_id = data.get("budget_id")

    if not all([type, goal, budget_id]):
        return jsonify({"error": "Missing fields"}), 400

    budget = Budget.query.get(budget_id)
    if not budget or budget.user_id != user_id:
        return jsonify({"error": "Invalid budget"}), 403

    try:
        new_goal = CategoryGoal(
            user_id=user_id,
            budget_id=budget_id,
            type=type,
            goal=goal
        )
        db.session.add(new_goal)
        db.session.commit()
        return jsonify({
            "id": new_goal.id,
            "type": new_goal.type,
            "goal": float(new_goal.goal)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not create goal", "details": str(e)}), 500

@app.route('/category-goals/<int:goal_id>', methods=['DELETE'])
def deleteCategoryGoal(goal_id):
    user_id = getUserIdToken()
    goal = CategoryGoal.query.get(goal_id)

    if not goal:
        return jsonify({"error": "Not found"}), 404
    if goal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        db.session.delete(goal)
        db.session.commit()
        return jsonify({"message": "Goal deleted"}), 200
    except:
        db.session.rollback()
        return jsonify({"error": "Could not delete goal"}), 500

if __name__ == '__main__':
    app.run(debug=True)