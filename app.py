from flask import Flask, render_template
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    @app.route('/')
    def index():
        return render_template('index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
"""

Just one route for now — serving your `index.html`. No blueprints yet, keeping it simple.

"""
SECRET_KEY=anylongrandostring123
DATABASE_URL=postgresql://localhost/barbershop