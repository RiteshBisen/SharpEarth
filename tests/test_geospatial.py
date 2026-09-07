"""
Unit tests for COG export, STAC item metadata, and FastAPI endpoints.
"""

import os
import numpy as np
import pytest
from src.serving.cog_stac import GeospatialCOGExporter, AI_DISCLAIMER_TEXT
from src.serving.titiler_service import TiTilerService
from fastapi.testclient import TestClient
from src.serving.api import app

def test_cog_and_stac_export(tmp_path):
    exporter = GeospatialCOGExporter(output_dir=str(tmp_path))
    sr_img = np.full((4, 64, 64), 1500.0, dtype=np.float32)
    conf_map = np.full((64, 64), 0.85, dtype=np.float32)

    sr_path = exporter.export_sr_cog(sr_img, tile_id="test_001")
    conf_path = exporter.export_confidence_cog(conf_map, tile_id="test_001")
    assert os.path.exists(sr_path)
    assert os.path.exists(conf_path)

    stac_item = exporter.generate_stac_item(
        tile_id="test_001",
        sr_cog_path=sr_path,
        confidence_cog_path=conf_path,
        bbox=(500000.0, 4999000.0, 5001000.0, 5000000.0),
        metrics={"psnr": 32.5, "ssim": 0.92}
    )

    assert stac_item["stac_version"] == "1.0.0"
    assert stac_item["properties"]["ai_enhanced_not_observed"] is True
    assert stac_item["properties"]["disclaimer"] == AI_DISCLAIMER_TEXT

def test_titiler_service():
    titiler = TiTilerService(host_url="http://localhost:8000")
    stac_item = {
        "id": "item_123",
        "bbox": [0, 0, 1, 1],
        "properties": {"disclaimer": AI_DISCLAIMER_TEXT},
        "assets": {
            "sr_image": {"href": "data/test_SR_COG.tif"},
            "confidence_map": {"href": "data/test_CONFIDENCE_COG.tif"}
        }
    }
    info = titiler.get_stac_layer_info(stac_item)
    assert "sr_tile_url" in info
    assert "confidence_tile_url" in info

def test_fastapi_health_endpoint():
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "disclaimer" in data
