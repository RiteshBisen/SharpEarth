"""
Patch Extractor and Geographic Dataset Splitter

Extracts paired LR and HR patches using sliding windows while enforcing
strict geographic-tile dataset splitting (Train / Val / Test) to eliminate
spatial data leakage.
"""

import os
import json
import random
import numpy as np
from typing import List, Dict, Tuple, Any

class GeographicPatchExtractor:
    """Extracts patches and manages geographic tile splits."""

    def __init__(
        self,
        patch_size_lr: int = 64,
        scale_factor: int = 4,
        stride_lr: int = 32
    ):
        self.patch_size_lr = patch_size_lr
        self.scale_factor = scale_factor
        self.patch_size_hr = patch_size_lr * scale_factor
        self.stride_lr = stride_lr
        self.stride_hr = stride_lr * scale_factor

    def split_tiles_geographically(
        self,
        tile_ids: List[str],
        train_ratio: float = 0.70,
        val_ratio: float = 0.15,
        test_ratio: float = 0.15,
        seed: int = 42
    ) -> Dict[str, List[str]]:
        """
        Splits dataset STRICTLY by geographic tile ID.
        Never splits patches randomly to avoid spatial leakage.
        """
        random.seed(seed)
        shuffled_tiles = list(tile_ids)
        random.shuffle(shuffled_tiles)

        n_total = len(shuffled_tiles)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)

        train_tiles = shuffled_tiles[:n_train]
        val_tiles = shuffled_tiles[n_train:n_train + n_val]
        test_tiles = shuffled_tiles[n_train + n_val:]

        splits = {
            "train": train_tiles,
            "val": val_tiles,
            "test": test_tiles
        }
        return splits

    def extract_patches(
        self,
        lr_image: np.ndarray,
        hr_image: np.ndarray
    ) -> Tuple[List[np.ndarray], List[np.ndarray]]:
        """
        Extracts synchronized LR and HR patches.
        lr_image shape: (C, H_lr, W_lr)
        hr_image shape: (C, H_hr, W_hr)
        """
        C, H_lr, W_lr = lr_image.shape
        lr_patches, hr_patches = [], []

        for y in range(0, H_lr - self.patch_size_lr + 1, self.stride_lr):
            for x in range(0, W_lr - self.patch_size_lr + 1, self.stride_lr):
                # Extract LR patch
                lr_patch = lr_image[:, y:y + self.patch_size_lr, x:x + self.patch_size_lr]
                
                # Corresponding HR coordinates
                y_hr = y * self.scale_factor
                x_hr = x * self.scale_factor
                hr_patch = hr_image[:, y_hr:y_hr + self.patch_size_hr, x_hr:x_hr + self.patch_size_hr]

                if lr_patch.shape[1:] == (self.patch_size_lr, self.patch_size_lr) and \
                   hr_patch.shape[1:] == (self.patch_size_hr, self.patch_size_hr):
                    lr_patches.append(lr_patch)
                    hr_patches.append(hr_patch)

        return lr_patches, hr_patches
