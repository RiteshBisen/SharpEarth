"""
Unit tests for cloud masking, co-registration, patch extraction, and normalization.
"""

import numpy as np
import pytest
from src.preprocessing.cloud_masking import CloudMasker
from src.preprocessing.coregistration import ImageCoRegistrator
from src.preprocessing.patch_extractor import GeographicPatchExtractor
from src.preprocessing.normalization import ReflectanceNormalizer

def test_cloud_masker():
    masker = CloudMasker(cloud_prob_threshold=0.40)
    fake_img = np.full((4, 64, 64), 500.0, dtype=np.float32)
    is_valid, cloud_frac = masker.filter_cloudy_patches(fake_img)
    assert is_valid is True
    assert cloud_frac <= 0.15

def test_coregistration():
    reg = ImageCoRegistrator()
    ref = np.zeros((4, 64, 64), dtype=np.float32)
    ref[:, 20:40, 20:40] = 5000.0

    target = np.roll(ref, (3, 5), axis=(1, 2))
    aligned, (sy, sx) = reg.align_phase_correlation(ref, target)

    assert aligned.shape == target.shape
    assert isinstance(sy, float)
    assert isinstance(sx, float)

def test_geographic_tile_split():
    extractor = GeographicPatchExtractor(patch_size_lr=64, scale_factor=4)
    tiles = [f"Tile_{i:03d}" for i in range(10)]

    splits = extractor.split_tiles_geographically(tiles, train_ratio=0.7, val_ratio=0.15, test_ratio=0.15, seed=42)
    assert len(splits["train"]) == 7
    assert len(splits["val"]) == 1
    assert len(splits["test"]) == 2
    # Verify no tile leakage across splits
    assert len(set(splits["train"]).intersection(set(splits["val"]))) == 0
    assert len(set(splits["train"]).intersection(set(splits["test"]))) == 0

def test_patch_extraction():
    extractor = GeographicPatchExtractor(patch_size_lr=32, scale_factor=4, stride_lr=16)
    lr_img = np.ones((4, 64, 64), dtype=np.float32)
    hr_img = np.ones((4, 256, 256), dtype=np.float32)

    lr_patches, hr_patches = extractor.extract_patches(lr_img, hr_img)
    assert len(lr_patches) == len(hr_patches)
    assert len(lr_patches) > 0
    assert lr_patches[0].shape == (4, 32, 32)
    assert hr_patches[0].shape == (4, 128, 128)

def test_normalization():
    normalizer = ReflectanceNormalizer(min_val=0.0, max_val=10000.0)
    raw = np.array([0.0, 5000.0, 10000.0], dtype=np.float32)
    normed = normalizer.normalize(raw)
    np.testing.assert_allclose(normed, [0.0, 0.5, 1.0], atol=1e-5)

    recovered = normalizer.denormalize(normed)
    np.testing.assert_allclose(recovered, raw, atol=1e-3)
