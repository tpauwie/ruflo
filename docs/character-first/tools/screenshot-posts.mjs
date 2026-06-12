/**
 * Character First — Instagram Post Screenshot Tool
 *
 * Gebruik:
 *   cd docs/character-first/tools
 *   npm install
 *   npm run screenshot        # Nederlands → output-nl/
 *   npm run screenshot:en     # English   → output-en/
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
console.log(`    Taal   : ${lang.toUpperCase()}`);
console.log(`    Output : ${outDir}\n`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
});

const page = await browser.newPage();

// 600px wide so each card (540px) fits with a small margin; no horizontal overflow
await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });

await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle2', timeout: 30000 });

// Switch language
if (lang === 'en') {
  await page.evaluate(() => {
    document.body.classList.add('lang-en');
    document.querySelectorAll('[data-nl]').forEach(el => {
      if (el.dataset.en) el.innerHTML = el.dataset.en;
    });
    document.querySelectorAll('.caption-text[data-lang="nl"]')
            .forEach(el => el.style.display = 'none');
    document.querySelectorAll('.caption-text[data-lang="en"]')
            .forEach(el => el.style.display = 'block');
  });
}

// Hide all page chrome — only the card itself should be visible
await page.evaluate(() => {
  // Hide everything except the cards themselves
  document.querySelectorAll(
    '.page-header, .month-header, .post-caption, ' +
    '.post-number, .post-type-badge, .dl-btn, ' +
    'div[style*="text-align:center"][style*="padding:40px"]'
  ).forEach(el => el.style.display = 'none');

  // Remove hover transform so cards don't scale during screenshot
  document.querySelectorAll('.card').forEach(el => {
    el.style.transform = 'none';
    el.style.transition = 'none';
    el.style.borderRadius = '0';
  });

  // Remove grid gaps and padding so cards sit flush
  document.querySelectorAll('.post-grid').forEach(el => {
    el.style.display = 'block';
    el.style.padding = '0';
    el.style.gap = '0';
  });

  document.querySelectorAll('.post-wrap').forEach(el => {
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.width = '540px';
  });

  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.background = '#000';
});

// Wait for fonts
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 600));

// Collect post IDs in order
const postIds = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.post-wrap'))
    .map(w => w.querySelector('.post-number')?.textContent.trim())
    .filter(Boolean)
);

console.log(`   ${postIds.length} kaarten gevonden\n`);

let saved = 0;

for (const postId of postIds) {
  const filename = `CharacterFirst-${postId.replace(/^(\d)$/, '0$1')}.png`;
  const outPath  = resolve(outDir, filename);

  // Get the card ElementHandle directly
  const cardHandle = await page.evaluateHandle((id) => {
    const wrap = Array.from(document.querySelectorAll('.post-wrap'))
      .find(w => w.querySelector('.post-number')?.textContent.trim() === id);
    return wrap?.querySelector('.card') || null;
  }, postId);

  if (!cardHandle || cardHandle.toString() === 'JSHandle:null') {
    console.log(`   ⚠  Post ${postId} — element niet gevonden, overgeslagen`);
    continue;
  }

  // element.screenshot() clips exactly to the element's bounding box
  // deviceScaleFactor:2 → 540×2 = 1080×1080 output PNG
  await cardHandle.screenshot({ path: outPath, type: 'png' });
  await cardHandle.dispose();

  saved++;
  process.stdout.write(`   ✓  Post ${String(postId).padStart(3)} → ${filename}\n`);
}

await browser.close();

console.log(`\n✅  ${saved} PNG's opgeslagen in: ${outDir}/`);
console.log(`   Klaar om te uploaden naar Instagram, Buffer of Later.\n`);
