from flask import Blueprint, jsonify, request, current_app
from models import db, Booking
from datetime import datetime
import stripe

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/api/bookings', methods=['POST'])
def create_booking():
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
    data = request.get_json()

    # Create a payment intent with Stripe
    # Amount is in cents — so €25 = 2500
    service_price = data.get('price', 0)
    amount_cents = int(service_price * 100)

    try:
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency='eur',
            metadata={
                'user_id': data['user_id'],
                'barber_id': data['barber_id'],
                'service_id': data['service_id'],
                'booking_date': data['booking_date'],
                'booking_time': data['booking_time'],
            }
        )
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({
        'client_secret': intent.client_secret,
        'payment_intent_id': intent.id
    }), 200


@bookings_bp.route('/api/bookings/confirm', methods=['POST'])
def confirm_booking():
    data = request.get_json()

    booking = Booking(
        user_id=data['user_id'],
        barber_id=data['barber_id'],
        service_id=data['service_id'],
        booking_date=datetime.strptime(data['booking_date'], '%Y-%m-%d').date(),
        booking_time=datetime.strptime(data['booking_time'], '%H:%M').time(),
        status='confirmed'
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({'message': 'Booking confirmed', 'id': booking.id}), 201