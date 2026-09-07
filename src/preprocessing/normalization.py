"""
Reflectance Normalization Module

Performs per-band surface reflectance normalization [0, 10000] -> [0, 1]
and saves corpus statistics for exact inference reproduction.
"""

import os
import json
import numpy as np
from typing import Dict, Any, Tuple

class ReflectanceNormalizer:
    """Normalizes multi-spectral reflectance tensors."""

    DEFAULT_MIN = 0.0
    DEFAULT_MAX = 10000.0 # Sentinel-2 L2A surface reflectance scale factor

    def __init__(
        self,
        min_val: float = 0.0,
        max_val: float = 10000.0,
        stats_path: str = "configs/norm_stats.json"
    ):
        self.min_val = min_val
        self.max_val = max_val
        self.stats_path = stats_path

    def normalize(self, tensor: np.ndarray) -> np.ndarray:
        """Normalizes raw reflectance array into [0.0, 1.0] range."""
        normed = (tensor.astype(np.float32) - self.min_val) / (self.max_val - self.min_val + 1e-8)
        return np.clip(normed, 0.0, 1.0).astype(np.float32)

    def denormalize(self, tensor: np.ndarray) -> np.ndarray:
        """Denormalizes [0.0, 1.0] tensor back to reflectance [0, 10000]."""
        raw = tensor.astype(np.float32) * (self.max_val - self.min_val) + self.min_val
        return np.clip(raw, 0.0, 10000.0).astype(np.float32)

    def save_stats(self, stats: Dict[str, Any]):
        """Persists normalization statistics to disk."""
        os.makedirs(os.path.dirname(self.stats_path), exist_ok=True)
        with open(self.stats_path, 'w') as f:
            json.dump(stats, f, indent=2)

    def load_stats(self) -> Dict[str, Any]:
        """Loads persistent normalization statistics."""
        if os.path.exists(self.stats_path):
            with open(self.stats_path, 'r') as f:
                return json.load(f)
        return {"min_val": self.min_val, "max_val": self.max_val}
