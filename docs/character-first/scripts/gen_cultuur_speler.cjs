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
    s: 2, title: 'Ons team contract',
    sessionLabel: 'Preseason sessie 2: spelerswerkblad',
    goalLabel: 'Doelstelling sessie 2',
    goals: [
      'Je helpt gedragsnormen maken die jij persoonlijk wil nakomen',
      'Je snapt het verschil tussen regels van de coach en normen die het team zelf maakt',
      'Je tekent bewust een contract als bewijs van je commitment',
    ],
    intro: 'Een teamcontract werkt niet als de coach het schrijft. Het werkt als jullie het zelf schrijven. Vandaag bouwen jullie de afspraken die jullie cultuur dit seizoen beschermen.',
    page1: `
      <div class="section-title">Oefening 1: wat verwachten we van elkaar?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Mijn top 3 verwachtingen</div>
        <p class="ex-instr">Schrijf drie dingen op die jij van elke teamgenoot verwacht. Niet over prestaties, maar over houding, respect en inzet.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Welke verwachting ben jij zelf het meest bereid na te komen?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2: mijn persoonlijke belofte</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wat beloof ik het team?</div>
        <p class="ex-instr">Schrijf drie beloftes op die jij dit seizoen aan het team maakt. Maak ze concreet, zodat je ze later kan checken.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">Ik beloof om</div><div class="line" style="flex:1"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: handtekening en commitment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Het teamcontract</div>
        <p class="ex-instr">Na de groepsdiscussie: schrijf hier de drie gedragsregels die jullie als team kozen. Teken daarna, als bewijs van jouw commitment.</p>
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
        <p class="ex-instr">Welke belofte wordt voor jou het moeilijkst? Waarom? En hoe hou jij jezelf daaraan?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: ons contract verdedigen</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Wat doen we als team wanneer een speler steeds opnieuw het contract breekt? Schrijf op wat jij dan zegt of doet.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Agreements, not rules. You can break a rule. You own an agreement."',
    cite: 'Atul Gawande, chirurg en teamonderzoeker',
    footer: 'Preseason S2: Ons team contract',
  },
  {
    s: 3, title: 'Vertrouwen en veiligheid',
    sessionLabel: 'Preseason sessie 3: spelerswerkblad',
    goalLabel: 'Doelstelling sessie 3',
    goals: [
      'Je legt uit wat psychologische veiligheid is en waarom het de cultuur maakt of breekt',
      'Je herkent gedrag dat vertrouwen opbouwt of afbreekt in jouw team',
      'Je zet een bewuste stap om iets persoonlijks te delen met een teamgenoot',
    ],
    intro: 'Zonder vertrouwen is er geen echte cultuur, alleen een façade. Teams die durven tonen wie ze zijn, presteren beter en houden het langer samen volhouden. Vandaag bouwen we dat fundament.',
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
        <div class="field-label" style="margin-top:10px">Wat valt je op aan je scores? Waar zie jij ruimte om te groeien?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2: vertrouwen bouwen of breken</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wat ik zelf zie gebeuren</div>
        <p class="ex-instr">Schrijf twee dingen op die vertrouwen bouwen in een team. Schrijf ook twee dingen op die vertrouwen breken. Vanuit je eigen ervaring.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">BOUWT VERTROUWEN</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">BREEKT VERTROUWEN</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">Welk eigen gedrag kan vertrouwen breken?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: iets delen durven</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Iets dat ik nooit vertel</div>
        <p class="ex-instr">Schrijf één ding op dat je moeilijk vindt in de sport of in het team. Iets dat je zelden uitspreekt. Je hoeft dit niet te delen, het opschrijven is al een stap.</p>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">Aan welke teamgenoot zou je dit het makkelijkst vertellen? Waarom juist die persoon?</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:8px">Wat zou het opleveren als je het wel deelt?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Actie deze week</div>
      <div class="ex">
        <p class="ex-instr">Welke stap zet je deze week om het vertrouwen in het team te vergroten?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: vertrouwen herstellen</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Wat doen we als team wanneer het vertrouwen breekt door iets dat een teamgenoot deed? Schrijf op wat jij dan zou zeggen of doen.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Vulnerability is not weakness. It is our greatest measure of courage."',
    cite: 'Brené Brown, onderzoeker en auteur',
    footer: 'Preseason S3: Vertrouwen en veiligheid',
  },
  {
    s: 4, title: 'Conflict en herstel',
    sessionLabel: 'Preseason sessie 4: spelerswerkblad',
    goalLabel: 'Doelstelling sessie 4',
    goals: [
      'Je herkent het verschil tussen een gezond conflict en een conflict dat schade aanricht',
      'Je past de stappen van herstel toe na spanning of een meningsverschil',
      'Je durft iemand aan te spreken zonder de relatie te beschadigen',
    ],
    intro: 'Conflict vermijden is geen cultuur, het is stilstand. Sterke teams hebben ook spanning, maar ze weten hoe ze er samen doorheen komen. Vandaag leer je conflict zien als een kans om te groeien.',
    page1: `
      <div class="section-title">Oefening 1: mijn conflictstijl</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Hoe reageer ik op spanning?</div>
        <p class="ex-instr">Kies de reactie die het meest op jou lijkt als er spanning is in het team. Omcirkel of onderstreep jouw stijl.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;font-size:0.78rem;color:var(--gray-600)">
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Vermijder:</strong> ik negeer het en hoop dat het vanzelf overgaat</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Aanpasser:</strong> ik ga akkoord om de vrede te bewaren, ook als ik het er niet mee eens ben</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Confronteerder:</strong> ik zeg direct wat ik denk, soms te fel</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Bemiddelaar:</strong> ik zoek naar een oplossing die voor iedereen werkt</div>
        </div>
        <div class="field-label" style="margin-top:8px">Wanneer helpt jouw stijl het team? Wanneer schaadt het?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2: het moeilijke gesprek</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Iemand aanspreken</div>
        <p class="ex-instr">Gebruik dit model: ik zie, ik voel, ik vraag je om. Denk aan spanning met een teamgenoot en schrijf het uit.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK ZIE</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VOEL</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">IK VRAAG JE OM</div><div class="line"></div></div>
        </div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: herstelstappen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Hoe herstelt ons team na een conflict?</div>
        <p class="ex-instr">Na de groepsdiscussie: schrijf de drie stappen op die jullie als team afspreken om spanning te herstellen. Snel en eerlijk, zonder een nacht te wachten.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">Wie is de natuurlijke bemiddelaar in ons team? Wat maakt die persoon daar goed in?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Persoonlijke reflectie</div>
      <div class="ex">
        <p class="ex-instr">Schrijf een conflict of spanning op uit het verleden die onopgelost bleef. Wat had je anders kunnen doen? Wat leer je daaruit voor dit seizoen?</p>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: conflict in het team opvangen</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Wat doen we als team wanneer twee teamgenoten een conflict hebben dat de sfeer beïnvloedt? Schrijf op wat jij dan zou zeggen of doen.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means."',
    cite: 'Ronald Reagan',
    footer: 'Preseason S4: Conflict en herstel',
  },
  {
    s: 5, title: 'Cultuur in actie',
    sessionLabel: 'Preseason sessie 5: spelerswerkblad',
    goalLabel: 'Doelstelling sessie 5',
    goals: [
      'Je formuleert rituelen die onze teamcultuur elke week levend houden',
      'Je weet hoe je elkaar aanspreekt als de cultuur tijdens het seizoen onder druk staat',
      'Je sluit de preseason af met een gedeeld beeld van de cultuur die jullie willen zijn',
    ],
    intro: 'Cultuur is niet wat je zegt, het is wat je doet als niemand kijkt. Na vier sessies weet je wie jullie willen zijn. Nu gaat het over hoe jullie dat elke dag waarmaken.',
    page1: `
      <div class="section-title">Oefening 1: onze rituelen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rituelen die onze cultuur beschermen</div>
        <p class="ex-instr">Rituelen zijn kleine, herhaalde acties die cultuur levend houden. Schrijf drie rituelen op die jullie dit seizoen invoeren. Voor training, na een wedstrijd of bij een moeilijk moment.</p>
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
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Oefening 2: de cultuurwacht</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Wie bewaakt onze cultuur?</div>
        <p class="ex-instr">Elke speler is verantwoordelijk voor de cultuur. Soms helpt een duidelijke afspraak. Schrijf op hoe jullie elkaar aanspreken als het contract niet wordt nageleefd.</p>
        <div class="field-label">Ons aanspreekmechanisme, hoe, wanneer, met wie:</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:6px">Wat doen we als iemand hetzelfde gedrag blijft vertonen?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2: `
      <div class="section-title">Oefening 3: cultuurmeting halverwege het seizoen</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Onze cultuur-check op maand 4</div>
        <p class="ex-instr">Schrijf drie vragen op die jullie halverwege het seizoen aan elkaar willen stellen, om te checken of de cultuur nog leeft. Plan nu al wanneer jullie dit doen.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Datum cultuur-check gepland:</div>
        <div class="line"></div>
      </div>
      <div class="section-title">Mijn belofte aan het seizoen</div>
      <div class="ex">
        <p class="ex-instr">Schrijf in één krachtige zin wat jij dit seizoen bijdraagt aan de teamcultuur. Als belofte aan jezelf en aan het team.</p>
        <div class="box box-sm"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Naam</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Datum</div><div class="line"></div></div>
        </div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mentale weerbaarheid: cultuur onder competitiedruk</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Wanneer staat onze cultuur het meest onder druk? Denk aan een verliesreeks, interne competitie of een speeltijdconflict. Schrijf het scenario op en wat jij dan doet om onze cultuur te verdedigen.</p>
        <div class="mental-box"></div>
      </div>`,
    quote: '"Champions behave like champions before they are champions."',
    cite: 'Bill Walsh, 3× Super Bowl Champion Coach, San Francisco 49ers',
    footer: 'Preseason S5: Cultuur in actie',
  },
];

const EN = [
  {
    s:1, title:'Our identity',
    sessionLabel:'Preseason session 1: player worksheet',
    goalLabel:'Goals session 1',
    goals:['You name three values you want our team to show this season','You understand why a shared identity is the foundation of a strong team','You help write one sentence that describes our team this season'],
    intro:"Culture doesn't start with rules. It starts with who you are. Who are we as a team? Not what we want to win, but how we want to be. This worksheet lays the foundation.",
    page1:`
      <div class="section-title">Exercise 1: who are we?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Three words for our team</div>
        <p class="ex-instr">Which three words do you want people to say about our team? Not about our results, but about our behavior and character.</p>
        <div class="field-label">My three words:</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
        <div class="field-label" style="margin-top:8px">After the group discussion: the three words our team chose.</div>
        <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
      </div>
      <div class="section-title">Exercise 2: our culture anchors</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What do we keep, what do we let go?</div>
        <p class="ex-instr">Think about last season. What do we want to keep? What do we consciously leave behind?</p>
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
      </div>`,
    page2:`
      <div class="section-title">Exercise 3: our team sentence</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>One sentence that describes us</div>
        <p class="ex-instr">Write one sentence together. A sentence that says who you want to be this season, as a team. Not a slogan, but a real promise.</p>
        <div class="field-label">Our team sentence this season:</div>
        <div class="box box-sm"></div>
        <div class="field-label" style="margin-top:8px">What does this sentence mean to me as a player?</div>
        <div class="box box-md"></div>
      </div>
      <div class="section-title">Personal reflection</div>
      <div class="ex">
        <p class="ex-instr">Which behavior last season didn't fit the culture we want now? Yours or the team's. What will you do about it?</p>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: defending our identity</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">Sometimes a player puts our values under pressure, on purpose or not. What do we do then, as a team? Write down what you say or do when this happens.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Culture is not just one aspect of the game, it is the game."',
    cite:'Lou Gerstner, CEO IBM',
    footer:'Preseason S1: Our identity',
  },
  {
    s:2, title:'Our team contract',
    sessionLabel:'Preseason session 2: player worksheet',
    goalLabel:'Goals session 2',
    goals:['You help create behavioral norms that you personally want to keep','You understand the difference between rules from the coach and norms the team makes itself','You consciously sign a contract as proof of your commitment'],
    intro:"A team contract doesn't work when the coach writes it. It works when you write it yourselves. Today you build the agreements that protect your culture this season.",
    page1:`
      <div class="section-title">Exercise 1: what do we expect from each other?</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>My top 3 expectations</div>
        <p class="ex-instr">Write down three things you expect from every teammate. Not about performance, but about attitude, respect, and effort.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Which expectation are you most willing to keep yourself?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2: my personal promise</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What do I promise the team?</div>
        <p class="ex-instr">Write down three promises you make to the team this season. Make them concrete, so you can check them later.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
          <div class="promise-row"><div class="promise-label">I promise to</div><div class="line" style="flex:1"></div></div>
        </div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3: signature and commitment</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>The team contract</div>
        <p class="ex-instr">After the group discussion: write down the three behavior rules your team chose. Then sign, as proof of your commitment.</p>
        <div class="field-label">Our team chooses:</div>
        <div class="num-list" style="margin-top:4px">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">What do I do if a teammate doesn't keep the contract?</div>
        <div class="box box-sm"></div>
        <div class="sign-row" style="margin-top:8px">
          <div class="sign-field"><div class="sign-label">Name</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Signature</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="section-title">Reflection</div>
      <div class="ex">
        <p class="ex-instr">Which promise will be hardest for you to keep? Why? How will you hold yourself to it?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: defending our contract</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">What do we do as a team when a player keeps breaking the contract? Write down what you would say or do.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Agreements, not rules. You can break a rule. You own an agreement."',
    cite:'Atul Gawande, surgeon and team researcher',
    footer:'Preseason S2: Our team contract',
  },
  {
    s:3, title:'Trust and safety',
    sessionLabel:'Preseason session 3: player worksheet',
    goalLabel:'Goals session 3',
    goals:['You explain what psychological safety is and why it makes or breaks a culture','You recognize behavior that builds or breaks trust in your team','You take a conscious step to share something personal with a teammate'],
    intro:"Without trust there is no real culture, only a façade. Teams that dare to show who they are perform better and stay together longer. Today we build that foundation.",
    page1:`
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
        <div class="field-label" style="margin-top:10px">What stands out in your scores? Where do you see room to grow?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2: building or breaking trust</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>What I see happening</div>
        <p class="ex-instr">Write down two things that build trust in a team. Write down two things that break trust. From your own experience.</p>
        <div class="two-col">
          <div>
            <div class="col-label" style="color:var(--green)">BUILDS TRUST</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
          <div>
            <div class="col-label" style="color:#c0392b">BREAKS TRUST</div>
            <div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
          </div>
        </div>
        <div class="field-label" style="margin-top:8px">Which of your own behaviors could break trust?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3: daring to share</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Something I never tell</div>
        <p class="ex-instr">Write down one thing you find hard in sports or in the team. Something you rarely say out loud. You don't have to share this, writing it down is already a step.</p>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:8px">Which teammate would you tell this to most easily? Why that person?</div>
        <div class="line"></div>
        <div class="field-label" style="margin-top:8px">What would it bring if you did share it?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Action this week</div>
      <div class="ex">
        <p class="ex-instr">What step will you take this week to grow trust in the team?</p>
        <div class="box box-sm"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: rebuilding trust</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">What do we do as a team when trust breaks because of something a teammate did? Write down what you would say or do.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Vulnerability is not weakness. It is our greatest measure of courage."',
    cite:'Brené Brown, researcher and author',
    footer:'Preseason S3: Trust and safety',
  },
  {
    s:4, title:'Conflict and recovery',
    sessionLabel:'Preseason session 4: player worksheet',
    goalLabel:'Goals session 4',
    goals:['You recognize the difference between a healthy conflict and a conflict that causes harm','You apply the recovery steps after tension or a disagreement','You dare to address someone without damaging the relationship'],
    intro:"Avoiding conflict is not culture, it is standing still. Strong teams have tension too, but they know how to work through it together. Today you learn to see conflict as a chance to grow.",
    page1:`
      <div class="section-title">Exercise 1: my conflict style</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>How do I react to tension?</div>
        <p class="ex-instr">Choose the reaction that looks most like you when there is tension in the team. Circle or underline your style.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;font-size:0.78rem;color:var(--gray-600)">
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Avoider:</strong> I ignore it and hope it goes away on its own</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Accommodator:</strong> I agree to keep the peace, even if I disagree</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Confronter:</strong> I say directly what I think, sometimes too sharply</div>
          <div style="padding:6px 10px;border:1px solid var(--line);border-radius:4px"><strong style="color:var(--ink)">Mediator:</strong> I look for a solution that works for everyone</div>
        </div>
        <div class="field-label" style="margin-top:8px">When does your style help the team? When does it hurt?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2: the difficult conversation</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Addressing someone</div>
        <p class="ex-instr">Use this model: I see, I feel, I ask you to. Think of tension with a teammate and write it out.</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I SEE</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I FEEL</div><div class="line"></div></div>
          <div><div class="field-label" style="color:var(--orange);font-weight:700">I ASK YOU TO</div><div class="line"></div></div>
        </div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3: recovery steps</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>How does our team recover after a conflict?</div>
        <p class="ex-instr">After the group discussion: write down the three steps your team agrees on to recover from tension. Fast and honest, without waiting a night.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:10px">Who is the natural mediator in our team? What makes them good at it?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Personal reflection</div>
      <div class="ex">
        <p class="ex-instr">Write down a conflict or tension from the past that stayed unresolved. What could you have done differently? What do you learn from it for this season?</p>
        <div class="box box-md"></div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: handling conflict in the team</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">What do we do as a team when two teammates have a conflict that affects the mood? Write down what you would say or do.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means."',
    cite:'Ronald Reagan',
    footer:'Preseason S4: Conflict and recovery',
  },
  {
    s:5, title:'Culture in action',
    sessionLabel:'Preseason session 5: player worksheet',
    goalLabel:'Goals session 5',
    goals:['You formulate rituals that keep our team culture alive every week','You know how to hold each other accountable when culture comes under pressure during the season','You close the preseason with a shared picture of the culture you want to be'],
    intro:"Culture is not what you say, it is what you do when nobody is watching. After four sessions you know who you want to be. Now it is about making that real every day.",
    page1:`
      <div class="section-title">Exercise 1: our rituals</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">1</div>Rituals that protect our culture</div>
        <p class="ex-instr">Rituals are small, repeated actions that keep culture alive. Write down three rituals you will introduce this season. For training, after a game, or in a difficult moment.</p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
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
        <div class="field-label" style="margin-top:8px">Which ritual has the biggest impact on the team mood? Why?</div>
        <div class="box box-sm"></div>
      </div>
      <div class="section-title">Exercise 2: the culture guard</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">2</div>Who guards our culture?</div>
        <p class="ex-instr">Every player is responsible for the culture. Sometimes a clear agreement helps. Write down how you hold each other accountable when the contract isn't kept.</p>
        <div class="field-label">Our accountability approach, how, when, with whom:</div>
        <div class="box box-md"></div>
        <div class="field-label" style="margin-top:6px">What do we do when someone keeps showing the same behavior?</div>
        <div class="box box-sm"></div>
      </div>`,
    page2:`
      <div class="section-title">Exercise 3: culture check midseason</div>
      <div class="ex">
        <div class="ex-title"><div class="ex-num">3</div>Our culture check at month 4</div>
        <p class="ex-instr">Write down three questions you want to ask each other halfway through the season, to check if the culture is still alive. Plan now when you will do this.</p>
        <div class="num-list">
          <div class="num-item"><div class="ex-num">1</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">2</div><div class="line"></div></div>
          <div class="num-item"><div class="ex-num">3</div><div class="line"></div></div>
        </div>
        <div class="field-label" style="margin-top:8px">Date for the culture check planned:</div>
        <div class="line"></div>
      </div>
      <div class="section-title">My promise to the season</div>
      <div class="ex">
        <p class="ex-instr">Write one strong sentence about what you will contribute to the team culture this season. As a promise to yourself and to the team.</p>
        <div class="box box-sm"></div>
        <div class="sign-row">
          <div class="sign-field"><div class="sign-label">Name</div><div class="line"></div></div>
          <div class="sign-field"><div class="sign-label">Date</div><div class="line"></div></div>
        </div>
      </div>
      <div class="mental-block">
        <div class="mental-label">🧠 Mental resilience: culture under competitive pressure</div>
        <p class="ex-instr" style="color:rgba(255,255,255,.8);margin-bottom:6px">When is our culture under the most pressure? Think of a losing streak, internal competition, or a playing time conflict. Write down the scenario and what you do then to defend our culture.</p>
        <div class="mental-box"></div>
      </div>`,
    quote:'"Champions behave like champions before they are champions."',
    cite:'Bill Walsh, three time Super Bowl Champion Coach, San Francisco 49ers',
    footer:'Preseason S5: Culture in action',
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
