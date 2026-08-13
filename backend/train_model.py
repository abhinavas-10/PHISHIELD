from pathlib import Path
import json

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier


BASE_DIR = Path(__file__).resolve().parent

PROCESSED_DIR = BASE_DIR / "dataset" / "processed"
MODEL_DIR = BASE_DIR / "trained_model"
MODEL_PATH = MODEL_DIR / "model.pkl"
METRICS_PATH = MODEL_DIR / "metrics.json"


RANDOM_STATE = 42


def load_data():
    """Load the processed training and testing datasets."""

    x_train = pd.read_csv(
        PROCESSED_DIR / "X_train.csv"
    )

    x_test = pd.read_csv(
        PROCESSED_DIR / "X_test.csv"
    )

    y_train = pd.read_csv(
        PROCESSED_DIR / "y_train.csv"
    ).squeeze("columns")

    y_test = pd.read_csv(
        PROCESSED_DIR / "y_test.csv"
    ).squeeze("columns")

    return x_train, x_test, y_train, y_test


def build_models():
    """Create the models that will be compared."""

    return {
        "Random Forest": RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            min_samples_split=2,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        "Decision Tree": DecisionTreeClassifier(
            random_state=RANDOM_STATE,
            max_depth=None,
        ),

        "Logistic Regression": Pipeline(
            steps=[
                (
                    "scaler",
                    StandardScaler(),
                ),
                (
                    "classifier",
                    LogisticRegression(
                        max_iter=2000,
                        random_state=RANDOM_STATE,
                    ),
                ),
            ]
        ),
    }


def evaluate_model(
    model,
    x_test,
    y_test,
):
    """Evaluate a trained model using classification metrics."""

    predictions = model.predict(x_test)

    probabilities = model.predict_proba(x_test)[:, 1]

    metrics = {
        "accuracy": accuracy_score(
            y_test,
            predictions,
        ),
        "precision": precision_score(
            y_test,
            predictions,
            zero_division=0,
        ),
        "recall": recall_score(
            y_test,
            predictions,
            zero_division=0,
        ),
        "f1_score": f1_score(
            y_test,
            predictions,
            zero_division=0,
        ),
        "roc_auc": roc_auc_score(
            y_test,
            probabilities,
        ),
        "confusion_matrix": (
            confusion_matrix(
                y_test,
                predictions,
            ).tolist()
        ),
        "classification_report": (
            classification_report(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
    }

    return metrics


def save_metrics(results):
    """Save model evaluation results as JSON."""

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    serializable_results = {}

    for model_name, metrics in results.items():
        serializable_results[model_name] = {
            key: value
            for key, value in metrics.items()
            if key != "classification_report"
        }

        serializable_results[model_name][
            "classification_report"
        ] = metrics["classification_report"]

    with open(
        METRICS_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            serializable_results,
            file,
            indent=4,
        )


def train():
    """Train, compare, and save the best phishing model."""

    print("=" * 70)
    print("AI PHISHING URL DETECTION MODEL TRAINING")
    print("=" * 70)

    x_train, x_test, y_train, y_test = load_data()

    print(f"\nTraining samples: {len(x_train)}")
    print(f"Testing samples: {len(x_test)}")
    print(f"Features: {x_train.shape[1]}")

    models = build_models()

    results = {}
    trained_models = {}

    for model_name, model in models.items():

        print("\n" + "-" * 70)
        print(f"Training: {model_name}")
        print("-" * 70)

        model.fit(
            x_train,
            y_train,
        )

        metrics = evaluate_model(
            model,
            x_test,
            y_test,
        )

        results[model_name] = metrics
        trained_models[model_name] = model

        print(
            f"Accuracy : {metrics['accuracy']:.4f}"
        )
        print(
            f"Precision: {metrics['precision']:.4f}"
        )
        print(
            f"Recall   : {metrics['recall']:.4f}"
        )
        print(
            f"F1 Score : {metrics['f1_score']:.4f}"
        )
        print(
            f"ROC-AUC  : {metrics['roc_auc']:.4f}"
        )

    # Select the model with the highest F1 score.
    best_model_name = max(
        results,
        key=lambda name: results[name]["f1_score"],
    )

    best_model = trained_models[
        best_model_name
    ]

    print("\n" + "=" * 70)
    print(
        f"BEST MODEL: {best_model_name}"
    )
    print("=" * 70)

    print(
        f"F1 Score: "
        f"{results[best_model_name]['f1_score']:.4f}"
    )

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Save both the model and its feature order.
    model_package = {
        "model": best_model,
        "feature_names": list(x_train.columns),
        "model_name": best_model_name,
    }

    joblib.dump(
        model_package,
        MODEL_PATH,
    )

    save_metrics(results)

    print(
        f"\nModel saved to: {MODEL_PATH}"
    )

    print(
        f"Metrics saved to: {METRICS_PATH}"
    )

    print("\nTraining completed successfully.")


if __name__ == "__main__":
    train()