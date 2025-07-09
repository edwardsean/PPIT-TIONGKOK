from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.json 
    old = data.get('oldPassword')
    new = data.get('newPassword')
    confirm = data.get('confirmPassword')

    current = os.getenv('PASSWORD')

    if old != current:
        return jsonify({'error': 'Password lama tidak sesuai!'}), 400

    if new != confirm:
        return jsonify({'error': 'Password baru dan konfirmasi tidak sama!'}), 400

    if len(new) < 6:
        return jsonify({'error': 'Password baru minimal 6 karakter!'}), 400

    return jsonify({'success': True})

@app.route("/verify", methods=['POST'])
def verify():
    data = request.json
    username_input = data.get('username')
    password_input = data.get('password')

    current_username = os.getenv('USERNAME')
    current_password = os.getenv('PASSWORD')

    if current_username == username_input and current_password == password_input :
        return jsonify({'success': True})
    else :
        return jsonify({'error': 'Kesalahan terjadi di username atau password'})
    
if __name__ == '__main__':
    app.run(debug=True)
