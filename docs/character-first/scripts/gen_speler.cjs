const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_NL = '/home/user/ruflo/docs/character-first/werkbladen-pdf/speler';
const OUT_EN = '/home/user/ruflo/docs/character-first/werkbladen-pdf/speler-en';
[OUT_NL, OUT_EN].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const EMAIL = 'info@characterfirst.be';

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --orange: #f05a28; --ink: #1C2433; --canvas: #FAF7F2; --line: #E4DFD6;
  --stone: #6E6A63; --gray-200: #e8e8e8; --gray-300: #d0d0d0; --gray-400: #999;
  --gray-600: #555; --mist: #F0ECE4;
}
html, body { background: #fff; }
body { font-family: Arial, sans-serif; color: var(--ink); font-size: 12px; }

/* EXACT A4 page — no overflow */
.page {
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  padding: 12mm 14mm 10mm;
  background: var(--canvas);
  display: flex;
  flex-direction: column;
  gap: 8px;
  page-break-after: always;
  break-after: page;
}
.page:last-child { page-break-after: auto; break-after: auto; }

/* Header */
.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  border-bottom: 3px solid var(--orange); padding-bottom: 8px; flex-shrink: 0;
}
.month-label { font-size: 0.62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); }
h2 { font-size: 1.25rem; font-weight: 900; color: var(--ink); margin-top: 2px; }
.page-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.badge {
  font-size: 0.58rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;
  letter-spacing: .08em; text-transform: uppercase;
  background: rgba(240,90,40,.12); color: var(--orange); border: 1px solid rgba(240,90,40,.3);
}
.logo { font-weight: 900; font-size: 0.7rem; color: var(--stone); letter-spacing: .06em; }
.logo span { color: var(--orange); }

/* Goal box */
.goal-box { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 8px 12px; flex-shrink: 0; }
.goal-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--orange); margin-bottom: 4px; }
.goal-box ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
.goal-box li { font-size: 0.78rem; color: var(--gray-600); padding-left: 14px; position: relative; line-height: 1.35; }
.goal-box li::before { content: '→'; position: absolute; left: 0; color: var(--orange); font-weight: 700; }

/* Intro */
.intro-box { background: var(--mist); border-radius: 5px; padding: 7px 12px; font-size: 0.78rem; color: var(--gray-600); font-style: italic; line-height: 1.45; flex-shrink: 0; }

/* Section label */
.section-title {
  font-size: 0.59rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em;
  color: var(--stone); border-bottom: 1px solid var(--line); padding-bottom: 3px; flex-shrink: 0;
}

/* Exercise block */
.ex { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 9px 12px; display: flex; flex-direction: column; gap: 6px; }
.ex-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.84rem; }
.ex-num {
  background: var(--orange); color: #fff; width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.66rem; font-weight: 800; flex-shrink: 0;
}
.ex-instr { font-size: 0.76rem; color: var(--gray-600); line-height: 1.45; }

/* Writing elements — generous white space */
.line { border-bottom: 1.5px solid var(--gray-300); height: 26px; width: 100%; }
.lines { display: flex; flex-direction: column; gap: 6px; }
.box { border: 1.5px solid var(--gray-300); border-radius: 4px; background: #fff; }
.box-xs  { min-height: 40px; }
.box-sm  { min-height: 56px; }
.box-md  { min-height: 80px; }
.box-lg  { min-height: 110px; }
.box-xl  { min-height: 140px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.col-label { font-size: 0.7rem; font-weight: 700; margin-bottom: 4px; }
.field-label { font-size: 0.73rem; color: var(--gray-400); margin-bottom: 3px; }

/* Mental resilience block */
.mental-block {
  background: linear-gradient(135deg, #1C2433 0%, #2d3a4f 100%);
  color: #fff; border-radius: 8px; padding: 10px 14px;
  border-left: 4px solid var(--orange); flex-shrink: 0;
}
.mental-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--orange); margin-bottom: 5px; }
.mental-block .ex-instr { color: rgba(255,255,255,.8); font-size: 0.75rem; }
.mental-box { border: 1.5px solid rgba(255,255,255,.2); border-radius: 4px; background: rgba(255,255,255,.06); min-height: 52px; }

/* Quote */
.quote-wrap { margin-top: auto; padding-top: 6px; flex-shrink: 0; }
.quote-block {
  background: var(--ink); color: #fff; border-radius: 8px; padding: 12px 16px;
  border-left: 4px solid var(--orange);
}
.quote-block p { font-size: 0.82rem; font-style: italic; line-height: 1.55; margin-bottom: 6px; }
.quote-block cite { font-size: 0.64rem; color: rgba(255,255,255,.6); font-style: normal; }

/* Footer */
.page-footer {
  display: flex; justify-content: space-between;
  font-size: 0.58rem; color: var(--stone);
  border-top: 1px solid var(--line); padding-top: 5px; margin-top: auto; flex-shrink: 0;
}

/* Continuation header */
.cont-header {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--orange); padding-bottom: 6px; flex-shrink: 0;
}
.cont-title { font-size: 0.74rem; font-weight: 700; color: var(--stone); }
.cont-month { font-size: 0.6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--orange); }

/* Misc */
.rank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px; }
.rank-item { display: flex; align-items: center; gap: 7px; font-size: 0.78rem; }
.rank-box { width: 28px; height: 22px; border-bottom: 1.5px solid var(--gray-300); flex-shrink: 0; }
.score-bars { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.score-row { display: flex; flex-direction: column; gap: 2px; }
.score-label { display: flex; justify-content: space-between; font-size: 0.76rem; }
.score-sub { color: var(--gray-400); font-size: 0.68rem; font-weight: 400; }
.score-bar { height: 14px; background: var(--gray-200); border-radius: 3px; position: relative; }
.score-bar span { position: absolute; right: 5px; top: 50%; transform: translateY(-50%); font-size: 0.6rem; color: var(--gray-400); }
.num-list { display: flex; flex-direction: column; gap: 8px; }
.num-item { display: flex; align-items: center; gap: 8px; }
.num-item .line { flex: 1; }
.intentions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.intent-label { font-size: 0.66rem; font-weight: 700; color: var(--orange); margin-bottom: 3px; text-transform: uppercase; }
.letter-box { border: 2px dashed var(--orange); border-radius: 6px; padding: 9px 12px; display: flex; flex-direction: column; gap: 6px; }
.sign-row { display: flex; gap: 20px; margin-top: 6px; }
.sign-field { flex: 1; }
.sign-label { font-size: 0.68rem; color: var(--gray-400); margin-bottom: 4px; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

// ─── NL DATA ────────────────────────────────────────────────────────────────
const NL = [
  {
    m: 1, title: 'Zelfkennis & identiteit',
    monthLabel: 'Maand 1, spelerswerkblad',
    goalLabel: 'Doelstelling Maand 1',
    goals: [
      'Je kan drie kernwaarden benoemen die jou als persoon en ploegmaat definiëren',
      'Je herkent wat je energie geeft en wat energie kost in een teamsetting',
      'Je begrijpt het verschil tussen hoe jij jezelf ziet en hoe anderen jou ervaren',
    ],
    intro: 'Wie ben jij als speler en als persoon? Dit werkblad helpt je om je eigen krachten, waarden en motivatie beter te begrijpen. Neem de tijd en wees eerlijk.',
    page1: `
      <div class="section-title">Oefening 1: mijn drie woorden</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Mijn drie woorden</div>
        <p class="ex-instr">Kies drie woorden die jou het best beschrijven als ploegmaat. Vraag daarna twee teamgenoten om ook drie woorden over jou te schrijven.</p>
        <div class="field-label">Mijn drie woorden:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Woorden van teamgenoot 1:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Woorden van teamgenoot 2:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Wat valt je op als je de lijsten vergelijkt?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2: energiegever vs energieslurper</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Energiegever vs energieslurper</div>
        <p class="ex-instr">Schrijf drie dingen op die je energie geven en drie dingen die energie kosten tijdens training of wedstrijd.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--orange)">ENERGIEGEVERS ▶</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#999">ENERGIESLURPERS ▼</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:6px">Hoe bouw ik meer energiegevers in mijn routine?</div>
        <div class="box box-xs"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: persoonlijk waardenkompas</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Persoonlijk waardenkompas</div>
        <p class="ex-instr">Rangschik onderstaande waarden van 1 (meest belangrijk) tot 6 (minder belangrijk) voor jou als speler en als persoon.</p>
        <div class="rank-grid">
          <div class="rank-item"><div class="rank-box"></div> Loyaliteit</div>
          <div class="rank-item"><div class="rank-box"></div> Eerlijkheid</div>
          <div class="rank-item"><div class="rank-box"></div> Moed</div>
          <div class="rank-item"><div class="rank-box"></div> Doorzetting</div>
          <div class="rank-item"><div class="rank-box"></div> Respect</div>
          <div class="rank-item"><div class="rank-box"></div> Teamgeest</div>
        </div>
        <div class="field-label" style="margin-top:10px">Welke waarde leef je het minst na? Wat wil je hieraan veranderen?</div>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Reflectie</div>
      <div class="ex">
        <p class="ex-instr">Als je aan het einde van dit seizoen terugkijkt: welk type ploegmaat wil je zijn geweest?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: positieve zelfpraat</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf één zin op die je tegen jezelf zegt wanneer je twijfelt aan jezelf als speler. Herschrijf ze daarna positief als een kracht.</p>
        <div class="field-label" style="color:rgba(255,255,255,.5)">Mijn krachtzin voor dit seizoen:</div>
        <div class="mental-box"></div>
      </div>`,
    quote: '"The most important thing is to try and inspire people so that they can be great in whatever they want to do."',
    cite: 'Kobe Bryant, 5× NBA Champion',
    footer: 'Maand 1: zelfkennis & identiteit',
  },
  {
    m: 2, title: 'Druk & stress',
    monthLabel: 'Maand 2, spelerswerkblad',
    goalLabel: 'Doelstelling Maand 2',
    goals: [
      'Je herkent de fysieke en mentale signalen van stress bij jezelf',
      'Je beheerst minstens één ademhalingstechniek om activatie te reguleren',
      'Je kan het verschil benoemen tussen probleemgerichte en emotiegerichte coping',
    ],
    intro: 'Druk voelen is normaal. Elk topsporter voelt het. Wat het verschil maakt is hoe je ermee omgaat. Dit werkblad helpt je ontdekken hoe jouw lichaam en geest reageren op stress.',
    page1: `
      <div class="section-title">Oefening 1: box breathing logboek</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Box breathing logboek</div>
        <p class="ex-instr">Oefen Box Breathing minstens 3× deze maand. Noteer datum, situatie en hoe je je voelde voor en na (schaal 1–10).</p>
        <div style="display:grid;grid-template-columns:2.5fr 1fr 1fr;gap:6px;margin-top:4px">
          <div class="field-label">DATUM & SITUATIE</div>
          <div class="field-label">VOOR (1–10)</div>
          <div class="field-label">NA (1–10)</div>
          <div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div>
        </div>
        <div class="field-label" style="margin-top:6px">Wat merk ik na Box Breathing bij mezelf?</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Oefening 2: stressdagboek</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Stressdagboek</div>
        <p class="ex-instr">Schrijf na je volgende wedstrijd op: wat voelde je, wat dacht je, wat deed je?</p>
        <div class="field-label">Wat voelde ik? (fysiek en emotioneel)</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:6px">Wat dacht ik?</div>
        <div class="box box-xs"></div>
        <div class="field-label" style="margin-top:6px">Wat deed ik? (hoe reageerde ik op de druk?)</div>
        <div class="box box-xs"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: worst case · best case · meest waarschijnlijk</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Worst case best case</div>
        <p class="ex-instr">Denk aan een situatie die je zenuwachtig maakt. Schrijf de drie scenario's op en maak een plan.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:#c0392b">WORST CASE</div>
            <div class="box box-md"></div>
          </div>
          <div>
            <div class="col-label" style="color:#27ae60">BEST CASE</div>
            <div class="box box-md"></div>
          </div>
        </div>
        <div class="col-label" style="color:var(--orange);margin-top:8px">MEEST WAARSCHIJNLIJK</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:6px">Mijn actieplan als de druk oploopt:</div>
        <div class="box box-xs"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: pre-game routine</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf je ideale mentale voorbereiding op voor een wedstrijd (3 stappen: ademhaling, focus-zin, actie). Oefen dit minstens 2× deze maand.</p>
        <div class="field-label" style="color:rgba(255,255,255,.5)">Mijn pre-game routine in 3 stappen:</div>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Pressure is a privilege — it only comes to those who earn it."',
    cite: 'Billie Jean King, 39× Grand Slam Champion',
    footer: 'Maand 2: druk & stress',
  },
  {
    m: 3, title: 'Mijn rol in het team',
    monthLabel: 'Maand 3, spelerswerkblad',
    goalLabel: 'Doelstelling Maand 3',
    goals: [
      'Je kan jouw huidige rol(len) in het team benoemen met concrete voorbeelden',
      'Je begrijpt waarom rolhelderheid bijdraagt aan teamcohesie en persoonlijke motivatie',
      'Je formuleert één concrete bijdrage die jij wil versterken de komende maanden',
    ],
    intro: 'Je hebt niet één rol in een team. Je hebt er meerdere, en ze veranderen. Dit werkblad helpt je ontdekken welke rollen jij vervult en welke je wil ontwikkelen.',
    page1: `
      <div class="section-title">Oefening 1: rolcompass</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rolcompass</div>
        <p class="ex-instr">Geef jezelf een score van 0 tot 10 voor elk van de vier rollen.</p>
        <div class="score-bars">
          <div class="score-row">
            <div class="score-label"><strong>Leider</strong><span class="score-sub">Geeft richting, spreekt de groep toe</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
          <div class="score-row">
            <div class="score-label"><strong>Motor</strong><span class="score-sub">Geeft energie, trekt het team mee</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
          <div class="score-row">
            <div class="score-label"><strong>Denker</strong><span class="score-sub">Analyseert, stelt vragen, zoekt oplossingen</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
          <div class="score-row">
            <div class="score-label"><strong>Stabiele Kracht</strong><span class="score-sub">Betrouwbaar, consistent, steun voor anderen</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">Mijn sterkste rol is <span style="color:var(--orange);font-weight:700">_________________________</span> omdat:</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Oefening 2: mijn top 3 bijdragen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Mijn top 3 bijdragen deze maand</div>
        <p class="ex-instr">Geen statistieken. Schrijf drie dingen op die jij hebt bijgedragen op het vlak van gedrag, houding of karakter.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Welke bijdrage wil ik volgend maand versterken?</div>
        <div class="box box-xs"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: rolcirkel reflectie</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Na de rolcirkel</div>
        <p class="ex-instr">Na de groepsoefening: wat heeft je verrast? Welke bijdrage van een teamgenoot had je niet verwacht?</p>
        <div class="box box-lg"></div>
        <div class="field-label" style="margin-top:8px">Welke rol wil ik bewust meer opnemen de komende weken?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Teamreflectie</div>
      <div class="ex">
        <p class="ex-instr">Wat heeft dit team nodig van mij dit seizoen, dat ik nog niet genoeg geef?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Rolfocus</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf één specifieke actie op die jij volgende week bewust gaat doen om je rol te versterken. Maak het zo concreet dat je het achteraf kan evalueren.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Individual commitment to a group effort — that is what makes a team work, a company work, a society work, a civilization work."',
    cite: 'Vince Lombardi — 5× NFL Champion Coach',
    footer: 'Maand 3: Mijn Rol in het Team',
  },
  {
    m: 4, title: 'Communicatie',
    monthLabel: 'Maand 4 — Spelerswerkblad',
    goalLabel: 'Doelstelling Maand 4',
    goals: [
      'Je kan het Ik-Boodschap model toepassen in een echte situatie uit je sportleven',
      'Je geeft constructieve feedback aan een teamgenoot zonder beschuldiging op te wekken',
      'Je plant en voert minstens één moeilijk gesprek dat je al uitstelde',
    ],
    intro: 'Hoe je praat bepaalt hoe je samenwerkt. Je leert het verschil tussen reageren en echt communiceren, en hoe je feedback geeft zonder relaties te beschadigen.',
    page1: `
      <div class="section-title">Oefening 1 — De Ik-Boodschap</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>De Ik-Boodschap</div>
        <p class="ex-instr">Model: "Ik zie… Ik voel… Ik heb nodig… Ik vraag je om…" Denk aan een echte situatie.</p>
        <div class="field-label">De situatie:</div>
        <div class="box box-xs"></div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK ZIE...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VOEL...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK HEB NODIG...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VRAAG JE OM...</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Oefening 2 — Het Gesprek dat ik Uitstel</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Het Gesprek dat ik Uitstel</div>
        <p class="ex-instr">Schrijf een gesprek op dat je al lang wil hebben maar uitstelt — met een coach, teamgenoot of ouder.</p>
        <div class="field-label">Met wie?</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Waarom stel ik het uit?</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:6px">De eerste zin waarmee ik dit gesprek open:</div>
        <div class="box box-xs"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Na de Feedbackronde</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Feedbackronde Reflectie</div>
        <p class="ex-instr">Wat was de beste feedback die je kreeg? Wat ga je er concreet mee doen?</p>
        <div class="field-label">De beste feedback die ik kreeg:</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">Wat ga ik er concreet mee doen?</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">Wat leerde ik over hoe ik zelf feedback geef?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Luisteren onder druk</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Tijdens de volgende kritische moment in training: adem 2× diep in voordat je reageert. Schrijf achteraf op: wat was het moment en hoe reageerde ik anders?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"The single biggest problem in communication is the illusion that it has taken place."',
    cite: 'George Bernard Shaw — Nobelprijswinnaar Literatuur',
    footer: 'Maand 4: Communicatie',
  },
  {
    m: 5, title: 'Team Eerst',
    monthLabel: 'Maand 5 — Spelerswerkblad',
    goalLabel: 'Doelstelling Maand 5',
    goals: [
      'Je kan uitleggen wat psychologische veiligheid is en waarom het teamsprestaties beïnvloedt',
      'Je draagt actief bij aan een veilig teamklimaat door hulp te vragen en anderen te erkennen',
      'Je sluit mee een gezamenlijk team contract af dat het seizoen begeleidt',
    ],
    intro: 'De stap van "ik" naar "wij" is de moeilijkste in de sport. Vandaag onderzoek je wat het echt betekent om het team voorop te stellen, ook als het je iets kost.',
    page1: `
      <div class="section-title">Oefening 1 — Team Contract</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Mijn Bijdrage aan het Team Contract</div>
        <p class="ex-instr">Schrijf drie gedragsregels op die jij persoonlijk wil naleven dit seizoen — over hoe je met teamgenoten omgaat.</p>
        <div class="lines" style="gap:12px">
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.72rem;font-weight:700;color:var(--orange);white-space:nowrap">Ik beloof om</span><div class="line" style="flex:1"></div></div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.72rem;font-weight:700;color:var(--orange);white-space:nowrap">Ik beloof om</span><div class="line" style="flex:1"></div></div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.72rem;font-weight:700;color:var(--orange);white-space:nowrap">Ik beloof om</span><div class="line" style="flex:1"></div></div>
        </div>
        <div class="sign-row" style="margin-top:12px">
          <div class="sign-field"><div class="sign-label">Handtekening</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Oefening 2 — Onzichtbare Bijdrage</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Onzichtbare Bijdrage</div>
        <p class="ex-instr">Schrijf één teamgenoot op die iets deed tijdens de laatste wedstrijd of training wat niemand opmerkte maar essentieel was.</p>
        <div class="field-label">Naam teamgenoot:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Wat deed hij of zij concreet?</div>
        <div class="box box-md"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Hulp Logboek</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Hulp Logboek</div>
        <p class="ex-instr">Vraag minstens 3× actief om hulp aan een teamgenoot. Schrijf op wat je vroeg, aan wie, en wat het opleverde.</p>
        <div style="display:grid;grid-template-columns:1.8fr 1.8fr 1.2fr 0.8fr;gap:6px;margin-top:4px">
          <div class="field-label">WAT VROEG IK?</div>
          <div class="field-label">WAT LEVERDE HET OP?</div>
          <div class="field-label">AAN WIE?</div>
          <div class="field-label">DATUM</div>
          <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
        </div>
        <div class="field-label" style="margin-top:8px">Hoe voelde het om om hulp te vragen? Wat leerde ik?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Ego loslaten</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf één moment op waarbij je iets hebt opgegeven voor het team (speeltijd, positie, aandacht). Hoe voelde je je erna? Wat zegt dat over jouw groei?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Talent wins games, but teamwork and intelligence win championships."',
    cite: 'Michael Jordan — 6× NBA Champion, Chicago Bulls',
    footer: 'Maand 5: Team Eerst',
  },
  {
    m: 6, title: 'Veerkracht & Groeimindset',
    monthLabel: 'Maand 6 — Spelerswerkblad',
    goalLabel: 'Doelstelling Maand 6',
    goals: [
      'Je onderscheidt een fixed mindset reactie van een groeimindset reactie bij jezelf',
      'Je herschrijft minstens één negatieve zelfgedachte naar een leergerichte formulering',
      'Je benoemt drie concrete manieren waarop je gegroeid bent dit seizoen',
    ],
    intro: 'Hoe je omgaat met tegenslagen en fouten bepaalt hoe ver je komt in de sport en in het leven. Een groeimindset is niet aangeboren — je kan het trainen.',
    page1: `
      <div class="section-title">Oefening 1 — Herschrijf de Fout</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Herschrijf de Fout</div>
        <p class="ex-instr">Schrijf een recente fout op. Herschrijf elke "ik kan het niet" gedachte naar "ik kan het nog niet" en voeg toe wat je ervan leert.</p>
        <div class="field-label">De fout of tegenslag:</div>
        <div class="box box-xs"></div>
        <div class="two-col" style="margin-top:8px">
          <div>
            <div class="col-label" style="color:#c0392b">WAT IK DACHT (fixed)</div>
            <div class="box box-md"></div>
          </div>
          <div>
            <div class="col-label" style="color:#27ae60">HOE IK HET HERSCHRIJF (growth)</div>
            <div class="box box-md"></div>
          </div>
        </div>
      </div>
      <div class="section-title">Oefening 2 — Progressielijst</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>3 Dingen die ik Beter Kan dan Vorige Maand</div>
        <p class="ex-instr">Geen vergelijking met anderen — enkel met jezelf.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Mijn Moeilijkste Moment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Moeilijkste Moment dit Seizoen</div>
        <p class="ex-instr">Beschrijf het moeilijkste moment. Wat deed je? Wat leerde je? Hoe ben je sterker geworden?</p>
        <div class="field-label">Wat was het moment?</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">Hoe reageerde ik, en wat leerde ik ervan?</div>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — De 24u-Regel</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Na een slechte wedstrijd of training: je hebt 24u om te balen. Daarna richt je je blik vooruit. Schrijf op hoe jij de overschakeling maakt van "balen" naar "leren".</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"I have missed more than 9,000 shots in my career. I have failed over and over again in my life. And that is why I succeed."',
    cite: 'Michael Jordan — 6× NBA Champion',
    footer: 'Maand 6: Veerkracht & Groeimindset',
  },
  {
    m: 7, title: 'Leiderschap van Binnenuit',
    monthLabel: 'Maand 7 — Spelerswerkblad',
    goalLabel: 'Doelstelling Maand 7',
    goals: [
      'Je herkent informeel leiderschap bij jezelf en anderen zonder te kijken naar officiële rollen',
      'Je neemt minstens éénmaal per week bewust een leidersmoment in training of wedstrijd',
      'Je investeert actief in de ontwikkeling van een jongere of nieuwe teamgenoot',
    ],
    intro: 'Leiderschap gaat niet over de aanvoerdersband. Elke speler kan op elk moment leiden door gedrag, houding en woorden. Jij ook.',
    page1: `
      <div class="section-title">Oefening 1 — Informele Leiders in ons Team</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Informele Leiders</div>
        <p class="ex-instr">Schrijf twee teamgenoten op die jij volgt — niet omdat ze aanvoerder zijn, maar omdat ze iets uitstralen. Wat doen ze concreet?</p>
        <div class="field-label">Persoon 1 — naam:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Wat maakt hem/haar invloedrijk?</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">Persoon 2 — naam:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Wat maakt hem/haar invloedrijk?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2 — Mijn Mentormoment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Mijn Mentormoment</div>
        <p class="ex-instr">Kies een jongere speler of nieuwe teamgenoot en besteed minstens eenmaal 5 minuten aan hem/haar.</p>
        <div class="two-col">
          <div><div class="field-label">Met wie?</div><div class="line"></div></div>
          <div><div class="field-label">Wat wilde ik meegeven?</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:6px">Hoe reageerde die persoon? Wat leerde ik zelf?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Logboek: De Eerste Stem</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Leidersmomenten Logboek</div>
        <p class="ex-instr">Schrijf na elke training of wedstrijd op wanneer jij de eerste stem was of een leidersmoment nam. Wat deed je precies?</p>
        <div class="box box-lg"></div>
        <div class="field-label" style="margin-top:8px">Welk type leiderschap wil ik meer laten zien?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Druk als leider</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf op: wat doe jij als leider wanneer het team verliest en de sfeer daalt? Welke drie concrete acties of woorden gebruik jij om het tij te keren?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Leadership is not about being in charge. It is about taking care of those in your charge."',
    cite: 'Simon Sinek — auteur & leiderschapsexpert',
    footer: 'Maand 7: Leiderschap van Binnenuit',
  },
  {
    m: 8, title: 'Nalatenschap & Volgende Stap',
    monthLabel: 'Maand 8 — Spelerswerkblad',
    goalLabel: 'Doelstelling Maand 8',
    goals: [
      'Je reflecteert op je groei als persoon en als ploegmaat over het volledige seizoen',
      'Je formuleert drie concrete, gedragsgerichte intenties voor volgend seizoen',
      'Je sluit het seizoen af met een bewust gevoel van zingeving en bijdrage',
    ],
    intro: 'Dit is het laatste werkblad van het seizoen. Je sluit af met reflectie op wie je bent geworden, wat je hebt bijgedragen en welke stap je wil zetten.',
    page1: `
      <div class="section-title">Oefening 1 — 5 Momenten van Karakter</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>5 Momenten van Karakter</div>
        <p class="ex-instr">Schrijf vijf concrete momenten op dit seizoen waarop jij iets hebt bijgedragen op vlak van gedrag en karakter.</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">1</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">2</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">3</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">4</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">5</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 2 — Drie Intenties voor Volgend Seizoen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Mijn Intenties</div>
        <p class="ex-instr">Schrijf drie concrete intenties voor volgend seizoen in gedrag.</p>
        <div class="intentions">
          <div><div class="intent-label">VOOR MEZELF</div><div class="box box-sm"></div></div>
          <div><div class="intent-label">VOOR HET TEAM</div><div class="box box-sm"></div></div>
          <div><div class="intent-label">VOOR MIJN COACH</div><div class="box box-sm"></div></div>
        </div>
      </div>
      <div class="letter-box" style="margin-top:4px">
        <div class="ex-title"><div class="ex-num">3</div>Brief aan Mijn Toekomstige Zelf</div>
        <p class="ex-instr" style="font-size:0.74rem;color:var(--gray-600)">Schrijf een brief aan jezelf van volgend seizoen. Welk type ploegmaat wil je zijn? Deze brief wordt bewaard en geopend bij de start van volgend seizoen.</p>
        <div class="box box-md"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Handtekening</div><div class="line"></div></div>
        </div>
      </div>`,
    quote: '"You are never really playing an opponent. You are playing yourself, your own highest standards, and when you reach your limits, that is real joy."',
    cite: 'Arthur Ashe — Wimbledon & US Open Champion',
    footer: 'Maand 8: Nalatenschap & Volgende Stap',
  },
];

// ─── EN DATA ────────────────────────────────────────────────────────────────
const EN_OVERRIDES = {
  titles:   { 1:'Self-Knowledge & Identity', 2:'Pressure & Stress', 3:'My Role in the Team', 4:'Communication', 5:'Team First', 6:'Resilience & Growth Mindset', 7:'Leadership from Within', 8:'Legacy & Next Step' },
  goalLabels: { 1:'Goals Month 1',2:'Goals Month 2',3:'Goals Month 3',4:'Goals Month 4',5:'Goals Month 5',6:'Goals Month 6',7:'Goals Month 7',8:'Goals Month 8' },
  footers:  { 1:'Month 1: Self-Knowledge & Identity', 2:'Month 2: Pressure & Stress', 3:'Month 3: My Role in the Team', 4:'Month 4: Communication', 5:'Month 5: Team First', 6:'Month 6: Resilience & Growth Mindset', 7:'Month 7: Leadership from Within', 8:'Month 8: Legacy & Next Step' },
  intros: {
    1:"Who are you as a player and as a person? This worksheet helps you better understand your own strengths, values, and motivation. Take your time and be honest.",
    2:"Feeling pressure is normal. Every top athlete feels it. What makes the difference is how you deal with it. This worksheet helps you discover how your body and mind respond to stress.",
    3:"You don't have one role in a team. You have several, and they change. This worksheet helps you discover which roles you fulfill and which you want to develop.",
    4:"How you speak determines how you work together. You learn the difference between reacting and truly communicating, and how to give feedback without damaging relationships.",
    5:'The step from "I" to "we" is the hardest in sports. Today you explore what it really means to put the team first, even when it costs you something.',
    6:"How you deal with setbacks and mistakes determines how far you go in sports and in life. A growth mindset is not innate — you can train it.",
    7:"Leadership is not about the captain's armband. Every player can lead at any moment through behavior, attitude, and words. You too.",
    8:"This is the last worksheet of the season. You close with reflection on who you have become, what you have contributed, and what step you want to take.",
  },
  goals: {
    1:['You can name three core values that define you as a person and teammate','You recognize what gives you energy and what costs energy in a team setting','You understand the difference between how you see yourself and how others see you'],
    2:['You recognize the physical and mental signals of stress in yourself','You master at least one breathing technique to regulate activation','You can name the difference between problem-focused and emotion-focused coping'],
    3:['You can name your current role(s) in the team with concrete examples','You understand why role clarity contributes to team cohesion and personal motivation','You formulate one concrete contribution you want to strengthen in the coming months'],
    4:['You can apply the I-Message model in a real situation from your sports life','You give constructive feedback to a teammate without triggering blame','You plan and have at least one difficult conversation you have been postponing'],
    5:['You can explain what psychological safety is and why it affects team performance','You actively contribute to a safe team climate by asking for help and acknowledging others','You co-sign a joint team contract that guides the season'],
    6:['You distinguish a fixed mindset reaction from a growth mindset reaction in yourself','You rewrite at least one negative self-thought into a learning-oriented formulation','You name three concrete ways you have grown this season'],
    7:['You recognize informal leadership in yourself and others without looking at official roles','You deliberately take a leadership moment at least once a week in training or a match','You actively invest in the development of a younger or newer teammate'],
    8:['You reflect on your growth as a person and teammate over the full season','You formulate three concrete, behavior-oriented intentions for next season','You close the season with a conscious feeling of purpose and contribution'],
  },
  monthLabels: { 1:'Month 1 — Player Worksheet',2:'Month 2 — Player Worksheet',3:'Month 3 — Player Worksheet',4:'Month 4 — Player Worksheet',5:'Month 5 — Player Worksheet',6:'Month 6 — Player Worksheet',7:'Month 7 — Player Worksheet',8:'Month 8 — Player Worksheet' },
  page1: {
    1:`
      <div class="section-title">Exercise 1 — My Three Words</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>My Three Words</div>
        <p class="ex-instr">Choose three words that best describe you as a teammate. Then ask two teammates to write three words about you too.</p>
        <div class="field-label">My three words:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Words from teammate 1:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Words from teammate 2:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">What stands out when you compare the lists?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2 — Energy Givers vs Energy Drains</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Energy Givers vs Energy Drains</div>
        <p class="ex-instr">Write three things that give you energy and three that drain your energy during training or a match.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--orange)">ENERGY GIVERS ▶</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#999">ENERGY DRAINS ▼</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:6px">How can I build in more energy givers in my routine?</div>
        <div class="box box-xs"></div>
      </div>`,
    2:`
      <div class="section-title">Exercise 1 — Box Breathing Log</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Box Breathing Log</div>
        <p class="ex-instr">Practice Box Breathing at least 3× this month. Note date, situation and how you felt before and after (scale 1–10).</p>
        <div style="display:grid;grid-template-columns:2.5fr 1fr 1fr;gap:6px;margin-top:4px">
          <div class="field-label">DATE & SITUATION</div>
          <div class="field-label">BEFORE (1–10)</div>
          <div class="field-label">AFTER (1–10)</div>
          <div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div>
        </div>
        <div class="field-label" style="margin-top:6px">What do I notice after Box Breathing in myself?</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Exercise 2 — Stress Diary</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Stress Diary</div>
        <p class="ex-instr">Write after your next match: what did you feel, what did you think, what did you do?</p>
        <div class="field-label">What did I feel? (physical and emotional)</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:6px">What did I think?</div>
        <div class="box box-xs"></div>
        <div class="field-label" style="margin-top:6px">What did I do? (how did I respond to the pressure?)</div>
        <div class="box box-xs"></div>
      </div>`,
    3:`
      <div class="section-title">Exercise 1 — Role Compass</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Role Compass</div>
        <p class="ex-instr">Give yourself a score from 0 to 10 for each of the four roles.</p>
        <div class="score-bars">
          <div class="score-row">
            <div class="score-label"><strong>Leader</strong><span class="score-sub">Gives direction, addresses the group</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
          <div class="score-row">
            <div class="score-label"><strong>Engine</strong><span class="score-sub">Gives energy, pulls the team along</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
          <div class="score-row">
            <div class="score-label"><strong>Thinker</strong><span class="score-sub">Analyzes, asks questions, finds solutions</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
          <div class="score-row">
            <div class="score-label"><strong>Stable Force</strong><span class="score-sub">Reliable, consistent, support for others</span></div>
            <div class="score-bar"><span>Score: ___/10</span></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">My strongest role is <span style="color:var(--orange);font-weight:700">_________________________</span> because:</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Exercise 2 — My Top 3 Contributions</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>My Top 3 Contributions This Month</div>
        <p class="ex-instr">No statistics — write three things you contributed in terms of behavior, attitude, or character.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Which contribution do I want to strengthen next month?</div>
        <div class="box box-xs"></div>
      </div>`,
    4:`
      <div class="section-title">Exercise 1 — The I-Message</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>The I-Message</div>
        <p class="ex-instr">Model: "I see… I feel… I need… I ask you to…" Think of a real situation.</p>
        <div class="field-label">The situation:</div>
        <div class="box box-xs"></div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I SEE...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I FEEL...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I NEED...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I ASK YOU TO...</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Exercise 2 — The Conversation I Keep Postponing</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>The Conversation I Keep Postponing</div>
        <p class="ex-instr">Write a conversation you've wanted to have but keep postponing — with a coach, teammate, or parent.</p>
        <div class="field-label">With whom?</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">Why do I keep postponing it?</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:6px">The first sentence I will use to open the conversation:</div>
        <div class="box box-xs"></div>
      </div>`,
    5:`
      <div class="section-title">Exercise 1 — Team Contract</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>My Contribution to the Team Contract</div>
        <p class="ex-instr">Write three behavioral rules you personally want to uphold this season — about how you treat your teammates.</p>
        <div class="lines" style="gap:12px">
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.72rem;font-weight:700;color:var(--orange);white-space:nowrap">I promise to</span><div class="line" style="flex:1"></div></div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.72rem;font-weight:700;color:var(--orange);white-space:nowrap">I promise to</span><div class="line" style="flex:1"></div></div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.72rem;font-weight:700;color:var(--orange);white-space:nowrap">I promise to</span><div class="line" style="flex:1"></div></div>
        </div>
        <div class="sign-row" style="margin-top:12px">
          <div class="sign-field"><div class="sign-label">Signature</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Exercise 2 — Invisible Contribution</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Invisible Contribution</div>
        <p class="ex-instr">Write one teammate who did something during the last match or training that nobody noticed but was essential for the team.</p>
        <div class="field-label">Teammate's name:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">What did he or she concretely do?</div>
        <div class="box box-md"></div>
      </div>`,
    6:`
      <div class="section-title">Exercise 1 — Rewrite the Mistake</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rewrite the Mistake</div>
        <p class="ex-instr">Write a recent mistake. Rewrite every "I can't" thought to "I can't yet" and add what you learn from it.</p>
        <div class="field-label">The mistake or setback:</div>
        <div class="box box-xs"></div>
        <div class="two-col" style="margin-top:8px">
          <div>
            <div class="col-label" style="color:#c0392b">WHAT I THOUGHT (fixed)</div>
            <div class="box box-md"></div>
          </div>
          <div>
            <div class="col-label" style="color:#27ae60">HOW I REWRITE IT (growth)</div>
            <div class="box box-md"></div>
          </div>
        </div>
      </div>
      <div class="section-title">Exercise 2 — Progress List</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>3 Things I Do Better Than Last Month</div>
        <p class="ex-instr">No comparison with others — only with yourself.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
      </div>`,
    7:`
      <div class="section-title">Exercise 1 — Informal Leaders in Our Team</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Informal Leaders</div>
        <p class="ex-instr">Write two teammates you follow — not because they are captain, but because they radiate something. What do they concretely do?</p>
        <div class="field-label">Person 1 — name:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">What makes him/her influential?</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">Person 2 — name:</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:6px">What makes him/her influential?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2 — My Mentor Moment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>My Mentor Moment</div>
        <p class="ex-instr">Choose a younger player or new teammate and spend at least 5 minutes with him/her this month.</p>
        <div class="two-col">
          <div><div class="field-label">With whom?</div><div class="line"></div></div>
          <div><div class="field-label">What did I want to share?</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:6px">How did that person respond? What did I learn myself?</div>
        <div class="box box-sm"></div>
      </div>`,
    8:`
      <div class="section-title">Exercise 1 — 5 Moments of Character</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>5 Moments of Character</div>
        <p class="ex-instr">Write five concrete moments this season where you contributed through behavior and character.</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">1</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">2</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">3</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">4</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
          <div><div class="num-item" style="margin-bottom:3px"><div class="ex-num">5</div><div class="line" style="flex:1"></div></div><div class="box box-xs"></div></div>
        </div>
      </div>`,
  },
  page2: {
    1:`
      <div class="section-title">Exercise 3 — Personal Values Compass</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Personal Values Compass</div>
        <p class="ex-instr">Rank the values below from 1 (most important) to 6 (least important) for you as a player and person.</p>
        <div class="rank-grid">
          <div class="rank-item"><div class="rank-box"></div> Loyalty</div>
          <div class="rank-item"><div class="rank-box"></div> Honesty</div>
          <div class="rank-item"><div class="rank-box"></div> Courage</div>
          <div class="rank-item"><div class="rank-box"></div> Perseverance</div>
          <div class="rank-item"><div class="rank-box"></div> Respect</div>
          <div class="rank-item"><div class="rank-box"></div> Team Spirit</div>
        </div>
        <div class="field-label" style="margin-top:10px">Which value do you live up to least? What do you want to change?</div>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Reflection</div>
      <div class="ex">
        <p class="ex-instr">When you look back at the end of this season: what kind of teammate do you want to have been?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Positive Self-Talk</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write one sentence you say to yourself when you doubt yourself as a player. Then rewrite it positively as a strength.</p>
        <div class="field-label" style="color:rgba(255,255,255,.5)">My power sentence for this season:</div>
        <div class="mental-box"></div>
      </div>`,
    2:`
      <div class="section-title">Exercise 3 — Worst Case · Best Case · Most Likely</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Worst Case Best Case</div>
        <p class="ex-instr">Think of a situation that makes you nervous. Write the three scenarios and make a plan.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:#c0392b">WORST CASE</div>
            <div class="box box-md"></div>
          </div>
          <div>
            <div class="col-label" style="color:#27ae60">BEST CASE</div>
            <div class="box box-md"></div>
          </div>
        </div>
        <div class="col-label" style="color:var(--orange);margin-top:8px">MOST LIKELY</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:6px">My action plan when pressure builds up:</div>
        <div class="box box-xs"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Pre-Game Routine</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write your ideal mental preparation before a match (3 steps: breathing, focus-word, action). Practice this at least 2× this month.</p>
        <div class="field-label" style="color:rgba(255,255,255,.5)">My pre-game routine in 3 steps:</div>
        <div class="mental-box"></div>
      </div>`,
    3:`
      <div class="section-title">Exercise 3 — Role Circle Reflection</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>After the Role Circle</div>
        <p class="ex-instr">After the group exercise: what surprised you? Which contribution from a teammate did you not expect?</p>
        <div class="box box-lg"></div>
        <div class="field-label" style="margin-top:8px">Which role do I want to consciously take on more in the coming weeks?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Team Reflection</div>
      <div class="ex">
        <p class="ex-instr">What does this team need from me this season that I'm not giving enough yet?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Role Focus</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write one specific action you will consciously take next week to strengthen your role. Make it concrete enough to evaluate afterward.</p>
        <div class="mental-box"></div>
      </div>`,
    4:`
      <div class="section-title">Exercise 3 — After the Feedback Round</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Feedback Round Reflection</div>
        <p class="ex-instr">What was the best feedback you received? What will you concretely do with it?</p>
        <div class="field-label">The best feedback I received:</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">What will I concretely do with it?</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">What did I learn about how I give feedback myself?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Listening under Pressure</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">During the next critical moment in training: breathe in 2× deeply before responding. Write afterward: what was the moment and how did I respond differently?</p>
        <div class="mental-box"></div>
      </div>`,
    5:`
      <div class="section-title">Exercise 3 — Help Log</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Help Log</div>
        <p class="ex-instr">Ask for help actively at least 3× from a teammate. Write what you asked, from whom, and what it delivered.</p>
        <div style="display:grid;grid-template-columns:1.8fr 1.8fr 1.2fr 0.8fr;gap:6px;margin-top:4px">
          <div class="field-label">WHAT DID I ASK?</div>
          <div class="field-label">WHAT DID IT DELIVER?</div>
          <div class="field-label">FROM WHOM?</div>
          <div class="field-label">DATE</div>
          <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
          <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
        </div>
        <div class="field-label" style="margin-top:8px">How did it feel to ask for help? What did I learn?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Letting Go of Ego</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write one moment where you gave something up for the team (playing time, position, spotlight). How did you feel afterward? What does that say about your growth?</p>
        <div class="mental-box"></div>
      </div>`,
    6:`
      <div class="section-title">Exercise 3 — My Hardest Moment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Hardest Moment This Season</div>
        <p class="ex-instr">Describe the hardest moment. What did you do? What did you learn? How did you become stronger?</p>
        <div class="field-label">What was the moment?</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">How did I respond, and what did I learn from it?</div>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — The 24h Rule</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">After a bad match or training: you have 24h to be upset. After that, you look forward. Write how you make the switch from "frustration" to "learning".</p>
        <div class="mental-box"></div>
      </div>`,
    7:`
      <div class="section-title">Exercise 3 — Log: The First Voice</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Leadership Moments Log</div>
        <p class="ex-instr">After each training or match, write when you were the first voice or took a leadership moment. What did you do exactly?</p>
        <div class="box box-lg"></div>
        <div class="field-label" style="margin-top:8px">What type of leadership do I want to show more?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Pressure as a Leader</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write: what do you do as a leader when the team loses and the atmosphere drops? What three concrete actions or words do you use to turn the tide?</p>
        <div class="mental-box"></div>
      </div>`,
    8:`
      <div class="section-title">Exercise 2 — Three Intentions for Next Season</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>My Intentions</div>
        <p class="ex-instr">Write three concrete intentions for next season in behavior.</p>
        <div class="intentions">
          <div><div class="intent-label">FOR MYSELF</div><div class="box box-sm"></div></div>
          <div><div class="intent-label">FOR THE TEAM</div><div class="box box-sm"></div></div>
          <div><div class="intent-label">FOR MY COACH</div><div class="box box-sm"></div></div>
        </div>
      </div>
      <div class="letter-box" style="margin-top:4px">
        <div class="ex-title"><div class="ex-num">3</div>Letter to My Future Self</div>
        <p class="ex-instr" style="font-size:0.74rem;color:var(--gray-600)">Write a letter to yourself from next season. What kind of teammate do you want to be? This letter is kept and opened at the start of next season.</p>
        <div class="box box-md"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Signature</div><div class="line"></div></div>
        </div>
      </div>`,
  },
};

function buildHTML(data, lang) {
  const isEN = lang === 'EN';
  const ov = EN_OVERRIDES;
  const m = data.m;

  const title     = isEN ? ov.titles[m]      : data.title;
  const mLabel    = isEN ? ov.monthLabels[m]  : data.monthLabel;
  const goalLabel = isEN ? ov.goalLabels[m]   : data.goalLabel;
  const goals     = isEN ? ov.goals[m]        : data.goals;
  const intro     = isEN ? ov.intros[m]       : data.intro;
  const p1        = isEN ? ov.page1[m]        : data.page1;
  const p2        = isEN ? ov.page2[m]        : data.page2;
  const footer    = isEN ? ov.footers[m]      : data.footer;

  const badge = isEN ? 'PLAYER WORKSHEET' : 'SPELERSWERKBLAD';
  const program = isEN ? 'CHARACTER <span>FIRST</span>' : 'CHARACTER <span>FIRST</span>';

  return `<!DOCTYPE html>
<html lang="${isEN ? 'en' : 'nl'}">
<head><meta charset="UTF-8"><style>${CSS}</style></head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div class="page-header">
    <div>
      <div class="month-label">${mLabel}</div>
      <h2>${title}</h2>
    </div>
    <div class="page-header-right">
      <div class="badge">${badge}</div>
      <div class="logo">${program}</div>
    </div>
  </div>

  <div class="goal-box">
    <div class="goal-label">${goalLabel}</div>
    <ul>${goals.map(g => `<li>${g}</li>`).join('')}</ul>
  </div>

  <div class="intro-box">${intro}</div>

  ${p1}

  <div class="page-footer">
    <span>${EMAIL}</span>
    <span>Created by Tom Pauwaert</span>
    <span>${footer} · ${isEN ? 'Page' : 'Pagina'} 1/2</span>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="cont-header">
    <div class="cont-title">${title}, ${isEN ? 'continued' : 'vervolg'}</div>
    <div class="cont-month">${mLabel}</div>
  </div>

  ${p2}

  <div class="quote-wrap">
    <div class="quote-block">
      <p>${data.quote}</p>
      <cite>${data.cite}</cite>
    </div>
  </div>

  <div class="page-footer">
    <span>${EMAIL}</span>
    <span>Created by Tom Pauwaert</span>
    <span>${footer} · ${isEN ? 'Page' : 'Pagina'} 2/2</span>
  </div>
</div>

</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const d of NL) {
    // NL
    const htmlNL = buildHTML(d, 'NL');
    await page.setContent(htmlNL, { waitUntil: 'networkidle' });
    const outNL = path.join(OUT_NL, `CF_Werkblad_Speler_M${d.m}_NL.pdf`);
    await page.pdf({ path: outNL, format: 'A4', printBackground: true });
    const szNL = Math.round(fs.statSync(outNL).size / 1024);
    console.log(`NL M${d.m} → ${szNL}KB`);

    // EN
    const htmlEN = buildHTML(d, 'EN');
    await page.setContent(htmlEN, { waitUntil: 'networkidle' });
    const outEN = path.join(OUT_EN, `CF_Werkblad_Speler_M${d.m}_EN.pdf`);
    await page.pdf({ path: outEN, format: 'A4', printBackground: true });
    const szEN = Math.round(fs.statSync(outEN).size / 1024);
    console.log(`EN M${d.m} → ${szEN}KB`);
  }

  await browser.close();
  console.log('Done!');
})();
