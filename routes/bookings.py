from flask import Blueprint, jsonify, request
from models import db, Booking, User
from datetime import datetime

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    booking = Booking(
        user_id=data['user_id'],
        barber_id=data['barber_id'],
        service_id=data['service_id'],
        booking_date=datetime.strptime(data['booking_date'], '%Y-%m-%d').date(),
        booking_time=datetime.strptime(data['booking_time'], '%H:%M').time(),
        status='pending'
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({'message': 'Booking created', 'id': booking.id}), 201