"""
Unit tests for scientific image quality metrics.
"""

import numpy as np
import pytest
from src.validation.quality_metrics import ImageQualityValidator
from src.validation.downstream_tasks import DownstreamTaskEvaluator

def test_psnr_and_ssim():
    validator = ImageQualityValidator(scale_factor=4.0)
    target = np.full((4, 64, 64), 2000.0, dtype=np.float32)
    pred = target + np.random.normal(0, 50.0, target.shape).astype(np.float32)

    psnr_val = validator.compute_psnr(pred, target)
    ssim_val = validator.compute_ssim(pred, target)

    assert psnr_val > 25.0 # High PSNR for low noise
    assert 0.8 < ssim_val <= 1.0

def test_custom_ergas():
    validator = ImageQualityValidator(scale_factor=4.0)
    target = np.full((4, 64, 64), 2000.0, dtype=np.float32)
    pred = target + np.random.normal(0, 10.0, target.shape).astype(np.float32)

    ergas_val = validator.compute_ergas(pred, target)
    assert isinstance(ergas_val, float)
    assert ergas_val >= 0.0

def test_custom_sam():
    validator = ImageQualityValidator(scale_factor=4.0)
    target = np.full((4, 64, 64), 1000.0, dtype=np.float32)
    pred = target * 1.05 # Scaled magnitude, identical spectral angle

    sam_val = validator.compute_sam(pred, target)
    assert isinstance(sam_val, float)
    assert sam_val < 1.0 # Near 0 degrees angle

def test_downstream_landcover():
    evaluator = DownstreamTaskEvaluator()
    lr = np.random.uniform(100, 3000, (4, 32, 32)).astype(np.float32)
    sr = lr + np.random.normal(0, 20, lr.shape).astype(np.float32)

    res = evaluator.evaluate_landcover_classification(lr, sr)
    assert "overall_accuracy" in res
    assert "cohens_kappa" in res
    assert 0.0 <= res["overall_accuracy"] <= 1.0
