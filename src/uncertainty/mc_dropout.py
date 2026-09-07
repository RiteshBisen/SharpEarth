"""
Monte-Carlo Dropout Uncertainty Quantification Module

Generates pixel-wise uncertainty and confidence maps for super-resolved rasters
using N stochastic Monte-Carlo Dropout forward passes:
1. Mean super-resolved prediction
2. Pixel-wise variance map across passes
3. Normalized confidence map (0.0 to 1.0)
4. Confidence thresholding and manual-review zone flagging
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Dict, Any, Tuple

class MonteCarloUncertaintyEstimator:
    """Estimates pixel-wise uncertainty using Monte-Carlo Dropout inference."""

    def __init__(self, num_passes: int = 10, confidence_threshold: float = 0.75):
        self.num_passes = num_passes
        self.confidence_threshold = confidence_threshold

    def enable_dropout_eval(self, model: nn.Module):
        """Forces all Dropout layers inside model to remain ACTIVE during inference."""
        model.eval()
        for m in model.modules():
            if isinstance(m, (nn.Dropout, nn.Dropout2d)):
                m.train()

    def predict_with_uncertainty(
        self,
        model: nn.Module,
        input_tensor: torch.Tensor,
        device: torch.device
    ) -> Dict[str, np.ndarray]:
        """
        Executes N stochastic forward passes and computes mean SR, variance, and confidence map.
        input_tensor shape: (B, C, H, W)
        """
        self.enable_dropout_eval(model)
        input_tensor = input_tensor.to(device)

        passes = []
        with torch.no_grad():
            for i in range(self.num_passes):
                sr_pass = model(input_tensor)
                passes.append(sr_pass.cpu().numpy())

        # Shape: (N, B, C, H, W)
        passes_arr = np.stack(passes, axis=0)

        # 1. Mean prediction across N passes
        mean_sr = np.mean(passes_arr, axis=0)[0] # (C, H, W)

        # 2. Pixel-wise variance across N passes
        variance_map = np.var(passes_arr, axis=0)[0] # (C, H, W)
        spatial_variance = np.mean(variance_map, axis=0) # (H, W)

        # 3. Normalized confidence map [0.0, 1.0]
        max_var = np.max(spatial_variance) + 1e-8
        min_var = np.min(spatial_variance)
        norm_var = (spatial_variance - min_var) / (max_var - min_var)
        confidence_map = 1.0 - norm_var # 1.0 = High Confidence, 0.0 = Low Confidence

        # 4. Low-confidence mask thresholding
        low_confidence_mask = confidence_map <= self.confidence_threshold
        low_confidence_percentage = float(np.mean(low_confidence_mask) * 100.0)

        return {
            "mean_sr": mean_sr.astype(np.float32),
            "variance_map": spatial_variance.astype(np.float32),
            "confidence_map": confidence_map.astype(np.float32),
            "low_confidence_mask": low_confidence_mask.astype(bool),
            "mean_confidence": float(np.mean(confidence_map)),
            "low_confidence_percentage": low_confidence_percentage,
            "num_passes": self.num_passes
        }
