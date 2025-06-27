from app import app, db

# ONE TIME USE, WILL NOT RUN THIS AGAIN

#Create Expenses and Budget databases based on model defined in models file
with app.app_context():
    db.drop_all()
    db.create_all()
    
    