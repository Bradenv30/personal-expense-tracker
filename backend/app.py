from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Configure app with the config class that has database URI.
# Create instance of SQLAlc that connects to DB config
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)





if __name__ == '__main__':
    app.run(debug=True)