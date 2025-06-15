import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('EMAIL_USER')
mail = Mail(app)

# Define ContactMessage model
class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"ContactMessage('{self.name}', '{self.email}', '{self.timestamp}')"

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def hello_backend():
    return "Hello, Backend!"

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message_text = data.get('message')

    if not all([name, email, message_text]):
        return jsonify({'error': 'Missing required fields'}), 400

    contact_message = ContactMessage(name=name, email=email, message=message_text)
    db.session.add(contact_message)
    db.session.commit()

    try:
        msg = Message(
            subject=f"New Contact Form Message from {name}",
            recipients=['moviesf14@gmail.com'],
            body=f"Name: {name}\nEmail: {email}\nMessage: {message_text}"
        )
        mail.send(msg)
    except Exception as e:
        app.logger.error(f"Error sending email: {e}")
        # Optionally, you could add more specific error handling here

    return jsonify({'message': 'Message received!'})

if __name__ == '__main__':
    app.run(debug=True)
