"""
Synthetic Degradation Pipeline

Generates paired synthetic Low-Resolution (LR, 10m) and High-Resolution (HR, 2.5m)
multispectral imagery from HR references using realistic physical degradation:
1. Blur kernel (Gaussian / point-spread function)
2. Additive Gaussian noise & radiometric jitter
3. Spatial downsampling (4x default scale factor)
4. Reflectance range scaling (0 - 10000 surface reflectance)
"""

import os
import json
import numpy as np
from scipy.ndimage import gaussian_filter
import rasterio
from rasterio.transform import from_origin
from typing import Tuple, Dict, Any, Optional

class SyntheticDegradationPipeline:
    """Pipeline for synthesizing LR-HR satellite imagery pairs."""

    def __init__(
        self,
        scale_factor: int = 4,
        blur_sigma: float = 1.2,
        noise_std: float = 0.015,
        num_bands: int = 4,
        hr_resolution: float = 2.5,
        lr_resolution: float = 10.0
    ):
        self.scale_factor = scale_factor
        self.blur_sigma = blur_sigma
        self.noise_std = noise_std
        self.num_bands = num_bands
        self.hr_resolution = hr_resolution
        self.lr_resolution = lr_resolution

    def generate_synthetic_hr_scene(
        self,
        size: Tuple[int, int] = (256, 256),
        seed: int = 42
    ) -> np.ndarray:
        """
        Generates realistic high-resolution 4-band reflectance imagery (R, G, B, NIR)
        simulating diverse land-cover patterns (croplands, urban structures, roads, water).
        Shape: (C, H, W) in range [0, 10000] float32.
        """
        np.random.seed(seed)
        H, W = size
        
        # Base background - vegetated terrain
        base_red = np.full((H, W), 400.0, dtype=np.float32)
        base_green = np.full((H, W), 700.0, dtype=np.float32)
        base_blue = np.full((H, W), 300.0, dtype=np.float32)
        base_nir = np.full((H, W), 3500.0, dtype=np.float32)
        
        # Add road grid pattern (high reflectance in RGB, moderate in NIR)
        y, x = np.mgrid[:H, :W]
        road_mask = ((x % 64 < 4) | (y % 64 < 4))
        base_red[road_mask] = 2200.0
        base_green[road_mask] = 2200.0
        base_blue[road_mask] = 2200.0
        base_nir[road_mask] = 2500.0

        # Add building structures (sharp boundaries)
        bldg_mask = ((x % 32 >= 8) & (x % 32 <= 20) & (y % 32 >= 8) & (y % 32 <= 20)) & ~road_mask
        base_red[bldg_mask] = 3000.0
        base_green[bldg_mask] = 2800.0
        base_blue[bldg_mask] = 2600.0
        base_nir[bldg_mask] = 1800.0

        # Add river/water body (low in Red/NIR, moderate Blue)
        water_mask = (y > int(H * 0.75)) & (y < int(H * 0.85))
        base_red[water_mask] = 200.0
        base_green[water_mask] = 400.0
        base_blue[water_mask] = 800.0
        base_nir[water_mask] = 100.0

        # High-frequency micro-texture noise
        texture = np.random.normal(0, 50.0, (H, W)).astype(np.float32)
        
        hr_image = np.stack([
            np.clip(base_red + texture, 0, 10000),
            np.clip(base_green + texture, 0, 10000),
            np.clip(base_blue + texture, 0, 10000),
            np.clip(base_nir + texture * 1.5, 0, 10000)
        ], axis=0)
        
        return hr_image

    def degrade_hr_to_lr(self, hr_image: np.ndarray) -> np.ndarray:
        """
        Applies point-spread blur, downsampling, and sensor noise to produce LR tile.
        Input HR shape: (C, H, W)
        Output LR shape: (C, H // scale_factor, W // scale_factor)
        """
        C, H, W = hr_image.shape
        lr_h, lr_w = H // self.scale_factor, W // self.scale_factor
        lr_image = np.zeros((C, lr_h, lr_w), dtype=np.float32)

        for c in range(C):
            # 1. Apply Gaussian blur to model optics & PSF
            blurred = gaussian_filter(hr_image[c], sigma=self.blur_sigma)
            # 2. Downsample spatially
            downsampled = blurred[::self.scale_factor, ::self.scale_factor]
            # 3. Additive sensor noise
            noise = np.random.normal(0, self.noise_std * 10000.0, downsampled.shape)
            lr_image[c] = np.clip(downsampled + noise, 0, 10000.0)

        return lr_image

    def save_geotiff_pair(
        self,
        hr_image: np.ndarray,
        lr_image: np.ndarray,
        output_dir: str,
        pair_id: str = "tile_001",
        crs: str = "EPSG:32632",
        west: float = 500000.0,
        north: float = 5000000.0
    ) -> Tuple[str, str, str]:
        """
        Saves paired HR and LR rasters as GeoTIFF files with valid spatial metadata.
        Returns (hr_path, lr_path, metadata_path).
        """
        os.makedirs(output_dir, exist_ok=True)
        hr_path = os.path.join(output_dir, f"{pair_id}_HR.tif")
        lr_path = os.path.join(output_dir, f"{pair_id}_LR.tif")
        meta_path = os.path.join(output_dir, f"{pair_id}_meta.json")

        C, H_hr, W_hr = hr_image.shape
        _, H_lr, W_lr = lr_image.shape

        # HR affine transform (2.5 m resolution)
        transform_hr = from_origin(west, north, self.hr_resolution, self.hr_resolution)
        with rasterio.open(
            hr_path, 'w',
            driver='GTiff',
            height=H_hr, width=W_hr,
            count=C, dtype='float32',
            crs=crs, transform=transform_hr
        ) as dst:
            for b in range(C):
                dst.write(hr_image[b], b + 1)

        # LR affine transform (10.0 m resolution)
        transform_lr = from_origin(west, north, self.lr_resolution, self.lr_resolution)
        with rasterio.open(
            lr_path, 'w',
            driver='GTiff',
            height=H_lr, width=W_lr,
            count=C, dtype='float32',
            crs=crs, transform=transform_lr
        ) as dst:
            for b in range(C):
                dst.write(lr_image[b], b + 1)

        metadata = {
            "pair_id": pair_id,
            "hr_path": hr_path,
            "lr_path": lr_path,
            "scale_factor": self.scale_factor,
            "hr_resolution": self.hr_resolution,
            "lr_resolution": self.lr_resolution,
            "bands": ["B2", "B3", "B4", "B8"],
            "crs": crs,
            "bbox": [west, north - H_hr * self.hr_resolution, west + W_hr * self.hr_resolution, north],
            "processing_version": "1.0.0",
            "synthetic": True
        }

        with open(meta_path, 'w') as f:
            json.dump(metadata, f, indent=2)

        return hr_path, lr_path, meta_path
