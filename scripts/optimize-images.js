/**
 * Script de optimización de imágenes para Arena Suites
 * Convierte JPG/PNG a WebP con múltiples tamaños
 *
 * Uso: npm run optimize:images
 */

import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'src/assets/images-optimized';

// Tamaños responsive
const SIZES = [
  { width: 400, suffix: '-sm' },   // Mobile
  { width: 800, suffix: '-md' },   // Tablet
  { width: 1200, suffix: '-lg' }   // Desktop
];

// Configuración de calidad
const WEBP_QUALITY = 80;
const JPG_QUALITY = 85;

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function optimizeImage(imagePath) {
  const filename = path.basename(imagePath, path.extname(imagePath));
  const relDir = path.dirname(imagePath).replace(INPUT_DIR, '');
  const outputPath = `${OUTPUT_DIR}${relDir}`;

  await ensureDir(outputPath);

  const image = sharp(imagePath);
  const metadata = await image.metadata();

  console.log(`  Processing: ${filename} (${metadata.width}x${metadata.height})`);

  for (const size of SIZES) {
    // Solo redimensionar si la imagen es más grande
    if (metadata.width > size.width) {
      // WebP (principal)
      await sharp(imagePath)
        .resize(size.width)
        .webp({ quality: WEBP_QUALITY })
        .toFile(`${outputPath}/${filename}${size.suffix}.webp`);

      // JPG fallback
      await sharp(imagePath)
        .resize(size.width)
        .jpeg({ quality: JPG_QUALITY })
        .toFile(`${outputPath}/${filename}${size.suffix}.jpg`);
    }
  }

  // También crear versión WebP del tamaño original (comprimida)
  await sharp(imagePath)
    .webp({ quality: WEBP_QUALITY })
    .toFile(`${outputPath}/${filename}.webp`);
}

async function main() {
  console.log('🖼️  Optimizando imágenes de Arena Suites...\n');

  const images = await glob(`${INPUT_DIR}/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`);

  if (images.length === 0) {
    console.log('⚠️  No se encontraron imágenes en', INPUT_DIR);
    console.log('   Asegúrate de copiar las imágenes originales primero.\n');
    return;
  }

  console.log(`📁 Encontradas ${images.length} imágenes\n`);

  let processed = 0;
  let errors = 0;

  for (const image of images) {
    try {
      await optimizeImage(image);
      processed++;
    } catch (err) {
      console.error(`  ❌ Error en ${image}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Completado: ${processed} imágenes procesadas`);
  if (errors > 0) {
    console.log(`⚠️  ${errors} errores`);
  }

  // Calcular tamaño final
  try {
    const { stdout } = await import('child_process').then(cp =>
      new Promise((resolve, reject) => {
        cp.exec(`du -sh ${OUTPUT_DIR}`, (err, stdout) => {
          if (err) reject(err);
          else resolve({ stdout });
        });
      })
    );
    console.log(`📦 Tamaño optimizado: ${stdout.split('\t')[0]}`);
  } catch {
    // Ignorar si du no está disponible
  }
}

main().catch(console.error);
