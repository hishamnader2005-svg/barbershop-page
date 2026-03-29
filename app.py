from flask import Flask, render_template
from config import Config
from models import db
from routes.services import services_bp
from routes.barbers import barbers_bp
from routes.bookings import bookings_bp
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(services_bp)
    app.register_blueprint(barbers_bp)
    app.register_blueprint(bookings_bp)

    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/login')
    def login_page():
        return render_template('login.html')

    @app.route('/signup')
    def signup_page():
        return render_template('signup.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)