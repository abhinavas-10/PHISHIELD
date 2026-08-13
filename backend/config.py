import os
from pathlib import Path

from dotenv import load_dotenv


# Load environment variables from .env if it exists.
load_dotenv()

# Absolute path of the backend directory.
BASE_DIR = Path(__file__).resolve().parent


class Config:
    """Base configuration for the Flask application."""

    # Flask settings
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-key-change-this-before-production",
    )

    # SQLite database
    DATABASE_PATH = BASE_DIR / "database.db"
    SQLALCHEMY_DATABASE_URI = (
        f"sqlite:///{DATABASE_PATH.as_posix()}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Frontend URL
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    )

    # Machine-learning model
    MODEL_DIR = BASE_DIR / "trained_model"
    MODEL_PATH = MODEL_DIR / "model.pkl"

    # API settings
    MAX_URL_LENGTH = 2048

    # Upload/request limits
    MAX_CONTENT_LENGTH = 1 * 1024 * 1024


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""

    DEBUG = False


class TestingConfig(Config):
    """Testing configuration."""

    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False


def get_config():
    """
    Return the configuration class based on APP_ENV.

    Supported values:
        development
        production
        testing
    """
    environment = os.getenv("APP_ENV", "production").lower()

    configurations = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig,
    }

    return configurations.get(environment, DevelopmentConfig)