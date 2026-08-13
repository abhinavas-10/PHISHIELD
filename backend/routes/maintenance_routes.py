from flask import Blueprint, jsonify

from extensions import db
from models.prediction import PredictionHistory


maintenance_bp = Blueprint(
    "maintenance",
    __name__,
)


@maintenance_bp.delete("/maintenance/scans")
def delete_all_scans():
    """Delete all prediction history records."""

    try:
        deleted_count = PredictionHistory.query.delete()

        db.session.commit()

        return jsonify(
            {
                "status": "success",
                "message": "All scan history deleted.",
                "deleted_count": deleted_count,
            }
        ), 200

    except Exception:
        db.session.rollback()

        return jsonify(
            {
                "status": "error",
                "message": (
                    "Unable to delete scan history."
                ),
            }
        ), 500