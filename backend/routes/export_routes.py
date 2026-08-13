import csv
import io

from flask import Blueprint, Response, jsonify

from models.prediction import PredictionHistory


export_bp = Blueprint(
    "export",
    __name__,
)


@export_bp.get("/history/export")
def export_history():
    """Export all prediction history as a CSV file."""

    try:
        scans = (
            PredictionHistory.query
            .order_by(
                PredictionHistory.created_at.desc()
            )
            .all()
        )

        output = io.StringIO()

        writer = csv.writer(output)

        writer.writerow(
            [
                "ID",
                "URL",
                "Prediction",
                "Confidence",
                "Risk",
                "Reason",
                "Created At",
            ]
        )

        for scan in scans:
            writer.writerow(
                [
                    scan.id,
                    scan.url,
                    scan.prediction,
                    scan.confidence,
                    scan.risk,
                    scan.reason,
                    scan.created_at.isoformat(),
                ]
            )

        response = Response(
            output.getvalue(),
            mimetype="text/csv",
        )

        response.headers[
            "Content-Disposition"
        ] = "attachment; filename=scan_history.csv"

        return response

    except Exception:
        return jsonify(
            {
                "status": "error",
                "message": (
                    "Unable to export scan history."
                ),
            }
        ), 500