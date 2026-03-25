from models import db

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Integer, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)

    bookings = db.relationship('Booking', backref='service', lazy=True)