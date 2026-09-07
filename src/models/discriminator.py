"""
Relativistic Average GAN (RaGAN) Discriminator

Implements a patch-based Relativistic Average Discriminator inspired by ESRGAN
for evaluating realistic high-frequency texture details in super-resolved rasters.
"""

import torch
import torch.nn as nn

class RaGANDiscriminator(nn.Module):
    """Patch-based Relativistic Average GAN Discriminator."""

    def __init__(self, in_channels: int = 4, num_filters: int = 64):
        super().__init__()

        def conv_block(in_f: int, out_f: int, stride: int = 1, normalize: bool = True):
            layers = [nn.Conv2d(in_f, out_f, 3, stride, 1)]
            if normalize:
                layers.append(nn.BatchNorm2d(out_f))
            layers.append(nn.LeakyReLU(0.2, inplace=True))
            return layers

        self.net = nn.Sequential(
            *conv_block(in_channels, num_filters, stride=1, normalize=False),
            *conv_block(num_filters, num_filters, stride=2),
            *conv_block(num_filters, num_filters * 2, stride=1),
            *conv_block(num_filters * 2, num_filters * 2, stride=2),
            *conv_block(num_filters * 2, num_filters * 4, stride=1),
            *conv_block(num_filters * 4, num_filters * 4, stride=2),
            *conv_block(num_filters * 4, num_filters * 8, stride=1),
            *conv_block(num_filters * 8, num_filters * 8, stride=2),
            nn.AdaptiveAvgPool2d(1),
            nn.Conv2d(num_filters * 8, 1024, 1),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(1024, 1, 1)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Outputs discriminator score matrix or scalar logit."""
        out = self.net(x)
        return torch.flatten(out, 1)
