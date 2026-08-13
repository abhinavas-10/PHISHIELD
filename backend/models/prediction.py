from datetime import datetime, timezone

from extensions import db


class PredictionHistory(db.Model):
    """Store the results of URL phishing predictions."""

    __tablename__ = "prediction_history"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    url = db.Column(
        db.String(2048),
        nullable=False,
    )

    prediction = db.Column(
        db.String(20),
        nullable=False,
    )

    confidence = db.Column(
        db.Float,
        nullable=False,
    )

    risk = db.Column(
        db.String(20),
        nullable=False,
    )

    reason = db.Column(
        db.Text,
        nullable=False,
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        """Convert the database record into a JSON-friendly dictionary."""

        return {
            "id": self.id,
            "url": self.url,
            "prediction": self.prediction,
            "confidence": self.confidence,
            "risk": self.risk,
            "reason": self.reason,
            "created_at": self.created_at.isoformat(),
        }