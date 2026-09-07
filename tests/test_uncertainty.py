"""
Unit tests for Monte-Carlo Dropout uncertainty quantification.
"""

import torch
import numpy as np
import pytest
from src.models.generator import SwinSRGANGenerator
from src.uncertainty.mc_dropout import MonteCarloUncertaintyEstimator

def test_mc_dropout_uncertainty():
    device = torch.device("cpu")
    model = SwinSRGANGenerator(
        in_channels=4, out_channels=4, num_features=16,
        num_rrdb_blocks=1, num_swin_blocks=1, scale_factor=4.0, dropout_rate=0.2
    ).to(device)

    estimator = MonteCarloUncertaintyEstimator(num_passes=4, confidence_threshold=0.75)
    input_tensor = torch.randn(1, 4, 16, 16).to(device)

    res = estimator.predict_with_uncertainty(model, input_tensor, device)

    assert res["mean_sr"].shape == (4, 64, 64)
    assert res["confidence_map"].shape == (64, 64)
    assert np.min(res["confidence_map"]) >= 0.0
    assert np.max(res["confidence_map"]) <= 1.0
    assert "low_confidence_percentage" in res
