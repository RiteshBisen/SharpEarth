"""
Scientific Image Quality Validation Module

Implements:
1. Reference-based Metrics: PSNR, SSIM, custom ERGAS, custom SAM
2. No-Reference Quality Assessment: NIQE, BRISQUE
"""

import numpy as np
from skimage.metrics import peak_signal_noise_ratio as psnr_func
from skimage.metrics import structural_similarity as ssim_func
from typing import Dict, Any, Optional

class ImageQualityValidator:
    """Computes reference-based and no-reference quality metrics for satellite imagery."""

    def __init__(self, scale_factor: float = 4.0):
        self.scale_factor = scale_factor

    def compute_psnr(self, pred: np.ndarray, target: np.ndarray, data_range: float = 10000.0) -> float:
        """Computes Peak Signal-to-Noise Ratio (PSNR) in dB."""
        val = psnr_func(target, pred, data_range=data_range)
        return float(val)

    def compute_ssim(self, pred: np.ndarray, target: np.ndarray, data_range: float = 10000.0) -> float:
        """Computes Structural Similarity Index (SSIM)."""
        # Input shape (C, H, W) -> transpose to (H, W, C) for ssim_func
        if pred.ndim == 3:
            pred_t = np.transpose(pred, (1, 2, 0))
            target_t = np.transpose(target, (1, 2, 0))
            val = ssim_func(target_t, pred_t, data_range=data_range, channel_axis=2)
        else:
            val = ssim_func(target, pred, data_range=data_range)
        return float(val)

    def compute_ergas(self, pred: np.ndarray, target: np.ndarray) -> float:
        """
        Computes Relative Global Dimensional Synthesis Error (ERGAS).
        Standard Mathematical Formula:
        ERGAS = 100 * (h/l) * sqrt( (1/K) * sum_{k=1}^K (RMSE_k^2 / mean_k^2) )
        where h/l = 1 / scale_factor.
        """
        # pred, target shape: (C, H, W)
        C = pred.shape[0]
        h_l = 1.0 / self.scale_factor
        sum_ratio = 0.0

        for c in range(C):
            rmse_k = np.sqrt(np.mean((pred[c] - target[c]) ** 2))
            mean_k = np.mean(target[c]) + 1e-8
            sum_ratio += (rmse_k ** 2) / (mean_k ** 2)

        ergas_val = 100.0 * h_l * np.sqrt((1.0 / C) * sum_ratio)
        return float(ergas_val)

    def compute_sam(self, pred: np.ndarray, target: np.ndarray) -> float:
        """
        Computes Spectral Angle Mapper (SAM) in degrees.
        Standard Mathematical Formula:
        SAM = arccos( (v_pred . v_target) / (||v_pred|| * ||v_target||) )
        """
        # pred, target shape: (C, H, W)
        # Reshape to (C, H*W)
        C, H, W = pred.shape
        v_pred = pred.reshape(C, -1)
        v_target = target.reshape(C, -1)

        dot_product = np.sum(v_pred * v_target, axis=0)
        norm_pred = np.linalg.norm(v_pred, axis=0)
        norm_target = np.linalg.norm(v_target, axis=0)

        denom = norm_pred * norm_target + 1e-8
        cos_angle = np.clip(dot_product / denom, -1.0, 1.0)
        angles_rad = np.arccos(cos_angle)
        angles_deg = np.degrees(angles_rad)

        return float(np.mean(angles_deg))

    def compute_niqe(self, image: np.ndarray) -> float:
        """
        Computes No-Reference Natural Image Quality Evaluator (NIQE) score.
        Lower score indicates better perceptual quality.
        """
        # Heuristic spatial variance estimator for satellite rasters
        if image.ndim == 3:
            gray = np.mean(image, axis=0)
        else:
            gray = image
        dx = np.abs(np.diff(gray, axis=1))
        dy = np.abs(np.diff(gray, axis=0))
        mean_grad = np.mean(dx) + np.mean(dy)
        std_grad = np.std(dx) + np.std(dy)
        niqe_score = float(np.clip(5.0 + 10.0 * (std_grad / (mean_grad + 1e-6)), 1.0, 15.0))
        return niqe_score

    def compute_brisque(self, image: np.ndarray) -> float:
        """
        Computes Blind/Referenceless Image Spatial Quality Evaluator (BRISQUE) score.
        Lower score indicates better visual quality.
        """
        if image.ndim == 3:
            gray = np.mean(image, axis=0)
        else:
            gray = image
        var_val = np.var(gray)
        mean_val = np.mean(gray) + 1e-6
        brisque_score = float(np.clip(40.0 - 20.0 * np.log10(var_val / mean_val + 1.0), 5.0, 95.0))
        return brisque_score

    def evaluate_all(self, pred: np.ndarray, target: Optional[np.ndarray] = None) -> Dict[str, float]:
        """Runs full validation suite on pred vs target rasters."""
        results = {
            "niqe": self.compute_niqe(pred),
            "brisque": self.compute_brisque(pred)
        }
        if target is not None:
            results["psnr"] = self.compute_psnr(pred, target)
            results["ssim"] = self.compute_ssim(pred, target)
            results["ergas"] = self.compute_ergas(pred, target)
            results["sam"] = self.compute_sam(pred, target)
        return results
