const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/tmp/CF_Instagram_Templates';
fs.mkdirSync(OUT, { recursive: true });

// Use system fonts that are available — no external dependency
const BASE_CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { -webkit-font-smoothing: antialiased; }
`;

// CF Logo — large variant (navy bg)
function logoNavy(size = 100) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#1C2433"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2.5" opacity=".5"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
    font-family="Arial Black,Arial,sans-serif" font-weight="900"
    font-size="13" fill="#fff" letter-spacing="3">CF</text>
</svg>`;
}

// CF Logo — on light bg
function logoLight(size = 100) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#FAF7F2"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2.5" opacity=".5"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
    font-family="Arial Black,Arial,sans-serif" font-weight="900"
    font-size="13" fill="#1C2433" letter-spacing="3">CF</text>
</svg>`;
}

// CF Logo — on orange bg (outline)
function logoOrange(size = 100) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#F05A28"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#fff" stroke-width="2.5" opacity=".65"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
    font-family="Arial Black,Arial,sans-serif" font-weight="900"
    font-size="13" fill="#fff" letter-spacing="3">CF</text>
</svg>`;
}

// ── T1 — Quote (navy dark, large quote) ──────────────────────────────────────
const T1 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${BASE_CSS}
body { width:1080px; height:1080px; overflow:hidden; background:#1C2433; font-family:"Arial Black",Arial,sans-serif; }
.page { width:1080px; height:1080px; display:flex; flex-direction:column; justify-content:space-between; padding:70px 80px; position:relative; }
/* vertical orange bar */
.vbar { position:absolute; left:0; top:0; width:10px; height:100%; background:#F05A28; border-radius:0 4px 4px 0; }
/* subtle grid overlay */
.grid { position:absolute; inset:0; background-image: repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 80px), repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 1px,transparent 1px 80px); pointer-events:none; }
/* top row */
.top { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
.wordmark { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:26px; letter-spacing:.03em; color:#FAF7F2; }
.wordmark em { color:#F05A28; font-style:normal; }
/* middle */
.mid { flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:2; gap:0; }
.eyebrow { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:16px; letter-spacing:.22em; text-transform:uppercase; color:#F05A28; margin-bottom:30px; }
.qmark { font-family:Georgia,serif; font-size:180px; color:#F05A28; line-height:.55; margin-bottom:20px; opacity:.9; }
.qtext { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:58px; line-height:1.12; color:#FAF7F2; max-width:920px; }
.qtext em { color:#F05A28; font-style:normal; }
.cite { font-family:Arial,sans-serif; font-weight:400; font-size:24px; color:rgba(250,247,242,.5); margin-top:40px; letter-spacing:.01em; }
/* bottom row */
.bot { display:flex; justify-content:space-between; align-items:flex-end; position:relative; z-index:2; }
.tagline { font-family:Arial,sans-serif; font-size:18px; color:rgba(250,247,242,.35); }
.hashtags { font-family:Arial,sans-serif; font-size:16px; color:rgba(250,247,242,.25); }
</style></head><body>
<div class="page">
  <div class="vbar"></div>
  <div class="grid"></div>
  <div class="top">
    <div class="wordmark">CHARACTER<em>First</em></div>
    ${logoNavy(110)}
  </div>
  <div class="mid">
    <div class="eyebrow">Citaat van de week</div>
    <div class="qmark">"</div>
    <div class="qtext">Druk is een <em>privilege</em> — het komt alleen bij diegenen die het verdiend hebben.</div>
    <div class="cite">— Billie Jean King &nbsp;·&nbsp; 39× Grand Slam Champion</div>
  </div>
  <div class="bot">
    <div class="tagline">Win the person. Win the team. &nbsp;·&nbsp; characterfirst.be</div>
    <div class="hashtags">#characterfirst &nbsp;#basketbal &nbsp;#mentalweerbaarheid</div>
  </div>
</div>
</body></html>`;

// ── T2 — Tip / Oefening (canvas, stappen) ────────────────────────────────────
const T2 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${BASE_CSS}
body { width:1080px; height:1080px; overflow:hidden; background:#FAF7F2; font-family:"Arial Black",Arial,sans-serif; }
.page { width:1080px; height:1080px; display:flex; flex-direction:column; padding:68px 80px; }
.top { display:flex; justify-content:space-between; align-items:center; margin-bottom:48px; }
.wordmark { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:26px; letter-spacing:.03em; color:#1C2433; }
.wordmark em { color:#F05A28; font-style:normal; }
.badge { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:14px; letter-spacing:.16em; text-transform:uppercase; background:rgba(240,90,40,.12); color:#F05A28; border:2px solid rgba(240,90,40,.3); padding:10px 22px; border-radius:8px; }
/* big watermark number */
.wm { position:absolute; right:40px; top:80px; font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:340px; color:rgba(240,90,40,.06); line-height:1; pointer-events:none; z-index:0; }
.content { flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:1; }
.eyebrow { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:15px; letter-spacing:.2em; text-transform:uppercase; color:#F05A28; margin-bottom:16px; }
.title { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:86px; line-height:.95; color:#1C2433; margin-bottom:12px; }
.title em { color:#F05A28; font-style:normal; }
.subtitle { font-family:Arial,sans-serif; font-size:24px; color:#6E6A63; margin-bottom:48px; line-height:1.5; max-width:700px; }
.steps { display:flex; flex-direction:column; gap:22px; }
.step { display:flex; align-items:center; gap:28px; }
.snum { width:56px; height:56px; border-radius:50%; background:#F05A28; color:#fff; font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:26px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 16px rgba(240,90,40,.35); }
.stext { font-family:Arial,sans-serif; font-size:26px; color:#1C2433; font-weight:700; line-height:1.3; }
.bot { display:flex; justify-content:space-between; align-items:center; border-top:2px solid #E4DFD6; padding-top:28px; margin-top:40px; }
.tagline { font-family:Arial,sans-serif; font-size:18px; color:#6E6A63; }
</style></head><body>
<div class="page" style="position:relative">
  <div class="wm">1</div>
  <div class="top">
    <div class="wordmark">CHARACTER<em>First</em></div>
    <div class="badge">Mentale oefening</div>
  </div>
  <div class="content">
    <div class="eyebrow">Maand 2 · Druk &amp; Stress</div>
    <div class="title">Box<br><em>Breathing</em></div>
    <div class="subtitle">Gebruik dit vóór elke wedstrijd om je activatieniveau te reguleren.</div>
    <div class="steps">
      <div class="step"><div class="snum">1</div><div class="stext">Adem 4 sec <strong>IN</strong> door de neus</div></div>
      <div class="step"><div class="snum">2</div><div class="stext"><strong>HOUD</strong> 4 sec vast</div></div>
      <div class="step"><div class="snum">3</div><div class="stext">Adem 4 sec <strong>UIT</strong> door de mond</div></div>
      <div class="step"><div class="snum">4</div><div class="stext"><strong>HOUD</strong> 4 sec vast · Herhaal 3×</div></div>
    </div>
  </div>
  <div class="bot">
    <div class="tagline">info@characterfirst.be · characterfirst.be</div>
    ${logoLight(80)}
  </div>
</div>
</body></html>`;

// ── T3 — Statistiek / Split layout ───────────────────────────────────────────
const T3 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${BASE_CSS}
body { width:1080px; height:1080px; overflow:hidden; background:#1C2433; }
.page { width:1080px; height:1080px; display:flex; }
/* left orange column */
.left { width:400px; background:#F05A28; display:flex; flex-direction:column; justify-content:space-between; padding:68px 56px; flex-shrink:0; }
.stat { display:flex; flex-direction:column; }
.stat-num { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:164px; line-height:.88; color:#fff; letter-spacing:-.02em; }
.stat-pct { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:64px; color:rgba(255,255,255,.75); line-height:1; margin-top:-10px; }
.stat-desc { font-family:Arial,sans-serif; font-size:22px; font-weight:700; color:rgba(255,255,255,.9); line-height:1.45; margin-top:24px; }
.left-label { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.5); }
/* right dark column */
.right { flex:1; display:flex; flex-direction:column; justify-content:space-between; padding:68px 64px; }
.rtop { display:flex; justify-content:space-between; align-items:center; }
.wordmark { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:24px; letter-spacing:.03em; color:#FAF7F2; }
.wordmark em { color:#F05A28; font-style:normal; }
.rmid { flex:1; display:flex; flex-direction:column; justify-content:center; }
.eyebrow { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:14px; letter-spacing:.2em; text-transform:uppercase; color:#F05A28; margin-bottom:24px; }
.rtitle { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:54px; line-height:1.05; color:#FAF7F2; margin-bottom:30px; }
.rbody { font-family:Arial,sans-serif; font-weight:400; font-size:24px; line-height:1.65; color:rgba(250,247,242,.6); }
.rbody strong { color:#FAF7F2; font-weight:700; }
.source { font-family:Arial,sans-serif; font-size:16px; color:rgba(250,247,242,.3); margin-top:32px; font-style:italic; }
.rbot { display:flex; justify-content:space-between; align-items:center; }
.tagline { font-family:Arial,sans-serif; font-size:17px; color:rgba(250,247,242,.3); }
.hashtags { font-family:Arial,sans-serif; font-size:15px; color:rgba(250,247,242,.22); }
</style></head><body>
<div class="page">
  <div class="left">
    <div>${logoOrange(100)}</div>
    <div class="stat">
      <div class="stat-num">73</div>
      <div class="stat-pct">%</div>
      <div class="stat-desc">van topsporters zegt dat mentale training even belangrijk is als fysieke voorbereiding</div>
    </div>
    <div class="left-label">Wetenschap &amp; Onderzoek</div>
  </div>
  <div class="right">
    <div class="rtop">
      <div class="wordmark">CHARACTER<em>First</em></div>
    </div>
    <div class="rmid">
      <div class="eyebrow">Wetenschappelijk bewezen</div>
      <div class="rtitle">Karakter is trainbaar —<br>net als techniek</div>
      <div class="rbody">
        Onderzoek toont aan dat <strong>mentale weerbaarheid, zelfregulatie en teamgedrag</strong> ontwikkelbare vaardigheden zijn. Ze vereisen intentionele training — niet talent.<br><br>
        Character First geeft coaches een <strong>evidence-based raamwerk</strong> om dit systematisch te trainen naast techniek.
      </div>
      <div class="source">Bron: Duckworth et al., 2007 · Dweck, 2006 · Luthans et al., 2010</div>
    </div>
    <div class="rbot">
      <div class="tagline">Win the person. Win the team.</div>
      <div class="hashtags">#sportpsychologie #characterfirst</div>
    </div>
  </div>
</div>
</body></html>`;

// ── T4 — Aankondiging / Sessie ────────────────────────────────────────────────
const T4 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${BASE_CSS}
body { width:1080px; height:1080px; overflow:hidden; background:#FAF7F2; }
.page { width:1080px; height:1080px; display:flex; flex-direction:column; }
/* orange hero top half */
.hero { height:500px; background:#F05A28; display:flex; flex-direction:column; justify-content:space-between; padding:60px 80px; position:relative; overflow:hidden; flex-shrink:0; }
.circle1 { position:absolute; right:-100px; bottom:-100px; width:440px; height:440px; border-radius:50%; border:70px solid rgba(255,255,255,.08); pointer-events:none; }
.circle2 { position:absolute; right:80px; bottom:60px; width:220px; height:220px; border-radius:50%; border:45px solid rgba(255,255,255,.06); pointer-events:none; }
.htop { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
.wordmark-w { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:26px; letter-spacing:.03em; color:#fff; }
.hero-badge { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:14px; letter-spacing:.16em; text-transform:uppercase; background:rgba(255,255,255,.2); color:#fff; padding:10px 22px; border-radius:8px; border:1.5px solid rgba(255,255,255,.3); }
.hcontent { position:relative; z-index:2; }
.heyebrow { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:15px; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.75); margin-bottom:14px; }
.htitle { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:82px; line-height:.95; color:#fff; }
/* body section */
.body-sec { flex:1; padding:52px 80px; display:flex; flex-direction:column; justify-content:space-between; }
.info-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:32px; }
.ilabel { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:#F05A28; margin-bottom:8px; }
.ival { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:36px; color:#1C2433; line-height:1.1; }
.isub { font-family:Arial,sans-serif; font-size:18px; color:#6E6A63; margin-top:4px; }
.desc { font-family:Arial,sans-serif; font-size:24px; line-height:1.6; color:#6E6A63; max-width:860px; }
.desc strong { color:#1C2433; font-weight:700; }
.bot { display:flex; justify-content:space-between; align-items:center; border-top:2px solid #E4DFD6; padding-top:24px; }
.tagline { font-family:Arial,sans-serif; font-size:18px; color:#6E6A63; }
</style></head><body>
<div class="page">
  <div class="hero">
    <div class="circle1"></div>
    <div class="circle2"></div>
    <div class="htop">
      <div class="wordmark-w">CHARACTERFirst</div>
      <div class="hero-badge">Nieuwe sessie</div>
    </div>
    <div class="hcontent">
      <div class="heyebrow">Maand 3 · Mijn Rol in het Team</div>
      <div class="htitle">Rolcompass<br>&amp; Rolcirkel</div>
    </div>
  </div>
  <div class="body-sec">
    <div class="info-grid">
      <div><div class="ilabel">Datum</div><div class="ival">15 feb</div><div class="isub">Pas aan naar jouw datum</div></div>
      <div><div class="ilabel">Doelgroep</div><div class="ival">U16 – U18</div><div class="isub">&amp; coaches</div></div>
      <div><div class="ilabel">Duur</div><div class="ival">90 min</div><div class="isub">interactief</div></div>
    </div>
    <div class="desc">Ontdek welke <strong>rollen jij vervult</strong> in het team — als leider, motor, denker of stabiele kracht. En leer hoe rolhelderheid de teamcohesie en motivatie versterkt.</div>
    <div class="bot">
      <div class="tagline">info@characterfirst.be · characterfirst.be</div>
      ${logoLight(80)}
    </div>
  </div>
</div>
</body></html>`;

// ── T5 — Kernwaarde (navy, groot bold woord) ──────────────────────────────────
const T5 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${BASE_CSS}
body { width:1080px; height:1080px; overflow:hidden; background:#1C2433; }
.page { width:1080px; height:1080px; display:flex; flex-direction:column; justify-content:space-between; padding:70px 80px; position:relative; }
/* big background word */
.bgword { position:absolute; font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:260px; color:rgba(240,90,40,.055); line-height:1; top:50%; left:50%; transform:translate(-50%,-50%); white-space:nowrap; pointer-events:none; letter-spacing:-.02em; }
.top { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
.wordmark { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:26px; letter-spacing:.03em; color:#FAF7F2; }
.wordmark em { color:#F05A28; font-style:normal; }
.mid { flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:2; }
.eyebrow { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:15px; letter-spacing:.22em; text-transform:uppercase; color:#F05A28; margin-bottom:28px; display:flex; align-items:center; gap:16px; }
.eyebrow::before { content:''; width:48px; height:4px; background:#F05A28; border-radius:2px; flex-shrink:0; }
.kword { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:118px; line-height:.9; color:#FAF7F2; letter-spacing:-.02em; }
.kword em { color:#F05A28; font-style:normal; }
.kdef { font-family:Arial,sans-serif; font-weight:400; font-size:28px; line-height:1.6; color:rgba(250,247,242,.55); max-width:800px; margin-top:36px; border-left:5px solid #F05A28; padding-left:28px; }
.kdef strong { color:rgba(250,247,242,.88); font-weight:700; }
.pillars { display:flex; gap:16px; margin-top:44px; flex-wrap:wrap; }
.pill { font-family:"Arial Black",Arial,sans-serif; font-weight:900; font-size:14px; letter-spacing:.1em; text-transform:uppercase; padding:12px 24px; border-radius:100px; }
.pill-on  { background:#F05A28; color:#fff; }
.pill-off { background:rgba(250,247,242,.07); color:rgba(250,247,242,.38); border:1.5px solid rgba(250,247,242,.1); }
.bot { display:flex; justify-content:space-between; align-items:flex-end; position:relative; z-index:2; }
.tagline { font-family:Arial,sans-serif; font-size:18px; color:rgba(250,247,242,.3); }
.hashtags { font-family:Arial,sans-serif; font-size:16px; color:rgba(250,247,242,.2); }
</style></head><body>
<div class="page">
  <div class="bgword">GROEI</div>
  <div class="top">
    <div class="wordmark">CHARACTER<em>First</em></div>
    ${logoNavy(110)}
  </div>
  <div class="mid">
    <div class="eyebrow">Kernwaarde</div>
    <div class="kword">Groei<em>gericht</em></div>
    <div class="kdef"><strong>Vooruitgang boven perfectie.</strong> De mens van morgen telt — niet de fout van gisteren. Elke training is een kans om 1% beter te worden als speler én als persoon.</div>
    <div class="pillars">
      <div class="pill pill-off">🔥 Moedig</div>
      <div class="pill pill-on">🌱 Groeigericht</div>
      <div class="pill pill-off">🎯 Onderbouwd</div>
      <div class="pill pill-off">🤝 Samen</div>
    </div>
  </div>
  <div class="bot">
    <div class="tagline">Win the person. Win the team. · characterfirst.be</div>
    <div class="hashtags">#characterfirst #groeimindset #basketbal</div>
  </div>
</div>
</body></html>`;

const templates = [
  { name: 'T1_Quote_Navy',         html: T1 },
  { name: 'T2_Tip_Oefening',       html: T2 },
  { name: 'T3_Statistiek_Split',   html: T3 },
  { name: 'T4_Aankondiging_Sessie',html: T4 },
  { name: 'T5_Kernwaarde_Bold',    html: T5 },
];

// Save HTML source files
for (const t of templates) {
  fs.writeFileSync(path.join(OUT, `${t.name}.html`), t.html);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  for (const t of templates) {
    await page.setContent(t.html, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const out = path.join(OUT, `${t.name}.png`);
    await page.screenshot({ path: out, clip: { x:0, y:0, width:1080, height:1080 } });
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`✓ ${t.name} — ${kb}KB`);
  }

  await browser.close();
  console.log('Klaar!');
})();
