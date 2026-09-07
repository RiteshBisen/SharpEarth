"""
TiTiler Integration Service

Provides dynamic raster web map tile endpoints (XYZ / TMS tiles)
for rendering COG rasters on MapLibre map viewers.
"""

import os
import numpy as np
from typing import Dict, Any, Tuple

class TiTilerService:
    """Mock/Embedded TiTiler Service for rendering COG tiles."""

    def __init__(self, host_url: str = "http://localhost:8000"):
        self.host_url = host_url

    def get_tile_url_template(self, cog_path: str) -> str:
        """Returns standard XYZ web map tile URL template for COG raster."""
        clean_path = os.path.abspath(cog_path).replace("\\", "/")
        return f"{self.host_url}/api/v1/tiles/{{z}}/{{x}}/{{y}}.png?cog_path={clean_path}"

    def get_stac_layer_info(self, stac_item: Dict[str, Any]) -> Dict[str, Any]:
        """Returns layer metadata for MapLibre interactive map configuration."""
        return {
            "id": stac_item["id"],
            "bbox": stac_item["bbox"],
            "sr_tile_url": self.get_tile_url_template(stac_item["assets"]["sr_image"]["href"]),
            "confidence_tile_url": self.get_tile_url_template(stac_item["assets"]["confidence_map"]["href"]),
            "disclaimer": stac_item["properties"]["disclaimer"]
        }
