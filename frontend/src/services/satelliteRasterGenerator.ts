import { GeoDataset } from '@/types/dataset';

export type RasterRenderLayer = 'original' | 'degraded' | 'enhanced' | 'confidence' | 'reference';

// Canvas Cache to avoid redundant re-renders
const rasterCache = new Map<string, string>();

/**
 * Procedurally draws location-matched satellite imagery layers onto an HTML5 Canvas.
 * Generates pixel-aligned Original (10m), Degraded, Enhanced (<4m), and Confidence rasters.
 */
export function drawSatelliteSceneToCanvas(
  canvas: HTMLCanvasElement,
  dataset: GeoDataset,
  layer: RasterRenderLayer,
  width = 800,
  height = 500
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const domain = dataset.domain;
  const locationId = dataset.id;

  // Background base fill based on region geology
  let baseColor = '#e2e8f0'; // neutral fallback
  if (locationId.includes('jaipur')) {
    baseColor = domain === 'crop' ? '#a3e635' : '#eab308'; // Jaipur warm terracota/desert soil
  } else if (locationId.includes('delhi')) {
    baseColor = '#94a3b8'; // Delhi urban concrete slate
  } else if (locationId.includes('mumbai')) {
    baseColor = '#0f766e'; // Mumbai coastal teal
  } else if (locationId.includes('punjab')) {
    baseColor = '#15803d'; // Punjab lush crop green
  } else if (locationId.includes('assam')) {
    baseColor = '#b45309'; // Assam sediment flood silt
  }

  // 1. Draw Base Terrain & Soil
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  // Seeded deterministic noise grid based on dataset ID
  const seed = locationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 2. Draw Region-Specific Feature Layers (Water, Roads, Buildings, Fields)
  if (locationId.includes('jaipur')) {
    drawJaipurFeatures(ctx, width, height, seed, layer, domain);
  } else if (locationId.includes('delhi')) {
    drawDelhiFeatures(ctx, width, height, seed, layer);
  } else if (locationId.includes('mumbai')) {
    drawMumbaiFeatures(ctx, width, height, seed, layer);
  } else if (locationId.includes('punjab')) {
    drawPunjabFeatures(ctx, width, height, seed, layer);
  } else if (locationId.includes('assam')) {
    drawAssamFeatures(ctx, width, height, seed, layer);
  } else {
    drawJaipurFeatures(ctx, width, height, seed, layer, 'urban');
  }

  // 3. Layer Specific Filters & Post-processing
  if (layer === 'original') {
    // Simulate Sentinel-2 10m Point Spread Function (PSF) spatial blur & atmospheric haze
    ctx.fillStyle = 'rgba(240, 249, 255, 0.08)';
    ctx.fillRect(0, 0, width, height);
    // Pixelate slightly to communicate 10m native spatial resolution
    applyPixelation(ctx, width, height, 4);
  } else if (layer === 'degraded') {
    applyPixelation(ctx, width, height, 7);
  } else if (layer === 'confidence') {
    // Apply spatial confidence map coloring (blue/green high conf, amber/red low conf)
    applyConfidenceOverlay(ctx, width, height, seed);
  } else if (layer === 'enhanced' || layer === 'reference') {
    // High spatial resolution crispness
    addSharpDetailNoise(ctx, width, height, 0.02);
  }
}

/**
 * Generates Data URL for a dataset layer
 */
export function getSatelliteRasterDataUrl(dataset: GeoDataset, layer: RasterRenderLayer): string {
  const cacheKey = `${dataset.id}_${layer}`;
  if (rasterCache.has(cacheKey)) {
    return rasterCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  drawSatelliteSceneToCanvas(canvas, dataset, layer, 800, 500);
  const dataUrl = canvas.toDataURL('image/png');
  rasterCache.set(cacheKey, dataUrl);
  return dataUrl;
}

/* =========================================================================
 * REGIONAL DRAWING FUNCTIONS (Jaipur, Delhi, Mumbai, Punjab, Assam)
 * ========================================================================= */

function drawJaipurFeatures(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  layer: RasterRenderLayer,
  domain: string
) {
  // Aravalli Hills Contour Line (Dark rocky elevation)
  ctx.beginPath();
  ctx.moveTo(0, h * 0.15);
  ctx.bezierCurveTo(w * 0.3, h * 0.05, w * 0.6, h * 0.35, w, h * 0.2);
  ctx.lineTo(w, 0);
  ctx.lineTo(0, 0);
  ctx.fillStyle = '#78350f'; // Dark hill ridge
  ctx.fill();

  // Jaipur Pink City Grid / Urban Blocks
  const isEnhanced = layer === 'enhanced' || layer === 'reference';
  const blockGap = isEnhanced ? 12 : 24;

  ctx.fillStyle = domain === 'crop' ? '#65a30d' : '#f59e0b';
  for (let x = 40; x < w - 40; x += 60) {
    for (let y = h * 0.3; y < h - 40; y += 50) {
      if ((x + y + seed) % 3 === 0) {
        ctx.fillStyle = '#b45309'; // Terracotta building roof
      } else if ((x + y + seed) % 2 === 0) {
        ctx.fillStyle = '#fef08a'; // Sandstone structure
      } else {
        ctx.fillStyle = '#84cc16'; // Courtyard greenery
      }
      ctx.fillRect(x, y, 48, 38);
      if (isEnhanced) {
        // Individual roof details & structural outlines
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 48, 38);
        ctx.fillRect(x + 8, y + 8, 14, 12);
      }
    }
  }

  // Major Road Arteries (MI Road & Arterial Avenues)
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = isEnhanced ? 10 : 14;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, 0);
  ctx.lineTo(w * 0.5, h);
  ctx.moveTo(0, h * 0.6);
  ctx.lineTo(w, h * 0.6);
  ctx.stroke();

  if (isEnhanced) {
    // Center lane line markings
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawDelhiFeatures(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, layer: RasterRenderLayer) {
  const isEnhanced = layer === 'enhanced' || layer === 'reference';

  // Yamuna River Curve
  ctx.beginPath();
  ctx.moveTo(w * 0.75, 0);
  ctx.bezierCurveTo(w * 0.65, h * 0.4, w * 0.85, h * 0.7, w * 0.7, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, 0);
  ctx.fillStyle = '#1e3a8a'; // Deep Yamuna water
  ctx.fill();

  // Delhi Metropolitan Blocks & Radial Hexagons (Connaught Place style)
  ctx.fillStyle = '#475569';
  for (let x = 30; x < w * 0.65; x += 55) {
    for (let y = 30; y < h - 30; y += 45) {
      ctx.fillRect(x, y, 42, 34);
      if (isEnhanced) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 5, y + 5, 12, 10);
      }
    }
  }

  // Lutyens Radial Avenues
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = isEnhanced ? 8 : 12;
  ctx.beginPath();
  ctx.arc(w * 0.35, h * 0.5, 90, 0, Math.PI * 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.7, h);
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.7, 0);
  ctx.stroke();
}

function drawMumbaiFeatures(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, layer: RasterRenderLayer) {
  const isEnhanced = layer === 'enhanced' || layer === 'reference';

  // Arabian Sea & Bay Water (Left Half)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w * 0.45, h);

  // Bandra Coastline & Mangroves
  ctx.fillStyle = '#047857'; // Mangrove vegetation
  ctx.beginPath();
  ctx.ellipse(w * 0.45, h * 0.5, 40, h * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dense BKC Urban Built-up (Right Half)
  ctx.fillStyle = '#334155';
  for (let x = w * 0.5; x < w - 20; x += 40) {
    for (let y = 20; y < h - 20; y += 35) {
      ctx.fillRect(x, y, 32, 28);
      if (isEnhanced) {
        ctx.fillStyle = '#38bdf8'; // Glass skyscraper roofs
        ctx.fillRect(x + 4, y + 4, 10, 8);
      }
    }
  }

  // Bandra-Worli Sea Link Line across Bay
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = isEnhanced ? 6 : 10;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.1);
  ctx.lineTo(w * 0.48, h * 0.85);
  ctx.stroke();
}

function drawPunjabFeatures(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, layer: RasterRenderLayer) {
  const isEnhanced = layer === 'enhanced' || layer === 'reference';

  // Agricultural Field Grid (Rectangular Crop Parcels)
  const cropColors = ['#15803d', '#16a34a', '#22c55e', '#a3e635', '#ca8a04', '#eab308'];

  let colIdx = 0;
  for (let x = 0; x < w; x += 80) {
    for (let y = 0; y < h; y += 60) {
      const color = cropColors[(x + y + seed + colIdx++) % cropColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 76, 56);

      if (isEnhanced) {
        // Field boundary lines & canal tracks
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, 76, 56);
      }
    }
  }

  // Irrigation Canal (Diagonal Blue Line)
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = isEnhanced ? 7 : 11;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.2);
  ctx.lineTo(w, h * 0.8);
  ctx.stroke();
}

function drawAssamFeatures(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, layer: RasterRenderLayer) {
  const isEnhanced = layer === 'enhanced' || layer === 'reference';

  // Kaziranga Wilderness Base (Deep Green)
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, 0, w, h);

  // Braided Brahmaputra River Inundation Channels
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.3);
  ctx.bezierCurveTo(w * 0.3, h * 0.1, w * 0.7, h * 0.6, w, h * 0.4);
  ctx.lineTo(w, h * 0.7);
  ctx.bezierCurveTo(w * 0.6, h * 0.8, w * 0.2, h * 0.4, 0, h * 0.6);
  ctx.closePath();
  ctx.fill();

  // Sediment Plumes (Silt Water)
  ctx.fillStyle = 'rgba(180, 83, 9, 0.4)';
  ctx.beginPath();
  ctx.arc(w * 0.4, h * 0.45, 50, 0, Math.PI * 2);
  ctx.fill();
}

/* =========================================================================
 * RASTER POST-PROCESSING HELPERS (Blur, Pixelation, Confidence Overlay)
 * ========================================================================= */

function applyPixelation(ctx: CanvasRenderingContext2D, w: number, h: number, factor: number) {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = Math.floor(w / factor);
  offCanvas.height = Math.floor(h / factor);
  const offCtx = offCanvas.getContext('2d');
  if (!offCtx) return;

  offCtx.imageSmoothingEnabled = false;
  offCtx.drawImage(ctx.canvas, 0, 0, offCanvas.width, offCanvas.height);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height, 0, 0, w, h);
}

function applyConfidenceOverlay(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Convert canvas features to spatially meaningful confidence heat map:
  // High contrast / edges -> High confidence (Blue #1d4ed8 / Cyan #06b6d4)
  // Low contrast / water / shadows -> Lower confidence (Amber #f59e0b / Red #dc2626)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Compute local feature intensity
    const intensity = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    const isEdgeOrRoad = intensity > 0.6 || intensity < 0.2;

    if (isEdgeOrRoad) {
      // High Confidence (Blue/Green)
      data[i] = 37;     // R
      data[i + 1] = 99; // G
      data[i + 2] = 235;// B
    } else {
      // Lower Confidence (Amber/Orange)
      data[i] = 245;    // R
      data[i + 1] = 158;// G
      data[i + 2] = 11; // B
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function addSharpDetailNoise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount * 255;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imgData, 0, 0);
}
