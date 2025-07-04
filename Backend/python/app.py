from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from detect_anomalies import predict_anomaly
import os
import jwt
from functools import wraps
from pymongo import MongoClient
from bson import ObjectId

# Configuration
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "allow_headers": ["Authorization", "Content-Type"]}})

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)
db = client["expense_tracker"]
expenses_collection = db["expenses"]

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "ahjdfahdajkfdhdjfashj")  # Updated to match provided secret
BUNDLE_PATH = os.getenv("BUNDLE_PATH", "iso_forest_bundle.pkl")
AMOUNT_MIN = float(os.getenv("AMOUNT_MIN", 50))
AMOUNT_MAX = float(os.getenv("AMOUNT_MAX", 10000))

# JWT authentication middleware
def isUser(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            if "_id" not in payload:
                return jsonify({"error": "Token missing required '_id' field"}), 401
            request.user = payload  # Attach user payload to request
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/expense/add', methods=['POST'])
@isUser
def add_expense():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    try:
        data = request.get_json()
        user_id = request.user.get("_id")  # Get user ID from JWT payload

        if not all(k in data for k in ['category', 'amount', 'date']):
            return jsonify({"error": "Missing required fields"}), 400

        input_record = {
            "Amount": float(data['amount']),
            "Category": data['category'],
            "Date": data['date']
        }

        try:
            anomaly_result = predict_anomaly(
                input_record,
                bundle_path=BUNDLE_PATH,
                amount_min=AMOUNT_MIN,
                amount_max=AMOUNT_MAX
            )
            status = 'Anomaly' if anomaly_result['is_anomaly'] else 'Normal'
            score = anomaly_result.get('score', 0.0)
        except Exception as model_err:
            print("Anomaly model error:", model_err)
            status = 'Unknown'
            score = 0.0

        expense = {
            'userId': ObjectId(user_id),
            'category': data['category'],
            'amount': float(data['amount']),
            'date': data['date'],
            'notes': data.get('notes', ''),
            'status': status,
            'anomaly_score': score
        }

        result = expenses_collection.insert_one(expense)
        expense['_id'] = str(result.inserted_id)
        expense['id'] = str(result.inserted_id)
        return jsonify(expense), 201

    except ValueError as e:
        return jsonify({"error": f"Invalid data: {str(e)}"}), 400
    except Exception as e:
        print("Unexpected server error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/expense/list', methods=['GET'])
@isUser
def list_expenses():
    try:
        user_id = request.user.get("_id")
        expenses = list(expenses_collection.find({"userId": ObjectId(user_id)}))
        sorted_expenses = sorted(
            expenses,
            key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'),
            reverse=True
        )
        for expense in sorted_expenses:
            expense['_id'] = str(expense['_id'])
            expense['id'] = str(expense['_id'])
        return jsonify(sorted_expenses), 200
    except Exception as e:
        print("Error fetching expenses:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/expense/update/<expense_id>', methods=['PUT'])
@isUser
def update_expense(expense_id):
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    try:
        user_id = request.user.get("_id")
        data = request.get_json()
        expense = expenses_collection.find_one({"_id": ObjectId(expense_id), "userId": ObjectId(user_id)})

        if not expense:
            return jsonify({"error": "Expense not found or not owned by user"}), 404

        input_record = {
            "Amount": float(data.get('amount', expense['amount'])),
            "Category": data.get('category', expense['category']),
            "Date": data.get('date', expense['date'])
        }

        try:
            anomaly_result = predict_anomaly(
                input_record,
                bundle_path=BUNDLE_PATH,
                amount_min=AMOUNT_MIN,
                amount_max=AMOUNT_MAX
            )
            status = 'Anomaly' if anomaly_result['is_anomaly'] else 'Normal'
            score = anomaly_result.get('score', 0.0)
        except Exception as model_err:
            print("Anomaly model error:", model_err)
            status = 'Unknown'
            score = 0.0

        updated_expense = {
            'category': data.get('category', expense['category']),
            'amount': float(data.get('amount', expense['amount'])),
            'date': data.get('date', expense['date']),
            'notes': data.get('notes', expense['notes']),
            'status': status,
            'anomaly_score': score,
            'userId': ObjectId(user_id)
        }

        expenses_collection.update_one(
            {"_id": ObjectId(expense_id), "userId": ObjectId(user_id)},
            {"$set": updated_expense}
        )
        updated_expense['_id'] = expense_id
        updated_expense['id'] = expense_id
        return jsonify(updated_expense), 200

    except ValueError as e:
        return jsonify({"error": f"Invalid data: {str(e)}"}), 400
    except Exception as e:
        print("Error updating expense:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/expense/delete/<expense_id>', methods=['DELETE'])
@isUser
def delete_expense(expense_id):
    try:
        user_id = request.user.get("_id")
        result = expenses_collection.delete_one({"_id": ObjectId(expense_id), "userId": ObjectId(user_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Expense not found or not owned by user"}), 404
        return jsonify({"message": "Expense deleted successfully"}), 200
    except Exception as e:
        print("Error deleting expense:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/expense/analysis', methods=['GET'])
@isUser
def analyze_expenses():
    try:
        user_id = request.user.get("_id")
        expenses = list(expenses_collection.find({"userId": ObjectId(user_id)}))
        total_amount = sum(e['amount'] for e in expenses)
        anomaly_count = len([e for e in expenses if e['status'] == 'Anomaly'])
        for expense in expenses:
            expense['_id'] = str(expense['_id'])
            expense['id'] = str(expense['_id'])
        return jsonify({
            "expenses": expenses,
            "total_amount": total_amount,
            "anomaly_count": anomaly_count,
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    except Exception as e:
        print("Error fetching analysis:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/anomaly', methods=['POST'])
@isUser
def anomaly():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    try:
        data = request.get_json()
        result = predict_anomaly(
            data,
            return_score=True,
            bundle_path=BUNDLE_PATH,
            amount_min=AMOUNT_MIN,
            amount_max=AMOUNT_MAX,
        )
        return jsonify(result), 200
    except Exception as e:
        print("Error checking anomaly:", e)
        return jsonify({"error": str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)