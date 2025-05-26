from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback
import logging
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/predict": {
        "origins": ["*"],  # Allow all origins for development
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model
try:
    model = joblib.load('wallet_trust_model.pkl')
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

# Expected features
FEATURE_NAMES = [
    'wallet_age_days',
    'tx_count',
    'unique_token_count',
    'total_token_balance',
    'nfts_owned',
    'last_tx_days_ago',
    'smart_contracts_used',
    'suspicious_activity_flag',
    'peer_score'
]


def validate_features(features):
    """Validate feature types and ranges"""
    checks = {
        'wallet_age_days': (1, 3650),  # 1 day to 10 years
        'tx_count': (0, 10000),
        'unique_token_count': (0, 100),
        'total_token_balance': (0, 1e8),  # Up to 100 million
        'nfts_owned': (0, 1000),
        'last_tx_days_ago': (0, 365),
        'smart_contracts_used': (0, 50),
        'suspicious_activity_flag': (0, 1),
        'peer_score': (0.0, 1.0)
    }

    errors = []
    for feature, (min_val, max_val) in checks.items():
        value = features.get(feature)
        if not isinstance(value, (int, float)):
            errors.append(f"{feature} must be a number")
        elif value < min_val or value > max_val:
            errors.append(f"{feature} must be between {min_val} and {max_val}")

    return errors


@app.route('/predict', methods=['POST'])
def predict():
    start_time = datetime.now()
    request_id = start_time.strftime("%Y%m%d%H%M%S")

    try:
        logger.info(f"[{request_id}] Received prediction request")

        # Get and validate input
        data = request.get_json()
        if not data or 'features' not in data:
            logger.error(f"[{request_id}] Missing features in request")
            return jsonify({
                'error': 'Missing features in request',
                'status': 'error',
                'request_id': request_id
            }), 400

        features = data['features']

        # Check for missing features
        missing_features = [f for f in FEATURE_NAMES if f not in features]
        if missing_features:
            logger.error(f"[{request_id}] Missing features: {missing_features}")
            return jsonify({
                'error': f'Missing features: {missing_features}',
                'required_features': FEATURE_NAMES,
                'status': 'error',
                'request_id': request_id
            }), 400

        # Validate feature values
        validation_errors = validate_features(features)
        if validation_errors:
            logger.error(f"[{request_id}] Validation errors: {validation_errors}")
            return jsonify({
                'error': 'Invalid feature values',
                'details': validation_errors,
                'status': 'error',
                'request_id': request_id
            }), 400

        # Prepare feature array
        feature_array = [features[f] for f in FEATURE_NAMES]
        logger.info(f"[{request_id}] Features: {features}")

        # Make prediction
        trust_score = model.predict([feature_array])[0]
        trust_score = float(np.clip(trust_score, 0, 1))

        processing_time = (datetime.now() - start_time).total_seconds()

        logger.info(f"[{request_id}] Prediction successful - score: {trust_score:.4f}, time: {processing_time:.2f}s")

        return jsonify({
            'trust_score': trust_score,
            'status': 'success',
            'request_id': request_id,
            'processing_time': processing_time
        })

    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds()
        logger.error(f"[{request_id}] Error: {str(e)}\n{traceback.format_exc()}")

        return jsonify({
            'error': 'Prediction failed',
            'message': str(e),
            'status': 'error',
            'request_id': request_id,
            'processing_time': processing_time
        }), 500


@app.route('/')
def home():
    return """
    <h1>Wallet Trust Score API</h1>
    <p>Send POST requests to /predict with wallet features:</p>
    <pre>
    {
        "features": {
            "wallet_age_days": 365,
            "tx_count": 150,
            "unique_token_count": 5,
            "total_token_balance": 2500,
            "nfts_owned": 3,
            "last_tx_days_ago": 7,
            "smart_contracts_used": 4,
            "suspicious_activity_flag": 0,
            "peer_score": 0.75
        }
    }
    </pre>
    <p>Response format:</p>
    <pre>
    {
        "trust_score": 0.815,
        "status": "success",
        "request_id": "20230601123456",
        "processing_time": 0.12
    }
    </pre>
    """


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)