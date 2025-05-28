from app import app, db
from model import Expenses, Budget

#Create Expenses and Budget databases based on model defined in models file
with app.app_context():
    db.create_all()
    
    