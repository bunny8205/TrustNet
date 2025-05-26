from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
model = joblib.load('risk_model.pkl')


@app.route('/')
def home():
    return """
    <h1>Risk Assessment API</h1>
    <p>Send POST requests to /risk with:</p>
    <pre>
    {
        "wallet_age_days": 365,
        "tx_count": 150,
        "suspicious_activity_flag": 0,
        "avg_tx_value": 500,
        "token_diversity": 0.5
    }
    </pre>
    """


@app.route('/risk', methods=['POST'])
def assess_risk():
    try:
        data = request.json
        required_fields = [
            'wallet_age_days',
            'tx_count',
            'suspicious_activity_flag'
        ]

        # Validate required fields
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'status': 'error'
                }), 400

        # Set defaults for optional fields
        avg_tx_value = data.get('avg_tx_value', 500)
        token_diversity = data.get('token_diversity', 0.5)

        features = [
            data['wallet_age_days'],
            data['tx_count'],
            data['suspicious_activity_flag'],
            avg_tx_value,
            token_diversity
        ]

        risk_score = model.predict([features])[0]
        return jsonify({
            'risk_score': float(np.clip(risk_score, 0, 1)),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)