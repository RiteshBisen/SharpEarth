"""
Unit tests for data acquisition and synthetic degradation pipeline.
"""

import os
import numpy as np
import pytest
from src.acquisition.sentinel_downloader import SentinelDownloader
from src.acquisition.synthetic_degradation import SyntheticDegradationPipeline

def test_sentinel_downloader():
    downloader = SentinelDownloader(output_dir="data/raw")
    results = downloader.search_scenes(
        bbox=(50.0, 10.0, 50.1, 10.1),
        start_date="2024-01-01",
        end_date="2024-06-01"
    )
    assert isinstance(results, list)
    assert len(results) > 0
    assert "scene_id" in results[0]

def test_synthetic_degradation_pipeline():
    pipeline = SyntheticDegradationPipeline(scale_factor=4)
    hr_img = pipeline.generate_synthetic_hr_scene(size=(256, 256), seed=42)
    assert hr_img.shape == (4, 256, 256)
    assert np.min(hr_img) >= 0.0

    lr_img = pipeline.degrade_hr_to_lr(hr_img)
    assert lr_img.shape == (4, 64, 64)
    assert np.min(lr_img) >= 0.0

def test_geotiff_saving(tmp_path):
    pipeline = SyntheticDegradationPipeline(scale_factor=4)
    hr_img = pipeline.generate_synthetic_hr_scene(size=(128, 128))
    lr_img = pipeline.degrade_hr_to_lr(hr_img)

    hr_p, lr_p, meta_p = pipeline.save_geotiff_pair(hr_img, lr_img, output_dir=str(tmp_path))
    assert os.path.exists(hr_p)
    assert os.path.exists(lr_p)
    assert os.path.exists(meta_p)
