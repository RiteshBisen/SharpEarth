"""
LR-HR Co-registration Module

Implements sub-pixel alignment using phase correlation to correct spatial
shifts between LR Sentinel-2 and HR reference imagery before patch extraction.
"""

import numpy as np
from scipy.fft import fft2, ifft2
from typing import Tuple

class ImageCoRegistrator:
    """Co-registers image pairs using sub-pixel phase correlation."""

    def align_phase_correlation(
        self,
        ref_img: np.ndarray,
        target_img: np.ndarray
    ) -> Tuple[np.ndarray, Tuple[float, float]]:
        """
        Aligns target_img to ref_img using 2D Fourier phase correlation.
        Returns (aligned_target_img, (shift_y, shift_x)).
        """
        if ref_img.ndim == 3:
            ref_gray = np.mean(ref_img, axis=0)
            target_gray = np.mean(target_img, axis=0)
        else:
            ref_gray = ref_img
            target_gray = target_img

        # 2D FFT
        F_ref = fft2(ref_gray)
        F_target = fft2(target_gray)

        # Cross-power spectrum
        R = F_ref * np.conj(F_target)
        R /= (np.abs(R) + 1e-9)

        # Inverse FFT to find correlation peak
        r = np.real(ifft2(R))
        shift_y, shift_x = np.unravel_index(np.argmax(r), r.shape)

        # Handle wrap-around shifts
        if shift_y > r.shape[0] // 2:
            shift_y -= r.shape[0]
        if shift_x > r.shape[1] // 2:
            shift_x -= r.shape[1]

        # Apply shift via roll
        if target_img.ndim == 3:
            aligned_target = np.roll(target_img, (int(shift_y), int(shift_x)), axis=(1, 2))
        else:
            aligned_target = np.roll(target_img, (int(shift_y), int(shift_x)), axis=(0, 1))

        return aligned_target, (float(shift_y), float(shift_x))
