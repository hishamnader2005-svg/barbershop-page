from flask import Blueprint, jsonify
from models import Barber

barbers_bp = Blueprint('barbers', __name__)

@barbers_bp.route('/api/barbers', methods=['GET'])
def get_barbers():
    barbers = Barber.query.all()
    return jsonify([{
        'id': b.id,
        'name': b.name,
        'title': b.title,
        'bio': b.bio
    } for b in barbers])