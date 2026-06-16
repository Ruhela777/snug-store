from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import uuid
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)

# --- Configuration ---
EMAIL_ADDRESS = 'ruhela.kritika777@gmail.com'
EMAIL_PASSWORD = 'rgahdwwyyeoifmvo' 

def get_data_path(filename):
    return os.path.join(os.path.dirname(__file__), 'data', filename)

def send_order_confirmation(user_email, order_id):
    msg = EmailMessage()
    msg['Subject'] = 'Order Confirmed! - Snugbear Store 🧸'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = user_email
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4D3A2A;">
        <h2 style="color: #6D442C;">Yay! Your Snuggles are on the way! 🧸</h2>
        <p>Hi there,</p>
        <p>Your order has been placed successfully.</p>
        <p style="background: #FFF9F6; padding: 10px; border-radius: 8px;">
            <strong>Order ID:</strong> {order_id}
        </p>
        <p>You can track your order status here:</p>
        <a href="http://localhost:5173/track-order" style="background: #6D442C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Order</a>
      </body>
    </html>
    """
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        print(f"CRITICAL ERROR in SMTP: {e}")

# --- User Routes ---

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "Backend is running!"})

@app.route('/api/products', methods=['GET'])
def get_products():
    file_path = get_data_path('products.json')
    if not os.path.exists(file_path): return jsonify([]), 200
    with open(file_path, 'r', encoding='utf-8') as f:
        try: return jsonify(json.load(f))
        except: return jsonify([]), 500

@app.route('/api/orders/<email>', methods=['GET'])
def get_orders_by_email(email):
    file_path = get_data_path('orders.json')
    if not os.path.exists(file_path): return jsonify([]), 200
    with open(file_path, 'r', encoding='utf-8') as f:
        try: orders = json.load(f)
        except: orders = []
    user_orders = [o for o in orders if o.get('email', '').lower() == email.lower()]
    return jsonify(user_orders)

@app.route('/api/checkout', methods=['POST', 'OPTIONS'])
def checkout():
    if request.method == 'OPTIONS': return '', 200
    order = request.json
    if not order: return jsonify({"error": "No data"}), 400
    
    order['order_id'] = str(uuid.uuid4())[:8]
    order['status'] = 'Processing'  # Default status
    
    file_path = get_data_path('orders.json')
    orders = []
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            try: orders = json.load(f)
            except: orders = []
    
    orders.append(order)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(orders, f, indent=4)
        
    send_order_confirmation(order.get('email'), order['order_id'])
    return jsonify({"message": "Order placed!", "order_id": order['order_id']}), 200

# --- Admin Routes ---

@app.route('/api/admin/orders', methods=['GET'])
def get_all_orders():
    file_path = get_data_path('orders.json')
    if not os.path.exists(file_path): return jsonify([]), 200
    with open(file_path, 'r', encoding='utf-8') as f:
        try: return jsonify(json.load(f))
        except: return jsonify([]), 500

@app.route('/api/admin/orders/<order_id>', methods=['PATCH'])
def update_order(order_id):
    data = request.json
    new_status = data.get('status')
    
    file_path = get_data_path('orders.json')
    with open(file_path, 'r', encoding='utf-8') as f:
        orders = json.load(f)
    
    for order in orders:
        if order.get('order_id') == order_id:
            order['status'] = new_status
            break
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(orders, f, indent=4)
    return jsonify({"message": "Order updated successfully"}), 200

if __name__ == '__main__':
    if not os.path.exists('data'): os.makedirs('data')
    app.run(debug=True, port=5000)