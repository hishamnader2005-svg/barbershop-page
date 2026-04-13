# Barbershop Booking App

A full-stack web application for booking barbershop appointments, built with Flask, PostgreSQL, and Stripe for payments.

## Features

- User signup and login with hashed passwords
- Browse available barbers and services
- Book appointments with a selected barber, service, date, and time
- Stripe payment integration for collecting payment at booking
- Session-based authentication

## Tech Stack

- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-Bcrypt
- **Database:** PostgreSQL
- **Payments:** Stripe
- **Frontend:** HTML, CSS, Vanilla JavaScript

## Project Structure

```
barbershop-page/
├── app.py              # App factory and route registration
├── config.py           # Configuration (env vars)
├── requirements.txt    # Python dependencies
├── models/             # SQLAlchemy models (User, Barber, Service, Booking)
├── routes/             # Blueprints for auth, barbers, services, bookings
├── templates/          # HTML templates (index, login, signup)
├── static/             # CSS and JS
└── database/
    └── schema.sql      # Raw SQL schema
```

## Setup

### 1. Clone and create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r barbershop-page/requirements.txt
```

### 2. Configure environment variables

Create a `.env` file inside `barbershop-page/`:

```env
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://localhost/barbershop
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Set up the database

```bash
createdb barbershop
psql barbershop < barbershop-page/database/schema.sql
```

### 4. Run the app

```bash
cd barbershop-page
python app.py
```

The app will be available at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| POST   | `/api/signup`           | Register a new user            |
| POST   | `/api/login`            | Log in                         |
| POST   | `/api/logout`           | Log out                        |
| GET    | `/api/me`               | Get current session user       |
| GET    | `/api/barbers`          | List all barbers               |
| GET    | `/api/services`         | List all services              |
| POST   | `/api/bookings`         | Create a Stripe payment intent |
| POST   | `/api/bookings/confirm` | Confirm booking after payment  |
