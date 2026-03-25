import models 
import db

class user(db.model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(255), unique = True , nullable = False)
    password_hash = db.column(db.String(255), nullable = False)
    created_at = db.Column(db.DateTime, server_default=db.func.now)
    
    bookings = db.relationship('Booking', backref='user', lazy=True)