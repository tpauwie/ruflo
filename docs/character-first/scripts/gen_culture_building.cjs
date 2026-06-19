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
.help-block { background: rgba(30,138,91,.08); border-left: 3px solid var(--green); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.help-block .section-label { color: var(--green); border-color: var(--green); }
.help-block ol, .help-block ul { padding-left: 16px; }
.help-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 3px; }
.question-block { background: rgba(47,111,176,.08); border-left: 3px solid var(--blue); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.question-block .section-label { color: var(--blue); border-color: var(--blue); }
.question-block ol { padding-left: 16px; }
.question-block li { font-size: 10.5px; color: var(--navy); line-height: 1.45; margin-bottom: 3px; font-style: italic; }
.followup-block { background: rgba(240,90,40,.07); border-left: 3px solid var(--orange); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
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
    tip: 'Geef zelf het goede voorbeeld: deel kort jouw eigen worst case best case voor een belangrijk moment in je coachcarrière.',
    warn: 'Forceer niemand om hardop te delen. Schrijven alleen is al waardevol. Dwing geen kwetsbaarheid af.',
    timing: ['Intro & doel: 5 min', 'Oefening 1: 8 min', 'Oefening 2: 10 min', 'Oefening 3: 12 min', 'Afsluiting: 10 min'],
    exerciseDetails: [
      {
        title: 'Persoonlijk waardenkompas',
        tijd: '8 min',
        purpose: 'Spelers worden zich bewust van de waarden die hun gedrag écht sturen, niet de waarden die "goed klinken". Dit is de basis voor alle latere gesprekken over gedrag en team.',
        instructions: '"Je krijgt zes waarden. Geef elke waarde een score van 1 tot 5: hoe belangrijk is die waarde voor hoe jij wil spelen en zijn in dit team? Er is geen goed of fout antwoord, en je hoeft niets te delen wat je niet wil delen."',
        example: 'Een speler scoort "moed" een 5 en "loyaliteit" een 2. Vraag door: "Wat betekent moed voor jou op het veld? Een schot durven nemen in de slotseconden, of iets durven zeggen tegen een teamgenoot?" Zo wordt de waarde concreet in plaats van abstract.',
      },
      {
        title: 'Energiegever vs energieslurper',
        tijd: '10 min',
        purpose: 'Spelers leren het verschil zien tussen situaties/gedrag die energie geven en die energie kosten, zodat ze dit later bewust kunnen sturen in plaats van passief te ondergaan.',
        instructions: '"Denk aan de afgelopen weken op training en in wedstrijden. Schrijf op: welke momenten of gedrag van anderen gaven jou energie? Welke kostten je energie? Het gaat om situaties en gedrag, niet om personen afkraken."',
        example: 'Een speler schrijft "energie van: als iemand me aanmoedigt na een fout" en "kost energie: als er gemopperd wordt na een gemiste kans". Bespreek in duo\'s hoe ze elkaar bewust meer van het eerste en minder van het tweede kunnen geven.',
      },
      {
        title: 'Worst case best case',
        tijd: '12 min',
        purpose: 'Spelers oefenen mentale voorbereiding op druk door realistisch na te denken over scenario\'s, in plaats van angst te laten groeien door vage onzekerheid.',
        instructions: '"Denk aan een belangrijke wedstrijd die eraan komt. Schrijf het slechtste op wat kan gebeuren, het beste wat kan gebeuren, en wat het meest waarschijnlijke scenario is. Bedenk ook: als het slechtste gebeurt, wat zou je dan doen?"',
        example: 'Worst case: "ik mis de winning shot en het team verliest." Best case: "ik scoor de winning shot." Meest waarschijnlijk: "het wordt een spannende, gelijkopgaande wedstrijd waarin ik goede en mindere momenten heb." Help de speler zien dat dit laatste scenario heel hanteerbaar is.',
      },
    ],
    helpTips: [
      'Bouw psychologische veiligheid op vóór je dieper gaat: begin met iets luchtigs en benoem expliciet dat er geen foute antwoorden zijn.',
      'Gebruik de waarden uit oefening 1 de rest van het seizoen actief in je taal op training: "dit is precies wat doorzetting betekent" maakt het tastbaar.',
      'Check tussendoor non-verbaal gedrag: spelers die wegkijken of stilvallen hebben soms net iets meer tijd of een 1-op-1 nodig.',
      'Koppel de energiegever/energieslurper-oefening aan concreet teamgedrag dat je zelf observeert op training, niet enkel aan de wedstrijd.',
      'Sluit de sessie nooit abrupt af. Laat minstens 5 minuten ruimte voor een rustige landing voor je terug naar het sportieve programma gaat.',
    ],
    questions: [
      'Welke waarde verraste jou het meest toen je ze moest rangschikken?',
      'Wie in het team geeft jou energie zonder dat diegene het weet?',
      'Wat zou je tegen jezelf zeggen vlak voor een belangrijke wedstrijd, als een goede vriend?',
      'Wanneer voelde druk de laatste keer overweldigend, en wat hielp toen wél?',
      'Welke van je waarden zie je nog te weinig terug in je eigen gedrag op het veld?',
    ],
    followUp: [
      'Verwerk de waarden van de groep in een kort, zichtbaar overzicht (bv. op het mededelingenbord) voor de komende weken.',
      'Check bij de eerstvolgende wedstrijd onder druk kort in bij 2-3 spelers: "hoe voelde dit zich vergeleken met je worst/best case?"',
      'Plan een korte individuele check-in met spelers die tijdens de oefening duidelijk worstelden of net heel stil waren.',
      'Neem de energiegevers/energieslurpers-inzichten mee bij het samenstellen van kleine groepjes voor toekomstige oefeningen.',
    ],
    pitfalls: [
      'Te snel doorgaan naar de volgende oefening zonder ruimte voor reflectie ondermijnt het effect van de hele sessie.',
      'Zelf invullen wat een speler "waarschijnlijk bedoelt" in plaats van echt te luisteren.',
      'De worst case oefening laten eindigen op het negatieve scenario zonder terug te keren naar het hanteerbare, meest waarschijnlijke scenario.',
      'Energiegevers/energieslurpers gebruiken als excuus om spelers publiekelijk te bekritiseren.',
    ],
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
    tip: 'Bewaar de ondertekende contracten en breng ze halverwege het seizoen terug als check-in moment.',
    warn: 'Bij de feedbackronde: koppel trio\'s bewust samen, vermijd combinaties met bestaande spanning zonder begeleiding.',
    timing: ['Intro & doel: 5 min', 'Oefening 1: 10 min', 'Oefening 2: 15 min', 'Oefening 3: 5 min', 'Afsluiting & contract: 15 min'],
    exerciseDetails: [
      {
        title: 'Rolcompass',
        tijd: '10 min',
        purpose: 'Spelers krijgen taal voor hun natuurlijke bijdrage aan het team, wat rolduidelijkheid en daarmee teamcohesie versterkt.',
        instructions: '"Scoor elke rol van 0 tot 10: hoe sterk herken je dit in jezelf? Er is geen beste rol, een team heeft alle vier nodig."',
        example: 'Bespreek plenair als bijna iedereen hoog scoort op "leider": "Wat mist het team dan misschien? Wie zou de stabiele kracht kunnen zijn deze maand?" Dit maakt rolverdeling een teamgesprek, geen individuele wedstrijd.',
      },
      {
        title: 'Feedbackronde trio',
        tijd: '15 min',
        purpose: 'Spelers oefenen het geven en ontvangen van constructieve feedback in een veilige, kleine setting, wat zelfinzicht en onderling vertrouwen vergroot.',
        instructions: '"In je trio krijgt elke speler om beurt twee minuten feedback van de andere twee: één sterk punt dat je bij hem/haar ziet, en één groeipunt. Wees concreet en gebruik voorbeelden, geen algemeenheden."',
        example: 'Modelleer eerst zelf: "Jouw sterke punt is dat je altijd communiceert in verdediging. Je groeipunt: je mag wat vaker zelf een schot nemen in plaats van altijd door te spelen." Dat format herhalen spelers dan in hun trio.',
      },
      {
        title: 'Reflectie na feedback',
        tijd: '5 min',
        purpose: 'Spelers verwerken wat ze net gehoord hebben actief, zodat de feedback niet verdampt maar omgezet wordt in een concrete intentie.',
        instructions: '"Schrijf op: wat heb je gehoord over je sterke punt en je groeipunt? Wat ga je concreet anders doen de komende weken?"',
        example: 'Een speler schrijft: "Ik ga in de komende trainingen bewust 1 schot per training nemen als de kans er is, in plaats van altijd door te spelen." Concreet en meetbaar werkt beter dan een vage intentie.',
      },
      {
        title: 'Team contract ondertekenen',
        tijd: '15 min',
        purpose: 'Publieke commitment (zoals ondertekenen) verhoogt de kans dat spelers zich echt aan hun beloftes houden, en sluit het traject symbolisch af.',
        instructions: '"Schrijf drie concrete beloftes die jij dit seizoen aan het team doet. Maak ze concreet en haalbaar, geen vage intenties. Onderteken daarna met datum."',
        example: 'In plaats van "ik beloof om een betere teamspeler te zijn", help de speler naar: "ik beloof om elke training op tijd te zijn" of "ik beloof om een teamgenoot aan te moedigen na elke fout die hij maakt."',
      },
    ],
    helpTips: [
      'Geef zelf eerst feedback aan een speler volgens het format (één sterk punt, één groeipunt) zodat de trio\'s weten wat je verwacht.',
      'Bewaak de rolverdeling: als iedereen "leider" scoort, bevraag dan plenair wat het team nog mist en wie dat zou kunnen invullen.',
      'Herhaal het teamcontract regelmatig terug in je coaching, niet alleen tijdens deze sessie: "weet je nog wat je beloofd hebt?"',
      'Maak van het ondertekende contract een zichtbaar object (foto, poster in de kleedkamer) zodat het een levend document blijft.',
      'Vier het wanneer een speler zich zichtbaar aan zijn belofte houdt, in het bijzijn van het team.',
    ],
    questions: [
      'Welke rol herken je het sterkst in jezelf, en welke rol zou je willen groeien?',
      'Wat was het lastigste om te horen tijdens de feedbackronde, en waarom?',
      'Welke van je drie beloftes is het moeilijkst om vol te houden over een heel seizoen?',
      'Wie in het team zou je nu makkelijker feedback durven geven dan voor deze sessie?',
      'Wat heeft het team nodig van jou, specifiek in jouw rol, om sterker te worden?',
    ],
    followUp: [
      'Hang het ondertekende teamcontract zichtbaar op (kleedkamer, teamapp) en verwijs er actief naar bij evaluatiemomenten.',
      'Plan een korte check-in halverwege het seizoen: laat spelers hun eigen contract herlezen en aanvullen.',
      'Gebruik de rolverdeling uit oefening 1 bewust bij het samenstellen van line-ups, kapiteinskeuzes of leiderschapstaken.',
      'Volg op of de feedback uit de trio\'s ook echt landt: vraag enkele weken later kort terug wat ermee gedaan is.',
    ],
    pitfalls: [
      'De feedbackronde inplannen zonder zelf eerst het format te modelleren leidt vaak tot te vage of te harde feedback.',
      'Trio\'s willekeurig samenstellen zonder rekening te houden met bestaande spanningen in de groep.',
      'Het teamcontract na de sessie laten liggen zonder er nog ooit naar terug te keren, waardoor de belofte vervliegt.',
      'Rolinzichten gebruiken om spelers vast te pinnen op één label in plaats van groei mogelijk te maken.',
    ],
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
    tip: 'Lead by example: briefly share your own worst case best case for an important moment in your coaching career.',
    warn: 'Don\'t force anyone to share out loud. Writing alone already has value. Don\'t force vulnerability.',
    timing: ['Intro & goal: 5 min', 'Exercise 1: 8 min', 'Exercise 2: 10 min', 'Exercise 3: 12 min', 'Closing: 10 min'],
    exerciseDetails: [
      {
        title: 'Personal values compass',
        tijd: '8 min',
        purpose: 'Players become aware of the values that actually drive their behavior, not the values that "sound good". This is the foundation for all later conversations about behavior and team.',
        instructions: '"You\'ll get six values. Give each one a score from 1 to 5: how important is this value for how you want to play and be on this team? There\'s no right or wrong answer, and you don\'t have to share anything you don\'t want to."',
        example: 'A player scores "courage" a 5 and "loyalty" a 2. Ask: "What does courage mean for you on the court? Taking the shot in the final seconds, or saying something to a teammate?" This makes the value concrete instead of abstract.',
      },
      {
        title: 'Energy giver vs energy drainer',
        tijd: '10 min',
        purpose: 'Players learn to spot the difference between situations/behavior that give energy and that drain it, so they can later steer this consciously instead of passively undergoing it.',
        instructions: '"Think back to the past few weeks at practice and in games. Write down: which moments or behavior from others gave you energy? Which drained your energy? This is about situations and behavior, not about tearing others down."',
        example: 'A player writes "energy from: when someone encourages me after a mistake" and "drains energy: when people grumble after a missed chance." Discuss in pairs how they can consciously give more of the first and less of the second.',
      },
      {
        title: 'Worst case best case',
        tijd: '12 min',
        purpose: 'Players practice mental preparation for pressure by realistically thinking through scenarios, instead of letting anxiety grow from vague uncertainty.',
        instructions: '"Think of an important upcoming game. Write down the worst that could happen, the best that could happen, and what the most likely scenario is. Also think: if the worst happens, what would you do?"',
        example: 'Worst case: "I miss the winning shot and the team loses." Best case: "I score the winning shot." Most likely: "it\'s a tight, back-and-forth game where I have good and less good moments." Help the player see that this last scenario is very manageable.',
      },
    ],
    helpTips: [
      'Build psychological safety before going deeper: start with something light and explicitly state there are no wrong answers.',
      'Use the values from exercise 1 actively in your language for the rest of the season: "this is exactly what perseverance means" makes it tangible.',
      'Check non-verbal cues along the way: players who look away or go quiet sometimes just need a bit more time or a 1-on-1.',
      'Tie the energy giver/drainer exercise to concrete team behavior you observe yourself at practice, not just in games.',
      'Never end the session abruptly. Leave at least 5 minutes for a calm landing before returning to the regular program.',
    ],
    questions: [
      'Which value surprised you the most when you had to rank them?',
      'Who on the team gives you energy without realizing it?',
      'What would you say to yourself right before an important game, as a good friend would?',
      'When did pressure last feel overwhelming, and what actually helped then?',
      'Which of your values do you see too little of in your own behavior on the court?',
    ],
    followUp: [
      'Turn the group\'s values into a short, visible overview (e.g. on the notice board) for the coming weeks.',
      'At the next high-pressure game, briefly check in with 2-3 players: "how did this compare to your worst/best case?"',
      'Plan a short individual check-in with players who clearly struggled or went very quiet during the exercise.',
      'Use the energy giver/drainer insights when forming small groups for future exercises.',
    ],
    pitfalls: [
      'Moving on too quickly to the next exercise without room for reflection undermines the effect of the whole session.',
      'Filling in yourself what a player "probably means" instead of truly listening.',
      'Letting the worst case exercise end on the negative scenario without returning to the manageable, most likely scenario.',
      'Using energy givers/drainers as an excuse to publicly criticize players.',
    ],
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
    tip: 'Keep the signed contracts and bring them back midseason as a check-in moment.',
    warn: 'For the feedback round: pair trios deliberately, avoid combinations with existing tension without guidance.',
    timing: ['Intro & goal: 5 min', 'Exercise 1: 10 min', 'Exercise 2: 15 min', 'Exercise 3: 5 min', 'Closing & contract: 15 min'],
    exerciseDetails: [
      {
        title: 'Role compass',
        tijd: '10 min',
        purpose: 'Players get language for their natural contribution to the team, which strengthens role clarity and, with it, team cohesion.',
        instructions: '"Score each role from 0 to 10: how strongly do you recognize this in yourself? There\'s no best role, a team needs all four."',
        example: 'If almost everyone scores high on "leader," discuss as a group: "What might the team be missing then? Who could be the steady force this month?" This turns role distribution into a team conversation, not an individual contest.',
      },
      {
        title: 'Feedback round trio',
        tijd: '15 min',
        purpose: 'Players practice giving and receiving constructive feedback in a safe, small setting, which builds self-insight and mutual trust.',
        instructions: '"In your trio, each player gets two minutes of feedback from the other two in turn: one strength you see in them, and one growth point. Be specific and use examples, not generalities."',
        example: 'Model it yourself first: "Your strength is that you always communicate on defense. Your growth point: take the shot yourself a bit more instead of always passing." Players then repeat that format in their trio.',
      },
      {
        title: 'Reflection after feedback',
        tijd: '5 min',
        purpose: 'Players actively process what they just heard, so the feedback doesn\'t evaporate but turns into a concrete intention.',
        instructions: '"Write down: what did you hear about your strength and your growth point? What will you concretely do differently in the coming weeks?"',
        example: 'A player writes: "In the next few practices I\'ll consciously take 1 shot per practice when the chance is there, instead of always passing." Concrete and measurable works better than a vague intention.',
      },
      {
        title: 'Sign the team contract',
        tijd: '15 min',
        purpose: 'Public commitment (such as signing) increases the chance that players actually keep their promises, and symbolically closes the track.',
        instructions: '"Write three concrete promises you make to the team this season. Make them specific and achievable, not vague intentions. Then sign with the date."',
        example: 'Instead of "I promise to be a better teammate," help the player toward: "I promise to be on time for every practice" or "I promise to encourage a teammate after every mistake they make."',
      },
    ],
    helpTips: [
      'Give feedback to one player yourself first using the format (one strength, one growth point) so trios know what\'s expected.',
      'Watch the role distribution: if everyone scores "leader," ask the group what the team is still missing and who could fill it.',
      'Keep referencing the team contract in your coaching, not just during this session: "remember what you promised?"',
      'Turn the signed contract into a visible object (photo, poster in the locker room) so it stays a living document.',
      'Celebrate when a player visibly lives up to their promise, in front of the team.',
    ],
    questions: [
      'Which role do you recognize most strongly in yourself, and which role would you like to grow into?',
      'What was hardest to hear during the feedback round, and why?',
      'Which of your three promises is hardest to keep over a full season?',
      'Who on the team would you now find it easier to give feedback to than before this session?',
      'What does the team need from you, specifically in your role, to get stronger?',
    ],
    followUp: [
      'Display the signed team contract visibly (locker room, team app) and actively refer to it during evaluation moments.',
      'Plan a short check-in midseason: have players reread and add to their own contract.',
      'Use the role distribution from exercise 1 deliberately when forming line-ups, captain choices, or leadership tasks.',
      'Follow up on whether the feedback from the trios actually lands: ask briefly a few weeks later what was done with it.',
    ],
    pitfalls: [
      'Scheduling the feedback round without modeling the format yourself first often leads to feedback that\'s too vague or too harsh.',
      'Forming trios randomly without accounting for existing tension in the group.',
      'Letting the team contract sit unused after the session, so the promise fades away.',
      'Using role insights to pin players to one label instead of allowing growth.',
    ],
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
  <div class="tip-block"><div class="section-label">${isEN ? 'Coach tip' : 'Coach tip'}</div><p>${d.tip}</p></div>
  <div class="warn-block"><div class="section-label">${isEN ? 'Watch out for' : 'Let op'}</div><p>${d.warn}</p></div>
  <div class="footer"><div class="footer-left">${EMAIL}</div><div class="footer-right">${isEN ? 'CONFIDENTIAL, For coaches only' : 'VERTROUWELIJK: enkel voor coaches'} — 1/3</div></div>
</div>
<div class="page">
  <div class="header"><div class="wordmark">CHARACTER <span>First</span></div><div class="session-label">${d.subtitle}</div></div>
  <div class="divider"></div>
  <div class="title-block"><div class="eyebrow">${isEN ? 'EXERCISES, ONE BY ONE' : 'OEFENINGEN, EEN VOOR EEN'}</div><div class="title" style="font-size:18px">${isEN ? 'Everything per exercise, in order' : 'Alles per oefening, op volgorde'}</div></div>
  <div class="detail-list">${d.exerciseDetails.map((e, i) => `
    <div class="detail-card">
      <div class="detail-header"><div class="activity-num">${i + 1}</div><div class="detail-title">${e.title}</div><div class="detail-time">${e.tijd}</div></div>
      <div class="detail-row"><div class="detail-key">${isEN ? 'Purpose' : 'Doel'}</div><div class="detail-val">${e.purpose}</div></div>
      <div class="detail-row"><div class="detail-key">${isEN ? 'Say to players' : 'Zeg tegen spelers'}</div><div class="detail-val script">${e.instructions}</div></div>
      <div class="detail-row"><div class="detail-key">${isEN ? 'Example' : 'Voorbeeld'}</div><div class="detail-val example">${e.example}</div></div>
    </div>`).join('')}</div>
  <div class="footer"><div class="footer-left">${EMAIL}</div><div class="footer-right">${isEN ? 'CONFIDENTIAL, For coaches only' : 'VERTROUWELIJK: enkel voor coaches'} — 2/3</div></div>
</div>
<div class="page">
  <div class="header"><div class="wordmark">CHARACTER <span>First</span></div><div class="session-label">${d.subtitle}</div></div>
  <div class="divider"></div>
  <div class="title-block"><div class="eyebrow">${isEN ? 'COACHING IN DEPTH' : 'COACHING IN DE DIEPTE'}</div><div class="title" style="font-size:18px">${isEN ? 'How to help your team' : 'Hoe help je je team verder'}</div></div>
  <div class="help-block"><div class="section-label">${isEN ? 'How to support your team' : 'Hoe ondersteun je je team'}</div><ol>${d.helpTips.map(t => `<li>${t}</li>`).join('')}</ol></div>
  <div class="question-block"><div class="section-label">${isEN ? 'Discussion questions to ask' : 'Gespreksvragen om te stellen'}</div><ol>${d.questions.map(q => `<li>${q}</li>`).join('')}</ol></div>
  <div class="followup-block"><div class="section-label">${isEN ? 'Follow-up in the coming weeks' : 'Vervolgstappen de komende weken'}</div><ol>${d.followUp.map(f => `<li>${f}</li>`).join('')}</ol></div>
  <div class="pitfall-block"><div class="section-label">${isEN ? 'Common pitfalls' : 'Veelvoorkomende valkuilen'}</div><ul>${d.pitfalls.map(p => `<li>${p}</li>`).join('')}</ul></div>
  <div class="footer"><div class="footer-left">${EMAIL}</div><div class="footer-right">${isEN ? 'CONFIDENTIAL, For coaches only' : 'VERTROUWELIJK: enkel voor coaches'} — 3/3</div></div>
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
