.PHONY: help install test train-stage1 train-stage2 api frontend frontend-build docker-build

help:
	@echo "SharpEarth Commands:"
	@echo "  make install        Install Python backend & Node frontend dependencies"
	@echo "  make test           Run PyTest backend unit test suite"
	@echo "  make train-stage1   Run Stage 1 generator pretraining"
	@echo "  make train-stage2   Run Stage 2 GAN fine-tuning"
	@echo "  make api            Run FastAPI backend REST service"
	@echo "  make frontend       Run React Vite dev server (frontend)"
	@echo "  make frontend-build Build production React frontend"
	@echo "  make docker-build   Build Docker containers"

install:
	pip install -r requirements.txt
	cd frontend && npm install

test:
	python -m pytest tests/ -v

train-stage1:
	python -m src.training.train_stage1 --config configs/default_config.yaml

train-stage2:
	python -m src.training.train_stage2 --config configs/default_config.yaml

api:
	python -m src.serving.api

frontend:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

docker-build:
	docker-compose -f docker/docker-compose.yml build
