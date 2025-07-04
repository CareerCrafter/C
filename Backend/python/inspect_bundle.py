import joblib
import pprint
from pathlib import Path
import sys
import numpy as np

def analyze_bundle(bundle: dict) -> dict:
    """Perform detailed analysis of the model bundle"""
    analysis = {}
    
    # Basic bundle info
    analysis['keys'] = list(bundle.keys())
    
    # Model information
    if 'model' in bundle or 'iso_forest' in bundle:
        model = bundle.get('model') or bundle.get('iso_forest')
        analysis['model_type'] = type(model).__name__
        analysis['model_params'] = model.get_params()
        analysis['n_estimators'] = model.n_estimators
        analysis['contamination'] = model.contamination
        
    # Scaler information
    if 'scaler' in bundle:
        scaler = bundle['scaler']
        analysis['scaler_type'] = type(scaler).__name__
        analysis['scaler_params'] = scaler.get_params()
        
    # Feature columns
    if 'feat_cols' in bundle:
        analysis['feature_columns'] = bundle['feat_cols']
        analysis['num_features'] = len(bundle['feat_cols'])
        
    # Category encoding info
    if 'category_map' in bundle:
        analysis['category_mapping'] = {
            'num_categories': len(bundle['category_map']),
            'example_mapping': dict(list(bundle['category_map'].items())[:3])
        }
    elif 'label_encoder' in bundle:
        le = bundle['label_encoder']
        analysis['label_encoder'] = {
            'classes': le.classes_.tolist(),
            'num_classes': len(le.classes_)
        }
        
    # Training data stats if available
    if 'training_stats' in bundle:
        analysis['training_stats'] = bundle['training_stats']
        
    return analysis

def main():
    pkl_path = "iso_forest_bundle.pkl"
    
    try:
        # Verify file exists
        if not Path(pkl_path).exists():
            print(f"Error: File not found - {pkl_path}")
            sys.exit(1)
            
        # Load the bundle
        print(f"Loading model bundle from {pkl_path}...")
        bundle = joblib.load(pkl_path)
        
        # Basic info
        print("\n=== Basic Bundle Info ===")
        pprint.pprint(list(bundle.keys()))
        
        # Detailed analysis
        print("\n=== Detailed Analysis ===")
        analysis = analyze_bundle(bundle)
        pprint.pprint(analysis)
        
        # Memory usage estimate
        print("\n=== Memory Information ===")
        print(f"Approximate size: {sum(sys.getsizeof(v) for v in bundle.values()) / 1024:.2f} KB")
        
        # Model validation
        print("\n=== Quick Validation ===")
        if 'model' in bundle or 'iso_forest' in bundle:
            model = bundle.get('model') or bundle.get('iso_forest')
            print(f"Model ready: {hasattr(model, 'predict')}")
        if 'scaler' in bundle:
            print(f"Scaler ready: {hasattr(bundle['scaler'], 'transform')}")
        
    except Exception as e:
        print(f"\nError loading or analyzing bundle: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()