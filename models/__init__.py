from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.user import User
from models.barbers import Barber
from models.services import Service
from models.bookings import Booking