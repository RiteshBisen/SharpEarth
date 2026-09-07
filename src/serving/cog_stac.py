"""
Cloud-Optimized GeoTIFF (COG) & STAC Metadata Generator

1. Exports super-resolved multispectral image as Cloud-Optimized GeoTIFF (COG)
2. Exports paired pixel-wise confidence map as COG raster
3. Generates STAC-compliant Item JSON metadata including model version,
   scale factor, validation metrics, and mandatory AI-enhanced disclaimer.
"""

import os
import json
from datetime import datetime
import numpy as np
import rasterio
from rasterio.transform import Affine
from typing import Dict, Any, Tuple

AI_DISCLAIMER_TEXT = (
    "AI-ENHANCED — NOT OBSERVED. High-resolution details are reconstructed by a deep-learning "
    "model (SwinSR-GAN) and should not be interpreted as directly observed satellite measurements."
)

class GeospatialCOGExporter:
    """Exports COG rasters and generates STAC-compliant item metadata."""

    def __init__(self, output_dir: str = "data/processed"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def export_sr_cog(
        self,
        sr_image: np.ndarray,
        tile_id: str,
        src_crs: str = "EPSG:32632",
        src_transform: Affine = None,
        west: float = 500000.0,
        north: float = 5000000.0,
        target_res: float = 2.5
    ) -> str:
        """
        Writes super-resolved raster as Cloud-Optimized GeoTIFF (COG).
        sr_image shape: (C, H, W)
        """
        output_filename = f"{tile_id}_SR_COG.tif"
        output_path = os.path.join(self.output_dir, output_filename)

        C, H, W = sr_image.shape
        transform = src_transform or Affine(target_res, 0.0, west, 0.0, -target_res, north)

        with rasterio.open(
            output_path, 'w',
            driver='GTiff',
            height=H, width=W,
            count=C, dtype='float32',
            crs=src_crs, transform=transform,
            tiled=True, blockxsize=256, blockysize=256,
            compress='deflate'
        ) as dst:
            for b in range(C):
                dst.write(sr_image[b], b + 1)
            dst.update_tags(
                TITLE="SharpEarth AI-Enhanced Super-Resolved Imagery",
                DISCLAIMER=AI_DISCLAIMER_TEXT
            )

        return output_path

    def export_confidence_cog(
        self,
        confidence_map: np.ndarray,
        tile_id: str,
        src_crs: str = "EPSG:32632",
        src_transform: Affine = None,
        west: float = 500000.0,
        north: float = 5000000.0,
        target_res: float = 2.5
    ) -> str:
        """Writes normalized confidence map (0.0 - 1.0) as COG raster."""
        output_filename = f"{tile_id}_CONFIDENCE_COG.tif"
        output_path = os.path.join(self.output_dir, output_filename)

        H, W = confidence_map.shape
        transform = src_transform or Affine(target_res, 0.0, west, 0.0, -target_res, north)

        with rasterio.open(
            output_path, 'w',
            driver='GTiff',
            height=H, width=W,
            count=1, dtype='float32',
            crs=src_crs, transform=transform,
            tiled=True, blockxsize=256, blockysize=256,
            compress='deflate'
        ) as dst:
            dst.write(confidence_map, 1)
            dst.update_tags(
                TITLE="SharpEarth Uncertainty/Confidence Map",
                DISCLAIMER=AI_DISCLAIMER_TEXT
            )

        return output_path

    def generate_stac_item(
        self,
        tile_id: str,
        sr_cog_path: str,
        confidence_cog_path: str,
        bbox: Tuple[float, float, float, float],
        metrics: Dict[str, float],
        scale_factor: float = 4.0
    ) -> Dict[str, Any]:
        """Generates STAC-compliant Item JSON catalog item."""
        stac_item = {
            "type": "Feature",
            "stac_version": "1.0.0",
            "id": f"sharpearth-sr-{tile_id}",
            "bbox": list(bbox),
            "properties": {
                "datetime": datetime.utcnow().isoformat() + "Z",
                "platform": "Sentinel-2",
                "instruments": ["MSI"],
                "model_name": "SwinSR-GAN",
                "model_version": "1.0.0",
                "scale_factor": scale_factor,
                "equivalent_resolution_m": 10.0 / scale_factor,
                "validation_metrics": metrics,
                "disclaimer": AI_DISCLAIMER_TEXT,
                "ai_enhanced_not_observed": True
            },
            "assets": {
                "sr_image": {
                    "href": sr_cog_path,
                    "type": "image/tiff; application=geotiff; profile=cloud-optimized",
                    "title": "Super-Resolved Multispectral COG (<4m)"
                },
                "confidence_map": {
                    "href": confidence_cog_path,
                    "type": "image/tiff; application=geotiff; profile=cloud-optimized",
                    "title": "Pixel-Wise Monte-Carlo Uncertainty Map"
                }
            }
        }

        stac_path = os.path.join(self.output_dir, f"{tile_id}_STAC.json")
        with open(stac_path, 'w') as f:
            json.dump(stac_item, f, indent=2)

        return stac_item
