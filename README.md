# SharpEarth

SharpEarth is a modular, production-ready geospatial AI platform designed to perform deep-learning super-resolution on satellite imagery. It enhances 10 m Sentinel-2 L2A optical satellite imagery to sub-4 m equivalent spatial resolution (2.5 m target) using a hybrid CNN + Swin Transformer + GAN architecture (**SwinSR-GAN**).

The platform integrates data preprocessing, reflectance normalisation, uncertainty estimation via Monte Carlo Dropout, comprehensive scientific quality metrics (PSNR, SSIM, ERGAS, SAM, NIQE, BRISQUE), downstream task evaluation, Cloud-Optimized GeoTIFF (COG) generation, and STAC item metadata export into a FastAPI backend REST service and an interactive React web dashboard.

---

## Features

- **Hybrid SwinSR-GAN Architecture**: Deep-learning generator combining Residual-in-Residual Dense Blocks (RRDB) with Swin Transformer blocks for high-frequency detail synthesis and spatial feature extraction.
- **Uncertainty Quantification**: Monte Carlo Dropout estimation performing multiple stochastic forward passes to generate pixel-level variance and confidence maps for AI outputs.
- **Geospatial Processing & Ingestion**: Reflectance normalisation, Sentinel-2 cloud masking (SCL band based), patch extraction with spatial overlap, and coregistration.
- **Cloud-Optimized GeoTIFF (COG) & STAC Export**: Automatic conversion of super-resolved outputs and confidence maps into COG format with full spatial projection tags and STAC (SpatioTemporal Asset Catalog) v1.0.0 JSON metadata items.
- **Scientific Validation & Quality Metrics**: Evaluation suite for spectral and spatial fidelity including PSNR, SSIM, ERGAS, SAM, NIQE, and BRISQUE.
- **Downstream Task Evaluation**: Automated land cover classification assessment comparing segmentation map accuracy before and after super-resolution.
- **FastAPI REST API**: Asynchronous job queuing and RESTful endpoints for system status, super-resolution inference, demo generation, and STAC item retrieval.
- **Interactive React Web Dashboard**: Responsive interface powered by MapLibre GL JS, interactive side-by-side satellite split viewers, quality metrics displays, and confidence visualization charts.
- **Streamlit Demo Dashboard**: Lightweight Python dashboard for quick interactive testing and parameter tuning.
- **Containerized Deployment**: Dockerfile definitions and Docker Compose configurations for backend, frontend, and full stack orchestration.

---

## Technology Stack

- **Deep Learning Framework**: PyTorch, torchvision, timm
- **Backend Service**: FastAPI, Uvicorn, Pydantic, PyYAML
- **Geospatial & Remote Sensing Libraries**: Rasterio, PySTAC, Scikit-Image, NumPy, SciPy
- **Frontend Web Application**: React 19, TypeScript, Vite, MapLibre GL JS, Recharts, Tailwind CSS, Lucide React
- **Dashboard**: Streamlit
- **Testing & Quality Assurance**: PyTest
- **Containerization**: Docker, Docker Compose

---

## Project Structure

```text
SharpEarth/
├── configs/                      # YAML configuration files & model weights
│   ├── default_config.yaml       # Default training and pipeline parameters
│   ├── model_config.yaml         # Architecture depth & feature dimensions
│   └── sharpearth_swinsr_gan.pth # Pre-trained SwinSR-GAN model weights
├── data/                         # Data directory structure
│   ├── raw/                      # Sentinel-2 L2A input bands (10m)
│   ├── processed/                # Super-resolved COGs & STAC items
│   └── splits/                   # Dataset splits for training/eval
├── docker/                       # Docker container setup
│   ├── Dockerfile                # Unified Docker container definition
│   ├── Dockerfile.backend        # FastAPI service container
│   ├── Dockerfile.frontend       # React Vite frontend container
│   └── docker-compose.yml        # Docker Compose service orchestration
├── dashboard/                    # Streamlit fallback / demo dashboard
│   ├── app.py                    # Main Streamlit application
│   ├── components.py             # Streamlit visual components
│   └── style.css                 # Custom Streamlit styling
├── frontend/                     # Modern React + Vite Web Application
│   ├── src/                      # React source components and hooks
│   ├── public/                   # Public assets and favicon
│   ├── package.json              # Node dependencies and scripts
│   └── vite.config.ts            # Vite build configuration
├── src/                          # Backend core Python modules
│   ├── acquisition/              # Sentinel-2 downloaders & synthetic degradation
│   ├── models/                   # SwinSR-GAN Generator, Discriminator, Loss functions
│   ├── preprocessing/            # Cloud masking, coregistration, normalisation
│   ├── serving/                  # FastAPI REST API & COG/STAC exporters
│   ├── training/                 # Stage 1 pre-training & Stage 2 GAN fine-tuning
│   ├── uncertainty/              # Monte Carlo Dropout estimation engine
│   └── validation/               # Quality metrics (PSNR, SSIM, ERGAS, SAM) & downstream tasks
├── tests/                        # PyTest test suite
│   ├── test_api.py               # REST API integration tests
│   ├── test_data.py              # Data loading & GeoTIFF export tests
│   ├── test_geospatial.py        # COG & STAC item packaging tests
│   ├── test_metrics.py           # Scientific validation metric unit tests
│   ├── test_models.py            # PyTorch model shape & forward pass tests
│   ├── test_preprocessing.py     # Cloud mask & normaliser tests
│   └── test_uncertainty.py       # MC Dropout variance engine tests
├── Makefile                      # Command shortcuts for setup, testing, and execution
├── pyproject.toml                # PyTest and Python tool configurations
├── requirements.txt              # Backend Python dependencies
└── .env.example                  # Environment configuration template
```

---

## How It Works

1. **Ingestion & Degradation**: Input Sentinel-2 L2A 10 m multispectral imagery (B02, B03, B04, B08) is received or synthetically generated via Gaussian blurring and sub-sampling for baseline testing.
2. **Preprocessing**: Images pass through reflectance normalisation ($[0, 10000] \rightarrow [0, 1]$), optional cloud masking (using SCL scene classification), and sub-patch extraction.
3. **Super-Resolution Inference**: The preprocessed tensor is fed to the `SwinSRGANGenerator` model, upscaling spatial resolution by 4x to 2.5 m equivalent pixel spacing.
4. **Uncertainty Estimation**: Monte Carlo Dropout executes multiple forward evaluations with active dropout layers. Pixel-wise standard variance is computed to output a spatial confidence map ($[0.0, 1.0]$).
5. **Quality Metric Validation**: Generated high-resolution images are evaluated against reference targets using PSNR, SSIM, ERGAS, SAM, NIQE, and BRISQUE metrics.
6. **COG & STAC Packaging**: Output bands and confidence maps are formatted into GeoTIFF files with Cloud-Optimized compression structures and indexed into a STAC Item JSON metadata object.
7. **Web Serving**: The REST API exposes status and results to the interactive React MapLibre frontend dashboard.

---

## Installation & Setup

### Prerequisites

- **Python**: Version 3.10, 3.11, 3.12, or 3.13
- **Node.js**: Version 18.x or higher (with npm)
- **Git**: Latest version installed

### 1. Clone Repository & Setup Environment

```bash
git clone https://github.com/RiteshBisen/SharpEarth.git
cd SharpEarth
```

### 2. Configure Environment File

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

### 3. Install Python Backend Dependencies

```bash
pip install -r requirements.txt
```

*(Alternatively, use Python launcher: `py -m pip install -r requirements.txt`)*

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the Application

### Option A: Run REST API & React Web Application

1. **Start FastAPI Backend**:
   ```bash
   python -m src.serving.api
   ```
   *(Or using python launcher: `py -m src.serving.api`)*  
   FastAPI server runs on **http://localhost:8000** (Swagger API Docs at **http://localhost:8000/docs**).

2. **Start React Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   React dashboard runs on **http://localhost:3000**.

---

### Option B: Run Streamlit Demo Dashboard

```bash
streamlit run dashboard/app.py
```

---

### Option C: Run with Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up --build
```

---

## Running Backend Test Suite

To verify system functionality and test all PyTorch models, data exporters, and API routes:

```bash
python -m pytest tests/ -v
```

---

## Screenshots

> [!NOTE]
> Screenshot images can be placed in `docs/screenshots/` and referenced below.

### Main Application Interface
![Main Application Interface](docs/screenshots/main_interface.png)
*Interactive MapLibre GL geospatial map interface displaying low-resolution (10 m) vs AI-enhanced high-resolution (<4 m) satellite scene split views.*

### Super-Resolution & Quality Metrics Viewer
![Quality Metrics Viewer](docs/screenshots/quality_metrics.png)
*Real-time quantitative validation metrics panel showing PSNR, SSIM, ERGAS, and SAM evaluation scores for super-resolved imagery.*

### Uncertainty Heatmap & Confidence Analysis
![Uncertainty Heatmap](docs/screenshots/uncertainty_heatmap.png)
*Pixel-level confidence map produced via Monte Carlo Dropout estimation, highlighting regions of high uncertainty and model stability.*

### STAC Item & COG Geospatial Export Workflow
![STAC Export Workflow](docs/screenshots/stac_export.png)
*Cloud-Optimized GeoTIFF (COG) generation and STAC Item JSON metadata export drawer ready for GIS integration.*

---

## Future Improvements

- **Real-Time STAC Stream Ingestion**: Integration with live Copernicus Data Space Ecosystem STAC APIs for automated scene fetching.
- **Multi-Temporal Super-Resolution**: Extension of SwinSR-GAN to fuse multi-date imagery for cloud fill and enhanced temporal consistency.
- **ONNX & TensorRT Inference Acceleration**: Optimizing model weights for high-throughput batch inference on cloud GPU clusters.

---

## License

Distributed under the MIT License. See `LICENSE` for details.
