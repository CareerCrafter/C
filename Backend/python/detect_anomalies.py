
"""
detect_anomalies.py  –  v2  (2025-07-01)

Robust helper for flagging expense outliers with a pre-trained
Isolation-Forest bundle produced by model_training.py.
"""

from __future__ import annotations

import pathlib
from datetime import datetime
from functools import lru_cache
from typing import Dict, List, Tuple, Union, Optional, Callable

import joblib
import numpy as np
import pandas as pd

# Quick-rule thresholds (tweak for your domain)
CATEGORY_THRESHOLDS = {
    "Rent":          30_000,
    "Groceries":     10_000,
    "Entertainment": 5_000,
    "Utilities":      8_000,
    "Transportation": 6_000,
    "Miscellaneous":  4_000,
}

AMOUNT_MIN_DEFAULT = 50
AMOUNT_MAX_DEFAULT = 10_000
CUSTOM_IFOREST_CUTOFF = -0.20          # tune on validation data

def _default_bundle_path() -> pathlib.Path:
    try:
        base_dir = pathlib.Path(__file__).resolve().parent
    except NameError:  # interactive session
        base_dir = pathlib.Path().resolve()
    return base_dir / "iso_forest_bundle.pkl"

@lru_cache(maxsize=1)
def _load_bundle(
    bundle_path: Union[str, pathlib.Path, None] = None
) -> Tuple:
    path = pathlib.Path(bundle_path) if bundle_path else _default_bundle_path()
    if not path.exists():
        raise FileNotFoundError(f"Model bundle not found: {path}")

    bundle = joblib.load(path)

    iso_forest = (
        bundle.get("model")
        or bundle.get("iso_forest")
        or bundle.get("iforest")
        or bundle.get("clf")
    )
    scaler     = bundle.get("scaler") or bundle.get("standard_scaler")
    feat_cols: List[str] = bundle.get("feat_cols") or bundle.get("features") or []

    if not (iso_forest and scaler and feat_cols):
        raise ValueError(
            "Bundle must contain at least 'model', 'scaler', and 'feat_cols'. "
            f"Found keys: {sorted(bundle)}"
        )

    cat_map         = bundle.get("category_map") or bundle.get("cat_map")
    label_encoder   = bundle.get("label_encoder") or bundle.get("le")

    def _encode(cat: str) -> int:
        if cat_map is not None:
            return cat_map.get(cat, -1)
        if label_encoder is not None:
            return int(label_encoder.transform([cat])[0]) if cat in label_encoder.classes_ else -1
        return 0

    return iso_forest, scaler, feat_cols, _encode

def _find_amount_col(feat_cols: List[str]) -> str:
    if "Amount" in feat_cols:
        return "Amount"
    matches = [c for c in feat_cols if "amount" in c.lower()]
    if matches:
        return matches[0]
    raise ValueError("No amount column found in feat_cols")

def _build_feature_row(
    amount: Union[int, float],
    category: str,
    date_str: str,
    feat_cols: List[str],
    encode_category: Callable[[str], int],
) -> pd.Series:
    row: Dict[str, Union[int, float]] = {col: 0 for col in feat_cols}

    amount_col = _find_amount_col(feat_cols)
    if "log" in amount_col.lower() or "Amount" in amount_col:
        row[amount_col] = np.log1p(amount)
    else:
        row[amount_col] = amount

    if "Category_enc" in feat_cols:
        row["Category_enc"] = encode_category(category)
    elif "Category" in feat_cols:
        row["Category"] = category

    try:
        dt = pd.to_datetime(date_str, utc=False)
    except (ValueError, TypeError) as exc:
        raise ValueError(f"Invalid date '{date_str}': {exc}") from exc

    mapping = {
        "Year":      dt.year,
        "Month":     dt.month,
        "Day":       dt.day,
        "Weekday":   dt.weekday(),
        "Hour":      dt.hour,
        "Is_Weekend": int(dt.weekday() >= 5),
    }
    for k, v in mapping.items():
        if k in feat_cols:
            row[k] = v

    return pd.Series(row, dtype=float)

def check_anomaly(
    *,
    amount: float,
    category: str,
    date_str: Optional[str] = None,
    return_score: bool = False,
    bundle_path: Union[str, pathlib.Path, None] = None,
    amount_min: float = AMOUNT_MIN_DEFAULT,
    amount_max: float = AMOUNT_MAX_DEFAULT,
) -> Dict[str, Union[bool, float, None]]:
    """
    Hybrid anomaly detection:
    1. Quick rule-based checks (amount range / category threshold)
    2. ML Isolation-Forest check from a saved bundle

    Returns:
        - {"is_anomaly": bool, "score": float | None}
    """
    result = {"is_anomaly": False, "score": None}

    # 1️⃣ Quick range checks
    if amount < amount_min or amount > amount_max:
        result["is_anomaly"] = True
        return result

    if category in CATEGORY_THRESHOLDS and amount > CATEGORY_THRESHOLDS[category]:
        result["is_anomaly"] = True
        return result

    # 2️⃣ ML IsolationForest check
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")

    try:
        iso_forest, scaler, feat_cols, encode_category = _load_bundle(bundle_path)
    except Exception as exc:
        print(f"[detect_anomalies] WARNING: model bundle not loaded – {exc}")
        return result

    try:
        row = _build_feature_row(
            amount=amount,
            category=category,
            date_str=date_str,
            feat_cols=feat_cols,
            encode_category=encode_category,
        )
        X = pd.DataFrame([row])[feat_cols]
        X_scaled = scaler.transform(X)

        score = float(iso_forest.decision_function(X_scaled)[0])
        result["is_anomaly"] = score <= CUSTOM_IFOREST_CUTOFF
        if return_score:
            result["score"] = score
    except Exception as exc:
        print(f"[detect_anomalies] WARNING: ML check failed – {exc}")

    return result

def predict_anomaly(
    input_data: Dict[str, Union[int, float, str]],
    *,
    return_score: bool = False,
    bundle_path: Union[str, pathlib.Path, None] = None,
    amount_min: float = AMOUNT_MIN_DEFAULT,
    amount_max: float = AMOUNT_MAX_DEFAULT,
) -> Union[str, Dict[str, Union[str, float]]]:
    """
    Legacy wrapper kept for backward compatibility with older code.
    Prefer calling `check_anomaly()` directly.
    """
    # Handle lowercase keys from frontend for compatibility
    data = {
        "Amount": float(input_data.get("amount", input_data.get("Amount", 0))),
        "Category": str(input_data.get("category", input_data.get("Category", ""))),
        "Date": str(input_data.get("date", input_data.get("Date", datetime.now().strftime("%Y-%m-%d"))))
    }
    result = check_anomaly(
        amount=data["Amount"],
        category=data["Category"],
        date_str=data["Date"],
        return_score=True,
        bundle_path=bundle_path,
        amount_min=amount_min,
        amount_max=amount_max,
    )

    label = "Outlier" if result["is_anomaly"] else "Normal"
    if return_score:
        return {"label": label, "score": result["score"], "is_anomaly": result["is_anomaly"]}
    return label

if __name__ == "__main__":
    demo = {
        "Amount": 750,
        "Category": "Rent",
        "Date": datetime(2025, 7, 1, 19, 17).strftime("%Y-%m-%d")
    }
    print("🧪 Quick bool  :", check_anomaly(amount=750, category="Rent"))
    print("🧪 With score :", check_anomaly(amount=750, category="Rent", return_score=True))
    print("🧪 Legacy call:", predict_anomaly(demo, return_score=True))