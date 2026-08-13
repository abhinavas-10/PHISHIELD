from flask import Blueprint, jsonify

from extensions import db
from models.prediction import PredictionHistory


admin_bp = Blueprint(
    "admin",
    __name__,
)


@admin_bp.get("/admin/overview")
def admin_overview():
    """Return administrative statistics."""

    try:
        total_scans = PredictionHistory.query.count()

        safe_scans = PredictionHistory.query.filter_by(
            prediction="Safe"
        ).count()

        phishing_scans = PredictionHistory.query.filter_by(
            prediction="Phishing"
        ).count()

        recent_scans = (
            PredictionHistory.query
            .order_by(
                PredictionHistory.created_at.desc()
            )
            .limit(10)
            .all()
        )

        return jsonify(
            {
                "status": "success",
                "data": {
                    "total_scans": total_scans,
                    "safe_scans": safe_scans,
                    "phishing_scans": phishing_scans,
                    "recent_scans": [
                        scan.to_dict()
                        for scan in recent_scans
                    ],
                },
            }
        ), 200

    except Exception:
        return jsonify(
            {
                "status": "error",
                "message": (
                    "Unable to retrieve admin statistics."
                ),
            }
        ), 500


@admin_bp.delete("/admin/scans/<int:scan_id>")
def admin_delete_scan(scan_id):
    """Delete a scan from the administrative interface."""

    scan = db.session.get(
        PredictionHistory,
        scan_id,
    )

    if scan is None:
        return jsonify(
            {
                "status": "error",
                "message": "Scan not found.",
            }
        ), 404

    try:
        db.session.delete(scan)
        db.session.commit()

        return jsonify(
            {
                "status": "success",
                "message": "Scan deleted successfully.",
            }
        ), 200

    except Exception:
        db.session.rollback()

        return jsonify(
            {
                "status": "error",
                "message": (
                    "Unable to delete scan."
                ),
            }
        ), 500