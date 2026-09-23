const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.resolve(__dirname, '../_work/badges_raw');
const OUTPUT_DIR = path.resolve(__dirname, '../public/images/badges');

async function processFile(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Check if image is already transparent (e.g. from Photoshop AI cutout or PNG)
  const cornerAlphas = [
    data[3],
    data[(width - 1) * channels + 3],
    data[((height - 1) * width) * channels + 3],
    data[((height - 1) * width + (width - 1)) * channels + 3]
  ];
  const isAlreadyTransparent = cornerAlphas.every(a => a < 10);

  if (!isAlreadyTransparent) {
    const visited = new Uint8Array(width * height);
    const queue = [
      0,
      width - 1,
      (height - 1) * width,
      (height - 1) * width + (width - 1)
    ];

    for (const idx of queue) {
      visited[idx] = 1;
    }

    function isBackground(x, y) {
      const p = (y * width + x) * channels;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const minC = Math.min(r, g, b);
      const maxC = Math.max(r, g, b);
      const diff = maxC - minC;

      // Pure white or warm/cool light background
      if (minC > 220 && diff < 25) return true;
      // Soft drop shadow (neutral grey gradient on white background)
      if (minC > 115 && diff < 16) return true;
      if (minC > 85 && diff < 10) return true;

      return false;
    }

    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cx = curr % width;
      const cy = Math.floor(curr / width);

      const p = curr * channels;
      data[p + 3] = 0;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          if (!visited[nidx] && isBackground(nx, ny)) {
            visited[nidx] = 1;
            queue.push(nidx);
          }
        }
      }
    }

    // 2-Pass Defringe: remove residual pale background & shadow fringe on outer border
    for (let pass = 0; pass < 2; pass++) {
      const toClear = [];
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const p = (y * width + x) * channels;
          if (data[p + 3] > 0) {
            let hasTrans = false;
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
              if (data[((y + dy) * width + (x + dx)) * channels + 3] === 0) {
                hasTrans = true;
                break;
              }
            }
            if (hasTrans) {
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              const minC = Math.min(r, g, b);
              const diff = Math.max(r, g, b) - minC;
              if (minC > 130 && diff < 22) {
                toClear.push(p + 3);
              }
            }
          }
        }
      }
      for (const p3 of toClear) data[p3] = 0;
    }

    // Soft edge anti-aliasing
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const p = idx * channels;
        if (data[p + 3] !== 0) {
          let hasTrans = false;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const np = ((y + dy) * width + (x + dx)) * channels;
            if (data[np + 3] === 0) {
              hasTrans = true;
              break;
            }
          }
          if (hasTrans) {
            const r = data[p];
            const g = data[p + 1];
            const b = data[p + 2];
            if (r > 200 && g > 200 && b > 200) {
              data[p + 3] = Math.max(0, Math.min(255, Math.round(255 - ((r + g + b) / 3 - 200) * 5)));
            }
          }
        }
      }
    }
  }

  // Final export: trim boundary, fit to 480px, pad to 512x512 with 16px border breathing room
  await sharp(data, {
    raw: { width, height, channels }
  })
    .trim()
    .resize(480, 480, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outputPath);
}

async function run() {
  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  if (files.length === 0) {
    console.log(`ℹ Keine Rohbilder in ${INPUT_DIR} gefunden.`);
    console.log(`Lege dort deine generierten Bilder ab, z.B. rainmaker.png, botanyNerd.jpg, etc.`);
    return;
  }

  console.log(`🚀 Verarbeite ${files.length} Bild(er) aus _work/badges_raw/...`);
  for (const file of files) {
    const ext = path.extname(file);
    const key = path.basename(file, ext);
    const inPath = path.join(INPUT_DIR, file);
    const outPath = path.join(OUTPUT_DIR, `${key}.webp`);

    try {
      await processFile(inPath, outPath);
      const stat = fs.statSync(outPath);
      console.log(`✔ [${key}] -> public/images/badges/${key}.webp (${Math.round(stat.size / 1024)} KB)`);
    } catch (err) {
      console.error(`✖ Fehler bei ${file}:`, err.message);
    }
  }

  // Auto-sync StatisticsClient.tsx BADGE_IMAGES
  const clientFile = path.resolve(__dirname, '../components/StatisticsClient.tsx');
  if (fs.existsSync(clientFile)) {
    const existingWebp = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.webp'));
    const entries = existingWebp.map(f => {
      const k = path.basename(f, '.webp');
      return `  ${k}: "/images/badges/${f}",`;
    }).join('\n');

    const content = fs.readFileSync(clientFile, 'utf-8');
    const updated = content.replace(
      /const BADGE_IMAGES: Record<string, string> = \{[\s\S]*?\};/,
      `const BADGE_IMAGES: Record<string, string> = {\n${entries}\n};`
    );
    if (updated !== content) {
      fs.writeFileSync(clientFile, updated, 'utf-8');
      console.log(`🔄 BADGE_IMAGES in StatisticsClient.tsx synchronisiert (${existingWebp.length} Badges aktiv).`);
    }
  }

  console.log('✨ Fertig!');
}

run().catch(console.error);
