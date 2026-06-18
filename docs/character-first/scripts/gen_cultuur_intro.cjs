'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/home/user/ruflo/docs/character-first/company-docs';
fs.mkdirSync(OUT, { recursive: true });

function logoDark(size = 56) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#1C2433"/>
    <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
    <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
    <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2" opacity=".45"/>
    <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
          font-family="Arial Black,Arial,sans-serif" font-weight="900"
          font-size="14" fill="#fff" letter-spacing="3">CF</text>
  </svg>`;
}

const CSS = `
  :root {
    --orange:#F05A28; --navy:#1C2433; --green:#1E8A5B;
    --blue:#2F6FB0; --canvas:#FAF7F2; --mist:#F0ECE4;
    --stone:#6E6A63; --line:#E4DFD6;
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#aaa; font-family:Arial,sans-serif; }

  .page {
    width:210mm; height:297mm; overflow:hidden;
    background:var(--canvas);
    display:flex; flex-direction:column;
    page-break-after:always; break-after:page;
  }

  /* ── HEADER STRIP ── */
  .hdr {
    flex-shrink:0; background:var(--navy);
    padding:10mm 14mm 9mm;
    display:flex; flex-direction:column; gap:0;
    position:relative; overflow:hidden;
  }
  .hdr::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0;
    height:22px; background:var(--canvas);
    clip-path:ellipse(55% 100% at 50% 100%);
  }
  .hdr-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .hdr-badge {
    font-family:"Arial Black",Arial,sans-serif; font-size:8.5px; font-weight:900;
    text-transform:uppercase; letter-spacing:.14em;
    background:rgba(240,90,40,.25); color:#fff;
    border:1px solid rgba(240,90,40,.5); border-radius:6px; padding:3px 10px;
  }
  .hdr-pg { font-size:9px; color:rgba(255,255,255,.45); }
  .hdr-eyebrow {
    font-family:"Arial Black",Arial,sans-serif; font-size:10px; font-weight:900;
    text-transform:uppercase; letter-spacing:.18em; color:var(--orange);
    margin-bottom:5px;
  }
  .hdr-title {
    font-family:"Arial Black",Arial,sans-serif; font-size:28px; font-weight:900;
    color:#fff; line-height:1.1;
  }
  .hdr-title span { color:var(--orange); }
  .hdr-sub {
    font-size:12px; color:rgba(255,255,255,.7); line-height:1.55;
    margin-top:8px; max-width:155mm;
  }

  /* ── PAGE INNER ── */
  .inner { flex:1; display:flex; flex-direction:column; padding:9mm 14mm 0; gap:0; overflow:hidden; }

  /* ── SECTION LABEL ── */
  .sec-label {
    font-family:"Arial Black",Arial,sans-serif; font-size:9px; font-weight:900;
    text-transform:uppercase; letter-spacing:.16em; color:var(--orange);
    margin-bottom:5px; margin-top:6mm; flex-shrink:0;
  }
  .sec-label:first-child { margin-top:0; }

  /* ── WHY BLOCK (navy) ── */
  .why-block {
    background:var(--navy); border-radius:12px; padding:14px 16px;
    flex-shrink:0;
  }
  .why-title {
    font-family:"Arial Black",Arial,sans-serif; font-size:14px; font-weight:900;
    color:#fff; margin-bottom:7px;
  }
  .why-title span { color:var(--orange); }
  .why-text { font-size:11px; color:rgba(255,255,255,.78); line-height:1.65; }

  /* ── STAT ROW ── */
  .stat-row { display:flex; gap:8px; flex-shrink:0; }
  .stat-card {
    flex:1; background:#fff; border:2px solid var(--line);
    border-radius:12px; padding:12px 10px; text-align:center;
  }
  .stat-num {
    font-family:"Arial Black",Arial,sans-serif; font-size:30px; font-weight:900;
    color:var(--orange); line-height:1;
  }
  .stat-lbl {
    font-family:"Arial Black",Arial,sans-serif; font-size:9px; font-weight:900;
    text-transform:uppercase; letter-spacing:.1em; color:var(--navy);
    margin-top:4px; line-height:1.3;
  }

  /* ── SESSION CARDS ── */
  .sessions-col { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
  .sess {
    display:flex; align-items:flex-start; gap:12px;
    background:#fff; border:1.5px solid var(--line); border-radius:10px;
    padding:10px 13px;
  }
  .sess-num {
    width:30px; height:30px; border-radius:50%; flex-shrink:0;
    background:var(--orange); color:#fff;
    font-family:"Arial Black",Arial,sans-serif; font-size:14px; font-weight:900;
    display:flex; align-items:center; justify-content:center;
  }
  .sess-body { flex:1; }
  .sess-title {
    font-family:"Arial Black",Arial,sans-serif; font-size:11.5px; font-weight:900;
    color:var(--navy); margin-bottom:2px;
  }
  .sess-desc { font-size:10px; color:var(--stone); line-height:1.5; }
  .sess-time {
    font-family:"Arial Black",Arial,sans-serif; font-size:8.5px; font-weight:900;
    text-transform:uppercase; letter-spacing:.08em;
    color:var(--green); flex-shrink:0; margin-top:2px;
  }

  /* ── P2 HEADER (small) ── */
  .ph2 {
    flex-shrink:0; padding:9mm 14mm 0;
    display:flex; align-items:center; justify-content:space-between;
  }
  .ph2-left { display:flex; align-items:center; gap:10px; }
  .ph2-wm {
    font-family:"Arial Black",Arial,sans-serif; font-size:14px; font-weight:900;
    color:var(--navy);
  }
  .ph2-wm span { color:var(--orange); }
  .ph2-bar { height:2.5px; background:var(--orange); border-radius:2px; margin:6px 14mm 0; flex-shrink:0; }

  /* ── HOW BOX ── */
  .how-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; flex-shrink:0; }
  .how-card {
    background:#fff; border:1.5px solid var(--line); border-radius:10px;
    padding:12px 13px;
  }
  .how-card.green { border-color:var(--green); background:rgba(30,138,91,.05); }
  .how-card.blue  { border-color:var(--blue);  background:rgba(47,111,176,.05); }
  .how-icon { font-size:22px; margin-bottom:6px; }
  .how-title {
    font-family:"Arial Black",Arial,sans-serif; font-size:11px; font-weight:900;
    color:var(--navy); margin-bottom:4px;
  }
  .how-text { font-size:10px; color:var(--stone); line-height:1.55; }

  /* ── TIME TABLE ── */
  .time-table { display:flex; flex-direction:column; gap:5px; flex-shrink:0; }
  .time-row {
    display:flex; align-items:center; gap:12px;
    background:#fff; border:1.5px solid var(--line); border-radius:8px;
    padding:8px 13px;
  }
  .time-chip {
    font-family:"Arial Black",Arial,sans-serif; font-size:10px; font-weight:900;
    background:var(--orange); color:#fff; border-radius:6px;
    padding:3px 10px; flex-shrink:0; min-width:60px; text-align:center;
  }
  .time-chip.green { background:var(--green); }
  .time-chip.blue  { background:var(--blue); }
  .time-desc { font-size:10.5px; color:var(--navy); line-height:1.4; }

  /* ── QUOTE ── */
  .quote-bar {
    background:var(--orange); border-radius:10px;
    padding:12px 16px; flex-shrink:0;
  }
  .qb-text {
    font-family:"Arial Black",Arial,sans-serif; font-size:14px; font-weight:900;
    color:#fff; font-style:italic; line-height:1.3;
  }
  .qb-auth { font-size:9.5px; color:rgba(255,255,255,.7); margin-top:5px; }

  /* ── FOOTER ── */
  .footer {
    flex-shrink:0; margin-top:auto;
    padding:5mm 14mm 6mm;
    display:flex; align-items:center; justify-content:space-between;
    border-top:1px solid var(--line);
  }
  .footer span { font-size:9px; color:var(--stone); }
  .footer .credit { color:var(--stone); }
`;

const NL = {
  badge: 'Handleiding voor coaches',
  eyebrow: 'Character First · Preseason',
  title: 'Cultuur bouwen\nbegint <span>vóór</span> de aftrap',
  sub: 'Dit document legt uit waarom teamcultuur het fundament is van een goed seizoen. En hoe je het Preseason Cultuurprogramma van Character First stap voor stap gebruikt.',

  whyTitle: 'Waarom cultuur <span>vóór techniek</span>?',
  whyText: 'Onderzoek toont steeds opnieuw: teams die een sterke cultuur bouwen vóór het seizoen start, presteren beter onder druk. Ze herstellen sneller na een verlies. Ze tonen meer eigenaarschap op en naast het veld. Cultuur is geen bijzaak. Het is de basis waarop techniek en tactiek kunnen groeien.',

  stats: [
    { num: '5', lbl: 'Sessies\npreseason' },
    { num: '60\'', lbl: 'Per sessie\ngemiddeld' },
    { num: '2', lbl: 'Versies\nNL & EN' },
    { num: '100%', lbl: 'Klaar voor\ngebruik' },
  ],

  secSessions: 'De 5 sessies: wat komt aan bod?',
  sessions: [
    { n:'1', t:'Onze identiteit', d:'Wie zijn wij als team? Waarden, trots en wat ons uniek maakt.', time:'45–60 min' },
    { n:'2', t:'Ons teamcontract', d:'Samen afspraken maken die iedereen respecteert en nakomt.', time:'50–60 min' },
    { n:'3', t:'Vertrouwen en veiligheid', d:'Een omgeving bouwen waar iedereen zichzelf durft te zijn.', time:'50–60 min' },
    { n:'4', t:'Conflict en herstel', d:'Hoe gaan we om met spanningen? Conflict als groeikans.', time:'45–60 min' },
    { n:'5', t:'Cultuur in actie', d:'Van woorden naar gedrag. Onze cultuur zichtbaar maken.', time:'45–60 min' },
  ],

  // P2
  secHow: 'Hoe gebruik je dit programma?',
  howCards: [
    { icon:'📋', title:'Werkblad speler', text:'Elke speler krijgt zijn eigen werkblad. Ze denken eerst individueel na, voor de groepsdiscussie. Dat geeft eerlijkere en diepere gesprekken.', cls:'' },
    { icon:'🎓', title:'Gids coach', text:'Jij krijgt een apart begeleidingsblad per sessie, met doelstelling, activiteiten, discussievragen en een afsluiting.', cls:'green' },
    { icon:'🗓️', title:'Wanneer starten?', text:'Plan de 5 sessies in de 3 tot 4 weken voor de competitiestart. Eén sessie per week werkt het best. Het kan ook tijdens een training.', cls:'blue' },
    { icon:'👥', title:'Groepsgrootte', text:'Werkt voor teams van 8 tot 25 spelers. Bij grotere groepen werk je best in kleinere groepjes voor de reflectie-oefeningen.', cls:'' },
  ],

  secTime: 'Tijdsinvestering voor de coach',
  timeRows: [
    { chip:'Voorbereiding', chipCls:'', desc:'10 tot 15 minuten per sessie. Lees het blad, print de werkbladen en leg het materiaal klaar.' },
    { chip:'Sessie zelf', chipCls:'', desc:'45 tot 60 minuten per sessie. Met 5 sessies kom je op ongeveer 4 tot 5 uur over heel het preseason.' },
    { chip:'Nabespreking', chipCls:'green', desc:'Optioneel: 10 minuten nabespreking met jezelf of een assistent-coach na elke sessie.' },
    { chip:'Totaal', chipCls:'blue', desc:'Een investering van ongeveer 5 tot 6 uur preseason voor een sterker, veerkrachtiger team het hele seizoen.' },
  ],

  secQuote: 'Het resultaat',
  quote: '"Cultuur is wat je team doet als de coach niet kijkt."',
  quoteAuth: 'Character First, win the person, win the team.',

  footer: 'characterfirst.be · info@characterfirst.be',
  credit: 'Created by Tom Pauwaert',
  pages: ['Pagina 1 van 2', 'Pagina 2 van 2'],
};

function buildHtml(c) {
  return `
  <!-- PAGE 1 -->
  <div class="page">
    <div class="hdr">
      <div class="hdr-top">
        ${logoDark(44)}
        <div style="text-align:right">
          <div class="hdr-badge">${c.badge}</div>
          <div class="hdr-pg" style="margin-top:5px">${c.pages[0]}</div>
        </div>
      </div>
      <div class="hdr-eyebrow">${c.eyebrow}</div>
      <div class="hdr-title">${c.title.replace('\n','<br>')}</div>
      <div class="hdr-sub">${c.sub}</div>
    </div>

    <div class="inner">
      <div class="sec-label">Waarom dit belangrijk is</div>
      <div class="why-block">
        <div class="why-title">${c.whyTitle}</div>
        <div class="why-text">${c.whyText}</div>
      </div>

      <div class="stat-row" style="margin-top:6mm">
        ${c.stats.map(s => `
        <div class="stat-card">
          <div class="stat-num">${s.num}</div>
          <div class="stat-lbl">${s.lbl.replace('\n','<br>')}</div>
        </div>`).join('')}
      </div>

      <div class="sec-label">${c.secSessions}</div>
      <div class="sessions-col">
        ${c.sessions.map(s => `
        <div class="sess">
          <div class="sess-num">${s.n}</div>
          <div class="sess-body">
            <div class="sess-title">${s.t}</div>
            <div class="sess-desc">${s.d}</div>
          </div>
          <div class="sess-time">⏱ ${s.time}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="footer">
      <span>${c.footer}</span>
      <span class="credit">${c.credit}</span>
      <span>${c.pages[0]}</span>
    </div>
  </div>

  <!-- PAGE 2 -->
  <div class="page">
    <div class="ph2">
      <div class="ph2-left">${logoDark(34)} <div class="ph2-wm">CHARACTER<span>First</span></div></div>
      <div style="font-size:9px;color:var(--stone)">${c.pages[1]}</div>
    </div>
    <div class="ph2-bar"></div>

    <div class="inner" style="padding-top:7mm">
      <div class="sec-label" style="margin-top:0">${c.secHow}</div>
      <div class="how-grid">
        ${c.howCards.map(h => `
        <div class="how-card${h.cls ? ' '+h.cls : ''}">
          <div class="how-icon">${h.icon}</div>
          <div class="how-title">${h.title}</div>
          <div class="how-text">${h.text}</div>
        </div>`).join('')}
      </div>

      <div class="sec-label">${c.secTime}</div>
      <div class="time-table">
        ${c.timeRows.map(r => `
        <div class="time-row">
          <div class="time-chip${r.chipCls ? ' '+r.chipCls : ''}">${r.chip}</div>
          <div class="time-desc">${r.desc}</div>
        </div>`).join('')}
      </div>

      <div class="sec-label">${c.secQuote}</div>
      <div class="quote-bar">
        <div class="qb-text">${c.quote}</div>
        <div class="qb-auth">${c.quoteAuth}</div>
      </div>
    </div>

    <div class="footer">
      <span>${c.footer}</span>
      <span class="credit">${c.credit}</span>
      <span>${c.pages[1]}</span>
    </div>
  </div>`;
}

async function generate() {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${buildHtml(NL)}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  const fname = 'CF_Cultuur_Handleiding_Coach.pdf';
  await page.pdf({
    path: path.join(OUT, fname),
    width: '210mm', height: '297mm',
    printBackground: true, margin: { top:0, right:0, bottom:0, left:0 }
  });
  await page.close();
  await browser.close();
  const size = Math.round(fs.statSync(path.join(OUT, fname)).size / 1024);
  console.log(`✓ ${fname} → ${size}KB`);
}

generate().catch(console.error);
