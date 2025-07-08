from app import app, db, bcrypt
from model import User

with app.app_context():
    user = User.query.filter_by(username="useruser3").first()
    user.password = bcrypt.generate_password_hash("password").decode("utf-8")
    db.session.commit()