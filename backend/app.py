from flask import Flask, jsonify, request

app = Flask(__name__)

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
expenses.append(expense1)

#Set up home page route
@app.route('/', methods=['GET'])
def home():
    return "<p>Hello!<p>"
    
#Create a route for 'budget' that displays the current values in budget
@app.route('/budget', methods=['GET'])
def get_budget():
    return jsonify(budget)

if __name__ == '__main__':
    app.run(debug=True)