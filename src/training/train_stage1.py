"""
Stage 1 Training Script — Generator Pre-training

Pre-trains SwinSRGANGenerator using L1 Pixel Loss + SAM Spectral Consistency Loss.
Adversarial RaGAN training is disabled in Stage 1 to stabilize generator weights.
"""

import os
import argparse
import yaml
import torch
from torch.utils.data import DataLoader, TensorDataset

from src.acquisition.synthetic_degradation import SyntheticDegradationPipeline
from src.preprocessing.patch_extractor import GeographicPatchExtractor
from src.preprocessing.normalization import ReflectanceNormalizer
from src.models.generator import SwinSRGANGenerator
from src.models.losses import SwinSRGANLossSuite

def run_stage1_training(config_path: str = "configs/default_config.yaml", epochs: int = 5):
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"--- SharpEarth Stage 1 Pretraining on device: {device} ---")

    # 1. Prepare synthetic dataset if needed
    synth_pipe = SyntheticDegradationPipeline(scale_factor=config["data"]["scale_factor"])
    hr_raw = synth_pipe.generate_synthetic_hr_scene(size=(256, 256), seed=42)
    lr_raw = synth_pipe.degrade_hr_to_lr(hr_raw)

    normalizer = ReflectanceNormalizer()
    hr_norm = normalizer.normalize(hr_raw)
    lr_norm = normalizer.normalize(lr_raw)

    patch_extractor = GeographicPatchExtractor(
        patch_size_lr=config["data"]["patch_size_lr"],
        scale_factor=config["data"]["scale_factor"],
        stride_lr=16
    )
    lr_patches, hr_patches = patch_extractor.extract_patches(lr_norm, hr_norm)

    lr_tensor = torch.tensor(lr_patches, dtype=torch.float32)
    hr_tensor = torch.tensor(hr_patches, dtype=torch.float32)

    dataset = TensorDataset(lr_tensor, hr_tensor)
    loader = DataLoader(dataset, batch_size=config["training"]["stage1"]["batch_size"], shuffle=True)

    # 2. Instantiate Generator & Loss Suite
    generator = SwinSRGANGenerator(
        in_channels=config["data"]["in_channels"],
        out_channels=config["data"]["out_channels"],
        num_features=config["model"]["generator"]["embed_dim"],
        num_rrdb_blocks=config["model"]["generator"]["num_rrdb_blocks"],
        num_swin_blocks=config["model"]["generator"]["num_swin_blocks"],
        scale_factor=float(config["data"]["scale_factor"]),
        dropout_rate=config["model"]["generator"]["dropout_rate"]
    ).to(device)

    loss_suite = SwinSRGANLossSuite(
        weight_l1=config["training"]["stage1"]["loss_weights"]["l1"],
        weight_sam=config["training"]["stage1"]["loss_weights"]["spectral_sam"]
    ).to(device)

    optimizer = torch.optim.Adam(generator.parameters(), lr=config["training"]["stage1"]["learning_rate"])

    # 3. Training Loop
    generator.train()
    for epoch in range(1, epochs + 1):
        total_epoch_loss = 0.0
        for lr_b, hr_b in loader:
            lr_b, hr_b = lr_b.to(device), hr_b.to(device)

            optimizer.zero_grad()
            sr_b = generator(lr_b)
            losses = loss_suite.forward_generator(sr_b, hr_b, stage=1)
            loss = losses["total_loss"]

            loss.backward()
            optimizer.step()

            total_epoch_loss += loss.item()

        avg_loss = total_epoch_loss / len(loader)
        print(f"Epoch [{epoch}/{epochs}] — Stage 1 Loss: {avg_loss:.6f} (L1: {losses['l1_loss'].item():.6f}, SAM: {losses['sam_loss'].item():.6f})")

    # 4. Save Checkpoint
    checkpoint_dir = "configs"
    os.makedirs(checkpoint_dir, exist_ok=True)
    checkpoint_path = os.path.join(checkpoint_dir, "sharpearth_swinsr_gan.pth")
    torch.save({
        "model_state_dict": generator.state_dict(),
        "config": config,
        "stage": 1,
        "scale_factor": config["data"]["scale_factor"]
    }, checkpoint_path)
    print(f"Saved Stage 1 pretrained checkpoint to: {checkpoint_path}")
    return checkpoint_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/default_config.yaml")
    parser.add_argument("--epochs", type=int, default=5)
    args = parser.parse_args()
    run_stage1_training(args.config, args.epochs)
