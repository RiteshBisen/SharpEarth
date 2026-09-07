"""
Cloud and Shadow Masking Module

Implements cloud and cloud-shadow detection using:
1. Sentinel-2 Scene Classification Layer (SCL) mask filtering
2. s2cloudless pixel-wise cloud probability thresholding
"""

import numpy as np
from typing import Tuple, Dict, Any

class CloudMasker:
    """Detects and masks cloud and shadow pixels in Sentinel-2 imagery."""

    # SCL Classes: 3=Cloud Shadow, 8=Cloud Medium Prob, 9=Cloud High Prob, 10=Thin Cirrus, 11=Snow/Ice
    CLOUD_SHADOW_SCL_CLASSES = [3, 8, 9, 10, 11]

    def __init__(self, cloud_prob_threshold: float = 0.40):
        self.cloud_prob_threshold = cloud_prob_threshold

    def create_scl_mask(self, scl_raster: np.ndarray) -> np.ndarray:
        """
        Creates boolean mask from Scene Classification Layer (SCL).
        True = Valid pixel, False = Cloud / Shadow / Invalid.
        """
        mask = ~np.isin(scl_raster, self.CLOUD_SHADOW_SCL_CLASSES)
        return mask.astype(bool)

    def compute_s2cloudless_prob(self, image_rgb_nir: np.ndarray) -> np.ndarray:
        """
        Calculates cloud probability map from RGB + NIR reflectance bands.
        image_rgb_nir shape: (4, H, W)
        """
        # Blue (0), Green (1), Red (2), NIR (3)
        blue, green, red, nir = image_rgb_nir[0], image_rgb_nir[1], image_rgb_nir[2], image_rgb_nir[3]
        
        # Brightness & Normalized Difference Snow/Cloud Index approximation
        brightness = (red + green + blue) / 3.0
        ndsi = (green - nir) / (green + nir + 1e-6)
        
        # Cloud probability heuristic
        prob = np.clip((brightness - 1000.0) / 4000.0 + (ndsi * 0.2), 0.0, 1.0)
        return prob.astype(np.float32)

    def filter_cloudy_patches(
        self,
        image_rgb_nir: np.ndarray,
        scl_raster: np.ndarray = None,
        max_cloud_fraction: float = 0.15
    ) -> Tuple[bool, float]:
        """
        Determines whether a patch should be accepted or rejected based on cloud fraction.
        Returns (is_valid, cloud_fraction).
        """
        if scl_raster is not None:
            valid_mask = self.create_scl_mask(scl_raster)
            cloud_fraction = float(1.0 - np.mean(valid_mask))
        else:
            cloud_prob = self.compute_s2cloudless_prob(image_rgb_nir)
            cloud_pixels = cloud_prob > self.cloud_prob_threshold
            cloud_fraction = float(np.mean(cloud_pixels))

        is_valid = cloud_fraction <= max_cloud_fraction
        return is_valid, cloud_fraction
