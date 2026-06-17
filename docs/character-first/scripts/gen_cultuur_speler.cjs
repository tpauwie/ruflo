const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_NL = '/home/user/ruflo/docs/character-first/werkbladen-pdf/cultuur-speler';
const OUT_EN = '/home/user/ruflo/docs/character-first/werkbladen-pdf/cultuur-speler-en';
[OUT_NL, OUT_EN].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const EMAIL = 'info@characterfirst.be';

const CSS = `
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

const NL = [
  {
    s: 1, title: 'Onze identiteit',
    sessionLabel: 'Preseason sessie 1: spelerswerkblad',
    goalLabel: 'Doelstelling sessie 1',
    goals: [
      'Je benoemt drie waarden die je dit seizoen in ons team wil zien',
      'Je snapt waarom een gedeelde identiteit de basis is van een sterk team',
      'Je helpt mee aan één zin die ons team dit seizoen beschrijft',
    ],
    intro: 'Cultuur begint niet met regels. Het begint met wie je bent. Wie zijn wij als team? Niet wat we willen winnen, maar hoe we willen zijn. Dit werkblad legt de basis.',
    page1: `
      <div class="section-title">Oefening 1: wie zijn wij?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Drie woorden voor ons team</div>
        <p class="ex-instr">Schrijf drie woorden op. Woorden die jij wil dat mensen over ons team zeggen. Niet over de resultaten, maar over ons gedrag.</p>
        <div class="field-label">Mijn drie woorden:</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
        <div class="field-label" style="margin-top:8px">Na de groepsdiscussie: de drie woorden die ons team koos.</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
      </div>
      <div class="section-title">Oefening 2: onze cultuurankers</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wat houd ik vast, wat laat ik los?</div>
        <p class="ex-instr">Denk aan vorig seizoen. Wat willen we behouden? Wat laten we bewust achter?</p>
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
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: onze teamzin</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Eén zin die ons beschrijft</div>
        <p class="ex-instr">Schrijf samen één zin. Een zin die zegt wie jullie dit seizoen willen zijn, als team. Geen slogan, maar een echte belofte.</p>
        <div class="field-label">Onze teamzin dit seizoen:</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">Wat betekent deze zin voor mij als speler?</div>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Persoonlijke reflectie</div>
      <div class="ex">
        <p class="ex-instr">Welk gedrag paste vorig seizoen niet bij de cultuur die we nu willen? Van jezelf of van het team. Wat ga je daaraan doen?</p>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: onze identiteit verdedigen</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Soms zet een speler onze waarden onder druk, met opzet of niet. Wat doen we dan als team? Schrijf op wat jij zegt of doet wanneer dit gebeurt.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Culture is not just one aspect of the game, it is the game."',
    cite: 'Lou Gerstner, CEO IBM',
    footer: 'Preseason S1: Onze identiteit',
  },
  {
    s: 2, title: 'Ons Team Contract',
    sessionLabel: 'Preseason Sessie 2 — Spelerswerkblad',
    goalLabel: 'Doelstelling Sessie 2',
    goals: [
      'Je co-creëert gedragsnormen die jij persoonlijk onderschrijft en nakomt',
      'Je begrijpt het verschil tussen regels opgelegd door de coach en normen die het team zelf maakt',
      'Je tekent bewust een contract als uiting van commitment aan de teamcultuur',
    ],
    intro: 'Een teamcontract werkt niet als de coach het maakt. Het werkt als jullie het zelf schrijven. Vandaag bouwen jullie de gedragscode die dit seizoen jullie cultuur beschermt.',
    page1: `
      <div class="section-title">Oefening 1 — Wat Verwachten We van Elkaar?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Mijn Top 3 Verwachtingen</div>
        <p class="ex-instr">Schrijf drie concrete gedragingen op die jij van elke teamgenoot verwacht — niet over prestaties, maar over houding, respect en inzet.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Welke verwachting ben jij zelf het meest bereid na te komen?</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Oefening 2 — Mijn Persoonlijke Belofte</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wat Beloof Ik het Team?</div>
        <p class="ex-instr">Schrijf drie beloftes op die jij persoonlijk maakt aan het team voor dit seizoen. Maak ze zo concreet dat je ze na het seizoen kan evalueren.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Handtekening & Commitment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Het Team Contract</div>
        <p class="ex-instr">Na de groepsdiscussie: schrijf hieronder de drie gezamenlijke gedragsregels die jullie als team hebben gekozen. Teken daarna bewust als uiting van jouw commitment.</p>
        <div class="field-label">Ons team kiest voor:</div>
        <div class="num-list" style="margin-top:4px">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">Wat doe ik als een teamgenoot het contract niet nakomt?</div>
        <div class="box box-sm"></div>
        <div class="sign-row" style="margin-top:8px">
          <div class="sign-field"><div class="sign-label">Naam</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Handtekening</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Reflectie</div>
      <div class="ex">
        <p class="ex-instr">Welke belofte zal voor jou het moeilijkst zijn om na te komen? Waarom? En hoe ga je jezelf hierop aanspreken?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Commitment onder druk</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf het scenario op waarbij jij de meeste kans hebt om je belofte te breken (bv. na een verlies, conflict, slechte dag). Wat doe je dan concreet om toch je commitment na te komen?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Agreements, not rules. You can break a rule. You own an agreement."',
    cite: 'Atul Gawande — chirurg & teamonderzoeker',
    footer: 'Preseason S2: Ons Team Contract',
  },
  {
    s: 3, title: 'Vertrouwen & Veiligheid',
    sessionLabel: 'Preseason Sessie 3 — Spelerswerkblad',
    goalLabel: 'Doelstelling Sessie 3',
    goals: [
      'Je kan uitleggen wat psychologische veiligheid is en waarom het teamcultuur maakt of breekt',
      'Je herkent concreet gedrag dat vertrouwen opbouwt of afbreekt in jouw team',
      'Je neemt een bewuste stap om kwetsbaarheid te tonen aan een teamgenoot',
    ],
    intro: 'Zonder vertrouwen is er geen echte cultuur — alleen façade. Teams die kwetsbaarheid durven tonen, presteren beter, leren sneller en houden langer vol. Vandaag bouwen we dat fundament.',
    page1: `
      <div class="section-title">Oefening 1 — Vertrouwensbarometer</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Hoe Veilig Voel Ik Me in ons Team?</div>
        <p class="ex-instr">Geef eerlijk een score van 1 tot 10 voor elk van de onderstaande situaties. Er is geen goed of fout antwoord.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
          <div class="field-label">Ik durf fouten toe te geven in ons team: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">Ik durf om hulp te vragen zonder me zwak te voelen: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">Ik durf mijn mening te zeggen ook als die verschilt: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">Ik voel me gesteund na een slechte wedstrijd: <span style="color:var(--orange);font-weight:700">___/10</span></div>
        </div>
        <div class="field-label" style="margin-top:10px">Wat valt je op aan je scores? Waar zit ruimte voor groei?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2 — Vertrouwen Bouwen of Breken</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Concrete Gedragingen</div>
        <p class="ex-instr">Schrijf twee concrete gedragingen op die vertrouwen bouwen in een team, en twee die vertrouwen afbreken — uit jouw eigen ervaring.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">BOUWT VERTROUWEN</div>
            <div class="lines"><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">BREEKT VERTROUWEN</div>
            <div class="lines"><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">Welk gedrag vertoon ik zelf dat vertrouwen kan afbreken?</div>
        <div class="box box-xs"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Kwetsbaarheid in Actie</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Iets dat Ik Nooit Vertel</div>
        <p class="ex-instr">Schrijf één ding op dat je moeilijk vindt in de sport of in het team maar dat je zelden uitspreekt. Je hoeft dit niet te delen — maar het opschrijven is al een stap.</p>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">Aan welke teamgenoot zou je dit het makkelijkst kunnen vertellen? Waarom juist aan die persoon?</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:8px">Wat zou het opleveren als je het wel deelt?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Actie deze week</div>
      <div class="ex">
        <p class="ex-instr">Welke concrete stap ga je deze week zetten om het vertrouwen in het team te vergroten?</p>
        <div class="box box-xs"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Vertrouwen herstellen</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf op: wat doe jij als het vertrouwen in het team onder druk staat (na een conflict, verlies of spanning)? Jouw drie stappen om het te herstellen.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Vulnerability is not weakness. It is our greatest measure of courage."',
    cite: 'Brené Brown — onderzoeker & auteur',
    footer: 'Preseason S3: Vertrouwen & Veiligheid',
  },
  {
    s: 4, title: 'Conflict & Herstel',
    sessionLabel: 'Preseason Sessie 4 — Spelerswerkblad',
    goalLabel: 'Doelstelling Sessie 4',
    goals: [
      'Je herkent het verschil tussen gezond conflict (dat groei stimuleert) en destructief conflict',
      'Je kan de stappen van herstel toepassen na een spanning of meningsverschil in het team',
      'Je durft iemand aanspreken zonder de relatie te beschadigen',
    ],
    intro: 'Conflict vermijden is geen cultuur — het is stagnatie. Sterke teams hebben spanning, maar ze weten hoe ze erdoorheen komen. Vandaag leer je conflict zien als groeikans, niet als bedreiging.',
    page1: `
      <div class="section-title">Oefening 1 — Mijn Conflictstijl</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Hoe Reageer Ik op Spanning?</div>
        <p class="ex-instr">Kies de reactie die het meest op jou lijkt als er spanning is in het team. Omcirkel of onderstreep jouw stijl.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;font-size:0.78rem;color:var(--gray-600)">
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Vermijder:</strong> Ik negeer het en hoop dat het vanzelf overgaat</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Aanpasser:</strong> Ik ga akkoord om de vrede te bewaren, ook als ik het er niet mee eens ben</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Confronteerder:</strong> Ik zeg direct wat ik denk, soms te fel</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Bemiddelaar:</strong> Ik zoek naar een oplossing die voor iedereen werkt</div>
        </div>
        <div class="field-label" style="margin-top:8px">Wanneer helpt mijn stijl het team? Wanneer schaadt het?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2 — Het Moeilijke Gesprek</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Iemand Aanspreken</div>
        <p class="ex-instr">Gebruik het model: Ik zie… Ik voel… Ik vraag je om… Denk aan een spanning met een teamgenoot en schrijf het uit.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK ZIE...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VOEL...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VRAAG JE OM...</div><div class="line"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Herstelstappen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Hoe Herstelt ons Team na een Conflict?</div>
        <p class="ex-instr">Na de groepsdiscussie: schrijf de drie stappen op die jullie als team afspreken om spanning te herstellen — snel, eerlijk en zonder nachtje wachten.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">Wie is de natuurlijke bemiddelaar in ons team? Wat maakt die persoon geschikt?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Persoonlijke reflectie</div>
      <div class="ex">
        <p class="ex-instr">Schrijf een conflict of spanning uit het verleden op dat onopgelost bleef. Wat had je anders kunnen doen? Wat leer je hieruit voor dit seizoen?</p>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Emotie vs Reactie</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Schrijf op: wat voel jij fysiek als er spanning is (hartslag, spanning in lijf, gedachten)? En wat doe je de komende 60 seconden vóór je reageert om niet impulsief te handelen?</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means."',
    cite: 'Ronald Reagan',
    footer: 'Preseason S4: Conflict & Herstel',
  },
  {
    s: 5, title: 'Cultuur in Actie',
    sessionLabel: 'Preseason Sessie 5 — Spelerswerkblad',
    goalLabel: 'Doelstelling Sessie 5',
    goals: [
      'Je formuleert concrete rituelen en gewoontes die onze teamcultuur elke week levend houden',
      'Je weet hoe je elkaar aanspreekt als de cultuur onder druk staat tijdens het seizoen',
      'Je sluit de preseason af met een gedeeld beeld van de cultuur die jullie willen zijn',
    ],
    intro: 'Cultuur is niet wat je zegt — het is wat je doet als niemand kijkt. Na vier sessies weet je wie jullie willen zijn. Nu gaat het over hoe jullie dat elke dag waarmaken.',
    page1: `
      <div class="section-title">Oefening 1 — Onze Rituelen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rituelen die onze Cultuur Beschermen</div>
        <p class="ex-instr">Rituelen zijn kleine herhaalde acties die cultuur levend houden. Schrijf drie rituelen op die jullie dit seizoen gaan invoeren — voor training, na een wedstrijd of tijdens moeilijke momenten.</p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
          <div>
            <div class="field-label" style="color:var(--orange);font-weight:700">VOOR TRAINING</div>
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
        <div class="field-label" style="margin-top:8px">Welk ritueel heeft de meeste impact op de teamsfeer? Waarom?</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Oefening 2 — De Cultuurwacht</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wie Bewaakt onze Cultuur?</div>
        <p class="ex-instr">Elke speler is verantwoordelijk voor de cultuur — maar soms helpt een expliciet systeem. Schrijf op hoe jullie elkaar aanspreken als het contract niet nageleefd wordt.</p>
        <div class="field-label">Ons aanspreekmechanisme (hoe, wanneer, met wie):</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:6px">Wat doen we als iemand hetzelfde gedrag blijft vertonen?</div>
        <div class="box box-xs"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3 — Cultuurmeting halverwege het Seizoen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Onze Cultuur-Check op Maand 4</div>
        <p class="ex-instr">Schrijf drie vragen op die jullie halverwege het seizoen aan elkaar willen stellen om te meten of de cultuur nog leeft. Plan nu al wanneer jullie dit doen.</div>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Datum cultuur-check gepland:</div>
        <div class="line"></div>
      </div>
      <div class="section-title">Mijn Belofte aan het Seizoen</div>
      <div class="ex">
        <p class="ex-instr">Schrijf in één krachtige zin wat jij dit seizoen gaat bijdragen aan de teamcultuur — als belofte aan jezelf én aan het team.</p>
        <div class="box box-sm"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Naam</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale Weerbaarheid — Cultuur onder competitiedruk</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Wanneer staan cultuurwaarden het meest onder druk? Schrijf het scenario op (verliesreeks, interne competitie, speeltijdconflict) en beschrijf jouw persoonlijke actieplan om de cultuur te verdedigen.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Champions behave like champions before they are champions."',
    cite: 'Bill Walsh — 3× Super Bowl Champion Coach, San Francisco 49ers',
    footer: 'Preseason S5: Cultuur in Actie',
  },
];

const EN = [
  {
    s:1, title:'Our Identity',
    sessionLabel:'Preseason Session 1 — Player Worksheet',
    goalLabel:'Goals Session 1',
    goals:['You can name three values you want our team to radiate this season','You understand why shared identity is the foundation of a strong team culture','You contribute to a shared team statement that guides the season'],
    intro:"Culture doesn't start with rules — it starts with who you are. Who are we as a team? Not what we want to win, but how we want to be. This worksheet lays the foundation.",
    page1:`
      <div class="section-title">Exercise 1 — Who Are We?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Three Words for Our Team</div>
        <p class="ex-instr">Write three words you want people to say about our team — not about our results, but about our behavior and character.</p>
        <div class="field-label">My three words:</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
        <div class="field-label" style="margin-top:8px">After the group discussion — the three words our team chose:</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
      </div>
      <div class="section-title">Exercise 2 — Our Culture Anchors</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What Do We Keep? What Do We Let Go?</div>
        <p class="ex-instr">Think about last season. Which habits or behaviors do we want to keep in our culture? Which do we consciously leave behind?</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">WE KEEP ▶</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">WE LET GO ✕</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3 — Our Team Statement</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>One Sentence That Describes Us</div>
        <p class="ex-instr">Write together one sentence that describes who you want to be this season — as a team, not as individuals. Not a slogan, but a real promise.</p>
        <div class="field-label">Our team statement this season:</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">What does this statement mean concretely for me as a player?</div>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Personal Reflection</div>
      <div class="ex">
        <p class="ex-instr">Which behavior from last season — yours or the team's — was not in line with the culture we want to be? How will you address that?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Identity Anchor</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write one sentence you tell yourself when you're under pressure to behave differently than the team culture requires. Your anchor.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Culture is not just one aspect of the game — it is the game."',
    cite:'Lou Gerstner — CEO IBM',
    footer:'Preseason S1: Our Identity',
  },
  {
    s:2, title:'Our Team Contract',
    sessionLabel:'Preseason Session 2 — Player Worksheet',
    goalLabel:'Goals Session 2',
    goals:['You co-create behavioral norms that you personally endorse and uphold','You understand the difference between rules imposed by the coach and norms the team creates itself','You consciously sign a contract as an expression of commitment to the team culture'],
    intro:"A team contract doesn't work when the coach makes it. It works when you write it yourselves. Today you build the code of conduct that protects your culture this season.",
    page1:`
      <div class="section-title">Exercise 1 — What Do We Expect from Each Other?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>My Top 3 Expectations</div>
        <p class="ex-instr">Write three concrete behaviors you expect from every teammate — not about performance, but about attitude, respect, and effort.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Which expectation are you most willing to uphold yourself?</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Exercise 2 — My Personal Promise</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What Do I Promise the Team?</div>
        <p class="ex-instr">Write three promises you personally make to the team for this season. Make them concrete enough to evaluate at the end of the season.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
        </div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3 — Signature & Commitment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>The Team Contract</div>
        <p class="ex-instr">After the group discussion: write the three behavioral rules you chose as a team. Then sign as an expression of your commitment.</p>
        <div class="field-label">Our team chooses:</div>
        <div class="num-list" style="margin-top:4px">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">What do I do if a teammate doesn't uphold the contract?</div>
        <div class="box box-sm"></div>
        <div class="sign-row" style="margin-top:8px">
          <div class="sign-field"><div class="sign-label">Name</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Signature</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Reflection</div>
      <div class="ex">
        <p class="ex-instr">Which promise will be hardest for you to keep? Why? And how will you hold yourself accountable?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Commitment under Pressure</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write the scenario where you're most likely to break your promise (e.g. after a loss, conflict, bad day). What do you do concretely to honor your commitment anyway?</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Agreements, not rules. You can break a rule. You own an agreement."',
    cite:'Atul Gawande — surgeon & team researcher',
    footer:'Preseason S2: Our Team Contract',
  },
  {
    s:3, title:'Trust & Safety',
    sessionLabel:'Preseason Session 3 — Player Worksheet',
    goalLabel:'Goals Session 3',
    goals:['You can explain what psychological safety is and why it makes or breaks team culture','You recognize concrete behaviors that build or destroy trust in your team','You take a conscious step to show vulnerability to a teammate'],
    intro:"Without trust there is no real culture — only façade. Teams that dare to show vulnerability perform better, learn faster and last longer. Today we build that foundation.",
    page1:`
      <div class="section-title">Exercise 1 — Trust Barometer</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>How Safe Do I Feel in Our Team?</div>
        <p class="ex-instr">Give an honest score from 1 to 10 for each situation below. There is no right or wrong answer.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
          <div class="field-label">I dare to admit mistakes in our team: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">I dare to ask for help without feeling weak: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">I dare to share my opinion even when it differs: <span style="color:var(--orange);font-weight:700">___/10</span></div>
          <div class="field-label">I feel supported after a bad match: <span style="color:var(--orange);font-weight:700">___/10</span></div>
        </div>
        <div class="field-label" style="margin-top:10px">What stands out from your scores? Where is there room to grow?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2 — Building or Breaking Trust</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Concrete Behaviors</div>
        <p class="ex-instr">Write two behaviors that build trust in a team, and two that break trust — from your own experience.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">BUILDS TRUST</div>
            <div class="lines"><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">BREAKS TRUST</div>
            <div class="lines"><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">Which behavior of your own could be breaking trust?</div>
        <div class="box box-xs"></div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3 — Vulnerability in Action</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Something I Never Talk About</div>
        <p class="ex-instr">Write one thing you find difficult in sports or in the team but rarely say out loud. You don't have to share this — but writing it down is already a step.</p>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">Which teammate could you most easily tell this to? Why that person?</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:8px">What would sharing it deliver?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Action this week</div>
      <div class="ex">
        <p class="ex-instr">What concrete step will you take this week to increase trust in the team?</p>
        <div class="box box-xs"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Rebuilding Trust</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write: what do you do when trust in the team is under pressure (after conflict, loss, or tension)? Your three steps to restore it.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Vulnerability is not weakness. It is our greatest measure of courage."',
    cite:'Brené Brown — researcher & author',
    footer:'Preseason S3: Trust & Safety',
  },
  {
    s:4, title:'Conflict & Recovery',
    sessionLabel:'Preseason Session 4 — Player Worksheet',
    goalLabel:'Goals Session 4',
    goals:['You recognize the difference between healthy conflict (that stimulates growth) and destructive conflict','You can apply the steps of recovery after tension or disagreement in the team','You dare to address someone without damaging the relationship'],
    intro:"Avoiding conflict is not culture — it is stagnation. Strong teams have tension, but they know how to get through it. Today you learn to see conflict as a growth opportunity, not a threat.",
    page1:`
      <div class="section-title">Exercise 1 — My Conflict Style</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>How Do I React to Tension?</div>
        <p class="ex-instr">Choose the response that most resembles you when there is tension in the team. Circle or underline your style.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;font-size:0.78rem;color:var(--gray-600)">
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Avoider:</strong> I ignore it and hope it resolves itself</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Accommodator:</strong> I agree to keep the peace, even if I disagree</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Confronter:</strong> I say directly what I think, sometimes too bluntly</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Mediator:</strong> I look for a solution that works for everyone</div>
        </div>
        <div class="field-label" style="margin-top:8px">When does your style help the team? When does it hurt?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2 — The Difficult Conversation</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Addressing Someone</div>
        <p class="ex-instr">Use the model: I see… I feel… I ask you to… Think of a tension with a teammate and write it out.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I SEE...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I FEEL...</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I ASK YOU TO...</div><div class="line"></div></div>
        </div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3 — Recovery Steps</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>How Does Our Team Recover After Conflict?</div>
        <p class="ex-instr">After the group discussion: write the three steps you agree on as a team to resolve tension — quickly, honestly, and without waiting a night.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">Who is the natural mediator in our team? What makes them suitable?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Personal Reflection</div>
      <div class="ex">
        <p class="ex-instr">Write a conflict or tension from the past that stayed unresolved. What could you have done differently? What do you learn from this for this season?</p>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Emotion vs Reaction</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Write: what do you feel physically when there is tension (heart rate, body tension, thoughts)? And what do you do in the next 60 seconds before reacting to avoid acting impulsively?</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means."',
    cite:'Ronald Reagan',
    footer:'Preseason S4: Conflict & Recovery',
  },
  {
    s:5, title:'Culture in Action',
    sessionLabel:'Preseason Session 5 — Player Worksheet',
    goalLabel:'Goals Session 5',
    goals:['You formulate concrete rituals and habits that keep our team culture alive every week','You know how to hold each other accountable when culture is under pressure during the season','You close the preseason with a shared image of the culture you want to be'],
    intro:"Culture is not what you say — it is what you do when nobody is watching. After four sessions you know who you want to be. Now it is about how you make that real every single day.",
    page1:`
      <div class="section-title">Exercise 1 — Our Rituals</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rituals that Protect Our Culture</div>
        <p class="ex-instr">Rituals are small repeated actions that keep culture alive. Write three rituals you will introduce this season — before training, after a match, or during difficult moments.</p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">BEFORE TRAINING</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">AFTER A MATCH</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">DURING A DIFFICULT MOMENT</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Which ritual has the most impact on team atmosphere? Why?</div>
        <div class="box box-xs"></div>
      </div>
      <div class="section-title">Exercise 2 — The Culture Guard</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Who Guards Our Culture?</div>
        <p class="ex-instr">Every player is responsible for culture — but sometimes an explicit system helps. Write how you will hold each other accountable when the contract is not followed.</p>
        <div class="field-label">Our accountability mechanism (how, when, with whom):</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:6px">What do we do if someone keeps showing the same behavior?</div>
        <div class="box box-xs"></div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3 — Culture Check Mid-Season</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Our Culture-Check at Month 4</div>
        <p class="ex-instr">Write three questions you want to ask each other halfway through the season to measure whether the culture is still alive. Schedule when you will do this now.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Scheduled date for culture-check:</div>
        <div class="line"></div>
      </div>
      <div class="section-title">My Promise to the Season</div>
      <div class="ex">
        <p class="ex-instr">Write in one powerful sentence what you will contribute to the team culture this season — as a promise to yourself and to the team.</p>
        <div class="box box-sm"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Name</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental Resilience — Culture Under Competition Pressure</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">When is culture most under pressure? Write the scenario (losing streak, internal competition, playing time conflict) and describe your personal action plan to defend the culture.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Champions behave like champions before they are champions."',
    cite:'Bill Walsh — 3× Super Bowl Champion Coach, San Francisco 49ers',
    footer:'Preseason S5: Culture in Action',
  },
];

function buildHTML(data, lang) {
  const isEN = lang === 'EN';
  const badge  = isEN ? 'PRESEASON · PLAYER' : 'PRESEASON · SPELER';
  const contd  = isEN ? 'Continued' : 'Vervolg';
  const pg     = isEN ? 'Page' : 'Pagina';

  return `<!DOCTYPE html>
<html lang="${isEN?'en':'nl'}"><head><meta charset="UTF-8"><style>${CSS}</style></head>
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
    <ul>${data.goals.map(g=>`<li>${g}</li>`).join('')}</ul>
  </div>
  <div class="intro-box">${data.intro}</div>
  ${data.page1}
  <div class="page-footer">
    <span>${EMAIL}</span>
    <span class="credit">Created by Tom Pauwaert</span>
    <span>${data.footer} — ${pg} 1/2</span>
  </div>
</div>
<div class="page">
  <div class="cont-header">
    <div class="cont-title">${data.title} — ${contd}</div>
    <div class="cont-session">${data.sessionLabel}</div>
  </div>
  ${data.page2}
  <div class="quote-wrap">
    <div class="quote-block">
      <p>${data.quote}</p>
      <cite>— ${data.cite}</cite>
    </div>
  </div>
  <div class="page-footer">
    <span>${EMAIL}</span>
    <span class="credit">Created by Tom Pauwaert</span>
    <span>${data.footer} — ${pg} 2/2</span>
  </div>
</div>
</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const d of NL) {
    const html = buildHTML(d, 'NL');
    await page.setContent(html, { waitUntil: 'networkidle' });
    const out = `${OUT_NL}/CF_Cultuur_Speler_S${d.s}_NL.pdf`;
    await page.pdf({ path: out, format: 'A4', printBackground: true });
    console.log(`NL S${d.s} → ${Math.round(require('fs').statSync(out).size/1024)}KB`);
  }
  for (const d of EN) {
    const html = buildHTML(d, 'EN');
    await page.setContent(html, { waitUntil: 'networkidle' });
    const out = `${OUT_EN}/CF_Cultuur_Speler_S${d.s}_EN.pdf`;
    await page.pdf({ path: out, format: 'A4', printBackground: true });
    console.log(`EN S${d.s} → ${Math.round(require('fs').statSync(out).size/1024)}KB`);
  }

  await browser.close();
  console.log('Done!');
})();
