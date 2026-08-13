from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

from feature_extractor import extract_features, feature_names


BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "dataset" / "phishing_urls.csv"
PROCESSED_DIR = BASE_DIR / "dataset" / "processed"

RANDOM_STATE = 42
TEST_SIZE = 0.20

TARGET_COLUMN = "label"


def load_dataset():
    """Load the original phishing URL dataset."""

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )

    return pd.read_csv(DATASET_PATH)


def extract_dataset_features(data):
    """
    Extract URL-based features from every dataset URL.

    This guarantees that training uses the same feature
    extraction logic that will be used during prediction.
    """

    if "URL" not in data.columns:
        raise ValueError(
            "The dataset does not contain a URL column."
        )

    if TARGET_COLUMN not in data.columns:
        raise ValueError(
            "The dataset does not contain a label column."
        )

    print("Extracting URL features...")

    feature_rows = []

    for index, url in enumerate(data["URL"]):
        if index % 10000 == 0:
            print(
                f"Processed {index:,} / "
                f"{len(data):,} URLs"
            )

        features = extract_features(str(url))
        feature_rows.append(features)

    features_df = pd.DataFrame(
        feature_rows,
        columns=feature_names(),
    )

    target = data[TARGET_COLUMN].astype(int)

    return features_df, target


def split_dataset(features, target):
    """Split data while preserving class distribution."""

    return train_test_split(
        features,
        target,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=target,
    )


def save_processed_data(
    x_train,
    x_test,
    y_train,
    y_test,
):
    """Save processed datasets."""

    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    x_train.to_csv(
        PROCESSED_DIR / "X_train.csv",
        index=False,
    )

    x_test.to_csv(
        PROCESSED_DIR / "X_test.csv",
        index=False,
    )

    y_train.to_csv(
        PROCESSED_DIR / "y_train.csv",
        index=False,
    )

    y_test.to_csv(
        PROCESSED_DIR / "y_test.csv",
        index=False,
    )


def main():
    """Run the URL-based preprocessing pipeline."""

    print("=" * 70)
    print("URL-BASED PHISHING DATASET PREPROCESSING")
    print("=" * 70)

    data = load_dataset()

    print(
        f"Original dataset shape: {data.shape}"
    )

    features, target = extract_dataset_features(
        data
    )

    print(
        f"\nExtracted feature shape: "
        f"{features.shape}"
    )

    print("\nFeatures used for training:")

    for number, name in enumerate(
        feature_names(),
        start=1,
    ):
        print(f"{number:02d}. {name}")

    print("\nClass distribution:")

    print(target.value_counts())

    x_train, x_test, y_train, y_test = (
        split_dataset(
            features,
            target,
        )
    )

    print("\nDataset split:")

    print(
        f"Training samples: {len(x_train):,}"
    )

    print(
        f"Testing samples: {len(x_test):,}"
    )

    save_processed_data(
        x_train,
        x_test,
        y_train,
        y_test,
    )

    print(
        "\nProcessed datasets saved to:"
    )

    print(PROCESSED_DIR)

    print(
        "\nPreprocessing completed successfully."
    )


if __name__ == "__main__":
    main()