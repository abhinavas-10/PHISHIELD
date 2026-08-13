from flask import Blueprint, current_app, jsonify, request

from extensions import db
from models.prediction import PredictionHistory
from predict import predict_url
from utils.explanation import generate_explanation
from utils.url_validator import normalize_url, validate_url


prediction_bp = Blueprint(
    "prediction",
    __name__,
)


@prediction_bp.post("/predict")
def predict():
    """Analyze a URL and return its phishing prediction."""

    # Make sure the request contains JSON.
    if not request.is_json:
        return jsonify(
            {
                "status": "error",
                "message": "Request must contain JSON data.",
            }
        ), 400

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {
                "status": "error",
                "message": "Invalid JSON request body.",
            }
        ), 400

    url = data.get("url")

    # Validate URL input.
    is_valid, validation_message = validate_url(url)

    if not is_valid:
        return jsonify(
            {
                "status": "error",
                "message": validation_message,
            }
        ), 400

    url = normalize_url(url)

    # Respect the configured maximum URL length.
    if len(url) > current_app.config["MAX_URL_LENGTH"]:
        return jsonify(
            {
                "status": "error",
                "message": "URL exceeds the maximum allowed length.",
            }
        ), 400

    try:
        # Run the trained ML model.
        prediction_result = predict_url(url)

        prediction = prediction_result["prediction"]

        # Extract URL features for explanation generation.
        from feature_extractor import extract_features

        features = extract_features(url)

        explanation = generate_explanation(
            features,
            prediction,
        )

        # Store the scan in SQLite.
        history = PredictionHistory(
            url=url,
            prediction=prediction,
            confidence=prediction_result["confidence"],
            risk=prediction_result["risk"],
            reason=explanation["summary"],
        )

        db.session.add(history)
        db.session.commit()

        return jsonify(
            {
                "status": "success",
                "data": {
                    "id": history.id,
                    "url": url,
                    "prediction": prediction,
                    "confidence": prediction_result[
                        "confidence"
                    ],
                    "risk": prediction_result["risk"],
                    "model": prediction_result["model"],
                    "summary": explanation["summary"],
                    "reasons": explanation["reasons"],
                    "warnings": explanation["warnings"],
                    "features": features,
                    "created_at": history.created_at.isoformat(),
                },
            }
        ), 200

    except FileNotFoundError:
        return jsonify(
            {
                "status": "error",
                "message": (
                    "Machine-learning model is not available."
                ),
            }
        ), 503

    except Exception:
        db.session.rollback()

        current_app.logger.exception(
            "URL prediction failed."
        )

        return jsonify(
            {
                "status": "error",
                "message": (
                    "Unable to analyze the URL right now."
                ),
            }
        ), 500