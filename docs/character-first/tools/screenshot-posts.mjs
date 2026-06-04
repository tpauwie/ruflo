/**
 * Character First — Instagram Post Screenshot Tool
 *
 * Opent social-visuals.html in een headless browser, screenshot elke kaart
 * als 1080×1080 PNG, en slaat ze op in ./output/
 *
 * Gebruik:
 *   cd docs/character-first/tools
 *   npm install
 *   npm run screenshot          # Nederlands
 *   npm run screenshot:en       # English
 */

import puppeteer from 'puppeteer';
import { mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir   = dirname(fileURLToPath(import.meta.url));
const lang    = process.argv.includes('--lang')
                  ? process.argv[process.argv.indexOf('--lang') + 1]
                  : (process.argv.includes('en') ? 'en' : 'nl');
const outDir  = resolve(__dir, `output-${lang}`);
const htmlFile = resolve(__dir, '../social-visuals.html');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

console.log(`\n📸  Character First — Screenshot Tool`);
console.log(`    Taal    : ${lang.toUpperCase()}`);
console.log(`    Bron    : ${htmlFile}`);
console.log(`    Output  : ${outDir}\n`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

// Load the HTML file directly (no CORS issues — real browser, not canvas)
await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle2', timeout: 30000 });

// Switch language if needed
if (lang === 'en') {
  await page.evaluate(() => {
    document.body.classList.add('lang-en');
    document.querySelectorAll('[data-nl]').forEach(el => {
      if (el.dataset.en) el.innerHTML = el.dataset.en;
    });
    document.querySelectorAll('.caption-text[data-lang="nl"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.caption-text[data-lang="en"]').forEach(el => el.style.display = 'block');
  });
}

// Wait for web fonts to render
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 800));

// Collect all cards with their post IDs
const posts = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.post-wrap')).map(wrap => {
    const num  = wrap.querySelector('.post-number');
    const card = wrap.querySelector('.card');
    const postId = num ? num.textContent.trim() : '?';
    const rect = card ? card.getBoundingClientRect() : null;
    return { postId, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null };
  }).filter(p => p.rect && p.rect.width > 0);
});

console.log(`   ${posts.length} kaarten gevonden\n`);

// Screenshot each card at 2× pixel ratio → 540×2 = 1080px
await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

// Re-collect rects after viewport change
const postsHD = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.post-wrap')).map(wrap => {
    const num  = wrap.querySelector('.post-number');
    const card = wrap.querySelector('.card');
    const postId = num ? num.textContent.trim() : '?';
    const rect = card ? card.getBoundingClientRect() : null;
    return { postId, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null };
  }).filter(p => p.rect && p.rect.width > 0);
});

let saved = 0;
for (const { postId, rect } of postsHD) {
  const filename = `CharacterFirst-${postId.padStart(2, '0')}.png`;
  const outPath  = resolve(outDir, filename);

  // Scroll card into view, then screenshot its exact bounds
  await page.evaluate((id) => {
    const wrap = Array.from(document.querySelectorAll('.post-wrap'))
      .find(w => w.querySelector('.post-number')?.textContent.trim() === id);
    if (wrap) wrap.scrollIntoView({ block: 'center' });
  }, postId);

  await new Promise(r => setTimeout(r, 120));

  // Re-get rect after scroll
  const liveRect = await page.evaluate((id) => {
    const wrap = Array.from(document.querySelectorAll('.post-wrap'))
      .find(w => w.querySelector('.post-number')?.textContent.trim() === id);
    const card = wrap?.querySelector('.card');
    const r    = card?.getBoundingClientRect();
    return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
  }, postId);

  if (!liveRect) { console.log(`   ⚠  Post ${postId} — geen rect, overgeslagen`); continue; }

  await page.screenshot({
    path: outPath,
    clip: {
      x: liveRect.x,
      y: liveRect.y,
      width:  liveRect.width,
      height: liveRect.height,
    },
  });

  saved++;
  process.stdout.write(`   ✓  Post ${postId.padStart(3)} → ${filename}\n`);
}

await browser.close();

console.log(`\n✅  ${saved} PNG's opgeslagen in: ${outDir}/`);
console.log(`   Klaar om te uploaden naar Instagram, Buffer of Later.\n`);
