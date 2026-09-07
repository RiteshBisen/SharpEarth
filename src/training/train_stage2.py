"""
Stage 2 Training Script — GAN Fine-Tuning

Fine-tunes pre-trained SwinSRGANGenerator with Relativistic Average GAN (RaGAN)
discriminator, Perceptual VGG Loss, Charbonnier Loss, and SAM Spectral Loss.
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
from src.models.discriminator import RaGANDiscriminator
from src.models.losses import SwinSRGANLossSuite

def run_stage2_training(config_path: str = "configs/default_config.yaml", epochs: int = 5):
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"--- SharpEarth Stage 2 GAN Fine-Tuning on device: {device} ---")

    # 1. Synthetic dataset setup
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
    loader = DataLoader(dataset, batch_size=config["training"]["stage2"]["batch_size"], shuffle=True)

    # 2. Instantiate Generator, Discriminator & Losses
    generator = SwinSRGANGenerator(
        in_channels=config["data"]["in_channels"],
        out_channels=config["data"]["out_channels"],
        num_features=config["model"]["generator"]["embed_dim"],
        num_rrdb_blocks=config["model"]["generator"]["num_rrdb_blocks"],
        num_swin_blocks=config["model"]["generator"]["num_swin_blocks"],
        scale_factor=float(config["data"]["scale_factor"]),
        dropout_rate=config["model"]["generator"]["dropout_rate"]
    ).to(device)

    # Load Stage 1 checkpoint if exists
    checkpoint_path = "configs/sharpearth_swinsr_gan.pth"
    if os.path.exists(checkpoint_path):
        ckpt = torch.load(checkpoint_path, map_location=device)
        generator.load_state_dict(ckpt["model_state_dict"])
        print("Loaded Stage 1 generator weights.")

    discriminator = RaGANDiscriminator(
        in_channels=config["data"]["out_channels"],
        num_filters=config["model"]["discriminator"]["num_filters"]
    ).to(device)

    loss_suite = SwinSRGANLossSuite(
        weight_l1=config["training"]["stage2"]["loss_weights"]["l1"],
        weight_charbonnier=config["training"]["stage2"]["loss_weights"]["charbonnier"],
        weight_perceptual=config["training"]["stage2"]["loss_weights"]["perceptual_vgg"],
        weight_sam=config["training"]["stage2"]["loss_weights"]["spectral_sam"],
        weight_gan=config["training"]["stage2"]["loss_weights"]["adversarial_ragan"]
    ).to(device)

    opt_g = torch.optim.Adam(generator.parameters(), lr=config["training"]["stage2"]["learning_rate"])
    opt_d = torch.optim.Adam(discriminator.parameters(), lr=config["training"]["stage2"]["learning_rate"])

    # 3. Training Loop
    generator.train()
    discriminator.train()

    for epoch in range(1, epochs + 1):
        for lr_b, hr_b in loader:
            lr_b, hr_b = lr_b.to(device), hr_b.to(device)

            # Train Discriminator
            opt_d.zero_grad()
            sr_b = generator(lr_b).detach()
            d_real = discriminator(hr_b)
            d_fake = discriminator(sr_b)
            d_loss = loss_suite.ragan_loss.discriminator_loss(d_real, d_fake)
            d_loss.backward()
            opt_d.step()

            # Train Generator
            opt_g.zero_grad()
            sr_b = generator(lr_b)
            d_real = discriminator(hr_b).detach()
            d_fake = discriminator(sr_b)
            g_losses = loss_suite.forward_generator(sr_b, hr_b, d_real=d_real, d_fake=d_fake, stage=2)
            g_loss = g_losses["total_loss"]
            g_loss.backward()
            opt_g.step()

        print(f"Epoch [{epoch}/{epochs}] — Stage 2 G_Loss: {g_loss.item():.6f}, D_Loss: {d_loss.item():.6f}")

    # Save final fine-tuned model checkpoint
    torch.save({
        "model_state_dict": generator.state_dict(),
        "discriminator_state_dict": discriminator.state_dict(),
        "config": config,
        "stage": 2,
        "scale_factor": config["data"]["scale_factor"]
    }, checkpoint_path)
    print(f"Saved Stage 2 fine-tuned model checkpoint to: {checkpoint_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/default_config.yaml")
    parser.add_argument("--epochs", type=int, default=5)
    args = parser.parse_args()
    run_stage2_training(args.config, args.epochs)
