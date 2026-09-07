"""
Data acquisition and synthetic degradation modules.
"""
from .sentinel_downloader import SentinelDownloader
from .synthetic_degradation import SyntheticDegradationPipeline

__all__ = ["SentinelDownloader", "SyntheticDegradationPipeline"]
