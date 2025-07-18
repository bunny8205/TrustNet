from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback
import logging
from datetime import datetime
import pandas as pd

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model and feature names
try:
    pipeline = joblib.load('wallet_trust_model.pkl')
    FEATURE_NAMES = joblib.load('feature_names.pkl')
    logger.info("Model and features loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

FEATURE_RANGES = {
    'wallet_age_days': (1, 3650),
    'tx_count': (0, 5000),
    'unique_token_count': (0, 50),
    'total_token_balance': (0, 1e8),
    'nfts_owned': (0, 100),
    'last_tx_days_ago': (0, 365),
    'smart_contracts_used': (0, 20),
    'suspicious_activity_flag': (0, 1),
    'peer_score': (0.0, 1.0)
}


@app.route('/predict', methods=['POST'])
def predict():
    start_time = datetime.now()
    request_id = start_time.strftime("%Y%m%d%H%M%S")

    try:
        logger.info(f"[{request_id}] Prediction request received")
        data = request.get_json()

        # Validate input
        if not data or 'features' not in data:
            return jsonify({
                'error': 'Missing features in request',
                'status': 'error',
                'request_id': request_id
            }), 400

        features = data['features']

        # Check for missing features
        missing = [f for f in FEATURE_NAMES if f not in features]
        if missing:
            return jsonify({
                'error': f'Missing features: {missing}',
                'required_features': FEATURE_NAMES,
                'status': 'error',
                'request_id': request_id
            }), 400

        # Prepare input DataFrame
        try:
            input_df = pd.DataFrame([features], columns=FEATURE_NAMES)
        except Exception as e:
            return jsonify({
                'error': f'Feature formatting error: {str(e)}',
                'status': 'error',
                'request_id': request_id
            }), 400

        # Make prediction
        trust_score = float(np.clip(pipeline.predict(input_df)[0], 0, 1))

        # Generate explanation
        explanation = generate_explanation(features, trust_score)

        return jsonify({
            'trust_score': trust_score,
            'score_breakdown': explanation,
            'status': 'success',
            'request_id': request_id,
            'processing_time': (datetime.now() - start_time).total_seconds()
        })

    except Exception as e:
        logger.error(f"[{request_id}] Error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e),
            'status': 'error',
            'request_id': request_id
        }), 500


def generate_explanation(features, score):
    """Generate human-readable score explanation"""
    factors = []

    # Wallet age impact
    age_days = features['wallet_age_days']
    age_impact = min(age_days / 1000, 0.3)
    factors.append({
        'factor': 'Wallet Age',
        'value': f"{age_days} days",
        'impact': f"+{age_impact * 100:.1f}%",
        'tip': 'Older wallets get higher scores'
    })

    # Transaction count impact
    tx_count = features['tx_count']
    tx_impact = min(tx_count / 500, 0.25)
    factors.append({
        'factor': 'Transaction Count',
        'value': tx_count,
        'impact': f"+{tx_impact * 100:.1f}%",
        'tip': 'More transactions increase trust'
    })

    # Peer score impact
    peer_score = features['peer_score']
    peer_impact = (peer_score - 0.5) * 0.3
    factors.append({
        'factor': 'Peer Reputation',
        'value': f"{peer_score:.2f}",
        'impact': f"{peer_impact * 100:+.1f}%",
        'tip': 'Higher peer scores boost your rating'
    })

    # Risk factors
    if features['suspicious_activity_flag']:
        factors.append({
            'factor': 'Suspicious Activity',
            'value': 'Detected',
            'impact': "-40.0%",
            'tip': 'Avoid suspicious transactions'
        })

    # Activity recency
    last_tx = features['last_tx_days_ago']
    inactivity_penalty = min(last_tx / 150, 0.2)
    factors.append({
        'factor': 'Recent Activity',
        'value': f"{last_tx} days ago",
        'impact': f"-{inactivity_penalty * 100:.1f}%",
        'tip': 'Regular activity improves scores'
    })

    return {
        'factors': factors,
        'score_category': get_score_category(score),
        'recommendations': generate_recommendations(features)
    }


def get_score_category(score):
    if score >= 0.8: return 'Excellent'
    if score >= 0.7: return 'Good'
    if score >= 0.5: return 'Fair'
    if score >= 0.3: return 'Limited'
    return 'Restricted'


def generate_recommendations(features):
    recs = []

    if features['last_tx_days_ago'] > 14:
        recs.append("Make regular transactions to improve your score")

    if features['tx_count'] < 50:
        recs.append("Increase your transaction count to build trust")

    if features['peer_score'] < 0.5:
        recs.append("Interact with reputable wallets to improve peer score")

    if features['suspicious_activity_flag']:
        recs.append("Review recent activity to remove suspicious flags")

    return recs if recs else ["Your wallet activity looks good. Keep it up!"]


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
