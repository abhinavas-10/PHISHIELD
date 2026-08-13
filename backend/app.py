from flask import Flask, jsonify
from flask_cors import CORS

from config import get_config
from extensions import db
from models.prediction import PredictionHistory
from routes.history_routes import history_bp
from routes.prediction_routes import prediction_bp
from routes.dashboard_routes import dashboard_bp
from routes.export_routes import export_bp
from routes.admin_routes import admin_bp
from routes.maintenance_routes import maintenance_bp

def create_app():
    """Create and configure the Flask application."""

    app = Flask(__name__)

    # Load environment-specific configuration.
    app.config.from_object(get_config())

    # Initialize SQLAlchemy.
    db.init_app(app)

    # Create database tables.
    with app.app_context():
        db.create_all()

    # Allow the React frontend to communicate with Flask.
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [app.config["FRONTEND_URL"]],
            }
        },
    )

    # Register prediction API routes.
    app.register_blueprint(
        prediction_bp,
        url_prefix="/api",
    )

    # Register history API routes.
    app.register_blueprint(
        history_bp,
        url_prefix="/api",
    )
    app.register_blueprint(
    dashboard_bp,
    url_prefix="/api",
    )
    app.register_blueprint(
    export_bp,
    url_prefix="/api",
    )
    app.register_blueprint(
    admin_bp,
    url_prefix="/api",
    )
    app.register_blueprint(
    maintenance_bp,
    url_prefix="/api",
    )
    @app.get("/api/health")
    def health_check():
        """Return the current backend health status."""

        return jsonify(
            {
                "status": "success",
                "message": "Phishing Detection API is running.",
            }
        )

    @app.errorhandler(404)
    def not_found(error):
        """Handle requests to unknown endpoints."""

        return jsonify(
            {
                "status": "error",
                "message": "The requested endpoint was not found.",
            }
        ), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        """Handle unexpected server errors."""

        return jsonify(
            {
                "status": "error",
                "message": "An internal server error occurred.",
            }
        ), 500

    return app


app = create_app()


if __name__ == "__main__":
    import os

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False,
    )