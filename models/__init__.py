from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.user import User
from models.barber import Barber
from models.service import Service
from models.booking import Booking