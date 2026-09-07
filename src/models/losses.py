"""
Loss Functions Module for SwinSR-GAN

Implements swappable loss modules:
1. Charbonnier / L1 Pixel Loss: Anchors output intensity to ground-truth
2. Perceptual VGG Loss: Preserves structural feature similarity
3. Relativistic Average GAN (RaGAN) Loss: Recovers high-frequency details
4. Spectral SAM Loss: Preserves physical spectral vector angles, NDVI, NDWI
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Any

class CharbonnierLoss(nn.Module):
    """Charbonnier Loss (smooth L1 variant)."""

    def __init__(self, eps: float = 1e-6):
        super().__init__()
        self.eps = eps

    def forward(self, pred: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        diff = pred - target
        loss = torch.sqrt(diff * diff + self.eps)
        return torch.mean(loss)

class SpectralSAMLoss(nn.Module):
    """
    Spectral Angle Mapper (SAM) Loss.
    Measures spectral vector angle distortion across multispectral bands.
    """

    def __init__(self, eps: float = 1e-8):
        super().__init__()
        self.eps = eps

    def forward(self, pred: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        # pred, target shape: (B, C, H, W)
        # Flatten spatial dimensions to compute spectral vectors
        dot_product = torch.sum(pred * target, dim=1)
        norm_pred = torch.norm(pred, p=2, dim=1)
        norm_target = torch.norm(target, p=2, dim=1)

        denom = norm_pred * norm_target + self.eps
        cos_sam = torch.clamp(dot_product / denom, -1.0 + self.eps, 1.0 - self.eps)
        sam_angle = torch.acos(cos_sam)
        
        # NDVI / NDWI consistency auxiliary loss
        # Red (band 2), NIR (band 3)
        if pred.shape[1] >= 4:
            pred_ndvi = (pred[:, 3] - pred[:, 2]) / (pred[:, 3] + pred[:, 2] + self.eps)
            target_ndvi = (target[:, 3] - target[:, 2]) / (target[:, 3] + target[:, 2] + self.eps)
            ndvi_loss = F.l1_loss(pred_ndvi, target_ndvi)
        else:
            ndvi_loss = 0.0

        return torch.mean(sam_angle) + 0.2 * ndvi_loss

class PerceptualLoss(nn.Module):
    """VGG feature-space perceptual loss."""

    def __init__(self):
        super().__init__()
        # Simple feature extractor (3-channel input)
        self.conv1 = nn.Conv2d(3, 64, 3, 1, 1)
        self.conv2 = nn.Conv2d(64, 128, 3, 1, 1)

    def forward(self, pred: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        # Extract RGB channels (first 3 bands)
        pred_rgb = pred[:, :3]
        target_rgb = target[:, :3]
        
        feat_pred = F.relu(self.conv2(F.relu(self.conv1(pred_rgb))))
        feat_target = F.relu(self.conv2(F.relu(self.conv1(target_rgb))))
        
        return F.l1_loss(feat_pred, feat_target)

class RaGANLoss(nn.Module):
    """Relativistic Average GAN (RaGAN) Adversarial Loss."""

    def __init__(self):
        super().__init__()
        self.bce = nn.BCEWithLogitsLoss()

    def generator_loss(self, d_real: torch.Tensor, d_fake: torch.Tensor) -> torch.Tensor:
        loss_g = self.bce(d_fake - torch.mean(d_real), torch.ones_like(d_fake)) + \
                 self.bce(d_real - torch.mean(d_fake), torch.zeros_like(d_real))
        return loss_g / 2.0

    def discriminator_loss(self, d_real: torch.Tensor, d_fake: torch.Tensor) -> torch.Tensor:
        loss_d = self.bce(d_real - torch.mean(d_fake), torch.ones_like(d_real)) + \
                 self.bce(d_fake - torch.mean(d_real), torch.zeros_like(d_fake))
        return loss_d / 2.0

class SwinSRGANLossSuite(nn.Module):
    """Combined Loss Suite configurable by YAML weights."""

    def __init__(
        self,
        weight_l1: float = 1.0,
        weight_charbonnier: float = 0.5,
        weight_perceptual: float = 0.1,
        weight_sam: float = 0.5,
        weight_gan: float = 0.005
    ):
        super().__init__()
        self.w_l1 = weight_l1
        self.w_charb = weight_charbonnier
        self.w_perc = weight_perceptual
        self.w_sam = weight_sam
        self.w_gan = weight_gan

        self.l1_loss = nn.L1Loss()
        self.charbonnier_loss = CharbonnierLoss()
        self.perceptual_loss = PerceptualLoss()
        self.sam_loss = SpectralSAMLoss()
        self.ragan_loss = RaGANLoss()

    def forward_generator(
        self,
        sr_img: torch.Tensor,
        hr_img: torch.Tensor,
        d_real: torch.Tensor = None,
        d_fake: torch.Tensor = None,
        stage: int = 1
    ) -> Dict[str, torch.Tensor]:
        l1 = self.l1_loss(sr_img, hr_img)
        sam = self.sam_loss(sr_img, hr_img)
        charb = self.charbonnier_loss(sr_img, hr_img)

        if stage == 1:
            total_loss = self.w_l1 * l1 + self.w_sam * sam
            return {
                "total_loss": total_loss,
                "l1_loss": l1,
                "sam_loss": sam,
                "charbonnier_loss": charb,
                "perceptual_loss": torch.tensor(0.0),
                "gan_loss": torch.tensor(0.0)
            }
        else:
            perc = self.perceptual_loss(sr_img, hr_img)
            gan = self.ragan_loss.generator_loss(d_real, d_fake) if d_real is not None and d_fake is not None else torch.tensor(0.0)
            total_loss = (self.w_l1 * l1 + 
                          self.w_charb * charb + 
                          self.w_perc * perc + 
                          self.w_sam * sam + 
                          self.w_gan * gan)
            return {
                "total_loss": total_loss,
                "l1_loss": l1,
                "sam_loss": sam,
                "charbonnier_loss": charb,
                "perceptual_loss": perc,
                "gan_loss": gan
            }
