from flask import Blueprint, request, jsonify, session
from models import db, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    user = User(email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    session['user_id'] = user.id
    return jsonify({'message': 'Account created', 'user_id': user.id}), 201


@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    session['user_id'] = user.id
    return jsonify({'message': 'Logged in', 'user_id': user.id}), 200


@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'}), 200


@auth_bp.route('/api/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(user_id)
    return jsonify({'user_id': user.id, 'email': user.email}), 200