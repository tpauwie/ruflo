'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_NL = '/home/user/ruflo/docs/character-first/werkbladen-pdf/cultuur-kort';
const OUT_EN = '/home/user/ruflo/docs/character-first/werkbladen-pdf/cultuur-kort-en';
const OUT_COACH_NL = '/home/user/ruflo/docs/character-first/werkbladen-pdf/cultuur-kort-coach';
const OUT_COACH_EN = '/home/user/ruflo/docs/character-first/werkbladen-pdf/cultuur-kort-coach-en';
[OUT_NL, OUT_EN, OUT_COACH_NL, OUT_COACH_EN].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const EMAIL = 'info@characterfirst.be';

// ---------------------------------------------------------------------------
// PLAYER CSS — exact as gen_cultuur_speler.cjs
// ---------------------------------------------------------------------------
const PLAYER_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --orange: #f05a28; --ink: #1C2433; --canvas: #FAF7F2; --line: #E4DFD6;
  --stone: #6E6A63; --gray-200: #e8e8e8; --gray-300: #d0d0d0; --gray-400: #999;
  --gray-600: #555; --mist: #F0ECE4; --green: #1E8A5B;
}
html, body { background: #fff; }
body { font-family: Arial, sans-serif; color: var(--ink); font-size: 12px; }
.page {
  width: 210mm; height: 297mm; overflow: hidden;
  padding: 12mm 14mm 10mm; background: var(--canvas);
  display: flex; flex-direction: column; gap: 14px;
  page-break-after: always; break-after: page;
}
.page:last-child { page-break-after: auto; break-after: auto; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  border-bottom: 3px solid var(--orange); padding-bottom: 8px; flex-shrink: 0;
}
.session-label { font-size: 0.62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); }
h2 { font-size: 1.2rem; font-weight: 900; color: var(--ink); margin-top: 2px; }
.page-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.badge { font-size: 0.58rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; letter-spacing: .08em; text-transform: uppercase; background: rgba(30,138,91,.12); color: var(--green); border: 1px solid rgba(30,138,91,.3); }
.logo { font-weight: 900; font-size: 0.7rem; color: var(--stone); letter-spacing: .06em; }
.logo span { color: var(--orange); }
.goal-box { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.goal-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--orange); margin-bottom: 4px; }
.goal-box ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
.goal-box li { font-size: 0.78rem; color: var(--gray-600); padding-left: 14px; position: relative; line-height: 1.35; }
.goal-box li::before { content: '→'; position: absolute; left: 0; color: var(--orange); font-weight: 700; }
.intro-box { background: var(--mist); border-radius: 5px; padding: 7px 12px; font-size: 0.78rem; color: var(--gray-600); font-style: italic; line-height: 1.45; flex-shrink: 0; }
.section-title { font-size: 0.59rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--stone); border-bottom: 1px solid var(--line); padding-bottom: 3px; flex-shrink: 0; }
.ex { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 9px 12px; display: flex; flex-direction: column; gap: 6px; }
.ex-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.84rem; }
.ex-num { background: var(--orange); color: #fff; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.66rem; font-weight: 800; flex-shrink: 0; }
.ex-instr { font-size: 0.76rem; color: var(--gray-600); line-height: 1.45; }
.line { border-bottom: 1.5px solid var(--gray-300); height: 26px; width: 100%; }
.lines { display: flex; flex-direction: column; gap: 6px; }
.box { border: 1.5px solid var(--gray-300); border-radius: 4px; background: #fff; }
.box-xs { min-height: 48px; } .box-sm { min-height: 72px; } .box-md { min-height: 100px; } .box-lg { min-height: 140px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.col-label { font-size: 0.7rem; font-weight: 700; margin-bottom: 4px; }
.field-label { font-size: 0.73rem; color: var(--gray-400); margin-bottom: 3px; }
.num-list { display: flex; flex-direction: column; gap: 8px; }
.num-item { display: flex; align-items: center; gap: 8px; }
.num-item .line { flex: 1; }
.sign-row { display: flex; gap: 20px; margin-top: 6px; }
.sign-field { flex: 1; }
.sign-label { font-size: 0.68rem; color: var(--gray-400); margin-bottom: 4px; }
.mental-block { background: linear-gradient(135deg,#1C2433 0%,#2d3a4f 100%); color:#fff; border-radius:8px; padding:10px 14px; border-left:4px solid var(--orange); flex-shrink:0; }
.mental-label { font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:var(--orange); margin-bottom:5px; }
.mental-box { border:1.5px solid rgba(255,255,255,.2); border-radius:4px; background:rgba(255,255,255,.06); min-height:156px; }
.quote-wrap { flex-shrink:0; }
.quote-block { background:var(--ink); color:#fff; border-radius:8px; padding:12px 16px; border-left:4px solid var(--orange); }
.quote-block p { font-size:0.82rem; font-style:italic; line-height:1.55; margin-bottom:6px; }
.quote-block cite { font-size:0.64rem; color:rgba(255,255,255,.6); font-style:normal; }
.page-footer { display:flex; justify-content:space-between; align-items:center; font-size:0.58rem; color:var(--stone); border-top:1px solid var(--line); padding-top:5px; margin-top:auto; flex-shrink:0; }
.page-footer .credit { color:var(--gray-400); }
.cont-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--orange); padding-bottom:6px; flex-shrink:0; }
.cont-title { font-size:0.74rem; font-weight:700; color:var(--stone); }
.cont-session { font-size:0.6rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--orange); }
.promise-row { display:flex; align-items:center; gap:8px; }
.promise-label { font-size:0.72rem; font-weight:700; color:var(--orange); white-space:nowrap; }
@media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
`;

// ---------------------------------------------------------------------------
// COACH CSS
// ---------------------------------------------------------------------------
const COACH_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --orange: #F05A28; --navy: #1C2433; --green: #1E8A5B; --canvas: #FAF7F2;
  --mist: #F0ECE4; --stone: #6E6A63; --line: #E4DFD6; --blue: #2F6FB0;
}
body { background: #fff; font-family: Arial, sans-serif; }
.page { width: 210mm; height: 297mm; overflow: hidden; padding: 12mm 14mm 10mm; background: var(--canvas); display: flex; flex-direction: column; gap: 8px; }
.header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.wordmark { font-family: Arial Black, Arial, sans-serif; font-size: 18px; font-weight: 900; color: var(--navy); }
.wordmark span { color: var(--orange); }
.badge { font-family: Arial Black, Arial, sans-serif; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; background: rgba(240,90,40,.12); color: var(--orange); border: 1.5px solid var(--orange); border-radius: 20px; padding: 3px 10px; }
.session-label { font-size: 11px; color: var(--stone); text-align: right; line-height: 1.3; }
.divider { height: 2px; background: var(--orange); border-radius: 1px; flex-shrink: 0; }
.title-block { flex-shrink: 0; }
.eyebrow { font-family: Arial Black, Arial, sans-serif; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .15em; color: var(--orange); margin-bottom: 3px; }
.title { font-family: Arial Black, Arial, sans-serif; font-size: 22px; font-weight: 900; color: var(--navy); line-height: 1.15; }
.subtitle { font-size: 13px; color: var(--stone); margin-top: 3px; }
.section-label { font-family: Arial Black, Arial, sans-serif; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; color: var(--navy); border-left: 3px solid var(--orange); padding-left: 8px; margin-bottom: 4px; }
.objective-block { background: rgba(240,90,40,.07); border-left: 3px solid var(--orange); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.objective-block .section-label { color: var(--orange); border-color: var(--orange); }
.objective-block p { font-size: 12px; color: var(--navy); line-height: 1.45; }
.tip-block { background: rgba(30,138,91,.08); border-left: 3px solid var(--green); border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.tip-block .section-label { color: var(--green); border-color: var(--green); }
.tip-block p { font-size: 11px; color: var(--navy); line-height: 1.4; }
.warn-block { background: rgba(192,57,43,.08); border-left: 3px solid #c0392b; border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.warn-block .section-label { color: #c0392b; border-color: #c0392b; }
.warn-block p { font-size: 11px; color: var(--navy); line-height: 1.4; }
.overview-block { background: rgba(240,90,40,.05); border-left: 3px solid var(--orange); border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.overview-block .section-label { color: var(--orange); border-color: var(--orange); }
.overview-block ol { padding-left: 16px; }
.overview-block li { font-size: 10.5px; color: var(--navy); line-height: 1.4; margin-bottom: 2px; }
.overview-block li strong { color: var(--orange); }
.program-title { text-align: right; }
.program-title .pt-main { font-family: Arial Black, Arial, sans-serif; font-size: 17px; font-weight: 900; color: var(--orange); line-height: 1.05; }
.program-title .pt-sub { font-size: 10px; color: var(--stone); margin-top: 3px; }
.p1-body { flex: 1; display: flex; flex-direction: column; justify-content: flex-start; gap: 14px; min-height: 0; }
.intro-block { flex-shrink: 0; }
.intro-block .section-label { font-size: 11px; margin-bottom: 6px; }
.intro-block p { font-size: 12px; color: var(--navy); line-height: 1.62; margin-top: 4px; }
.intro-block strong { font-weight: 900; color: var(--navy); }
.objectives-block { background: rgba(240,90,40,.1); border: 1.5px solid var(--orange); border-radius: 8px; padding: 11px 15px; flex-shrink: 0; }
.objectives-block .section-label { color: var(--orange); border-color: var(--orange); font-size: 11px; margin-bottom: 8px; }
.objectives-block ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; }
.objectives-block li { font-size: 12.5px; color: var(--navy); font-weight: 600; padding-left: 21px; position: relative; line-height: 1.35; }
.objectives-block li::before { content: '✓'; position: absolute; left: 0; color: var(--orange); font-weight: 900; }
.coachtips-block { background: rgba(30,138,91,.08); border-left: 3px solid var(--green); border-radius: 6px; padding: 10px 14px; flex-shrink: 0; }
.coachtips-block .section-label { color: var(--green); border-color: var(--green); font-size: 11px; margin-bottom: 6px; }
.coachtips-block ol { padding-left: 18px; margin: 0; }
.coachtips-block li { font-size: 11.5px; color: var(--navy); line-height: 1.5; margin-bottom: 6px; }
.coachtips-block li:last-child { margin-bottom: 0; }
.coachtips-block li::marker { font-weight: 900; color: var(--green); }
.watchlist-block { background: rgba(192,57,43,.08); border-left: 3px solid #c0392b; border-radius: 6px; padding: 10px 14px; flex-shrink: 0; }
.watchlist-block .section-label { color: #c0392b; border-color: #c0392b; font-size: 11px; margin-bottom: 6px; }
.watchlist-block ul { padding-left: 17px; margin: 0; }
.watchlist-block li { font-size: 11.5px; color: var(--navy); line-height: 1.5; margin-bottom: 6px; }
.watchlist-block li:last-child { margin-bottom: 0; }
.science-footnote { border-top: 1px dashed var(--line); padding-top: 7px; flex-shrink: 0; }
.science-footnote .sf-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--stone); margin-bottom: 4px; }
.science-footnote ul { padding-left: 15px; margin: 0; }
.science-footnote li { font-size: 8.5px; color: var(--stone); line-height: 1.4; margin-bottom: 2px; }
.footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 5px; flex-shrink: 0; margin-top: auto; }
.footer-left, .footer-right { font-size: 9px; color: var(--stone); }
.question-block { background: rgba(47,111,176,.08); border-left: 3px solid var(--blue); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.question-block .section-label { color: var(--blue); border-color: var(--blue); }
.question-block ol { padding-left: 16px; }
.question-block li { font-size: 10px; color: var(--navy); line-height: 1.4; margin-bottom: 2px; font-style: italic; }
.followup-block { background: rgba(240,90,40,.07); border-left: 3px solid var(--orange); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.followup-block .section-label { color: var(--orange); border-color: var(--orange); }
.followup-block ol { padding-left: 16px; }
.followup-block li { font-size: 10px; color: var(--navy); line-height: 1.4; margin-bottom: 2px; }
.detail-list { display: flex; flex-direction: column; gap: 7px; }
.detail-card { border: 1.5px solid var(--line); border-radius: 8px; padding: 8px 12px; background: #fff; flex-shrink: 0; }
.detail-header { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.detail-title { font-family: Arial Black, Arial, sans-serif; font-size: 12px; font-weight: 900; color: var(--navy); flex: 1; }
.detail-time { font-size: 9.5px; color: var(--stone); font-weight: 700; white-space: nowrap; }
.detail-row { display: grid; grid-template-columns: 72px 1fr; gap: 5px; margin-bottom: 4px; }
.detail-row:last-child { margin-bottom: 0; }
.detail-key { font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--stone); padding-top: 1px; line-height: 1.3; }
.detail-val { font-size: 9.8px; color: #333; line-height: 1.38; }
.detail-val.script { font-style: italic; color: var(--blue); }
.mini-list { padding-left: 11px; margin: 1px 0; }
.mini-list li { font-size: 9.3px; line-height: 1.35; margin-bottom: 2px; color: #333; }
.scenario-list li { color: var(--green); }
.pitfall-list li { color: #c0392b; }
.faq-item { margin-bottom: 3px; }
.faq-q { font-size: 9.2px; font-weight: 700; color: var(--navy); display: block; }
.faq-a { font-size: 9.2px; color: var(--stone); display: block; padding-left: 8px; line-height: 1.35; }
.activity-num { width: 21px; height: 21px; border-radius: 50%; background: var(--navy); color: #fff; font-size: 11px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: Arial Black, Arial, sans-serif; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

// ---------------------------------------------------------------------------
// PLAYER CONTENT — NL (unchanged)
// ---------------------------------------------------------------------------
const playerNL = [
  {
    s: 1,
    title: 'Wie zijn wij?',
    sessionLabel: 'Verkorte cultuurreeks: sessie 1 van 2',
    goalLabel: 'Doelstelling sessie 1',
    goals: [
      'Je benoemt drie waarden die jij dit seizoen in ons team wil zien',
      'Je helpt bepalen wat we als team willen bewaren en wat we loslaten',
      'Je legt je persoonlijke belofte aan het team vast met je handtekening',
    ],
    intro: 'Cultuur begint niet met regels. Het begint met wie je bent. Wie zijn wij als team? Niet wat we willen winnen, maar hoe we willen zijn. Dit werkblad legt de basis.',
    page1: `
      <div class="section-title">Oefening 1: wie zijn wij?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Drie woorden voor ons team</div>
        <p class="ex-instr">Schrijf drie woorden op. Woorden die jij wil dat mensen over ons team zeggen. Niet over de resultaten, maar over ons gedrag en karakter.</p>
        <div class="field-label">Mijn drie woorden:</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
        <div class="field-label" style="margin-top:8px">Na de groepsdiscussie: de drie woorden die ons team koos.</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
      </div>
      <div class="section-title">Oefening 2: onze cultuurankers</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wat houden we vast, wat laten we los?</div>
        <p class="ex-instr">Denk aan vorig seizoen. Wat willen we als team bewaren? Wat laten we bewust achter?</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">WE HOUDEN VAST ▶</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">WE LATEN LOS ✕</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">Welk gedrag wil je zelf bewust loslaten dit seizoen?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: ons teamcontract</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Mijn beloftes aan het team</div>
        <p class="ex-instr">Schrijf drie concrete beloftes die jij dit seizoen aan het team doet. Maak ze concreet, zodat je ze later kan checken. Teken daarna, als bewijs van jouw commitment.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
        </div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Naam</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Handtekening</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Persoonlijke reflectie</div>
      <div class="ex">
        <p class="ex-instr">Welke belofte wordt voor jou het moeilijkst om na te komen? Waarom? En hoe hou jij jezelf daaraan?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: onze identiteit verdedigen</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Soms zet iemand onze cultuur of waarden onder druk, met opzet of niet. Wat doe jij dan? Schrijf op wat jij zegt of doet als onze afspraken worden uitgedaagd.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Culture is not just one aspect of the game, it is the game."',
    cite: 'Lou Gerstner, CEO IBM',
    footer: 'Verkorte cultuurreeks S1: Wie zijn wij?',
  },
  {
    s: 2,
    title: 'Hoe werken wij?',
    sessionLabel: 'Verkorte cultuurreeks: sessie 2 van 2',
    goalLabel: 'Doelstelling sessie 2',
    goals: [
      'Je weet hoe veilig je je voelt in dit team en waar er ruimte is om te groeien',
      'Je oefent hoe je iemand aanspreekt zonder de relatie te beschadigen',
      'Je formuleert rituelen die onze cultuur elke week levend houden',
    ],
    intro: 'Cultuur zie je pas echt als het moeilijk wordt. Hoe gaan we om met spanning, eerlijkheid en aanspreken? Dit werkblad maakt dat concreet.',
    page1: `
      <div class="section-title">Oefening 1: vertrouwensbarometer</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Hoe veilig voel ik me in ons team?</div>
        <p class="ex-instr">Geef eerlijk een score van 1 tot 10 voor elke situatie. Er is geen goed of fout antwoord.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
          <div class="field-label">Ik durf fouten toe te geven in ons team: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">Ik durf om hulp te vragen zonder me zwak te voelen: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">Ik durf mijn mening te zeggen, ook als die anders is: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">Ik voel me gesteund na een slechte wedstrijd: <span style="color:var(--orange);font-weight:700">___/10</span></div>
        </div>
        <div class="field-label" style="margin-top:10px">Wat valt je op aan je scores? Welke score wil je verhogen dit seizoen?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2: het moeilijke gesprek</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Iemand aanspreken</div>
        <p class="ex-instr">Gebruik dit model om iemand aan te spreken zonder aan te vallen. Denk aan een situatie met een teamgenoot en schrijf het uit.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK ZIE (wat je concreet observeert, zonder interpretatie)</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VOEL (wat dat bij jou doet)</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VRAAG JE OM (één concrete actie)</div><div class="line"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: rituelen en cultuurbelofte</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Wat doen wij elke week?</div>
        <p class="ex-instr">Rituelen zijn kleine, herhaalde acties die cultuur levend houden, ook als de druk toeneemt. Schrijf drie rituelen op die jullie dit seizoen invoeren.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">VOOR DE TRAINING</div>
            <div class="line"></div>
          </div>
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">NA EEN WEDSTRIJD</div>
            <div class="line"></div>
          </div>
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">BIJ EEN MOEILIJK MOMENT</div>
            <div class="line"></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:10px">Mijn bijdrage aan de cultuur dit seizoen (één zin):</div>
        <div class="box box-sm"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Naam</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Persoonlijke reflectie</div>
      <div class="ex">
        <p class="ex-instr">Wanneer staat onze cultuur het meest onder druk? Denk aan een verliesreeks, spanning over speeltijd, of een conflict. Wat doe jij dan om de cultuur te bewaken?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: cultuur verdedigen onder druk</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf één concreet scenario dat onze cultuur echt onder druk zet. Verliesreeks, interne competitie, conflict. Wat doe jij dan om te zorgen dat de cultuur stand houdt?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Champions behave like champions before they are champions."',
    cite: 'Bill Walsh, 3× Super Bowl Champion Coach, San Francisco 49ers',
    footer: 'Verkorte cultuurreeks S2: Hoe werken wij?',
  },
];

// ---------------------------------------------------------------------------
// PLAYER CONTENT — EN (unchanged)
// ---------------------------------------------------------------------------
const playerEN = [
  {
    s: 1,
    title: 'Who are we?',
    sessionLabel: 'Short culture track: session 1 of 2',
    goalLabel: 'Goals session 1',
    goals: [
      'You name three values you want our team to show this season',
      'You help decide what we want to keep as a team and what we let go',
      'You record your personal promise to the team with your signature',
    ],
    intro: "Culture doesn't start with rules. It starts with who you are. Who are we as a team? Not what we want to win, but how we want to be. This worksheet lays the foundation.",
    page1: `
      <div class="section-title">Exercise 1: who are we?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Three words for our team</div>
        <p class="ex-instr">Write down three words. Words you want people to say about our team. Not about the results, but about our behavior and character.</p>
        <div class="field-label">My three words:</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
        <div class="field-label" style="margin-top:8px">After the group discussion: the three words our team chose.</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
      </div>
      <div class="section-title">Exercise 2: our culture anchors</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What do we keep, what do we let go?</div>
        <p class="ex-instr">Think about last season. What do we want to keep as a team? What do we consciously leave behind?</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">WE KEEP ▶</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">WE LET GO ✕</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">What behavior do you personally want to let go of this season?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2: `
      <div class="section-title">Exercise 3: our team contract</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>My promises to the team</div>
        <p class="ex-instr">Write down three concrete promises you make to the team this season. Make them specific so you can check them later. Then sign as proof of your commitment.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
        </div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Name</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Signature</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Personal reflection</div>
      <div class="ex">
        <p class="ex-instr">Which promise will be hardest for you to keep? Why? How will you hold yourself to it?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: defending our identity</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Sometimes someone puts our culture or values under pressure, on purpose or not. What do you do then? Write down what you say or do when our agreements are challenged.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Culture is not just one aspect of the game, it is the game."',
    cite: 'Lou Gerstner, CEO IBM',
    footer: 'Short culture track S1: Who are we?',
  },
  {
    s: 2,
    title: 'How do we work?',
    sessionLabel: 'Short culture track: session 2 of 2',
    goalLabel: 'Goals session 2',
    goals: [
      'You know how safe you feel in this team and where there is room to grow',
      'You practice addressing someone without damaging the relationship',
      'You formulate rituals that keep our culture alive every week',
    ],
    intro: "You really see culture when things get hard. How do we handle tension, honesty, and accountability? This worksheet makes that concrete.",
    page1: `
      <div class="section-title">Exercise 1: trust barometer</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>How safe do I feel in our team?</div>
        <p class="ex-instr">Give an honest score from 1 to 10 for each situation. There is no right or wrong answer.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
          <div class="field-label">I dare to admit mistakes in our team: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">I dare to ask for help without feeling weak: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">I dare to say my opinion, even when it differs: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">I feel supported after a bad game: <span style="color:var(--orange);font-weight:700">___/10</span></div>
        </div>
        <div class="field-label" style="margin-top:10px">What stands out in your scores? Which score do you want to raise this season?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2: the difficult conversation</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Addressing someone</div>
        <p class="ex-instr">Use this model to address someone without attacking them. Think of a situation with a teammate and write it out.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I SEE (what you concretely observe, without interpretation)</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I FEEL (what it does to you)</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I ASK YOU TO (one concrete action)</div><div class="line"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Exercise 3: rituals and culture promise</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>What do we do every week?</div>
        <p class="ex-instr">Rituals are small, repeated actions that keep culture alive, even when pressure rises. Write down three rituals you will introduce this season.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">BEFORE TRAINING</div>
            <div class="line"></div>
          </div>
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">AFTER A GAME</div>
            <div class="line"></div>
          </div>
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">IN A DIFFICULT MOMENT</div>
            <div class="line"></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:10px">My contribution to the team culture this season (one sentence):</div>
        <div class="box box-sm"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Name</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Personal reflection</div>
      <div class="ex">
        <p class="ex-instr">When is our culture under the most pressure? Think of a losing streak, playing time tension, or a conflict. What do you do then to guard the culture?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: defending culture under pressure</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write down one concrete scenario that really puts our culture under pressure. A losing streak, internal competition, conflict. What do you do then to make sure the culture holds?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Champions behave like champions before they are champions."',
    cite: 'Bill Walsh, three time Super Bowl Champion Coach, San Francisco 49ers',
    footer: 'Short culture track S2: How do we work?',
  },
];

// ---------------------------------------------------------------------------
// SHARED COACH CONTENT (program-level)
// ---------------------------------------------------------------------------
const PROGRAM_INTRO_NL = 'Cultuur is <strong>wat een team doet als niemand kijkt</strong>. Dit verkorte cultuurprogramma helpt je om in <strong>twee sessies</strong> een <strong>sterke teamcultuur</strong> te bouwen, ook als je weinig tijd hebt. Het vertrekt vanuit één idee: <strong>cultuur ontstaat niet vanzelf, je bouwt ze bewust</strong>. In sessie 1 leggen je spelers vast <strong>wie ze willen zijn als team</strong> en welke beloftes ze aan elkaar doen. In sessie 2 leren ze hoe ze die cultuur <strong>levend houden als het moeilijk wordt</strong>, door eerlijk te zijn, elkaar aan te spreken en kleine rituelen in te bouwen. <strong>Jij als coach bent de sleutel</strong>: jij bewaakt de toon, geeft het voorbeeld en zorgt dat afspraken niet vergeten worden. De werkbladen zijn van de spelers, maar <strong>de richting komt van jou</strong>. Verwacht geen onmiddellijk resultaat, <strong>cultuur groeit over weken en maanden</strong>. Het doel is niet een perfecte sessie, maar <strong>een team dat zich eigenaar voelt van zijn eigen gedrag</strong>. Gebruik deze gids als houvast, niet als script, en pas hem aan jouw groep aan.';
const PROGRAM_INTRO_EN = 'Culture is <strong>what a team does when no one is watching</strong>. This short culture program helps you build a <strong>strong team culture</strong> in just <strong>two sessions</strong>, even when time is limited. It starts from one idea: <strong>culture does not appear by itself, you build it on purpose</strong>. In session 1, your players define <strong>who they want to be as a team</strong> and what promises they make to each other. In session 2, they learn how to <strong>keep that culture alive when things get hard</strong>, by being honest, holding each other accountable, and building in small rituals. <strong>You as the coach are the key</strong>: you guard the tone, set the example, and make sure agreements are not forgotten. The worksheets belong to the players, but <strong>the direction comes from you</strong>. Do not expect instant results, <strong>culture grows over weeks and months</strong>. The goal is not a perfect session, but <strong>a team that feels ownership over its own behavior</strong>. Use this guide as support, not as a script, and adapt it to your group.';

const COACH_TIPS_NL = [
  'Ga zelf eerst: deel jouw eigen antwoord voor je het aan de spelers vraagt. Kwetsbaarheid voordoen maakt spelers eerlijker.',
  'Laat eerst individueel schrijven (2 min), pas daarna delen. Zo voorkom je dat één luide stem de hele groep bepaalt.',
  'Veroordeel geen enkel antwoord. Een speler die zich veilig voelt, deelt meer dan een speler die zich beoordeeld voelt.',
  'Maak alles concreet in gedrag. Vraag bij elk vaag antwoord: "Hoe ziet dat eruit op training?"',
  'Sluit elke sessie af met één concrete afspraak en een moment van stilte, zodat de betekenis kan landen.',
];
const COACH_TIPS_EN = [
  'Go first: share your own answer before asking the players. Modeling vulnerability makes players more honest.',
  'Let players write individually first (2 min), then share. This stops one loud voice from setting the tone for the whole group.',
  'Do not judge any answer. A player who feels safe shares more than a player who feels evaluated.',
  'Make everything concrete in behavior. For every vague answer ask: "What does that look like at practice?"',
  'Close every session with one concrete agreement and a moment of quiet, so the meaning can settle.',
];

// ---------------------------------------------------------------------------
// COACH CONTENT — NL
// ---------------------------------------------------------------------------
const coachNL = [
  {
    s: 1,
    title: 'Wie zijn wij?',
    subtitle: 'Verkorte cultuurreeks: sessie 1 van 2',
    intro: PROGRAM_INTRO_NL,
    coachTips: COACH_TIPS_NL,
    objectives: [
      'Spelers benoemen drie waarden die het team dit seizoen wil uitstralen',
      'Spelers bepalen samen wat ze als team behouden en wat ze loslaten',
      'Elke speler legt een persoonlijke, ondertekende belofte aan het team vast',
    ],
    watchOut: [
      'Laat de discussie niet vervallen tot klagen over vorig seizoen. Stuur bij naar wie jullie willen zijn.',
      'Forceer niemand om te delen. Vrijwilligheid houdt de veiligheid hoog en de antwoorden eerlijk.',
      'Bewaak de tijd: elke oefening heeft een richttijd. Liever kort en scherp dan lang en vaag.',
    ],
    science: [
      'Cameron & Quinn (2011): teams die hun cultuur bewust benoemen, presteren stabieler onder druk dan teams die dat niet doen.',
      'Tod et al. (2011): publieke commitment, zoals ondertekenen, verhoogt de naleving van gedragsafspraken.',
      'Carron & Eys (2012): gedeelde identiteit is de sterkste voorspeller van teamcohesie over een heel seizoen.',
    ],
    exerciseDetails: [
      {
        title: 'Drie woorden voor ons team',
        tijd: '⏱ 10 min',
        explanation: 'Spelers expliciteren wat cultuur voor hen concreet betekent. Door individueel te starten voor je laat delen, vermijd je groepsdenken en hoort iedereen zijn eigen stem eerst.',
        script: '"Je krijgt twee minuten om alleen te schrijven. Geen overleg. Drie woorden die jij wil dat mensen over ons team zeggen. Niet over het klassement, maar over ons gedrag en karakter."',
        tips: [
          'Ga zelf als eerste: deel jouw woorden voordat je de groep vraagt. Dit normaliseert het en verhoogt de eerlijkheid.',
          'Koppel de gekozen woorden aan concrete momenten: "Wanneer zagen jullie dit vorig jaar, en wanneer niet?"',
          'Combineer de meest gekozen woorden tot drie teamwoorden. Laat kort stemmen met een show of hands.',
        ],
        scenarios: [
          'Scenario A: bijna iedereen kiest hetzelfde woord, bv. "eerlijkheid". Vraag: "Wanneer was dat er echt, en wanneer misten jullie het?" Zo worden woorden levend in plaats van abstract.',
          'Scenario B: spelers kiezen zeer uiteenlopende woorden. Zeg: "Jullie kiezen andere woorden, maar ze gaan allemaal over hoe jullie met elkaar omgaan." Zoek samen de gemeenschappelijke kern.',
        ],
        pitfalls: [
          'Te snel naar de groepsdiscussie gaan voor iedereen individueel heeft geschreven. Groepsdenken doodt eerlijkheid.',
          'Woorden accepteren die over resultaten gaan. "Kampioenen" is geen cultuurwoord. Stuur bij naar gedrag: "Hoe gedraag je je als kampioen?"',
        ],
        faq: [
          { q: 'Moeten het echt drie woorden zijn?', a: 'Nee. Als een speler één perfect woord vindt, is dat prima. Het gaat om kwaliteit, niet om het aantal.' },
          { q: 'Wat als spelers heel verschillende woorden kiezen?', a: 'Dat is waardevol. Laat de verschillen zien en zoek samen wat de woorden in gedrag verbindt.' },
        ],
      },
      {
        title: 'Cultuurankers',
        tijd: '⏱ 12 min',
        explanation: 'Teams die bewust benoemen wat ze willen bewaren én loslaten, doorbreken ondienstig gedrag sneller. De twee kolommen sturen het gesprek vooruit en maken verandering concreet.',
        script: '"Denk aan vorig seizoen. Links: wat willen we bewaren als team — gedrag, gewoontes, momenten. Rechts: wat laten we bewust achter? Twee minuten schrijven, dan korte bespreking."',
        tips: [
          'Stuur bij als "loslaten" een klaagfest wordt. Vraag: "Wat spreken we dan af zodat dit dit seizoen anders gaat?"',
          'Maak elk punt concreet in zichtbaar gedrag: niet "meer discipline", maar "we spreken elkaar aan als iemand te laat komt".',
        ],
        scenarios: [
          'Scenario A: een speler wil "mopperen op de bank" loslaten. Vraag: "Wat doe je dan wél als je gefrustreerd bent?" Zo geef je richting aan het nieuwe gedrag.',
          'Scenario B: de groep wil bijna alles loslaten en weinig bewaren. Vraag: "Was er echt niets positief vorig jaar?" Dat herbalanceert het gesprek en geeft ook erkenning.',
        ],
        pitfalls: [
          'Loslaten wordt een klaagmoment in plaats van een vooruitkijk. Stuur actief bij als dat gebeurt.',
          'Cultuurankers blijven vaag. Help elk punt concreet te maken: "Hoe ziet dit eruit als je het in gedrag ziet op training?"',
        ],
        faq: [
          { q: 'Hoe "loslaat" een team iets concreet?', a: 'Door een nieuw gedrag af te spreken dat het oude vervangt. Niet "minder negativiteit", maar "we bouwen elkaar op na elke fout".' },
          { q: 'Wat als spelers het niet eens zijn over wat we loslaten?', a: 'Laat kort toelichten waarom iemand iets wil bewaren. Stem daarna. Het gesprek zelf is al waardevol.' },
        ],
      },
      {
        title: 'Teamcontract ondertekenen',
        tijd: '⏱ 8 min',
        explanation: 'Publieke commitment via handtekening verhoogt de kans dat spelers gedragsafspraken écht nakomen. Een contract dat spelers zelf schreven werkt sterker dan regels van bovenaf.',
        script: '"Schrijf drie concrete beloftes die jij dit seizoen aan het team doet. Maak ze meetbaar: iets wat je zelf kunt checken. Onderteken daarna met naam en datum."',
        tips: [
          'Help spelers van vaag naar concreet. "Harder werken" → "Ik ben de eerste die een teamgenoot aanmoedigt na een fout".',
          'Vraag na het schrijven twee spelers hun belofte hardop voor te lezen. Dit verhoogt het commitment van iedereen.',
          'Bewaar de contracten en breng ze halverwege het seizoen terug voor een expliciete check-in.',
        ],
        scenarios: [
          'Scenario A: een speler schrijft een vage belofte. Vraag: "Hoe weet je over drie maanden of je dit gedaan hebt?" Help hem concreter maken.',
          'Scenario B: een speler twijfelt en schrijft niets. Ga naast hem zitten: "Wat is één ding dat jij dit seizoen aan het team wil bijdragen?" Begin klein.',
        ],
        pitfalls: [
          'Beloftes accepteren die niet controleerbaar zijn. "Ik beloof een betere teamspeler te zijn" verdwijnt binnen een week.',
          'De contracten vergeten op te volgen. Een contract zonder follow-up is decoratie. Plan de check-in nu al in.',
        ],
        faq: [
          { q: 'Wat als ik mijn belofte niet nakom?', a: 'Dat is menselijk. Het gaat erom dat je het erkent en opnieuw start. Spreek erover met je coach of een teamgenoot.' },
          { q: 'Moet ik echt drie beloftes schrijven?', a: 'Nee. Eén sterke, concrete belofte is meer waard dan drie vage. Kwaliteit gaat boven kwantiteit.' },
        ],
      },
    ],
    questions: [
      'Welk woord koos bijna iedereen, en wat zegt dat over wie jullie al zijn als team?',
      'Wat loslaten is voor jou persoonlijk het moeilijkst dit seizoen, en waarom?',
      'Welke belofte durf je hardop uit te spreken voor het hele team?',
      'Hoe zorg je dat dit contract niet vergeten wordt na vandaag?',
    ],
    followUp: [
      'Bewaar de ondertekende contracten en breng ze halverwege het seizoen terug: "Wat beloofde je, en hoe gaat het?"',
      'Hang de drie cultuurwoorden zichtbaar op in de kleedkamer. Verwijs er actief naar bij evaluatiemomenten.',
      'Benoem de komende week minstens twee keer concreet gedrag dat bij de cultuurankers past: "Dit is precies wat we bedoelden."',
      'Plan een check-in na zes weken: spelers herlezen hun belofte en scoren hoe goed ze die nakwamen.',
    ],
  },
  {
    s: 2,
    title: 'Hoe werken wij?',
    subtitle: 'Verkorte cultuurreeks: sessie 2 van 2',
    intro: PROGRAM_INTRO_NL,
    coachTips: COACH_TIPS_NL,
    objectives: [
      'Spelers brengen in kaart hoe veilig ze zich voelen in het team',
      'Spelers oefenen hoe ze elkaar aanspreken zonder de relatie te beschadigen',
      'Spelers kiezen rituelen die de cultuur elke week levend houden',
    ],
    watchOut: [
      'De vertrouwensbarometer kan gevoelig liggen na een moeilijke periode. Luister eerst, stel daarna pas vragen.',
      'Sla het voordoen van "ik zie, ik voel, ik vraag" niet over. Spelers moeten het format zien voor ze het proberen.',
      'Hou rituelen klein. Een ritueel dat als last voelt, verdwijnt binnen twee weken.',
    ],
    science: [
      'Edmondson (1999): psychologische veiligheid is een sterke voorspeller van teamprestaties bij onzekerheid.',
      'Eys et al. (2015): het "ik zie, ik voel, ik vraag"-model vermindert aanvallend taalgebruik in gesprekken.',
      'Lencioni (2002): conflictvermijding is een disfunctie van teams. Gezond conflict is een teken van vertrouwen.',
    ],
    exerciseDetails: [
      {
        title: 'Vertrouwensbarometer',
        tijd: '⏱ 10 min',
        explanation: 'Spelers expliciteren hoe veilig ze zich voelen in vier concrete situaties. Dit maakt een onzichtbare groepsdynamiek zichtbaar en geeft taal aan wat anders onbesproken blijft.',
        script: '"Geef eerlijk een score van 1 tot 10 voor elke situatie. Er is geen goed of fout. Niemand hoeft zijn scores te tonen als hij dat niet wil. Twee minuten schrijven."',
        tips: [
          'Kalibreer eerst: "Als 10 betekent dat je alles durft te delen, wat is dan een 5 voor jullie?" Zo krijgen scores meer betekenis.',
          'Verschuif van diagnose naar actie: als veel spelers laag scoren, vraag: "Wat moet er veranderen zodat jullie één punt hoger scoren?"',
          'Niemand is verplicht scores te tonen. Vrijwilligheid maakt het veiliger om eerlijk te zijn.',
        ],
        scenarios: [
          'Scenario A: bijna iedereen scoort laag op "fouten durven toegeven". Bespreek: "Wat maakt dat het hier niet veilig voelt?" Zoek het eerste kleine stapje, niet de perfecte oplossing.',
          'Scenario B: één speler deelt een lage score openlijk. Reageer zonder oordeel: "Dank dat je dit deelt. Dit helpt ons als team."',
          'Scenario C: het team heeft net een slechte wedstrijd gespeeld. Bereid je voor op lage scores. Luister eerst, stel pas daarna vragen.',
        ],
        pitfalls: [
          'De barometer gebruiken om het team te beoordelen in plaats van als startpunt voor gesprek.',
          'Spelers aanmoedigen scores te tonen als de groep nog niet veilig genoeg voelt. Verplicht delen is fnuikend voor vertrouwen.',
        ],
        faq: [
          { q: 'Wat als niemand zijn scores wil delen?', a: 'Dat is een signaal. Bespreek anoniem: "Wat moet er veranderen zodat we dit wél kunnen delen?" Het gesprek is waardevoller dan de cijfers.' },
          { q: 'Zijn lage scores erg?', a: 'Nee. Een lage score die uitgesproken wordt, is een kans om te groeien. Scores die nooit besproken worden, zijn het echte probleem.' },
        ],
      },
      {
        title: 'Het moeilijke gesprek',
        tijd: '⏱ 12 min',
        explanation: 'Spelers oefenen een model dat observatie, gevoel en verzoek scheidt van aanval en beschuldiging. Zo durven ze moeilijke gesprekken voeren zonder dat die escaleren.',
        script: '"Modelleer dit eerst zelf. Schrijf dan: IK ZIE (observatie zonder interpretatie), IK VOEL (wat dit bij jou doet), IK VRAAG JE OM (één concrete actie). Geen namen nodig op papier."',
        tips: [
          'Geef altijd een volledig modelvoorbeeld voor je de spelers laat schrijven. Zo weet iedereen exact wat je verwacht.',
          'Benadruk: IK ZIE gaat over feiten, geen oordelen. "Je bent altijd laat" is een oordeel. "Je was de laatste drie trainingen 10 minuten te laat" is een observatie.',
          'Vraag na het schrijven of iemand zijn tekst hardop wil lezen. Laat anoniem toe als dat veiliger voelt.',
        ],
        scenarios: [
          'Scenario A: een speler schrijft aanvallende "ik zie"-zinnen. Stop hem vriendelijk: "Dit is een interpretatie. Wat zag je concreet?" Help hem herschrijven zonder oordeel.',
          'Scenario B: een speler wil het model meteen voor een echte spanning gebruiken. Begeleid dit zorgvuldig: "Is dit iets wat je ook echt wil bespreken, of oefen je alleen?"',
        ],
        pitfalls: [
          '"IK ZIE"-zinnen die eigenlijk oordelen zijn. "Je trekt je niet in" is een oordeel, geen observatie.',
          'De oefening overslaan omdat "ze dit al kennen". Kennen is niet hetzelfde als kunnen toepassen onder druk.',
        ],
        faq: [
          { q: 'Moet ik dit model altijd gebruiken in echte gesprekken?', a: 'Nee. Het is een oefenhulp. Naarmate het vertrouwd wordt, gebruik je de structuur automatisch zonder het zo strak te volgen.' },
          { q: 'Wat als de ander boos reageert als ik hem aansprek?', a: 'Vraag rustig: "Ik wou dit zeggen omdat ik om ons team geef. Mag ik uitleggen wat ik bedoelde?" Rustig blijven helpt meer dan je punt herhalen.' },
        ],
      },
      {
        title: 'Rituelen en cultuurbelofte',
        tijd: '⏱ 10 min',
        explanation: 'Cultuur zonder rituelen vervliegt. Kleine, herhaalde acties houden cultuur levend, ook als de druk toeneemt. De handtekening sluit de reeks symbolisch en krachtig af.',
        script: '"Schrijf drie rituelen op: één voor de training, één na een wedstrijd, één bij een moeilijk moment. Schrijf dan één zin die zegt wat jij bijdraagt aan de cultuur van dit team. Onderteken."',
        tips: [
          'Vraag niet welk ritueel het leukst klinkt, maar welk ritueel minstens acht weken vol te houden is. Klein en haalbaar werkt, ambitieus en ingewikkeld niet.',
          'Introduceer het eerste ritueel op de eerstvolgende training. Eigenaarschap van de spelers verhoogt de kans dat het beklijft.',
          'Benoem de eerste vier weken actief elk ritueel als je het ziet: "Dit is precies het ritueel dat jullie kozen."',
        ],
        scenarios: [
          'Scenario A: spelers stellen ingewikkelde rituelen voor. Help vereenvoudigen: "Wat is de kern hiervan in 30 seconden?"',
          'Scenario B: de groep wil geen rituelen ("dat voelt geforceerd"). Laat een klein voorbeeld zien: "Wat als jullie voor elke training één naam noemen van iemand die het die week goed deed? 30 seconden, grote impact."',
        ],
        pitfalls: [
          'Rituelen invoeren die te ingewikkeld of tijdsintensief zijn. Een ritueel dat als last wordt ervaren, verdwijnt binnen twee weken.',
          'Rituelen niet actief opvolgen. Nieuw gedrag heeft 6-8 weken begeleiding nodig voor het automatisch wordt.',
        ],
        faq: [
          { q: 'Wat als het team het ritueel na een week al vergeet?', a: 'Dat is normaal. Herinner eraan zonder te veroordelen: "We hadden afgesproken om voor de training één naam te noemen. We doen het nu." Zo herstart je zonder drama.' },
          { q: 'Wie bewaakt de rituelen?', a: 'Aanvankelijk jij, maar de bedoeling is dat spelers het overnemen. Vraag wie dit op zich wil nemen.' },
        ],
      },
    ],
    questions: [
      'Welke van de vier vertrouwensvragen voelde het gevaarlijkst om eerlijk te beantwoorden, en waarom?',
      'Heb je ooit iemand aangesproken op gedrag? Wat werkte en wat werkte niet?',
      'Welk ritueel zou ons team direct veranderen, ook als het maar 30 seconden duurt?',
      'Wat wil jij dat een nieuw teamlid over vijf jaar over deze groep zegt?',
    ],
    followUp: [
      'Introduceer het eerste ritueel op de eerstvolgende training. Benoem expliciet dat het van de spelers zelf komt, niet van jou.',
      'Check de rituelenafspraken na vier weken: zijn ze nog actief? Zo niet, bespreek dit open en zonder oordeel.',
      'Gebruik het "ik zie, ik voel, ik vraag"-model zelf in je gesprekken met spelers. Zo normaliseer je het buiten de sessie.',
      'Plan een korte terugblik op de reeks na zes weken: wat is er veranderd? Wat niet? Plan het nu al in.',
    ],
  },
];

// ---------------------------------------------------------------------------
// COACH CONTENT — EN
// ---------------------------------------------------------------------------
const coachEN = [
  {
    s: 1,
    title: 'Who are we?',
    subtitle: 'Short culture track: session 1 of 2',
    intro: PROGRAM_INTRO_EN,
    coachTips: COACH_TIPS_EN,
    objectives: [
      'Players name three values the team wants to show this season',
      'Players decide together what to keep as a team and what to let go',
      'Each player records a personal, signed promise to the team',
    ],
    watchOut: [
      'Do not let the discussion slide into complaining about last season. Redirect toward who you want to be.',
      'Never force anyone to share. Voluntary participation keeps safety high and answers honest.',
      'Guard the time: each exercise has a target time. Short and sharp beats long and vague.',
    ],
    science: [
      'Cameron & Quinn (2011): teams that consciously name their culture perform more stably under pressure than teams that do not.',
      'Tod et al. (2011): public commitment, such as signing, increases adherence to behavioral agreements.',
      'Carron & Eys (2012): shared identity is the strongest predictor of team cohesion across a full season.',
    ],
    exerciseDetails: [
      {
        title: 'Three words for our team',
        tijd: '⏱ 10 min',
        explanation: 'Players make explicit what culture means to them in behavior. By starting individually before sharing, you avoid groupthink and everyone hears their own voice first.',
        script: '"You have two minutes to write alone. No talking. Three words you want people to say about our team. Not about standings, but about our behavior and character."',
        tips: [
          'Go first: share your own words before asking the group. This normalizes vulnerability and raises the quality of their answers.',
          'Link the chosen words to concrete moments: "When did you show this last year, and when did you not?"',
          'Combine the most chosen words into three team words. Take a quick vote with a show of hands.',
        ],
        scenarios: [
          'Scenario A: almost everyone chooses the same word, e.g. "honesty". Ask: "When was that really there, and when did you miss it?" This brings the word to life instead of keeping it abstract.',
          'Scenario B: players choose very different words. Say: "You choose different words but they all point to how you treat each other." Find the common thread together.',
        ],
        pitfalls: [
          'Moving too quickly to group discussion before everyone has written individually. Groupthink kills honesty.',
          'Accepting words about results. "Champions" is not a culture word. Redirect to behavior: "How do you behave like a champion?"',
        ],
        faq: [
          { q: 'Does it have to be exactly three words?', a: 'No. If a player finds one perfect word, that is fine. It is about quality, not quantity.' },
          { q: 'What if players choose very different words?', a: 'That is valuable. Show the differences and look together for what connects the words in behavior.' },
        ],
      },
      {
        title: 'Culture anchors',
        tijd: '⏱ 12 min',
        explanation: 'Teams that consciously name what they want to keep and let go break unhelpful behavior faster. The two columns make change concrete and steer the conversation forward.',
        script: '"Think about last season. Left side: what do we want to keep as a team — behaviors, habits, moments. Right side: what do we consciously leave behind? Two minutes writing, then a short discussion."',
        tips: [
          'Redirect if "let go" becomes a complaint session. Ask: "What do we agree on so this is different this season?"',
          'Make each item concrete in visible behavior: not "more discipline," but "we hold each other accountable when someone is late."',
        ],
        scenarios: [
          'Scenario A: a player wants to let go of "grumbling on the bench." Ask: "What do you do instead when you are frustrated?" This gives direction to the new behavior.',
          'Scenario B: the group wants to let go of almost everything. Ask: "Was there really nothing positive last year?" This rebalances and gives recognition too.',
        ],
        pitfalls: [
          'Letting go becomes a complaint session instead of a forward look. Actively redirect if this happens.',
          'Culture anchors stay vague. Help make each one concrete: "What does this look like as visible behavior at practice?"',
        ],
        faq: [
          { q: 'How do you "let go" of something as a team concretely?', a: 'By agreeing on a new behavior that replaces the old one. Not "less negativity," but "we build each other up after every mistake."' },
          { q: 'What if players disagree on what to let go?', a: 'Let them briefly explain why they want to keep something. Then vote. The conversation itself is already valuable.' },
        ],
      },
      {
        title: 'Sign the team contract',
        tijd: '⏱ 8 min',
        explanation: 'Public commitment through signing increases the chance that players actually follow through. A contract players wrote themselves works stronger than rules handed down from above.',
        script: '"Write down three concrete promises you make to the team this season. Make them measurable: something you can check yourself. Then sign with name and date."',
        tips: [
          'Help players move from vague to concrete. "Work harder" → "I am the first to encourage a teammate after a mistake."',
          'After writing, ask two players to read their promise out loud. This raises commitment for everyone.',
          'Keep the contracts and bring them back midseason for an explicit check-in.',
        ],
        scenarios: [
          'Scenario A: a player writes a vague promise. Ask: "How will you know in three months if you did this?" Help make it more specific.',
          'Scenario B: a player hesitates and writes nothing. Sit next to them: "What is one thing you want to contribute to this team this season?" Start small.',
        ],
        pitfalls: [
          'Accepting promises that cannot be checked. "I promise to be a better teammate" will fade within a week.',
          'Forgetting to follow up on the contracts. A contract without follow-up is decoration. Plan the check-in now.',
        ],
        faq: [
          { q: 'What if I do not keep my promise?', a: 'That is human. What matters is that you acknowledge it and start again. Talk about it with your coach or a teammate.' },
          { q: 'Do I really have to write three promises?', a: 'No. One strong, concrete promise is worth more than three vague ones. Quality matters more than quantity.' },
        ],
      },
    ],
    questions: [
      'Which word did almost everyone choose, and what does that say about who you already are as a team?',
      'What is personally hardest for you to let go of this season, and why?',
      'Which promise do you dare to say out loud in front of the whole team?',
      'How do you make sure this contract is not forgotten after today?',
    ],
    followUp: [
      'Keep the signed contracts and bring them back midseason: "What did you promise, and how is it going?"',
      'Display the three culture words visibly in the locker room. Actively refer to them at evaluation moments.',
      'In the coming week, name at least twice concrete behavior you observe that fits the culture anchors: "This is exactly what we meant."',
      'Plan a check-in after six weeks: players reread their promise and score how well they kept it.',
    ],
  },
  {
    s: 2,
    title: 'How do we work?',
    subtitle: 'Short culture track: session 2 of 2',
    intro: PROGRAM_INTRO_EN,
    coachTips: COACH_TIPS_EN,
    objectives: [
      'Players map how safe they feel in the team',
      'Players practice holding each other accountable without damaging the relationship',
      'Players choose rituals that keep the culture alive every week',
    ],
    watchOut: [
      'The trust barometer can be sensitive after a hard period. Listen first, ask questions later.',
      'Do not skip modeling the "I see, I feel, I ask" exercise. Players need to see the format before they try it.',
      'Keep rituals small. A ritual that feels like a burden disappears within two weeks.',
    ],
    science: [
      'Edmondson (1999): psychological safety is a strong predictor of team performance under uncertainty.',
      'Eys et al. (2015): the "I see, I feel, I ask" model reduces aggressive language in conversations.',
      'Lencioni (2002): conflict avoidance is a team dysfunction. Healthy conflict is a sign of trust.',
    ],
    exerciseDetails: [
      {
        title: 'Trust barometer',
        tijd: '⏱ 10 min',
        explanation: 'Players make explicit how safe they feel in four concrete situations. This makes an invisible group dynamic visible and gives language to what would otherwise go unspoken.',
        script: '"Give an honest score from 1 to 10 for each situation. No right or wrong. No one has to show their scores if they do not want to. Two minutes to write."',
        tips: [
          'Calibrate first: "If 10 means you dare to share everything, what is a 5 for your team?" This gives scores more meaning.',
          'Shift from diagnosis to action: if many score low, ask: "What needs to change for you to score one point higher?"',
          'No one is required to show scores. Voluntary sharing makes it safer to be honest.',
        ],
        scenarios: [
          'Scenario A: almost everyone scores low on "daring to admit mistakes." Ask: "What makes this not feel safe here?" Look for the first small step, not the perfect solution.',
          'Scenario B: one player openly shares a low score. Respond without judgment: "Thank you for sharing this. It helps us as a team."',
          'Scenario C: the team just had a bad game. Expect low scores. Listen first, ask questions later.',
        ],
        pitfalls: [
          'Using the barometer to judge the team instead of as a starting point for conversation.',
          'Encouraging players to show scores when the group does not feel safe enough yet. Compulsory sharing kills trust.',
        ],
        faq: [
          { q: 'What if no one wants to share their scores?', a: 'That is a signal. Discuss anonymously: "What needs to change so we can share this?" The process is more valuable than the numbers.' },
          { q: 'Are low scores bad?', a: 'No. A low score that gets spoken out loud is an opportunity to grow. Scores that never get discussed are the real problem.' },
        ],
      },
      {
        title: 'The difficult conversation',
        tijd: '⏱ 12 min',
        explanation: 'Players practice a model that separates observation, feeling, and request from attack and accusation. This way they dare to have difficult conversations without them escalating.',
        script: '"Model this yourself first with a fictional example. Then write: I SEE (observation without interpretation), I FEEL (what it does to you), I ASK YOU TO (one concrete action). No names needed."',
        tips: [
          'Always give a complete model example before letting players write. Everyone needs to know exactly what you expect.',
          'Emphasize: I SEE is about facts, not judgments. "You are always late" is a judgment. "You were late to the last three practices by 10 minutes" is an observation.',
          'After writing, ask if anyone wants to read their text out loud. Allow anonymity if that feels safer.',
        ],
        scenarios: [
          'Scenario A: a player writes attacking "I see" statements. Gently stop them: "This is an interpretation. What did you concretely see?" Help them rewrite without judgment.',
          'Scenario B: a player wants to use the model immediately for a real tension in the team. Guide carefully: "Is this something you actually want to address, or are you just practicing?"',
        ],
        pitfalls: [
          '"I see" statements that are actually judgments. "You do not contribute" is a judgment, not an observation.',
          'Skipping the exercise because "they already know this." Knowing is not the same as being able to apply it under pressure.',
        ],
        faq: [
          { q: 'Do I always have to use this model in real conversations?', a: 'No. It is a practice tool. As it becomes familiar, you use the structure naturally without following it so strictly.' },
          { q: 'What if the other person gets angry when I address them?', a: 'Ask calmly: "I said this because I care about our team. Can I explain what I meant?" Staying calm helps more than repeating your point.' },
        ],
      },
      {
        title: 'Rituals and culture promise',
        tijd: '⏱ 10 min',
        explanation: 'Culture without rituals fades. Small, repeated actions keep culture alive, even when pressure rises. The signature symbolically and powerfully closes the track.',
        script: '"Write three rituals: one before training, one after a game, one in a difficult moment. Then write one sentence saying what you contribute to the culture of this team. Sign with name and date."',
        tips: [
          'Do not ask which ritual sounds best, but which ritual is easiest to keep up for at least eight weeks. Small and doable works; ambitious and complicated does not.',
          'Introduce the first ritual at the very next practice. Player ownership increases the chance it sticks.',
          'Actively name each ritual for the first four weeks when you see it: "This is exactly the ritual you chose."',
        ],
        scenarios: [
          'Scenario A: players propose complex rituals. Help simplify: "What is the essence of this in 30 seconds?"',
          'Scenario B: the group does not want rituals ("that feels forced"). Show a small example: "What if before every practice you name one person who did something well that week? 30 seconds, big impact."',
        ],
        pitfalls: [
          'Introducing rituals that are too complex or time-consuming. A ritual experienced as a burden disappears within two weeks.',
          'Not actively following up on rituals. New behavior needs 6-8 weeks of support before it becomes automatic.',
        ],
        faq: [
          { q: 'What if the team already forgets the ritual after a week?', a: 'That is normal. Remind them without judgment: "We agreed to name one person before practice. We do it now." Restart without drama.' },
          { q: 'Who keeps track of the rituals?', a: 'Initially you, but the aim is for players to take over. Ask who wants to take this on.' },
        ],
      },
    ],
    questions: [
      'Which of the four trust questions felt most dangerous to answer honestly, and why?',
      'Have you ever addressed someone about their behavior? What worked and what did not?',
      'Which ritual would immediately change our team, even if it only takes 30 seconds?',
      'What do you want a new teammate to say about this group five years from now?',
    ],
    followUp: [
      'Introduce the first ritual at the very next practice. Mention explicitly that it comes from the players themselves, not from you.',
      'Check the ritual agreements after four weeks: are they still active? If not, discuss this openly and without judgment.',
      'Use the "I see, I feel, I ask" model yourself in conversations with players. This makes it normal outside the session.',
      'Plan a short look-back on the track after six weeks: what changed? What did not? Plan it now.',
    ],
  },
];

// ---------------------------------------------------------------------------
// BUILDERS
// ---------------------------------------------------------------------------
function buildPlayerHTML(data, lang) {
  const isEN = lang === 'EN';
  const badge  = isEN ? 'SHORT TRACK · PLAYER' : 'VERKORTE REEKS · SPELER';
  const contd  = isEN ? 'Continued' : 'Vervolg';
  const pg     = isEN ? 'Page' : 'Pagina';

  return `<!DOCTYPE html>
<html lang="${isEN ? 'en' : 'nl'}"><head><meta charset="UTF-8"><style>${PLAYER_CSS}</style></head>
<body>
<div class="page">
  <div class="page-header">
    <div>
      <div class="session-label">${data.sessionLabel}</div>
      <h2>${data.title}</h2>
    </div>
    <div class="page-header-right">
      <div class="badge">${badge}</div>
      <div class="logo">CHARACTER <span>First</span></div>
    </div>
  </div>
  <div class="goal-box">
    <div class="goal-label">${data.goalLabel}</div>
    <ul>${data.goals.map(g => `<li>${g}</li>`).join('')}</ul>
  </div>
  <div class="intro-box">${data.intro}</div>
  ${data.page1}
  <div class="page-footer">
    <span>${EMAIL}</span>
    <span class="credit">Created by Tom Pauwaert</span>
    <span>${data.footer}, ${pg} 1/2</span>
  </div>
</div>
<div class="page">
  <div class="cont-header">
    <div class="cont-title">${data.title}: ${contd}</div>
    <div class="cont-session">${data.sessionLabel}</div>
  </div>
  ${data.page2}
  <div class="quote-wrap">
    <div class="quote-block">
      <p>${data.quote}</p>
      <cite>${data.cite}</cite>
    </div>
  </div>
  <div class="page-footer">
    <span>${EMAIL}</span>
    <span class="credit">Created by Tom Pauwaert</span>
    <span>${data.footer}, ${pg} 2/2</span>
  </div>
</div>
</body></html>`;
}

function buildCoachHTML(sessions, isEN) {
  const L = isEN ? {
    coach:    'COACH GUIDE',
    progMain: 'Culture program',
    progSub:  'Coach guide · Session',
    of2:      'of 2',
    introL:   'About this program',
    objL:     'Goals of this session',
    exL:      'The exercises of this session',
    tipsL:    '5 tips to help your team in the sessions',
    watchL:   'Watch out during this session',
    sciL:     'Research basis (for reference)',
    obj:      'Objective',
    approach: 'Key coaching approach',
    watch:    'Watch out for',
    overview: 'Exercise overview',
    exHead:   'EXERCISES IN DETAIL',
    exSlug:   'Everything per exercise, in order',
    wrapHead: 'WRAPPING UP',
    wrapSlug: 'Questions, follow-up and closing',
    explain:  'Explain',
    say:      'Say:',
    tips:     'Tips',
    scen:     'Scenarios',
    pitf:     'Pitfalls',
    faq:      'FAQ',
    faqQ:     'Q',
    faqA:     'A',
    qs:       'Discussion questions to ask',
    fu:       'Follow-up in the coming weeks',
    conf:     'CONFIDENTIAL — For coaches only',
  } : {
    coach:    'COACHGIDS',
    progMain: 'Cultuur programma',
    progSub:  'Coachgids · Sessie',
    of2:      'van 2',
    introL:   'Over dit programma',
    objL:     'Doelstelling van deze sessie',
    exL:      'De oefeningen van deze sessie',
    tipsL:    '5 tips om je team te helpen in de sessies',
    watchL:   'Let op tijdens deze sessie',
    sciL:     'Wetenschappelijke basis (ter info)',
    obj:      'Doelstelling',
    approach: 'Jouw rol als coach',
    watch:    'Let op',
    overview: 'Overzicht oefeningen',
    exHead:   'OEFENINGEN IN DETAIL',
    exSlug:   'Alles per oefening, op volgorde',
    wrapHead: 'AFSLUITING EN OPVOLGING',
    wrapSlug: 'Vragen, vervolgstappen en afsluiting',
    explain:  'Uitleg',
    say:      'Zeg:',
    tips:     'Tips',
    scen:     "Scenario's",
    pitf:     'Valkuilen',
    faq:      'FAQ',
    faqQ:     'V',
    faqA:     'A',
    qs:       'Gespreksvragen om te stellen',
    fu:       'Vervolgstappen de komende weken',
    conf:     'VERTROUWELIJK — Enkel voor coaches',
  };

  const exCard = (e, i) => `
    <div class="detail-card">
      <div class="detail-header">
        <div class="activity-num">${i + 1}</div>
        <div class="detail-title">${e.title}</div>
        <div class="detail-time">${e.tijd}</div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${L.explain}</div>
        <div class="detail-val">${e.explanation}</div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${L.say}</div>
        <div class="detail-val script">${e.script}</div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${L.tips}</div>
        <div class="detail-val"><ul class="mini-list">${e.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${L.scen}</div>
        <div class="detail-val"><ul class="mini-list scenario-list">${e.scenarios.map(s => `<li>${s}</li>`).join('')}</ul></div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${L.pitf}</div>
        <div class="detail-val"><ul class="mini-list pitfall-list">${e.pitfalls.map(p => `<li>${p}</li>`).join('')}</ul></div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${L.faq}</div>
        <div class="detail-val">${e.faq.map(f => `<div class="faq-item"><span class="faq-q">${L.faqQ}: ${f.q}</span><span class="faq-a">${L.faqA}: ${f.a}</span></div>`).join('')}</div>
      </div>
    </div>`;

  const pageHeader = (d) => `
  <div class="header">
    <div class="wordmark">CHARACTER <span>First</span></div>
    <div class="program-title">
      <div class="pt-main">${L.progMain}</div>
      <div class="pt-sub">${L.progSub} ${d.s} ${L.of2}</div>
    </div>
  </div>
  <div class="divider"></div>`;

  const pageFooter = (subtitle, n) => `
  <div class="footer">
    <div class="footer-left">${EMAIL}</div>
    <div class="footer-right">${L.conf} · ${n}/3</div>
  </div>`;

  const page1Header = (d) => `
  <div class="header">
    <div class="wordmark">CHARACTER <span>First</span></div>
    <div class="program-title">
      <div class="pt-main">${L.progMain}</div>
      <div class="pt-sub">${L.progSub} ${d.s} ${L.of2}</div>
    </div>
  </div>
  <div class="divider"></div>`;

  const pages = sessions.map(d => `
<div class="page">
  ${page1Header(d)}
  <div class="p1-body">
    <div class="intro-block">
      <div class="section-label">${L.introL}</div>
      <p>${d.intro}</p>
    </div>
    <div class="objectives-block">
      <div class="section-label">${L.objL}</div>
      <ul>${d.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
    </div>
    <div class="overview-block">
      <div class="section-label">${L.exL}</div>
      <ol>${d.exerciseDetails.map(e => `<li><strong>${e.title}</strong> &mdash; ${e.tijd}</li>`).join('')}</ol>
    </div>
    <div class="coachtips-block">
      <div class="section-label">${L.tipsL}</div>
      <ol>${d.coachTips.map(t => `<li>${t}</li>`).join('')}</ol>
    </div>
    <div class="watchlist-block">
      <div class="section-label">${L.watchL}</div>
      <ul>${d.watchOut.map(w => `<li>${w}</li>`).join('')}</ul>
    </div>
    <div class="science-footnote">
      <div class="sf-label">${L.sciL}</div>
      <ul>${d.science.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  </div>
  ${pageFooter(d.subtitle, 1)}
</div>
<div class="page">
  ${pageHeader(d)}
  <div class="title-block">
    <div class="eyebrow">${L.exHead}</div>
    <div class="title" style="font-size:18px">${L.exSlug}</div>
  </div>
  <div class="detail-list">
    ${exCard(d.exerciseDetails[0], 0)}
    ${exCard(d.exerciseDetails[1], 1)}
  </div>
  ${pageFooter(d.subtitle, 2)}
</div>
<div class="page">
  ${pageHeader(d)}
  <div class="title-block">
    <div class="eyebrow">${L.wrapHead}</div>
    <div class="title" style="font-size:18px">${L.wrapSlug}</div>
  </div>
  <div class="detail-list">
    ${exCard(d.exerciseDetails[2], 2)}
  </div>
  <div class="question-block">
    <div class="section-label">${L.qs}</div>
    <ol>${d.questions.map(q => `<li>${q}</li>`).join('')}</ol>
  </div>
  <div class="followup-block">
    <div class="section-label">${L.fu}</div>
    <ol>${d.followUp.map(f => `<li>${f}</li>`).join('')}</ol>
  </div>
  ${pageFooter(d.subtitle, 3)}
</div>`).join('');

  return `<!DOCTYPE html><html lang="${isEN ? 'en' : 'nl'}"><head><meta charset="UTF-8"><style>${COACH_CSS}</style></head><body>${pages}</body></html>`;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const jobs = [
    ...playerNL.map(d => ({
      name: `CF_Cultuur_Kort_Speler_S${d.s}_NL.pdf`,
      dir: OUT_NL,
      html: buildPlayerHTML(d, 'NL'),
    })),
    ...playerEN.map(d => ({
      name: `CF_Cultuur_Kort_Speler_S${d.s}_EN.pdf`,
      dir: OUT_EN,
      html: buildPlayerHTML(d, 'EN'),
    })),
    {
      name: 'CF_Cultuur_Kort_Coach_NL.pdf',
      dir: OUT_COACH_NL,
      html: buildCoachHTML(coachNL, false),
    },
    {
      name: 'CF_Cultuur_Kort_Coach_EN.pdf',
      dir: OUT_COACH_EN,
      html: buildCoachHTML(coachEN, true),
    },
  ];

  for (const j of jobs) {
    await page.setContent(j.html, { waitUntil: 'networkidle' });
    const out = path.join(j.dir, j.name);
    await page.pdf({ path: out, format: 'A4', printBackground: true });
    console.log(`${j.name} → ${Math.round(fs.statSync(out).size / 1024)}KB`);
  }

  await browser.close();
  console.log('Done! 6 PDFs generated.');
})();
