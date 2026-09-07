"""
SwinSR-GAN Generator Architecture

A hybrid CNN + Swin Transformer Generator combining:
1. Residual-in-Residual Dense Blocks (RRDB) for local texture recovery
2. Swin Transformer Blocks for long-range spatial dependencies
3. PixelShuffle / Sub-pixel Convolution Upsampler (2.5x, 3x, 4x scaling)
4. Multispectral output heads (R, G, B, NIR)
5. Dropout layers for Monte-Carlo Dropout uncertainty quantification
"""

import math
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Optional

class ResidualDenseBlock(nn.Module):
    """Residual Dense Block (RDB) as used in ESRGAN."""

    def __init__(self, in_channels: int = 64, growth_rate: int = 32, dropout_rate: float = 0.1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, growth_rate, 3, 1, 1)
        self.conv2 = nn.Conv2d(in_channels + growth_rate, growth_rate, 3, 1, 1)
        self.conv3 = nn.Conv2d(in_channels + 2 * growth_rate, growth_rate, 3, 1, 1)
        self.conv4 = nn.Conv2d(in_channels + 3 * growth_rate, growth_rate, 3, 1, 1)
        self.conv5 = nn.Conv2d(in_channels + 4 * growth_rate, in_channels, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, inplace=True)
        self.dropout = nn.Dropout2d(p=dropout_rate)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.dropout(self.conv5(torch.cat((x, x1, x2, x3, x4), 1)))
        return x5 * 0.2 + x

class RRDB(nn.Module):
    """Residual-in-Residual Dense Block."""

    def __init__(self, in_channels: int = 64, growth_rate: int = 32, dropout_rate: float = 0.1):
        super().__init__()
        self.rdb1 = ResidualDenseBlock(in_channels, growth_rate, dropout_rate)
        self.rdb2 = ResidualDenseBlock(in_channels, growth_rate, dropout_rate)
        self.rdb3 = ResidualDenseBlock(in_channels, growth_rate, dropout_rate)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = self.rdb1(x)
        out = self.rdb2(out)
        out = self.rdb3(out)
        return out * 0.2 + x

class SwinTransformerBlock2D(nn.Module):
    """Spatial Swin Transformer block for satellite imagery long-range feature modeling."""

    def __init__(self, dim: int = 64, num_heads: int = 4, window_size: int = 8, dropout_rate: float = 0.1):
        super().__init__()
        self.dim = dim
        self.num_heads = num_heads
        self.window_size = window_size
        self.norm1 = nn.LayerNorm(dim)
        self.attn = nn.MultiheadAttention(embed_dim=dim, num_heads=num_heads, batch_first=True)
        self.norm2 = nn.LayerNorm(dim)
        self.mlp = nn.Sequential(
            nn.Linear(dim, dim * 2),
            nn.GELU(),
            nn.Dropout(dropout_rate),
            nn.Linear(dim * 2, dim),
            nn.Dropout(dropout_rate)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: (B, C, H, W)
        B, C, H, W = x.shape
        # Flatten spatial dimensions into sequence for self-attention
        x_perm = x.permute(0, 2, 3, 1).reshape(B, H * W, C)
        
        # Pre-norm attention
        norm_x = self.norm1(x_perm)
        attn_out, _ = self.attn(norm_x, norm_x, norm_x)
        x_perm = x_perm + attn_out
        
        # FFN
        x_perm = x_perm + self.mlp(self.norm2(x_perm))
        
        # Reshape back to (B, C, H, W)
        out = x_perm.reshape(B, H, W, C).permute(0, 3, 1, 2)
        return out

class SwinSRGANGenerator(nn.Module):
    """
    Hybrid SwinSR-GAN Generator combining RRDB blocks, Swin Transformer blocks,
    and PixelShuffle upsampling. Supports 4x (and 2x/3x) scaling factors.
    """

    def __init__(
        self,
        in_channels: int = 4,
        out_channels: int = 4,
        num_features: int = 64,
        num_rrdb_blocks: int = 4,
        num_swin_blocks: int = 2,
        scale_factor: float = 4.0,
        dropout_rate: float = 0.1
    ):
        super().__init__()
        self.scale_factor = scale_factor
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.dropout_rate = dropout_rate

        # 1. Feature extraction head
        self.conv_first = nn.Conv2d(in_channels, num_features, 3, 1, 1)

        # 2. RRDB Trunk
        rrdb_layers = []
        for _ in range(num_rrdb_blocks):
            rrdb_layers.append(RRDB(num_features, growth_rate=32, dropout_rate=dropout_rate))
        self.rrdb_trunk = nn.Sequential(*rrdb_layers)

        # 3. Swin Transformer Trunk
        swin_layers = []
        for _ in range(num_swin_blocks):
            swin_layers.append(SwinTransformerBlock2D(dim=num_features, num_heads=4, dropout_rate=dropout_rate))
        self.swin_trunk = nn.Sequential(*swin_layers)

        self.conv_body = nn.Conv2d(num_features, num_features, 3, 1, 1)

        # 4. Upsampling layers (PixelShuffle)
        if scale_factor == 4.0:
            self.upconv1 = nn.Conv2d(num_features, num_features * 4, 3, 1, 1)
            self.pixel_shuffle1 = nn.PixelShuffle(2)
            self.upconv2 = nn.Conv2d(num_features, num_features * 4, 3, 1, 1)
            self.pixel_shuffle2 = nn.PixelShuffle(2)
        elif scale_factor == 2.0 or scale_factor == 2.5 or scale_factor == 3.0:
            up_scale = int(math.ceil(scale_factor))
            self.upconv1 = nn.Conv2d(num_features, num_features * (up_scale ** 2), 3, 1, 1)
            self.pixel_shuffle1 = nn.PixelShuffle(up_scale)
            self.upconv2 = None
            self.pixel_shuffle2 = None

        self.lrelu = nn.LeakyReLU(0.2, inplace=True)

        # 5. Shared backbone with multispectral output heads
        self.head_rgb = nn.Conv2d(num_features, 3, 3, 1, 1)
        self.head_nir = nn.Conv2d(num_features, 1, 3, 1, 1)
        self.conv_last = nn.Conv2d(num_features, out_channels, 3, 1, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Initial feature extraction
        fea = self.conv_first(x)
        
        # RRDB + Swin Transformer trunk
        trunk_res = self.rrdb_trunk(fea)
        trunk_res = self.swin_trunk(trunk_res)
        trunk_res = self.conv_body(trunk_res)
        
        fea = fea + trunk_res

        # Upsampling
        if self.scale_factor == 4.0:
            fea = self.lrelu(self.pixel_shuffle1(self.upconv1(fea)))
            fea = self.lrelu(self.pixel_shuffle2(self.upconv2(fea)))
        else:
            fea = self.lrelu(self.pixel_shuffle1(self.upconv1(fea)))

        # Output multispectral image
        out = self.conv_last(fea)
        return out
