from pathlib import Path
from urllib.parse import urlparse

import joblib
import pandas as pd

from feature_extractor import extract_features


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "trained_model"
    / "model.pkl"
)


# Known legitimate domains.
# These are checked before the ML model because the
# training data has very few short root domains.

TRUSTED_DOMAINS = {
    # Search / Google
    "google.com",
    "google.co.in",
    "google.co.uk",

    # Microsoft
    "microsoft.com",
    "live.com",
    "outlook.com",
    "office.com",
    "office365.com",
    "bing.com",

    # Apple
    "apple.com",
    "icloud.com",

    # Amazon
    "amazon.com",
    "amazon.in",
    "amazon.co.uk",

    # Meta
    "facebook.com",
    "instagram.com",
    "whatsapp.com",
    "messenger.com",

    # Developer / Technology
    "github.com",
    "gitlab.com",
    "stackoverflow.com",
    "npmjs.com",
    "python.org",
    "pypi.org",
    "nodejs.org",
    "docker.com",

    # Education / Information
    "wikipedia.org",
    "coursera.org",
    "edx.org",
    "khanacademy.org",

    # Professional
    "linkedin.com",
    "indeed.com",

    # Video / Social
    "youtube.com",
    "reddit.com",
    "x.com",
    "twitter.com",

    # Cloud / Services
    "dropbox.com",
    "drive.google.com",
    "discord.com",
    "zoom.us",

    # Popular services
    "paypal.com",
    "stripe.com",
    "adobe.com",
    "canva.com",
    "spotify.com",
    "netflix.com",

    # Indian services
    "flipkart.com",
    "myntra.com",
    "irctc.co.in",
    "gov.in",
    "nic.in",
}


class PhishingPredictor:
    """Load the trained model and perform URL predictions."""

    def __init__(self, model_path=MODEL_PATH):
        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model not found: {self.model_path}"
            )

        package = joblib.load(self.model_path)

        self.model = package["model"]
        self.feature_names = package["feature_names"]
        self.model_name = package["model_name"]

    def prepare_features(self, url):
        """Extract and arrange URL features for the model."""

        features = extract_features(url)

        feature_data = {
            name: features.get(name, 0)
            for name in self.feature_names
        }

        return pd.DataFrame(
            [feature_data],
            columns=self.feature_names,
        )

    @staticmethod
    def _is_trusted_domain(url):
        """Check whether the URL belongs to a known trusted domain."""

        try:
            hostname = urlparse(url).hostname

            if not hostname:
                return False

            hostname = hostname.lower().rstrip(".")

            return (
                hostname in TRUSTED_DOMAINS
                or any(
                    hostname.endswith("." + domain)
                    for domain in TRUSTED_DOMAINS
                )
            )

        except Exception:
            return False

    def predict(self, url):
        """Predict whether a URL is legitimate or phishing."""

        # Prepare features for the ML model.
        feature_data = self.prepare_features(url)

        # Known trusted domains are handled separately because
        # the training dataset contains very few short root domains.
        if self._is_trusted_domain(url):
            return {
                "prediction": "Safe",
                "confidence": 99.0,
                "risk": "Low",
                "model": self.model_name,
            }

        prediction = self.model.predict(
            feature_data
        )[0]

        probabilities = self.model.predict_proba(
            feature_data
        )[0]

        # Dataset label mapping:
        # 0 = phishing
        # 1 = legitimate / safe.
        phishing_probability = probabilities[0]
        legitimate_probability = probabilities[1]

        if prediction == 1:
            result = "Safe"
            confidence = legitimate_probability * 100
            risk = self._calculate_risk(
                phishing_probability
            )
        else:
            result = "Phishing"
            confidence = phishing_probability * 100
            risk = self._calculate_risk(
                phishing_probability
            )

        return {
            "prediction": result,
            "confidence": round(
                confidence,
                2,
            ),
            "risk": risk,
            "model": self.model_name,
        }

    @staticmethod
    def _calculate_risk(
        phishing_probability,
    ):
        """Convert phishing probability into a risk level."""

        probability = phishing_probability * 100

        if probability >= 75:
            return "High"

        if probability >= 40:
            return "Medium"

        return "Low"


_predictor = None


def get_predictor():
    """Return a lazily initialized predictor instance."""

    global _predictor

    if _predictor is None:
        _predictor = PhishingPredictor()

    return _predictor


def predict_url(url):
    """Convenience function for URL prediction."""

    predictor = get_predictor()

    return predictor.predict(url)


if __name__ == "__main__":
    test_url = "https://example.com/login"

    result = predict_url(test_url)

    print("Prediction Result")
    print("-" * 40)
    print(f"URL: {test_url}")
    print(
        f"Prediction: "
        f"{result['prediction']}"
    )
    print(
        f"Confidence: "
        f"{result['confidence']}%"
    )
    print(
        f"Risk: "
        f"{result['risk']}"
    )
    print(
        f"Model: "
        f"{result['model']}"
    )