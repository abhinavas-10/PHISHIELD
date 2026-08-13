from flask import Blueprint, jsonify, request

from extensions import db
from models.prediction import PredictionHistory


history_bp = Blueprint(
    "history",
    __name__,
)


@history_bp.get("/history")
def get_history():
    """Return paginated prediction history."""

    try:
        page = request.args.get(
            "page",
            default=1,
            type=int,
        )

        per_page = request.args.get(
            "per_page",
            default=10,
            type=int,
        )

        search = request.args.get(
            "search",
            default="",
            type=str,
        ).strip()

        prediction_filter = request.args.get(
            "prediction",
            default="",
            type=str,
        ).strip()

        page = max(page, 1)
        per_page = min(max(per_page, 1), 100)

        query = PredictionHistory.query

        if search:
            query = query.filter(
                PredictionHistory.url.ilike(
                    f"%{search}%"
                )
            )

        if prediction_filter:
            allowed_predictions = {
                "Safe",
                "Phishing",
            }

            if prediction_filter not in allowed_predictions:
                return jsonify(
                    {
                        "status": "error",
                        "message": (
                            "Prediction filter must be "
                            "'Safe' or 'Phishing'."
                        ),
                    }
                ), 400

            query = query.filter(
                PredictionHistory.prediction
                == prediction_filter
            )

        query = query.order_by(
            PredictionHistory.created_at.desc()
        )

        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )

        scans = [
            scan.to_dict()
            for scan in pagination.items
        ]

        return jsonify(
            {
                "status": "success",
                "data": {
                    "scans": scans,
                    "pagination": {
                        "page": pagination.page,
                        "per_page": pagination.per_page,
                        "total": pagination.total,
                        "pages": pagination.pages,
                        "has_next": pagination.has_next,
                        "has_previous": pagination.has_prev,
                    },
                },
            }
        ), 200

    except Exception:
        return jsonify(
            {
                "status": "error",
                "message": (
                    "Unable to retrieve scan history."
                ),
            }
        ), 500


@history_bp.delete("/history/<int:scan_id>")
def delete_history(scan_id):
    """Delete a prediction history record."""

    scan = db.session.get(
        PredictionHistory,
        scan_id,
    )

    if scan is None:
        return jsonify(
            {
                "status": "error",
                "message": "Scan record not found.",
            }
        ), 404

    try:
        db.session.delete(scan)
        db.session.commit()

        return jsonify(
            {
                "status": "success",
                "message": (
                    "Scan history deleted successfully."
                ),
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