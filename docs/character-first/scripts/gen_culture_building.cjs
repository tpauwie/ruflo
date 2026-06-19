'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join('/home/user/ruflo/docs/character-first/werkbladen-pdf/culture-building');
fs.mkdirSync(OUT, { recursive: true });

const EMAIL = 'characterfirstbb@gmail.com';

const PLAYER_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --orange: #f05a28; --ink: #1C2433; --canvas: #FAF7F2; --line: #E4DFD6;
  --stone: #6E6A63; --gray-300: #d0d0d0; --gray-400: #999; --gray-600: #555;
  --mist: #F0ECE4; --green: #1E8A5B;
}
html, body { background: #fff; }
body { font-family: Arial, sans-serif; color: var(--ink); font-size: 12px; }
.page {
  width: 210mm; height: 297mm; overflow: hidden;
  padding: 12mm 14mm 10mm; background: var(--canvas);
  display: flex; flex-direction: column; gap: 10px;
}
.page-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid var(--orange); padding-bottom: 8px; flex-shrink: 0; }
.session-label { font-size: 0.62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); }
h2 { font-size: 1.2rem; font-weight: 900; color: var(--ink); margin-top: 2px; }
.page-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.badge { font-size: 0.58rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; letter-spacing: .08em; text-transform: uppercase; background: rgba(30,138,91,.12); color: var(--green); border: 1px solid rgba(30,138,91,.3); }
.logo { font-weight: 900; font-size: 0.7rem; color: var(--stone); letter-spacing: .06em; }
.logo span { color: var(--orange); }
.goal-box { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.goal-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--orange); margin-bottom: 4px; }
.goal-box ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
.goal-box li { font-size: 0.76rem; color: var(--gray-600); padding-left: 14px; position: relative; line-height: 1.3; }
.goal-box li::before { content: '→'; position: absolute; left: 0; color: var(--orange); font-weight: 700; }
.intro-box { background: var(--mist); border-radius: 5px; padding: 6px 12px; font-size: 0.76rem; color: var(--gray-600); font-style: italic; line-height: 1.4; flex-shrink: 0; }
.section-title { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--stone); border-bottom: 1px solid var(--line); padding-bottom: 3px; flex-shrink: 0; }
.ex { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 8px 12px; display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
.ex-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.82rem; }
.ex-num { background: var(--orange); color: #fff; width: 19px; height: 19px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.64rem; font-weight: 800; flex-shrink: 0; }
.ex-instr { font-size: 0.74rem; color: var(--gray-600); line-height: 1.4; }
.line { border-bottom: 1.5px solid var(--gray-300); height: 22px; width: 100%; }
.lines { display: flex; flex-direction: column; gap: 5px; }
.box { border: 1.5px solid var(--gray-300); border-radius: 4px; background: #fff; }
.box-xs { min-height: 36px; } .box-sm { min-height: 56px; } .box-md { min-height: 78px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.col-label { font-size: 0.68rem; font-weight: 700; margin-bottom: 4px; }
.field-label { font-size: 0.72rem; color: var(--gray-400); margin-bottom: 3px; }
.num-list { display: flex; flex-direction: column; gap: 6px; }
.num-item { display: flex; align-items: center; gap: 8px; }
.num-item .line { flex: 1; }
.sign-row { display: flex; gap: 20px; margin-top: 4px; }
.sign-field { flex: 1; }
.sign-label { font-size: 0.66rem; color: var(--gray-400); margin-bottom: 3px; }
.promise-row { display: flex; align-items: center; gap: 8px; }
.promise-label { font-size: 0.7rem; font-weight: 700; color: var(--orange); white-space: nowrap; }
.rank-row { display: flex; align-items: center; gap: 8px; font-size: 0.76rem; }
.rank-box { width: 22px; height: 22px; border: 1.5px solid var(--gray-300); border-radius: 4px; flex-shrink: 0; }
.quote-block { background: var(--ink); color: #fff; border-radius: 8px; padding: 10px 14px; border-left: 4px solid var(--orange); flex-shrink: 0; margin-top: auto; }
.quote-block p { font-size: 0.8rem; font-style: italic; line-height: 1.5; margin-bottom: 5px; }
.quote-block cite { font-size: 0.62rem; color: rgba(255,255,255,.6); font-style: normal; }
.page-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.56rem; color: var(--stone); border-top: 1px solid var(--line); padding-top: 5px; flex-shrink: 0; }
.page-footer .credit { color: var(--gray-400); }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

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
.objective-block p { font-size: 12px; color: var(--navy); line-height: 1.45; }
.activities { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.activity-card { border: 1.5px solid var(--line); border-radius: 8px; padding: 7px 12px; background: #fff; }
.activity-header { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.activity-num { width: 21px; height: 21px; border-radius: 50%; background: var(--navy); color: #fff; font-size: 11px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: Arial Black, Arial, sans-serif; }
.activity-title { font-family: Arial Black, Arial, sans-serif; font-size: 13px; font-weight: 900; color: var(--navy); }
.activity-meta { font-size: 10px; color: var(--stone); margin-bottom: 3px; }
.activity-desc { font-size: 10.5px; color: #444; line-height: 1.4; }
.tip-block { background: rgba(30,138,91,.08); border-left: 3px solid var(--green); border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.tip-block .section-label { color: var(--green); border-color: var(--green); }
.tip-block p { font-size: 11px; color: var(--navy); line-height: 1.4; }
.warn-block { background: rgba(192,57,43,.08); border-left: 3px solid #c0392b; border-radius: 6px; padding: 7px 12px; flex-shrink: 0; }
.warn-block .section-label { color: #c0392b; border-color: #c0392b; }
.warn-block p { font-size: 11px; color: var(--navy); line-height: 1.4; }
.footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 5px; flex-shrink: 0; margin-top: auto; }
.footer-left, .footer-right { font-size: 9px; color: var(--stone); }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

// ---------------------------------------------------------------------------
// PLAYER CONTENT
// ---------------------------------------------------------------------------
const playerNL = [
  {
    s: 1, title: 'Zelfkennis & Omgaan met Druk',
    sessionLabel: 'Sessie 1: spelerswerkblad', goalLabel: 'Doelstelling sessie 1',
    goals: [
      'Je benoemt de waarden die jouw gedrag op en naast het veld sturen',
      'Je herkent wie in jouw team energie geeft en wie energie kost',
      'Je bereidt je mentaal voor op een drukvolle wedstrijdsituatie',
    ],
    intro: 'Voor je een goede teamspeler kan zijn, moet je jezelf kennen. Dit werkblad helpt je stilstaan bij je waarden, je omgeving en hoe je omgaat met druk.',
    body: `
      <div class="section-title">Oefening 1: persoonlijk waardenkompas</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rangschik jouw waarden</div>
        <p class="ex-instr">Geef elke waarde een score van 1 (minst belangrijk) tot 5 (belangrijkste) voor hoe jij wil spelen en zijn in dit team.</p>
        <div style="display:flex;flex-direction:column;gap:4px">
          <div class="rank-row"><div class="rank-box"></div>Loyaliteit</div>
          <div class="rank-row"><div class="rank-box"></div>Eerlijkheid</div>
          <div class="rank-row"><div class="rank-box"></div>Moed</div>
          <div class="rank-row"><div class="rank-box"></div>Doorzetting</div>
          <div class="rank-row"><div class="rank-box"></div>Respect</div>
          <div class="rank-row"><div class="rank-box"></div>Teamgeest</div>
        </div>
      </div>
      <div class="section-title">Oefening 2: energiegever vs energieslurper</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wie geeft en wie kost energie?</div>
        <p class="ex-instr">Denk aan situaties of mensen in je team. Wat geeft jou energie? Wat kost je energie?</p>
        <div class="two-col">
          <div><div class="col-label" style="color:var(--green)">GEEFT ENERGIE</div><div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div></div>
          <div><div class="col-label" style="color:#c0392b">KOST ENERGIE</div><div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div></div>
        </div>
      </div>
      <div class="section-title">Oefening 3: worst case best case</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Voorbereiden op druk</div>
        <p class="ex-instr">Denk aan een belangrijke wedstrijd. Wat is het slechtste dat kan gebeuren? Wat is het beste? Wat is het meest waarschijnlijk?</p>
        <div class="two-col">
          <div><div class="col-label">WORST CASE</div><div class="box box-sm"></div></div>
          <div><div class="col-label">BEST CASE</div><div class="box box-sm"></div></div>
        </div>
        <div class="field-label" style="margin-top:4px">Meest waarschijnlijk</div>
        <div class="box box-xs"></div>
      </div>`,
    quote: '"The most important thing is to try and inspire people so that they can be great in whatever they want to do."',
    cite: 'Kobe Bryant, 5x NBA Champion, Los Angeles Lakers',
    footer: 'Character First, Sessie 1: Zelfkennis & Omgaan met Druk',
  },
  {
    s: 2, title: 'Mijn Rol & Team Eerst',
    sessionLabel: 'Sessie 2: spelerswerkblad', goalLabel: 'Doelstelling sessie 2',
    goals: [
      'Je herkent jouw natuurlijke rol binnen het team',
      'Je verwerkt feedback van twee teamgenoten op een constructieve manier',
      'Je legt jouw persoonlijke bijdrage aan het teamcontract vast',
    ],
    intro: 'Een sterk team draait niet om één ster, maar om spelers die hun rol kennen en elkaar versterken. Dit werkblad sluit het traject af met een concrete belofte aan je team.',
    body: `
      <div class="section-title">Oefening 1: rolcompass</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Welke rol past bij jou?</div>
        <p class="ex-instr">Geef elke rol een score van 0 tot 10, hoe sterk herken jij die in jezelf?</p>
        <div style="display:flex;flex-direction:column;gap:4px">
          <div class="rank-row"><div class="rank-box"></div>Leider, neemt initiatief en spreekt het team toe</div>
          <div class="rank-row"><div class="rank-box"></div>Motor, jaagt energie en tempo aan</div>
          <div class="rank-row"><div class="rank-box"></div>Denker, analyseert en bewaakt het plan</div>
          <div class="rank-row"><div class="rank-box"></div>Stabiele kracht, zorgt voor rust en consistentie</div>
        </div>
      </div>
      <div class="section-title">Oefening 2: na de feedbackronde trio</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wat neem je mee?</div>
        <p class="ex-instr">Na de feedbackronde in trio's: wat heb je gehoord over jouw sterke punten en groeipunten? Wat ga je ermee doen?</p>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Oefening 3: mijn bijdrage aan het team contract</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Mijn beloftes</div>
        <p class="ex-instr">Schrijf drie concrete beloftes die jij dit seizoen aan het team doet.</p>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
        </div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Handtekening</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>`,
    quote: '"The strength of the team is each individual member. The strength of each member is the team. I never tried to be the best player. I tried to be the player we needed."',
    cite: 'Phil Jackson, 11x NBA Championship coach',
    footer: 'Character First, Sessie 2: Mijn Rol & Team Eerst',
  },
];

const playerEN = [
  {
    s: 1, title: 'Self-Knowledge & Handling Pressure',
    sessionLabel: 'Session 1: player worksheet', goalLabel: 'Goal session 1',
    goals: [
      'You name the values that guide your behavior on and off the court',
      'You recognize who in your team gives energy and who drains it',
      'You mentally prepare for a high-pressure game situation',
    ],
    intro: 'Before you can be a good teammate, you need to know yourself. This worksheet helps you reflect on your values, your environment, and how you handle pressure.',
    body: `
      <div class="section-title">Exercise 1: personal values compass</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rank your values</div>
        <p class="ex-instr">Give each value a score from 1 (least important) to 5 (most important) for how you want to play and be on this team.</p>
        <div style="display:flex;flex-direction:column;gap:4px">
          <div class="rank-row"><div class="rank-box"></div>Loyalty</div>
          <div class="rank-row"><div class="rank-box"></div>Honesty</div>
          <div class="rank-row"><div class="rank-box"></div>Courage</div>
          <div class="rank-row"><div class="rank-box"></div>Perseverance</div>
          <div class="rank-row"><div class="rank-box"></div>Respect</div>
          <div class="rank-row"><div class="rank-box"></div>Team Spirit</div>
        </div>
      </div>
      <div class="section-title">Exercise 2: energy giver vs energy drainer</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Who gives and who drains energy?</div>
        <p class="ex-instr">Think of situations or people in your team. What gives you energy? What drains your energy?</p>
        <div class="two-col">
          <div><div class="col-label" style="color:var(--green)">GIVES ENERGY</div><div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div></div>
          <div><div class="col-label" style="color:#c0392b">DRAINS ENERGY</div><div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div></div>
        </div>
      </div>
      <div class="section-title">Exercise 3: worst case best case</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Preparing for pressure</div>
        <p class="ex-instr">Think of an important game. What is the worst that could happen? What is the best? What is most likely?</p>
        <div class="two-col">
          <div><div class="col-label">WORST CASE</div><div class="box box-sm"></div></div>
          <div><div class="col-label">BEST CASE</div><div class="box box-sm"></div></div>
        </div>
        <div class="field-label" style="margin-top:4px">Most likely</div>
        <div class="box box-xs"></div>
      </div>`,
    quote: '"The most important thing is to try and inspire people so that they can be great in whatever they want to do."',
    cite: 'Kobe Bryant, 5x NBA Champion, Los Angeles Lakers',
    footer: 'Character First, Session 1: Self-Knowledge & Handling Pressure',
  },
  {
    s: 2, title: 'My Role & Team First',
    sessionLabel: 'Session 2: player worksheet', goalLabel: 'Goal session 2',
    goals: [
      'You recognize your natural role within the team',
      'You process feedback from two teammates constructively',
      'You record your personal contribution to the team contract',
    ],
    intro: 'A strong team is not built around one star, but around players who know their role and strengthen each other. This worksheet closes the track with a concrete promise to your team.',
    body: `
      <div class="section-title">Exercise 1: role compass</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Which role fits you?</div>
        <p class="ex-instr">Give each role a score from 0 to 10, how strongly do you recognize it in yourself?</p>
        <div style="display:flex;flex-direction:column;gap:4px">
          <div class="rank-row"><div class="rank-box"></div>Leader, takes initiative and speaks to the team</div>
          <div class="rank-row"><div class="rank-box"></div>Engine, drives energy and pace</div>
          <div class="rank-row"><div class="rank-box"></div>Thinker, analyzes and guards the plan</div>
          <div class="rank-row"><div class="rank-box"></div>Steady Force, provides calm and consistency</div>
        </div>
      </div>
      <div class="section-title">Exercise 2: after the feedback round trio</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What do you take with you?</div>
        <p class="ex-instr">After the feedback round in trios: what did you hear about your strengths and growth points? What will you do with it?</p>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Exercise 3: my contribution to the team contract</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>My promises</div>
        <p class="ex-instr">Write three concrete promises you make to the team this season.</p>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
        </div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Signature</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>`,
    quote: '"The strength of the team is each individual member. The strength of each member is the team. I never tried to be the best player. I tried to be the player we needed."',
    cite: 'Phil Jackson, 11x NBA Championship coach',
    footer: 'Character First, Session 2: My Role & Team First',
  },
];

// ---------------------------------------------------------------------------
// COACH CONTENT
// ---------------------------------------------------------------------------
const coachNL = [
  {
    s: 1, title: 'Zelfkennis & Omgaan met Druk', subtitle: 'Sessie 1: coachgids',
    science: [
      'Ntoumanis et al. (2021): autonomie-ondersteunend coachen verhoogt intrinsieke motivatie en welzijn',
      'Zuber & Conzelmann (2014): zelfkennis bij jonge sporters voorspelt prestatie onder druk',
      'Deci & Ryan (1985, 2017): zelfdeterminatietheorie, gevoel van competentie en verbondenheid',
      'Hanton et al. (2009): mentale voorbereiding op worst-case scenario\'s vermindert wedstrijdangst',
    ],
    objective: 'Spelers leggen hun persoonlijke waarden vast, herkennen energiebronnen in hun team en bereiden zich mentaal voor op druk. Dit vormt de basis voor de rest van het traject.',
    activities: [
      { title: 'Persoonlijk waardenkompas', tijd: '8 min', desc: 'Laat spelers individueel de zes waarden rangschikken. Geen goed of fout antwoord. Vraag na: welke waarde verraste jezelf het meest?' },
      { title: 'Energiegever vs energieslurper', tijd: '10 min', desc: 'Spelers werken individueel, bespreek nadien in duo\'s. Let op: dit gaat over situaties en gedrag, niet over het afkraken van teamgenoten.' },
      { title: 'Worst case best case', tijd: '12 min', desc: 'Koppel dit aan een concrete, herkenbare wedstrijdsituatie. Bespreek plenair: wat maakt het meest waarschijnlijke scenario hanteerbaar?' },
    ],
    tip: 'Geef zelf het goede voorbeeld: deel kort jouw eigen worst case best case voor een belangrijk moment in je coachcarrière.',
    warn: 'Forceer niemand om hardop te delen. Schrijven alleen is al waardevol. Dwing geen kwetsbaarheid af.',
    timing: ['Intro & doel: 5 min', 'Oefening 1: 8 min', 'Oefening 2: 10 min', 'Oefening 3: 12 min', 'Afsluiting: 10 min'],
  },
  {
    s: 2, title: 'Mijn Rol & Team Eerst', subtitle: 'Sessie 2: coachgids',
    science: [
      'Bruner et al. (2021): rolduidelijkheid in teams hangt samen met hogere teamcohesie',
      'Eys et al. (2015): rolacceptatie voorspelt teamtevredenheid en effort',
      'Carron & Eys (2012): teamcohesie als sterkste voorspeller van teamprestatie over tijd',
      'Holt et al. (2020): peer feedback verhoogt zelfinzicht bij jeugdsporters',
      'Tod et al. (2011): publieke commitment, zoals ondertekenen, verhoogt naleving van afspraken',
    ],
    objective: 'Spelers herkennen hun natuurlijke rol, oefenen het geven en ontvangen van feedback, en leggen hun persoonlijke bijdrage aan het teamcontract vast als afsluiter van het traject.',
    activities: [
      { title: 'Rolcompass', tijd: '10 min', desc: 'Laat spelers individueel scoren, bespreek daarna in de groep welke rollen oververtegenwoordigd of onderbelicht zijn in het team.' },
      { title: 'Feedbackronde trio', tijd: '15 min', desc: 'Verdeel in trio\'s. Elke speler krijgt om beurt twee minuten feedback van de andere twee: één sterk punt, één groeipunt. Coach modelleert eerst het format.' },
      { title: 'Reflectie na feedback', tijd: '5 min', desc: 'Individueel invullen: wat neem je mee, wat ga je ermee doen.' },
      { title: 'Team contract ondertekenen', tijd: '15 min', desc: 'Elke speler schrijft drie persoonlijke beloftes en ondertekent. Verzamel de blaadjes en maak er één zichtbaar teamdocument van.' },
    ],
    tip: 'Bewaar de ondertekende contracten en breng ze halverwege het seizoen terug als check-in moment.',
    warn: 'Bij de feedbackronde: koppel trio\'s bewust samen, vermijd combinaties met bestaande spanning zonder begeleiding.',
    timing: ['Intro & doel: 5 min', 'Oefening 1: 10 min', 'Oefening 2: 15 min', 'Oefening 3: 5 min', 'Afsluiting & contract: 15 min'],
  },
];

const coachEN = [
  {
    s: 1, title: 'Self-Knowledge & Handling Pressure', subtitle: 'Session 1: coach guide',
    science: [
      'Ntoumanis et al. (2021): autonomy-supportive coaching increases intrinsic motivation and well-being',
      'Zuber & Conzelmann (2014): self-knowledge in young athletes predicts performance under pressure',
      'Deci & Ryan (1985, 2017): self-determination theory, sense of competence and relatedness',
      'Hanton et al. (2009): mental preparation for worst-case scenarios reduces competitive anxiety',
    ],
    objective: 'Players record their personal values, recognize energy sources in their team, and mentally prepare for pressure. This forms the foundation for the rest of the track.',
    activities: [
      { title: 'Personal values compass', tijd: '8 min', desc: 'Have players individually rank the six values. No right or wrong answer. Ask afterward: which value surprised you the most?' },
      { title: 'Energy giver vs energy drainer', tijd: '10 min', desc: 'Players work individually, discuss afterward in pairs. Note: this is about situations and behavior, not about tearing down teammates.' },
      { title: 'Worst case best case', tijd: '12 min', desc: 'Link this to a concrete, recognizable game situation. Discuss as a group: what makes the most likely scenario manageable?' },
    ],
    tip: 'Lead by example: briefly share your own worst case best case for an important moment in your coaching career.',
    warn: 'Don\'t force anyone to share out loud. Writing alone already has value. Don\'t force vulnerability.',
    timing: ['Intro & goal: 5 min', 'Exercise 1: 8 min', 'Exercise 2: 10 min', 'Exercise 3: 12 min', 'Closing: 10 min'],
  },
  {
    s: 2, title: 'My Role & Team First', subtitle: 'Session 2: coach guide',
    science: [
      'Bruner et al. (2021): role clarity in teams is linked to higher team cohesion',
      'Eys et al. (2015): role acceptance predicts team satisfaction and effort',
      'Carron & Eys (2012): team cohesion as the strongest predictor of team performance over time',
      'Holt et al. (2020): peer feedback increases self-insight in youth athletes',
      'Tod et al. (2011): public commitment, such as signing, increases adherence to agreements',
    ],
    objective: 'Players recognize their natural role, practice giving and receiving feedback, and record their personal contribution to the team contract as the closer of the track.',
    activities: [
      { title: 'Role compass', tijd: '10 min', desc: 'Have players score individually, then discuss as a group which roles are over- or under-represented in the team.' },
      { title: 'Feedback round trio', tijd: '15 min', desc: 'Split into trios. Each player gets two minutes of feedback from the other two in turn: one strength, one growth point. Coach models the format first.' },
      { title: 'Reflection after feedback', tijd: '5 min', desc: 'Individually complete: what do you take with you, what will you do with it.' },
      { title: 'Sign the team contract', tijd: '15 min', desc: 'Each player writes three personal promises and signs. Collect the sheets and turn them into one visible team document.' },
    ],
    tip: 'Keep the signed contracts and bring them back midseason as a check-in moment.',
    warn: 'For the feedback round: pair trios deliberately, avoid combinations with existing tension without guidance.',
    timing: ['Intro & goal: 5 min', 'Exercise 1: 10 min', 'Exercise 2: 15 min', 'Exercise 3: 5 min', 'Closing & contract: 15 min'],
  },
];

// ---------------------------------------------------------------------------
// BUILDERS
// ---------------------------------------------------------------------------
function buildPlayerHTML(sessions, isEN) {
  const badge = isEN ? 'PLAYER' : 'SPELER';
  const pages = sessions.map(d => `
<div class="page">
  <div class="page-header">
    <div><div class="session-label">${d.sessionLabel}</div><h2>${d.title}</h2></div>
    <div class="page-header-right"><div class="badge">${badge}</div><div class="logo">CHARACTER <span>First</span></div></div>
  </div>
  <div class="goal-box"><div class="goal-label">${d.goalLabel}</div><ul>${d.goals.map(g => `<li>${g}</li>`).join('')}</ul></div>
  <div class="intro-box">${d.intro}</div>
  ${d.body}
  <div class="quote-block"><p>${d.quote}</p><cite>${d.cite}</cite></div>
  <div class="page-footer"><span>${EMAIL}</span><span class="credit">Created by Tom Pauwaert</span><span>${d.footer}</span></div>
</div>`).join('');
  return `<!DOCTYPE html><html lang="${isEN ? 'en' : 'nl'}"><head><meta charset="UTF-8"><style>${PLAYER_CSS}</style></head><body>${pages}</body></html>`;
}

function buildCoachHTML(sessions, isEN) {
  const pages = sessions.map(d => `
<div class="page">
  <div class="header"><div class="wordmark">CHARACTER <span>First</span></div><div class="session-label">${d.subtitle}</div></div>
  <div class="divider"></div>
  <div class="title-block"><div class="eyebrow">${isEN ? 'COACH GUIDE' : 'COACHGIDS'}</div><div class="title">${d.title}</div></div>
  <div class="science-block"><div class="section-label">${isEN ? 'Scientific basis' : 'Wetenschappelijke basis'}</div><ul>${d.science.map(s => `<li>${s}</li>`).join('')}</ul></div>
  <div class="objective-block"><div class="section-label">${isEN ? 'Objective' : 'Doelstelling'}</div><p>${d.objective}</p></div>
  <div class="section-label">${isEN ? 'Guidance per exercise' : 'Begeleiding per oefening'}</div>
  <div class="activities">${d.activities.map((a, i) => `
    <div class="activity-card">
      <div class="activity-header"><div class="activity-num">${i + 1}</div><div class="activity-title">${a.title}</div></div>
      <div class="activity-meta">${a.tijd}</div>
      <div class="activity-desc">${a.desc}</div>
    </div>`).join('')}</div>
  <div class="tip-block"><div class="section-label">${isEN ? 'Coach tip' : 'Coach tip'}</div><p>${d.tip}</p></div>
  <div class="warn-block"><div class="section-label">${isEN ? 'Watch out for' : 'Let op'}</div><p>${d.warn}</p></div>
  <div class="footer"><div class="footer-left">${EMAIL}</div><div class="footer-right">${isEN ? 'CONFIDENTIAL, For coaches only' : 'VERTROUWELIJK: enkel voor coaches'}</div></div>
</div>`).join('');
  return `<!DOCTYPE html><html lang="${isEN ? 'en' : 'nl'}"><head><meta charset="UTF-8"><style>${COACH_CSS}</style></head><body>${pages}</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const docs = [
    { name: 'CF_Culture_Building_Speler_NL.pdf', html: buildPlayerHTML(playerNL, false) },
    { name: 'CF_Culture_Building_Coach_NL.pdf', html: buildCoachHTML(coachNL, false) },
    { name: 'CF_Culture_Building_Player_EN.pdf', html: buildPlayerHTML(playerEN, true) },
    { name: 'CF_Culture_Building_Coach_EN.pdf', html: buildCoachHTML(coachEN, true) },
  ];

  for (const d of docs) {
    await page.setContent(d.html, { waitUntil: 'networkidle' });
    const out = path.join(OUT, d.name);
    await page.pdf({ path: out, format: 'A4', printBackground: true });
    console.log(`${d.name} -> ${Math.round(fs.statSync(out).size / 1024)}KB`);
  }

  await browser.close();
  console.log('Done!');
})();
