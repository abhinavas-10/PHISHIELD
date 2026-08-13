from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset" / "phishing_urls.csv"


def inspect_dataset():
    """Inspect the downloaded phishing URL dataset."""

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )

    print("=" * 60)
    print("PHISHING URL DATASET INSPECTION")
    print("=" * 60)

    data = pd.read_csv(DATASET_PATH)

    print("\nDataset shape:")
    print(data.shape)

    print("\nColumn names:")
    for column in data.columns:
        print(f"- {column}")

    print("\nFirst 5 rows:")
    print(data.head())

    print("\nData types:")
    print(data.dtypes)

    print("\nMissing values:")
    print(data.isnull().sum())

    print("\nDuplicate rows:")
    print(data.duplicated().sum())

    print("\nUnique values:")
    for column in data.columns:
        if data[column].nunique() <= 20:
            print(f"\n{column}:")
            print(data[column].value_counts(dropna=False))


if __name__ == "__main__":
    inspect_dataset()