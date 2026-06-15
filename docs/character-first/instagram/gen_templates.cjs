const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/tmp/CF_Instagram_Templates';
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Inter:wght@400;500;600;700&display=swap');`;

const LOGO_NAVY = `<svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#1C2433"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2" opacity=".45"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central" font-family="Arial Black,sans-serif" font-weight="900" font-size="14" fill="#fff" letter-spacing="3">CF</text>
</svg>`;

const LOGO_LIGHT = `<svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#FAF7F2"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2" opacity=".45"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central" font-family="Arial Black,sans-serif" font-weight="900" font-size="14" fill="#1C2433" letter-spacing="3">CF</text>
</svg>`;

const LOGO_ORANGE_OUTLINE = `<svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#F05A28"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#fff" stroke-width="2" opacity=".6"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central" font-family="Arial Black,sans-serif" font-weight="900" font-size="14" fill="#fff" letter-spacing="3">CF</text>
</svg>`;

// ── TEMPLATE 1 — Quote (donker navy, oranje accent) ──────────────────────────
const T1 = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1080px; overflow: hidden; background: #1C2433; font-family: 'Archivo', Arial Black, sans-serif; }
.wrap { width: 1080px; height: 1080px; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 72px; }
.top { display: flex; justify-content: space-between; align-items: flex-start; }
.wordmark { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 18px; letter-spacing: .04em; color: #fff; }
.wordmark span { color: #F05A28; }
.eyebrow { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .18em; text-transform: uppercase; color: #F05A28; margin-bottom: 32px; }
.middle { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.quote-mark { font-size: 120px; color: #F05A28; line-height: 0.6; margin-bottom: 24px; font-family: Georgia, serif; opacity: .9; }
.quote-text { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 52px; line-height: 1.15; color: #FAF7F2; max-width: 900px; }
.quote-text em { color: #F05A28; font-style: normal; }
.cite { font-family: 'Inter', Arial, sans-serif; font-weight: 500; font-size: 20px; color: rgba(250,247,242,.5); margin-top: 36px; }
.bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.tagline { font-family: 'Inter', Arial, sans-serif; font-size: 16px; color: rgba(250,247,242,.35); letter-spacing: .04em; }
.accent-line { position: absolute; left: 72px; top: 0; width: 6px; height: 100%; background: #F05A28; border-radius: 0 3px 3px 0; opacity: .15; }
.hl { background: rgba(240,90,40,.18); border-left: 5px solid #F05A28; padding: 0 16px; display: inline; }
</style></head>
<body><div class="wrap">
  <div class="accent-line"></div>
  <div class="top">
    <div class="wordmark">CHARACTER<span>First</span></div>
    ${LOGO_NAVY}
  </div>
  <div class="middle">
    <div class="eyebrow">Citaat van de week</div>
    <div class="quote-mark">"</div>
    <div class="quote-text">
      Druk is een <em>privilege</em> — het komt alleen bij diegenen die het verdiend hebben.
    </div>
    <div class="cite">— Billie Jean King · 39× Grand Slam Champion</div>
  </div>
  <div class="bottom">
    <div class="tagline">Win the person. Win the team. · characterfirst.be</div>
    <div style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:rgba(250,247,242,.3)">#characterfirst #basketbal #mentalweerbaarheid</div>
  </div>
</div></body></html>`;

// ── TEMPLATE 2 — Tip/Oefening (canvas achtergrond, oranje accenten) ──────────
const T2 = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1080px; overflow: hidden; background: #FAF7F2; font-family: 'Inter', Arial, sans-serif; }
.wrap { width: 1080px; height: 1080px; position: relative; display: flex; flex-direction: column; padding: 72px; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; }
.wordmark { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 18px; letter-spacing: .04em; color: #1C2433; }
.wordmark span { color: #F05A28; }
.badge { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 12px; letter-spacing: .15em; text-transform: uppercase; background: rgba(240,90,40,.12); color: #F05A28; border: 1.5px solid rgba(240,90,40,.3); padding: 6px 16px; border-radius: 6px; }
.number-big { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 200px; color: rgba(240,90,40,.08); position: absolute; right: 48px; top: 100px; line-height: 1; }
.content { flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; }
.eyebrow { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .18em; text-transform: uppercase; color: #F05A28; margin-bottom: 20px; }
.title { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 68px; line-height: 1.05; color: #1C2433; margin-bottom: 32px; }
.title span { color: #F05A28; }
.body { font-family: 'Inter', Arial, sans-serif; font-weight: 400; font-size: 26px; line-height: 1.6; color: #6E6A63; max-width: 820px; }
.steps { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
.step { display: flex; align-items: center; gap: 24px; }
.step-num { width: 48px; height: 48px; border-radius: 50%; background: #F05A28; color: #fff; font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-text { font-family: 'Inter', Arial, sans-serif; font-size: 24px; color: #1C2433; font-weight: 500; }
.bottom { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 40px; border-top: 1.5px solid #E4DFD6; }
.tagline { font-family: 'Inter', Arial, sans-serif; font-size: 16px; color: #6E6A63; }
</style></head>
<body><div class="wrap">
  <div class="number-big">1</div>
  <div class="top">
    <div class="wordmark">CHARACTER<span>First</span></div>
    <div class="badge">Mentale oefening</div>
  </div>
  <div class="content">
    <div class="eyebrow">Maand 2 · Druk & Stress</div>
    <div class="title">Box<br><span>Breathing</span></div>
    <div class="body">Gebruik deze techniek vóór elke wedstrijd om je activatieniveau te reguleren.</div>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div class="step-text">Adem 4 seconden IN door de neus</div></div>
      <div class="step"><div class="step-num">2</div><div class="step-text">HOUD 4 seconden vast</div></div>
      <div class="step"><div class="step-num">3</div><div class="step-text">Adem 4 seconden UIT door de mond</div></div>
      <div class="step"><div class="step-num">4</div><div class="step-text">HOUD 4 seconden vast · Herhaal 3×</div></div>
    </div>
  </div>
  <div class="bottom">
    <div class="tagline">info@characterfirst.be · characterfirst.be</div>
    ${LOGO_LIGHT}
  </div>
</div></body></html>`;

// ── TEMPLATE 3 — Statistiek/Wetenschappelijk feit (split layout) ─────────────
const T3 = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1080px; overflow: hidden; background: #1C2433; font-family: 'Archivo', Arial Black, sans-serif; }
.wrap { width: 1080px; height: 1080px; display: flex; }
.left { width: 420px; background: #F05A28; display: flex; flex-direction: column; justify-content: space-between; padding: 72px 56px; }
.stat-big { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 140px; line-height: 0.9; color: #fff; }
.stat-unit { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 40px; color: rgba(255,255,255,.75); margin-top: 8px; }
.stat-label { font-family: 'Inter', Arial, sans-serif; font-size: 20px; font-weight: 600; color: rgba(255,255,255,.85); line-height: 1.4; margin-top: 24px; }
.right { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 72px 64px; }
.top-right { display: flex; justify-content: space-between; align-items: flex-start; }
.wordmark { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 18px; letter-spacing: .04em; color: #FAF7F2; }
.wordmark span { color: #F05A28; }
.mid-right { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.eyebrow { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: #F05A28; margin-bottom: 24px; }
.fact-title { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 48px; line-height: 1.1; color: #FAF7F2; margin-bottom: 28px; }
.fact-body { font-family: 'Inter', Arial, sans-serif; font-weight: 400; font-size: 22px; line-height: 1.65; color: rgba(250,247,242,.65); }
.fact-body strong { color: #FAF7F2; font-weight: 600; }
.source { font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: rgba(250,247,242,.3); margin-top: 28px; font-style: italic; }
.bottom-right { display: flex; justify-content: space-between; align-items: center; }
.tagline { font-family: 'Inter', Arial, sans-serif; font-size: 15px; color: rgba(250,247,242,.3); }
.divider { width: 4px; height: 100%; background: rgba(240,90,40,.25); position: absolute; }
</style></head>
<body><div class="wrap">
  <div class="left">
    <div>
      ${LOGO_ORANGE_OUTLINE}
    </div>
    <div>
      <div class="stat-big">73</div>
      <div class="stat-unit">%</div>
      <div class="stat-label">van topsporters zegt dat mentale training net zo belangrijk is als fysieke training</div>
    </div>
    <div style="font-family:'Archivo',Arial Black,sans-serif;font-weight:800;font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.5)">Onderzoek & Wetenschap</div>
  </div>
  <div class="right">
    <div class="top-right">
      <div class="wordmark">CHARACTER<span>First</span></div>
    </div>
    <div class="mid-right">
      <div class="eyebrow">Wetenschappelijk bewezen</div>
      <div class="fact-title">Karakter is trainbaar — net als techniek</div>
      <div class="fact-body">
        Onderzoek toont aan dat <strong>mentale weerbaarheid, zelfregulatie en teamgedrag</strong> ontwikkelbare vaardigheden zijn. Ze vereisen intentionele training — niet talent.
        <br><br>
        Character First biedt coaches een <strong>evidence-based raamwerk</strong> om dit systematisch aan te leren.
      </div>
      <div class="source">Bron: Duckworth et al., 2007 · Dweck, 2006 · Luthans et al., 2010</div>
    </div>
    <div class="bottom-right">
      <div class="tagline">Win the person. Win the team.</div>
      <div style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:rgba(250,247,242,.25)">#sportpsychologie #jeugdbasketbal</div>
    </div>
  </div>
</div></body></html>`;

// ── TEMPLATE 4 — Sessie-aankondiging (canvas + oranje blok) ──────────────────
const T4 = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1080px; overflow: hidden; background: #FAF7F2; font-family: 'Archivo', Arial Black, sans-serif; }
.wrap { width: 1080px; height: 1080px; display: flex; flex-direction: column; }
.hero { background: #F05A28; height: 480px; display: flex; flex-direction: column; justify-content: space-between; padding: 56px 72px; position: relative; overflow: hidden; }
.bg-circle { position: absolute; right: -80px; bottom: -80px; width: 380px; height: 380px; border-radius: 50%; border: 60px solid rgba(255,255,255,.08); }
.bg-circle2 { position: absolute; right: 60px; bottom: 60px; width: 200px; height: 200px; border-radius: 50%; border: 40px solid rgba(255,255,255,.06); }
.hero-top { display: flex; justify-content: space-between; align-items: center; position: relative; z-index:2; }
.wordmark-w { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 20px; letter-spacing: .04em; color: #fff; }
.hero-badge { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .15em; text-transform: uppercase; background: rgba(255,255,255,.18); color: #fff; padding: 8px 18px; border-radius: 6px; }
.hero-content { position: relative; z-index:2; }
.hero-eyebrow { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.75); margin-bottom: 16px; }
.hero-title { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 76px; line-height: 1; color: #fff; }
.body-section { flex: 1; padding: 56px 72px; display: flex; flex-direction: column; justify-content: space-between; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
.info-item { }
.info-label { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #F05A28; margin-bottom: 8px; }
.info-value { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 28px; color: #1C2433; line-height: 1.2; }
.info-sub { font-family: 'Inter', Arial, sans-serif; font-size: 16px; color: #6E6A63; margin-top: 4px; }
.description { font-family: 'Inter', Arial, sans-serif; font-size: 22px; line-height: 1.6; color: #6E6A63; max-width: 840px; }
.description strong { color: #1C2433; }
.bottom-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #E4DFD6; padding-top: 20px; }
.tagline { font-family: 'Inter', Arial, sans-serif; font-size: 16px; color: #6E6A63; }
.cta { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 16px; letter-spacing: .1em; text-transform: uppercase; background: #F05A28; color: #fff; padding: 14px 28px; border-radius: 8px; }
</style></head>
<body><div class="wrap">
  <div class="hero">
    <div class="bg-circle"></div>
    <div class="bg-circle2"></div>
    <div class="hero-top">
      <div class="wordmark-w">CHARACTER<span style="opacity:.8">First</span></div>
      <div class="hero-badge">Nieuwe sessie</div>
    </div>
    <div class="hero-content">
      <div class="hero-eyebrow">Maand 3 · Mijn Rol in het Team</div>
      <div class="hero-title">Rolcompass<br>& Rolcirkel</div>
    </div>
  </div>
  <div class="body-section">
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Datum</div>
        <div class="info-value">15 feb</div>
        <div class="info-sub">Aanpassen naar jouw datum</div>
      </div>
      <div class="info-item">
        <div class="info-label">Doelgroep</div>
        <div class="info-value">U16 – U18</div>
        <div class="info-sub">& coaches</div>
      </div>
      <div class="info-item">
        <div class="info-label">Duur</div>
        <div class="info-value">90 min</div>
        <div class="info-sub">interactief</div>
      </div>
    </div>
    <div class="description">
      Ontdek welke <strong>rollen jij vervult</strong> in het team — als leider, motor, denker of stabiele kracht. En leer hoe rolhelderheid de teamcohesie versterkt.
    </div>
    <div class="bottom-bar">
      <div class="tagline">info@characterfirst.be · characterfirst.be</div>
      ${LOGO_LIGHT}
    </div>
  </div>
</div></body></html>`;

// ── TEMPLATE 5 — Kernwaarde (groot bold statement, minimalistisch) ────────────
const T5 = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1080px; overflow: hidden; background: #1C2433; font-family: 'Archivo', Arial Black, sans-serif; }
.wrap { width: 1080px; height: 1080px; display: flex; flex-direction: column; justify-content: space-between; padding: 72px; position: relative; }
.bg-text { position: absolute; font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 380px; color: rgba(240,90,40,.04); line-height: 1; top: 50%; left: 50%; transform: translate(-50%,-50%); white-space: nowrap; pointer-events: none; letter-spacing: -.02em; }
.top { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
.wordmark { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 18px; letter-spacing: .04em; color: #FAF7F2; }
.wordmark span { color: #F05A28; }
.mid { flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; }
.eyebrow { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .22em; text-transform: uppercase; color: #F05A28; margin-bottom: 28px; display: flex; align-items: center; gap: 14px; }
.eyebrow::before { content: ''; width: 40px; height: 3px; background: #F05A28; border-radius: 2px; }
.value-word { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 900; font-size: 120px; line-height: 0.95; color: #FAF7F2; letter-spacing: -.02em; }
.value-word .accent { color: #F05A28; }
.value-def { font-family: 'Inter', Arial, sans-serif; font-weight: 400; font-size: 26px; line-height: 1.6; color: rgba(250,247,242,.55); max-width: 760px; margin-top: 36px; border-left: 4px solid #F05A28; padding-left: 24px; }
.value-def strong { color: rgba(250,247,242,.85); font-weight: 600; }
.pillars { display: flex; gap: 16px; margin-top: 44px; }
.pill { font-family: 'Archivo', Arial Black, sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .1em; text-transform: uppercase; padding: 10px 22px; border-radius: 100px; }
.pill-active { background: #F05A28; color: #fff; }
.pill-ghost { background: rgba(250,247,242,.06); color: rgba(250,247,242,.4); border: 1.5px solid rgba(250,247,242,.1); }
.bottom { display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 2; }
.tagline { font-family: 'Inter', Arial, sans-serif; font-size: 16px; color: rgba(250,247,242,.3); }
</style></head>
<body><div class="wrap">
  <div class="bg-text">GROEI</div>
  <div class="top">
    <div class="wordmark">CHARACTER<span>First</span></div>
    ${LOGO_NAVY}
  </div>
  <div class="mid">
    <div class="eyebrow">Kernwaarde</div>
    <div class="value-word">Groei<span class="accent">gericht</span></div>
    <div class="value-def">
      <strong>Vooruitgang boven perfectie.</strong> De mens van morgen telt — niet de fout van gisteren. Elke training is een kans om 1% beter te worden als speler én als persoon.
    </div>
    <div class="pillars">
      <div class="pill pill-ghost">🔥 Moedig</div>
      <div class="pill pill-active">🌱 Groeigericht</div>
      <div class="pill pill-ghost">🎯 Onderbouwd</div>
      <div class="pill pill-ghost">🤝 Samen</div>
    </div>
  </div>
  <div class="bottom">
    <div class="tagline">Win the person. Win the team. · characterfirst.be</div>
    <div style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:rgba(250,247,242,.25)">#characterfirst #groeimindset</div>
  </div>
</div></body></html>`;

const templates = [
  { name: 'T1_Quote_Navy',         html: T1 },
  { name: 'T2_Tip_Canvas',         html: T2 },
  { name: 'T3_Statistiek_Split',   html: T3 },
  { name: 'T4_Aankondiging_Event', html: T4 },
  { name: 'T5_Kernwaarde_Bold',    html: T5 },
];

// Also save HTML files
for (const t of templates) {
  fs.writeFileSync(path.join(OUT, `${t.name}.html`), t.html);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  for (const t of templates) {
    await page.setContent(t.html, { waitUntil: 'networkidle' });
    // Wait for fonts
    await page.waitForTimeout(1200);
    const out = path.join(OUT, `${t.name}.png`);
    await page.screenshot({ path: out, fullPage: false, clip: { x:0, y:0, width:1080, height:1080 } });
    const kb = Math.round(require('fs').statSync(out).size / 1024);
    console.log(`${t.name} → ${kb}KB`);
  }

  await browser.close();
  console.log('Done!');
})();
