"""
Unit tests for SwinSRGAN Generator, Discriminator, and Loss Suite.
"""

import torch
import pytest
from src.models.generator import SwinSRGANGenerator
from src.models.discriminator import RaGANDiscriminator
from src.models.losses import SwinSRGANLossSuite, SpectralSAMLoss

def test_generator_forward_pass():
    model = SwinSRGANGenerator(
        in_channels=4,
        out_channels=4,
        num_features=32,
        num_rrdb_blocks=2,
        num_swin_blocks=1,
        scale_factor=4.0,
        dropout_rate=0.1
    )
    model.eval()

    # Input: LR patch (B=2, C=4, H=16, W=16)
    x = torch.randn(2, 4, 16, 16)
    out = model(x)
    # Output: HR patch (B=2, C=4, H=64, W=64)
    assert out.shape == (2, 4, 64, 64)

def test_discriminator_forward_pass():
    disc = RaGANDiscriminator(in_channels=4, num_filters=32)
    disc.eval()

    x = torch.randn(2, 4, 64, 64)
    score = disc(x)
    assert score.shape == (2, 1)

def test_spectral_sam_loss():
    sam_loss = SpectralSAMLoss()
    pred = torch.randn(2, 4, 32, 32)
    target = torch.randn(2, 4, 32, 32)

    loss_val = sam_loss(pred, target)
    assert isinstance(loss_val, torch.Tensor)
    assert loss_val.item() >= 0.0

def test_loss_suite():
    suite = SwinSRGANLossSuite()
    pred = torch.randn(2, 4, 32, 32)
    target = torch.randn(2, 4, 32, 32)

    losses = suite.forward_generator(pred, target, stage=1)
    assert "total_loss" in losses
    assert "sam_loss" in losses
    assert losses["total_loss"].item() >= 0.0
