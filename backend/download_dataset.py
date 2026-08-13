from pathlib import Path

from ucimlrepo import fetch_ucirepo


# Project directories
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"

# Create dataset directory if it does not exist.
DATASET_DIR.mkdir(parents=True, exist_ok=True)


def download_dataset():
    """Download the PhiUSIIL dataset from the UCI repository."""

    print("Downloading PhiUSIIL dataset from UCI...")

    dataset = fetch_ucirepo(id=967)

    features = dataset.data.features
    targets = dataset.data.targets

    if features is None or targets is None:
        raise RuntimeError(
            "UCI dataset did not return the expected data."
        )

    # Combine features and target into one DataFrame.
    data = features.copy()

    if hasattr(targets, "columns"):
        for column in targets.columns:
            data[column] = targets[column].values
    else:
        data["label"] = targets

    output_path = DATASET_DIR / "phishing_urls.csv"

    data.to_csv(
        output_path,
        index=False,
    )

    print("Dataset downloaded successfully.")
    print(f"Saved to: {output_path}")
    print(f"Rows: {len(data)}")
    print(f"Columns: {len(data.columns)}")


if __name__ == "__main__":
    download_dataset()