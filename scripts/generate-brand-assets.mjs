#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../apps/frontend/public');
const brandDir = path.join(publicDir, 'brand');
const markSvg = path.join(brandDir, 'maxx-clipz-mark.svg');
const logoSvg = path.join(brandDir, 'maxx-clipz-logo.svg');

async function ensureBrandAssets() {
  await Promise.all(
    [markSvg, logoSvg].map(async (asset) => {
      try {
        await fs.access(asset);
      } catch (error) {
        throw new Error(`Missing source asset: ${asset}`);
      }
    })
  );
}

async function generateOgImage() {
  const target = path.join(publicDir, 'og-image.png');
  await sharp(logoSvg)
    .resize(1200, 630, {
      fit: 'contain',
      background: '#0B0F14',
    })
    .png()
    .toFile(target);
}

async function generateFaviconPng() {
  const target = path.join(publicDir, 'favicon.png');
  await sharp(markSvg).resize(64, 64).png().toFile(target);
}

async function generateAppleTouchIcon() {
  const target = path.join(publicDir, 'apple-touch-icon.png');
  await sharp(markSvg).resize(180, 180).png().toFile(target);
}

async function generateFaviconIco() {
  const buffers = await Promise.all(
    [16, 32, 48].map((size) =>
      sharp(markSvg)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
    )
  );

  const ico = await pngToIco(buffers);
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), ico);
}

async function copyLegacyAlias() {
  const source = path.join(publicDir, 'favicon.png');
  const target = path.join(publicDir, 'postiz-fav.png');
  try {
    await fs.copyFile(source, target);
  } catch (error) {
    if ((error?.code ?? '') !== 'ENOENT') {
      throw error;
    }
  }
}

async function run() {
  await ensureBrandAssets();
  await generateOgImage();
  await Promise.all([
    generateFaviconPng(),
    generateAppleTouchIcon(),
    generateFaviconIco(),
  ]);
  await copyLegacyAlias();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
