from flask import Blueprint, jsonify

from models.prediction import PredictionHistory


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
)


@dashboard_bp.get("/dashboard/stats")
def dashboard_stats():
    """Return statistics for the cybersecurity dashboard."""

    try:
        total_scans = PredictionHistory.query.count()

        safe_count = PredictionHistory.query.filter_by(
            prediction="Safe"
        ).count()

        phishing_count = PredictionHistory.query.filter_by(
            prediction="Phishing"
        ).count()

        if total_scans > 0:
            safe_percentage = (
                safe_count / total_scans
            ) * 100

            phishing_percentage = (
                phishing_count / total_scans
            ) * 100
        else:
            safe_percentage = 0
            phishing_percentage = 0

        recent_scans = (
            PredictionHistory.query
            .order_by(
                PredictionHistory.created_at.desc()
            )
            .limit(5)
            .all()
        )

        return jsonify(
            {
                "status": "success",
                "data": {
                    "total_scans": total_scans,
                    "safe_urls": safe_count,
                    "phishing_urls": phishing_count,
                    "safe_percentage": round(
                        safe_percentage,
                        2,
                    ),
                    "phishing_percentage": round(
                        phishing_percentage,
                        2,
                    ),
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
                    "Unable to retrieve dashboard statistics."
                ),
            }
        ), 500