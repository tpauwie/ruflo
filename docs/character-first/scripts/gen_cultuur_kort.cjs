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
// COACH CSS — as gen_culture_building.cjs
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
.science-block { background: rgba(47,111,176,.08); border-left: 3px solid var(--blue); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.science-block .section-label { color: var(--blue); border-color: var(--blue); }
.science-block ul { padding-left: 16px; }
.science-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 2px; }
.objective-block { background: rgba(240,90,40,.07); border-left: 3px solid var(--orange); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.objective-block .section-label { color: var(--orange); border-color: var(--orange); }
.objective-block p { font-size: 12px; color: var(--navy); line-height: 1.45; }
.tip-block { background: rgba(30,138,91,.08); border-left: 3px solid var(--green); border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.tip-block .section-label { color: var(--green); border-color: var(--green); }
.tip-block p { font-size: 11px; color: var(--navy); line-height: 1.4; }
.warn-block { background: rgba(192,57,43,.08); border-left: 3px solid #c0392b; border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.warn-block .section-label { color: #c0392b; border-color: #c0392b; }
.warn-block p { font-size: 11px; color: var(--navy); line-height: 1.4; }
.footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 5px; flex-shrink: 0; margin-top: auto; }
.footer-left, .footer-right { font-size: 9px; color: var(--stone); }
.help-block { background: rgba(30,138,91,.08); border-left: 3px solid var(--green); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.help-block .section-label { color: var(--green); border-color: var(--green); }
.help-block ol { padding-left: 16px; }
.help-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 3px; }
.question-block { background: rgba(47,111,176,.08); border-left: 3px solid var(--blue); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.question-block .section-label { color: var(--blue); border-color: var(--blue); }
.question-block ol { padding-left: 16px; }
.question-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 3px; font-style: italic; }
.followup-block { background: rgba(240,90,40,.07); border-left: 3px solid var(--orange); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.followup-block .section-label { color: var(--orange); border-color: var(--orange); }
.followup-block ol { padding-left: 16px; }
.followup-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 3px; }
.pitfall-block { background: rgba(192,57,43,.08); border-left: 3px solid #c0392b; border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.pitfall-block .section-label { color: #c0392b; border-color: #c0392b; }
.pitfall-block ul { padding-left: 16px; }
.pitfall-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 3px; }
.detail-list { display: flex; flex-direction: column; gap: 7px; }
.detail-card { border: 1.5px solid var(--line); border-radius: 8px; padding: 8px 12px; background: #fff; flex-shrink: 0; }
.detail-header { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.detail-title { font-family: Arial Black, Arial, sans-serif; font-size: 12.5px; font-weight: 900; color: var(--navy); flex: 1; }
.detail-time { font-size: 9.5px; color: var(--stone); font-weight: 700; white-space: nowrap; }
.detail-row { display: grid; grid-template-columns: 78px 1fr; gap: 6px; margin-bottom: 4px; }
.detail-row:last-child { margin-bottom: 0; }
.detail-key { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--stone); padding-top: 1px; }
.detail-val { font-size: 10.3px; color: #333; line-height: 1.4; }
.detail-val.script { font-style: italic; color: var(--blue); }
.detail-val.example { color: var(--green); }
.activity-num { width: 21px; height: 21px; border-radius: 50%; background: var(--navy); color: #fff; font-size: 11px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: Arial Black, Arial, sans-serif; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

// ---------------------------------------------------------------------------
// PLAYER CONTENT — NL
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
// PLAYER CONTENT — EN
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
// COACH CONTENT — NL
// ---------------------------------------------------------------------------
const coachNL = [
  {
    s: 1,
    title: 'Wie zijn wij?',
    subtitle: 'Verkorte cultuurreeks: sessie 1 van 2',
    science: [
      'Cameron & Quinn (2011): teams die hun cultuur bewust benoemen, presteren stabieler onder druk dan teams die dit niet doen',
      'Baumeister & Leary (1995): sociale verbondenheid is een basisbehoefte. Cultuurafspraken versterken die verbondenheid op teamniveau',
      'Tod et al. (2011): publieke commitment, zoals ondertekenen, verhoogt naleving van gedragsafspraken met 30-40%',
      'Carron & Eys (2012): gedeelde identiteit is de sterkste voorspeller van teamcohesie en prestatiemotivatie over een heel seizoen',
    ],
    objective: 'Spelers benoemen wat hen bindt als team. Ze formuleren cultuurankers en leggen hun persoonlijke belofte vast. Dit is de basis voor alle samenwerking die volgt.',
    tip: 'Begin zelf: deel jouw drie woorden voor het team voor je de spelers vraagt. Dit normaliseert kwetsbaarheid en verhoogt de kwaliteit van hun antwoorden aanzienlijk.',
    warn: 'Laat de groepsdiscussie over cultuurankers niet vervallen tot een klaagmoment over het vorige seizoen. Stuur actief bij als de toon te negatief wordt. De focus is vooruitkijken.',
    exerciseDetails: [
      {
        title: 'Drie woorden voor ons team',
        tijd: '⏱ 10 min',
        purpose: 'Spelers expliciteren wat cultuur voor hen concreet betekent. Door individueel te starten voor je laat delen, vermijd je groepsdenken. Iedereen hoort zijn eigen stem eerst.',
        instructions: '"Je krijgt twee minuten om alleen te schrijven. Geen overleg. Schrijf drie woorden op die jij wil dat mensen over ons team zeggen. Niet over het klassement, maar over ons gedrag en karakter. Er is geen goed of fout antwoord."',
        example: 'Drie spelers schrijven "eerlijkheid", "vechtlust", "plezier". Vraag: "Wanneer hebben we dit het afgelopen jaar getoond?" en "Wanneer niet?" Zo worden de woorden tastbaar in plaats van abstract. Combineer daarna de meest gekozen woorden tot drie teamwoorden.',
      },
      {
        title: 'Cultuurankers',
        tijd: '⏱ 12 min',
        purpose: 'Teams die bewust benoemen wat ze willen bewaren én loslaten, brengen positief gedrag sneller terug en breken minder snel terug met oud gedrag dat niet diende. Dit maakt de verandering concreet.',
        instructions: '"Denk aan vorig seizoen. Links: schrijf op wat we willen behouden als team, gedrag, gewoontes, momenten. Rechts: wat laten we bewust achter? Wat paste niet bij wie we willen zijn? Twee minuten schrijven, dan korte bespreking."',
        example: 'Een team schrijft "houden: we staan voor elkaar na een fout", "loslaten: mopperen op de bank als je niet speelt." Bespreek plenair: "Hoe zorgen we dat we dit loslaten? Wat is onze concrete afspraak?" Maak het niet vaag maar in gedrag.',
      },
      {
        title: 'Teamcontract ondertekenen',
        tijd: '⏱ 8 min',
        purpose: 'Publieke commitment via handtekening verhoogt de kans dat spelers gedragsafspraken écht nakomen. Een contract dat spelers zelf schreven werkt sterker dan regels van bovenaf. De handtekening maakt het serieus.',
        instructions: '"Schrijf drie concrete beloftes die jij dit seizoen aan het team doet. Niet vaag, maar meetbaar: iets wat je zelf kunt checken. Onderteken daarna met naam en datum."',
        example: 'In plaats van "ik beloof een betere teamspeler te zijn", help de speler naar iets concreets: "ik beloof de eerste te zijn die een teamgenoot aanmoedigt na een fout" of "ik beloof altijd op tijd te zijn, ook voor informele trainingen." Vraag na het schrijven aan twee spelers om hun belofte hardop voor te lezen.',
      },
    ],
    helpTips: [
      'Bouw de groepsdiscussie in twee stappen: eerst individueel schrijven (2 min), dan pas delen. Zo hoort iedereen zijn eigen stem vóór die van de groep, en vermijd je dat één stem de rest bepaalt.',
      'Gebruik de gekozen cultuurwoorden actief de rest van het seizoen. "Dit is precies wat doorzetting betekent" maakt cultuur tastbaar in het moment. Benoem het concreet als je het ziet.',
      'Benoem expliciet het verschil tussen een cultuuranker en een wedstrijddoel. Spelers verwarren dit soms. Cultuurankers gaan over gedrag, niet over titels of scores.',
      'Check bij het ondertekenen of beloftes concreet genoeg zijn. Als je een belofte niet kunt controleren over drie maanden, is ze te vaag. Help de speler haar concreter te maken.',
      'Laat minstens 5 minuten staan na het ondertekenen voor een rustige landing. Een moment van stilte, voor je verder gaat met het programma. Dit laat de betekenis landen.',
    ],
    questions: [
      'Welk woord koos bijna iedereen, en wat zegt dat over wie jullie al zijn als team?',
      'Wat loslaten is voor jou persoonlijk het moeilijkst dit seizoen, en waarom?',
      'Welke belofte durf je hardop uit te spreken voor het hele team?',
      'Wanneer was er vorig seizoen een moment dat jullie cultuur écht klopte? Wat maakte dat moment anders?',
      'Hoe zorg je ervoor dat dit contract niet vergeten wordt na vandaag?',
    ],
    followUp: [
      'Verzamel de ondertekende contracten en maak een foto. Breng ze halverwege het seizoen terug bij een expliciete check-in: "wat heb je beloofd, en hoe gaat het?"',
      'Hang de drie cultuurwoorden zichtbaar op in de kleedkamer of zet ze in de teamapp. Verwijs er actief naar bij evaluatiemomenten.',
      'Verwijs in de week na de sessie minstens twee keer naar concreet gedrag dat je observeert en dat bij de cultuurankers past. "Dit is precies wat we bedoelden."',
      'Plan een check-in na zes weken: laat spelers hun eigen belofte herlezen en scoren van 1 tot 10 hoe goed ze die tot nu toe hebben nagekomen.',
    ],
    pitfalls: [
      'De groepsdiscussie te snel starten voordat iedereen individueel heeft nagedacht. Groepsdenken neemt dan de individuele stem over, en je verliest de eerlijkheid die je net nodig hebt.',
      'Cultuurankers bespreken als een klaagmoment over het vorige seizoen in plaats van een vooruitkijk naar wat jullie willen zijn. Stuur bij als de toon te negatief wordt.',
      'Beloftes accepteren die te vaag zijn. "Ik beloof harder te werken" is niet meetbaar en zal vervliegen. Help elke speler naar één concrete, zichtbare belofte.',
      'Het ondertekende contract vergeten op te volgen. Een contract zonder follow-up is een decoratie, geen afspraak. Plan de terugkoppeling nu al in.',
    ],
  },
  {
    s: 2,
    title: 'Hoe werken wij?',
    subtitle: 'Verkorte cultuurreeks: sessie 2 van 2',
    science: [
      'Edmondson (1999): psychologische veiligheid, het gevoel dat je fouten mag maken, is de sterkste voorspeller van teamprestaties in omgevingen met onzekerheid',
      'Eys et al. (2015): het "ik zie, ik voel, ik vraag"-model vermindert aanvallig taalgebruik en verhoogt de kans op een constructief gesprek significant',
      'Walsh et al. (2020): rituelen in sportteams verhogen groepscohesie en verminderen prestatieangst bij spelers, ook bij jonge sporters',
      'Lencioni (2002): conflictvermijding is de tweede disfunctie van teams. Gezond conflict is een teken van vertrouwen, niet van zwakte',
    ],
    objective: 'Spelers leren hoe veilig ze zich voelen, oefenen een concreet aanspreekinstrument, en vertalen cultuur naar dagelijkse rituelen. Dit sluit de verkorte reeks af met actie.',
    tip: 'Modelleer de "ik zie, ik voel, ik vraag"-oefening zelf eerst. Geef een fictief maar herkenbaar voorbeeld voor de hele groep voor je de spelers laat starten. Zo weten ze exact welk format je verwacht.',
    warn: 'De vertrouwensbarometer kan gevoelig liggen als het team net een moeilijke periode achter de rug heeft. Wees klaar om te luisteren. Wijs erop dat er geen "juiste" score bestaat en dat niemand zijn scores hoeft te tonen.',
    exerciseDetails: [
      {
        title: 'Vertrouwensbarometer',
        tijd: '⏱ 10 min',
        purpose: 'Spelers expliciteren hoe veilig ze zich voelen in vier concrete situaties. Dit maakt een onzichtbare groepsdynamiek zichtbaar en geeft taal aan iets wat anders onbesproken blijft. Het is een diagnose, geen oordeel.',
        instructions: '"Geef eerlijk een score van 1 tot 10 voor elke situatie. Er is geen juist of fout. Niemand hoeft zijn scores te tonen als hij dat niet wil. Neem twee minuten om te schrijven. Daarna kan je kort toelichten als je wil, maar het hoeft niet."',
        example: 'Als de meeste spelers een 4 of lager scoren op "ik durf fouten toe te geven", zeg: "Wat zou er moeten veranderen zodat jullie morgen een 6 scoren?" Zo verschuif je van diagnose naar actie. Zoek naar het eerste kleine stapje, niet de perfecte oplossing.',
      },
      {
        title: 'Het moeilijke gesprek',
        tijd: '⏱ 12 min',
        purpose: 'Spelers oefenen een concreet communicatiemodel dat observatie, gevoel en verzoek scheidt van aanval en beschuldiging. Zo durven ze moeilijke gesprekken voeren zonder dat die escaleren tot conflict.',
        instructions: '"Modelleer dit eerst zelf met een fictief voorbeeld. Schrijf daarna: IK ZIE (wat je concreet observeert, zonder interpretatie), IK VOEL (wat dat bij jou doet, zonder beschuldiging), IK VRAAG JE OM (één concrete, uitvoerbare actie). Geen namen nodig op papier."',
        example: 'Fout: "Je bent altijd te laat." Goed: IK ZIE: "jij komt de laatste weken 10 minuten te laat op training." IK VOEL: "dat maakt me onzeker over onze afspraken als team." IK VRAAG JE OM: "op tijd te komen, of me vooraf te berichten als het niet lukt." Lees dit voor de hele groep voor je ze laat schrijven.',
      },
      {
        title: 'Rituelen en cultuurbelofte',
        tijd: '⏱ 10 min',
        purpose: 'Cultuur zonder rituelen vervliegt. Kleine, herhaalde acties houden cultuur levend, ook als de druk toeneemt. De handtekening sluit de verkorte reeks symbolisch en krachtig af.',
        instructions: '"Schrijf drie rituelen op: één voor de training, één na een wedstrijd, één bij een moeilijk moment. Daarna: schrijf één zin die zegt wat jij bijdraagt aan de cultuur van dit team. Onderteken met naam en datum."',
        example: 'Rituelen hoeven klein te zijn: "voor elke training zeggen we één naam die het die week goed deed." Dat kost 30 seconden en creëert verbondenheid. Bespreek plenair welk ritueel de meeste impact zou hebben en prik er één dat jullie volgende week al invoeren.',
      },
    ],
    helpTips: [
      'Start de vertrouwensbarometer met een kalibratie: "als 10 betekent dat je alles durft delen, wat is dan een 5 voor jullie team?" Zo krijgen de scores meer betekenis en vergelijkbaarheid.',
      'Modelleer de "ik zie, ik voel, ik vraag"-oefening zelf met een fictief voorbeeld. Gebruik een situatie die herkenbaar is maar niemand rechtstreeks viseert. Dan durven de spelers ook oefenen.',
      'Bij de rituelen: vraag niet welk ritueel het leukst klinkt, maar welk ritueel het makkelijkst minstens 8 weken vol te houden is. Haalbaar en klein slaat aan, ambitieus en ingewikkeld niet.',
      'Sluit de sessie af met een cirkel: elke speler zegt in één zin wat hij meeneemt. Geen discussie achteraf, gewoon luisteren. Dit verankert de sessie individueel.',
      'Volg de rituelen de eerste vier weken actief op. Benoem ze, ook als je ze ziet: "dit is precies het ritueel dat jullie kozen." Rituelen die niet begeleid worden verdwijnen na twee weken.',
    ],
    questions: [
      'Welke van de vier vertrouwensvragen voelde het gevaarlijkst om eerlijk te beantwoorden, en waarom?',
      'Heb je ooit iemand aangesproken op gedrag? Wat werkte en wat werkte niet?',
      'Welk ritueel zou ons team direct veranderen, ook als het maar 30 seconden duurt per keer?',
      'Wanneer voelde de sfeer in dit team het best? Wat maakte dat moment anders?',
      'Wat wil jij dat een nieuw teamlid over vijf jaar over deze groep zegt?',
    ],
    followUp: [
      'Introduceer het eerste ritueel op de eerstvolgende training. Benoem expliciet dat dit afkomstig is van de spelers zelf, niet van jou als coach. Eigenaarschap zit bij het team.',
      'Check de rituelenafspraken na vier weken: zijn ze nog actief? Zo niet, wat hield ze tegen? Bespreek dit kort en open, zonder oordeel.',
      'Gebruik het "ik zie, ik voel, ik vraag"-model zelf als je een moeilijk gesprek hebt met een speler. Zo modelleer je het ook buiten de sessie en maak je het normaal.',
      'Plan een korte terugblik op de verkorte reeks na zes weken: wat is er veranderd? Wat haalden jullie niet? Plan nu al wanneer je dit doet.',
    ],
    pitfalls: [
      'De vertrouwensbarometer gebruiken als diagnostisch instrument om te oordelen over het team, in plaats van als startpunt voor een gesprek over wat beter kan.',
      'De "ik zie, ik voel, ik vraag"-oefening overslaan omdat "ze dit al kennen." Kennen is niet hetzelfde als kunnen toepassen onder druk. Oefen het altijd.',
      'Rituelen invoeren die te ingewikkeld of tijdsintensief zijn. Een ritueel dat spelers als last ervaren, verdwijnt binnen twee weken. Klein en consistent werkt.',
      'De reeks afsluiten zonder een concrete vervolgstap of datum voor een check-in. Zonder follow-up vervaagt alles wat jullie vandaag gebouwd hebben. Plan het nu al in.',
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
    science: [
      'Cameron & Quinn (2011): teams that consciously name their culture perform more stably under pressure than teams that do not',
      'Baumeister & Leary (1995): social belonging is a basic need. Culture agreements strengthen that belonging at the team level',
      'Tod et al. (2011): public commitment, such as signing, increases adherence to behavioral agreements by 30-40%',
      'Carron & Eys (2012): shared identity is the strongest predictor of team cohesion and performance motivation across a full season',
    ],
    objective: 'Players name what binds them as a team. They formulate culture anchors and record their personal promise. This is the foundation for all the collaboration that follows.',
    tip: 'Go first: share your own three words for the team before asking the players. This normalizes vulnerability and significantly raises the quality of their answers.',
    warn: 'Do not let the group discussion on culture anchors become a complaint session about last season. Actively redirect if the tone gets too negative. The focus is looking ahead.',
    exerciseDetails: [
      {
        title: 'Three words for our team',
        tijd: '⏱ 10 min',
        purpose: 'Players make explicit what culture means to them concretely. By starting individually before sharing, you avoid groupthink. Everyone hears their own voice first.',
        instructions: '"You have two minutes to write alone. No talking. Write down three words you want people to say about our team. Not about standings, but about our behavior and character. There is no right or wrong answer."',
        example: 'Three players write "honesty", "fight", "fun". Ask: "When did we show this last year?" and "When did we not?" This makes the words tangible instead of abstract. Then combine the most chosen words into three team words.',
      },
      {
        title: 'Culture anchors',
        tijd: '⏱ 12 min',
        purpose: 'Teams that consciously name what they want to keep and let go bring positive behavior back faster and break less easily with old behavior that did not serve them. This makes change concrete.',
        instructions: '"Think about last season. Left side: write what we want to keep as a team, behaviors, habits, moments. Right side: what do we consciously leave behind? What did not fit who we want to be? Two minutes writing, then a short discussion."',
        example: 'A team writes "keep: we stand up for each other after a mistake", "let go: grumbling on the bench when you do not play." Discuss as a group: "How do we make sure we let this go? What is our concrete agreement?" Keep it in behavior, not vague intention.',
      },
      {
        title: 'Sign the team contract',
        tijd: '⏱ 8 min',
        purpose: 'Public commitment through signing increases the chance that players actually keep their behavioral agreements. A contract players wrote themselves works stronger than rules handed down from above. The signature makes it serious.',
        instructions: '"Write down three concrete promises you make to the team this season. Not vague, but measurable: something you can check yourself. Then sign with name and date."',
        example: 'Instead of "I promise to be a better teammate," help the player toward something concrete: "I promise to be the first to encourage a teammate after a mistake" or "I promise to always be on time, even for informal practices." Ask two players to read their promise out loud after writing.',
      },
    ],
    helpTips: [
      'Build the group discussion in two steps: first individual writing (2 min), then sharing. This way everyone hears their own voice before the group\'s, and you avoid one voice determining the rest.',
      'Use the chosen culture words actively for the rest of the season. "This is exactly what perseverance means" makes culture tangible in the moment. Name it concretely when you see it.',
      'Explicitly name the difference between a culture anchor and a match goal. Players sometimes confuse these. Culture anchors are about behavior, not titles or scores.',
      'When signing, check if promises are concrete enough. If you cannot check a promise three months from now, it is too vague. Help the player make it more specific.',
      'Leave at least 5 minutes after signing for a calm landing. A moment of quiet before moving on. This lets the meaning settle.',
    ],
    questions: [
      'Which word did almost everyone choose, and what does that say about who you already are as a team?',
      'What is personally hardest for you to let go of this season, and why?',
      'Which promise do you dare to say out loud in front of the whole team?',
      'When was there a moment last season where your culture really clicked? What made that moment different?',
      'How do you make sure this contract is not forgotten after today?',
    ],
    followUp: [
      'Collect the signed contracts and take a photo. Bring them back midseason at an explicit check-in: "what did you promise, and how is it going?"',
      'Display the three culture words visibly in the locker room or put them in the team app. Actively refer to them at evaluation moments.',
      'In the week after the session, name at least twice concrete behavior you observe that fits the culture anchors. "This is exactly what we meant."',
      'Plan a check-in after six weeks: have players reread their own promise and score from 1 to 10 how well they have kept it so far.',
    ],
    pitfalls: [
      'Starting the group discussion too quickly before everyone has thought individually. Groupthink then takes over the individual voice, and you lose the honesty you need.',
      'Discussing culture anchors as a complaint session about last season instead of a forward look at who you want to be. Redirect if the tone gets too negative.',
      'Accepting promises that are too vague. "I promise to work harder" is not measurable and will fade. Help every player toward one concrete, visible promise.',
      'Forgetting to follow up on the signed contract. A contract without follow-up is decoration, not an agreement. Plan the follow-up now.',
    ],
  },
  {
    s: 2,
    title: 'How do we work?',
    subtitle: 'Short culture track: session 2 of 2',
    science: [
      'Edmondson (1999): psychological safety, the feeling that you can make mistakes, is the strongest predictor of team performance in uncertain environments',
      'Eys et al. (2015): the "I see, I feel, I ask" model significantly reduces aggressive language and raises the chance of a constructive conversation',
      'Walsh et al. (2020): rituals in sports teams increase group cohesion and reduce performance anxiety in players, including young athletes',
      'Lencioni (2002): avoidance of conflict is the second dysfunction of teams. Healthy conflict is a sign of trust, not weakness',
    ],
    objective: 'Players learn how safe they feel, practice a concrete accountability tool, and translate culture into daily rituals. This closes the short track with action.',
    tip: 'Model the "I see, I feel, I ask" exercise yourself first. Give a fictional but recognizable example in front of the whole group before letting players start. This way they know exactly what format you expect.',
    warn: 'The trust barometer can be sensitive if the team has just been through a difficult period. Be ready to listen. Point out that there is no "right" score and that no one has to show their scores.',
    exerciseDetails: [
      {
        title: 'Trust barometer',
        tijd: '⏱ 10 min',
        purpose: 'Players make explicit how safe they feel in four concrete situations. This makes an invisible group dynamic visible and gives language to something that would otherwise go unspoken. It is a diagnosis, not a judgment.',
        instructions: '"Give an honest score from 1 to 10 for each situation. No right or wrong. No one has to show their scores if they do not want to. Take two minutes to write. Then you can briefly explain if you want, but you do not have to."',
        example: 'If most players score a 4 or lower on "I dare to admit mistakes," say: "What would need to change for you to score a 6 tomorrow?" This shifts from diagnosis to action. Look for the first small step, not the perfect solution.',
      },
      {
        title: 'The difficult conversation',
        tijd: '⏱ 12 min',
        purpose: 'Players practice a concrete communication model that separates observation, feeling, and request from attack and accusation. This way they dare to have difficult conversations without them escalating into conflict.',
        instructions: '"Model this yourself first with a fictional example. Then write: I SEE (what you concretely observe, without interpretation), I FEEL (what it does to you, without accusation), I ASK YOU TO (one concrete, doable action). No names needed on paper."',
        example: 'Wrong: "You are always late." Right: I SEE: "you have been 10 minutes late to practice the last few weeks." I FEEL: "that makes me uncertain about our agreements as a team." I ASK YOU TO: "be on time, or let me know in advance if you cannot." Read this out loud to the whole group before they start writing.',
      },
      {
        title: 'Rituals and culture promise',
        tijd: '⏱ 10 min',
        purpose: 'Culture without rituals fades. Small, repeated actions keep culture alive, even when pressure rises. The signature symbolically and powerfully closes the short track.',
        instructions: '"Write three rituals: one before training, one after a game, one in a difficult moment. Then write one sentence that says what you contribute to the culture of this team. Sign with name and date."',
        example: 'Rituals can be tiny: "before every practice we name one person who did something well that week." That takes 30 seconds and creates connection. Discuss as a group which ritual would have the most impact and pick one to start next week.',
      },
    ],
    helpTips: [
      'Start the trust barometer with a calibration: "if 10 means you dare to share everything, what is a 5 for your team?" This gives scores more meaning and makes them comparable.',
      'Model the "I see, I feel, I ask" exercise yourself with a fictional example. Use a situation that is recognizable but does not directly target anyone. Then players dare to practice too.',
      'For rituals: do not ask which ritual sounds best, but which ritual is easiest to keep up for at least 8 weeks. Small and doable lands, ambitious and complicated does not.',
      'Close the session with a circle: each player says in one sentence what they take away. No discussion afterward, just listening. This anchors the session individually.',
      'Follow up on rituals actively for the first four weeks. Name them when you see them: "this is exactly the ritual you chose." Rituals that are not supported disappear within two weeks.',
    ],
    questions: [
      'Which of the four trust questions felt most dangerous to answer honestly, and why?',
      'Have you ever addressed someone about their behavior? What worked and what did not?',
      'Which ritual would immediately change our team, even if it only takes 30 seconds each time?',
      'When did the atmosphere in this team feel best? What made that moment different?',
      'What do you want a new teammate to say about this group five years from now?',
    ],
    followUp: [
      'Introduce the first ritual at the very next practice. Explicitly name that it comes from the players themselves, not from you as coach. Ownership belongs to the team.',
      'Check the ritual agreements after four weeks: are they still active? If not, what held them back? Discuss this briefly and openly, without judgment.',
      'Use the "I see, I feel, I ask" model yourself when you have a difficult conversation with a player. This models it outside the session and makes it normal.',
      'Plan a short look-back on the short track after six weeks: what changed? What did not happen? Plan now when you will do this.',
    ],
    pitfalls: [
      'Using the trust barometer as a diagnostic tool to judge the team, instead of as a starting point for a conversation about what can be better.',
      'Skipping the "I see, I feel, I ask" exercise because "they already know this." Knowing is not the same as being able to apply it under pressure. Always practice it.',
      'Introducing rituals that are too complex or time-consuming. A ritual that players experience as a burden disappears within two weeks. Small and consistent works.',
      'Closing the track without a concrete next step or date for a check-in. Without follow-up, everything you built today will fade. Plan it now.',
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
  const pages = sessions.map(d => `
<div class="page">
  <div class="header">
    <div class="wordmark">CHARACTER <span>First</span></div>
    <div class="session-label">${d.subtitle}</div>
  </div>
  <div class="divider"></div>
  <div class="title-block">
    <div class="eyebrow">${isEN ? 'COACH GUIDE' : 'COACHGIDS'}</div>
    <div class="title">${d.title}</div>
  </div>
  <div class="science-block">
    <div class="section-label">${isEN ? 'Scientific basis' : 'Wetenschappelijke basis'}</div>
    <ul>${d.science.map(s => `<li>${s}</li>`).join('')}</ul>
  </div>
  <div class="objective-block">
    <div class="section-label">${isEN ? 'Objective' : 'Doelstelling'}</div>
    <p>${d.objective}</p>
  </div>
  <div class="tip-block">
    <div class="section-label">${isEN ? 'Coach tip' : 'Coach tip'}</div>
    <p>${d.tip}</p>
  </div>
  <div class="warn-block">
    <div class="section-label">${isEN ? 'Watch out for' : 'Let op'}</div>
    <p>${d.warn}</p>
  </div>
  <div class="footer">
    <div class="footer-left">${EMAIL}</div>
    <div class="footer-right">${isEN ? 'CONFIDENTIAL — For coaches only' : 'VERTROUWELIJK — Enkel voor coaches'} · 1/3</div>
  </div>
</div>
<div class="page">
  <div class="header">
    <div class="wordmark">CHARACTER <span>First</span></div>
    <div class="session-label">${d.subtitle}</div>
  </div>
  <div class="divider"></div>
  <div class="title-block">
    <div class="eyebrow">${isEN ? 'EXERCISES, ONE BY ONE' : 'OEFENINGEN, EEN VOOR EEN'}</div>
    <div class="title" style="font-size:18px">${isEN ? 'Everything per exercise, in order' : 'Alles per oefening, op volgorde'}</div>
  </div>
  <div class="detail-list">
    ${d.exerciseDetails.map((e, i) => `
    <div class="detail-card">
      <div class="detail-header">
        <div class="activity-num">${i + 1}</div>
        <div class="detail-title">${e.title}</div>
        <div class="detail-time">${e.tijd}</div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${isEN ? 'Purpose' : 'Doel'}</div>
        <div class="detail-val">${e.purpose}</div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${isEN ? 'Say to players' : 'Zeg tegen spelers'}</div>
        <div class="detail-val script">${e.instructions}</div>
      </div>
      <div class="detail-row">
        <div class="detail-key">${isEN ? 'Example' : 'Voorbeeld'}</div>
        <div class="detail-val example">${e.example}</div>
      </div>
    </div>`).join('')}
  </div>
  <div class="footer">
    <div class="footer-left">${EMAIL}</div>
    <div class="footer-right">${isEN ? 'CONFIDENTIAL — For coaches only' : 'VERTROUWELIJK — Enkel voor coaches'} · 2/3</div>
  </div>
</div>
<div class="page">
  <div class="header">
    <div class="wordmark">CHARACTER <span>First</span></div>
    <div class="session-label">${d.subtitle}</div>
  </div>
  <div class="divider"></div>
  <div class="title-block">
    <div class="eyebrow">${isEN ? 'COACHING IN DEPTH' : 'COACHING IN DE DIEPTE'}</div>
    <div class="title" style="font-size:18px">${isEN ? 'How to help your team further' : 'Hoe help je je team verder'}</div>
  </div>
  <div class="help-block">
    <div class="section-label">${isEN ? 'How to support your team' : 'Hoe ondersteun je je team'}</div>
    <ol>${d.helpTips.map(t => `<li>${t}</li>`).join('')}</ol>
  </div>
  <div class="question-block">
    <div class="section-label">${isEN ? 'Discussion questions to ask' : 'Gespreksvragen om te stellen'}</div>
    <ol>${d.questions.map(q => `<li>${q}</li>`).join('')}</ol>
  </div>
  <div class="followup-block">
    <div class="section-label">${isEN ? 'Follow-up in the coming weeks' : 'Vervolgstappen de komende weken'}</div>
    <ol>${d.followUp.map(f => `<li>${f}</li>`).join('')}</ol>
  </div>
  <div class="pitfall-block">
    <div class="section-label">${isEN ? 'Common pitfalls' : 'Veelvoorkomende valkuilen'}</div>
    <ul>${d.pitfalls.map(p => `<li>${p}</li>`).join('')}</ul>
  </div>
  <div class="footer">
    <div class="footer-left">${EMAIL}</div>
    <div class="footer-right">${isEN ? 'CONFIDENTIAL — For coaches only' : 'VERTROUWELIJK — Enkel voor coaches'} · 3/3</div>
  </div>
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
    // Player NL — one PDF per session
    ...playerNL.map(d => ({
      name: `CF_Cultuur_Kort_Speler_S${d.s}_NL.pdf`,
      dir: OUT_NL,
      html: buildPlayerHTML(d, 'NL'),
    })),
    // Player EN — one PDF per session
    ...playerEN.map(d => ({
      name: `CF_Cultuur_Kort_Speler_S${d.s}_EN.pdf`,
      dir: OUT_EN,
      html: buildPlayerHTML(d, 'EN'),
    })),
    // Coach NL — all sessions in one PDF per language
    {
      name: 'CF_Cultuur_Kort_Coach_NL.pdf',
      dir: OUT_COACH_NL,
      html: buildCoachHTML(coachNL, false),
    },
    // Coach EN
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
  console.log('Done! 8 PDFs generated.');
})();
