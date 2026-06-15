'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first';
const OUT_NL = path.join(BASE, 'werkbladen-pdf/coaches-traject');
const OUT_EN = path.join(BASE, 'werkbladen-pdf/coaches-traject-en');
[OUT_NL, OUT_EN].forEach(d => fs.mkdirSync(d, { recursive: true }));

function logo(size = 48) {
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
    --orange: #F05A28;
    --navy: #1C2433;
    --green: #1E8A5B;
    --blue: #2F6FB0;
    --purple: #7A52C7;
    --canvas: #FAF7F2;
    --mist: #F0ECE4;
    --stone: #6E6A63;
    --line: #E4DFD6;
    --ember: #D44A1A;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #ccc; font-family: Arial, sans-serif; }
  .page {
    width: 210mm; height: 297mm; overflow: hidden;
    padding: 11mm 13mm 9mm; background: var(--canvas);
    display: flex; flex-direction: column; gap: 7px;
    page-break-after: always; break-after: page;
  }
  /* Header */
  .header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .wordmark { font-family: "Arial Black", Arial, sans-serif; font-size: 17px; font-weight: 900; color: var(--navy); }
  .wordmark span { color: var(--orange); }
  .badge {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em;
    background: rgba(47,111,176,.12); color: var(--blue);
    border: 1.5px solid var(--blue); border-radius: 20px;
    padding: 3px 9px;
  }
  .module-label { font-size: 10px; color: var(--stone); text-align: right; line-height: 1.4; }
  /* Divider */
  .divider { height: 2px; background: var(--orange); border-radius: 1px; flex-shrink: 0; }
  /* Title */
  .eyebrow {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .15em; color: var(--orange); margin-bottom: 2px;
  }
  .title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 21px; font-weight: 900;
    color: var(--navy); line-height: 1.1;
  }
  .core-question {
    font-size: 12px; color: var(--blue); font-style: italic;
    border-left: 3px solid var(--blue); padding-left: 8px; margin-top: 3px;
    line-height: 1.4;
  }
  /* Theory block */
  .theory-block {
    background: rgba(28,36,51,.05); border-left: 3px solid var(--navy);
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .section-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .12em; color: var(--navy);
    margin-bottom: 3px;
  }
  .theory-block p { font-size: 11px; color: #333; line-height: 1.5; }
  .theory-block .source { font-size: 9.5px; color: var(--stone); margin-top: 3px; font-style: italic; }
  /* Quotes */
  .quotes-row { display: flex; gap: 7px; flex-shrink: 0; }
  .quote-card {
    flex: 1; background: var(--navy); border-radius: 7px; padding: 8px 10px;
    border-left: 3px solid var(--orange);
  }
  .quote-card .qt { font-size: 10.5px; color: #fff; font-style: italic; line-height: 1.45; margin-bottom: 3px; }
  .quote-card .qa { font-size: 9px; color: var(--orange); font-family: "Arial Black", Arial, sans-serif; font-weight: 900; }
  /* Reflection */
  .reflection-block { flex-shrink: 0; }
  .reflection-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .12em; color: var(--orange);
    border-left: 3px solid var(--orange); padding-left: 7px; margin-bottom: 5px;
  }
  .reflection-q { display: flex; gap: 7px; align-items: flex-start; margin-bottom: 5px; }
  .reflection-q .qnum {
    width: 18px; height: 18px; border-radius: 50%; background: var(--orange);
    color: #fff; font-size: 9.5px; font-weight: 900; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; font-family: "Arial Black", Arial, sans-serif;
  }
  .reflection-q .qtext { font-size: 11px; color: var(--navy); line-height: 1.4; flex: 1; }
  .answer-line { border-bottom: 1px solid var(--line); height: 18px; margin-bottom: 1px; }
  /* Notes area */
  .notes-mini { flex: 1 1 auto; min-height: 0; }
  .note-line { border-bottom: 1px solid var(--line); height: 20px; }
  /* Footer */
  .footer {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line); padding-top: 4px; flex-shrink: 0;
  }
  .footer span { font-size: 8.5px; color: var(--stone); }

  /* ===== PAGE 2 ===== */
  .resources-grid { display: flex; flex-direction: column; gap: 7px; flex-shrink: 0; }
  .resource-section { background: #fff; border: 1.5px solid var(--line); border-radius: 8px; padding: 8px 11px; }
  .res-header {
    display: flex; align-items: center; gap: 6px;
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    color: var(--navy); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .08em;
  }
  .res-icon { font-size: 14px; }
  .resource-item { display: flex; gap: 7px; margin-bottom: 5px; }
  .resource-item:last-child { margin-bottom: 0; }
  .res-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--orange);
    flex-shrink: 0; margin-top: 5px;
  }
  .res-content { flex: 1; }
  .res-title { font-family: "Arial Black", Arial, sans-serif; font-size: 10.5px; font-weight: 900; color: var(--navy); }
  .res-author { font-size: 9.5px; color: var(--stone); }
  .res-why { font-size: 10px; color: #444; line-height: 1.4; margin-top: 1px; }
  .res-url { font-size: 9px; color: var(--blue); margin-top: 1px; }
  /* Action block */
  .action-block {
    background: rgba(240,90,40,.07); border: 1.5px solid var(--orange);
    border-radius: 8px; padding: 8px 11px; flex-shrink: 0;
  }
  .action-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .12em; color: var(--orange); margin-bottom: 4px;
  }
  .action-desc { font-size: 11px; color: var(--navy); line-height: 1.45; margin-bottom: 5px; }
  .commit-box {
    border: 1.5px dashed var(--orange); border-radius: 5px; padding: 5px 9px;
    font-size: 10px; color: var(--stone); line-height: 1.4;
  }
  .commit-line { border-bottom: 1px solid var(--line); height: 18px; margin-top: 3px; }
`;

// ============================================================
// NL DATA
// ============================================================
const modulesNL = [
  {
    num: 1, kleur: '#F05A28',
    title: 'Zelfkennis als Coach',
    vraag: 'Wie ben jij als coach — en hoe beïnvloedt dat wat er bij je spelers gebeurt?',
    theorie: 'Coaches zijn de meest invloedrijke volwassenen in het leven van jonge sporters, na de ouders. Maar die invloed is niet neutraal: het is altijd een weerspiegeling van wie de coach zelf is. Het Johari Window (Luft & Ingham, 1955) toont dat effectieve coaching begint met het verkleinen van je "blinde vlek" — de dingen die anderen zien maar jij niet. Coaches die hoge zelfkennis bezitten, gaan bewuster om met macht, druk en relaties.',
    bron: 'Luft & Ingham (1955) · Rhind & Jowett (2010) · Côté & Gilbert (2009)',
    quotes: [
      { text: '"Voordat je een leider bent, draait succes om het groeien van jezelf. Wanneer je een leider wordt, draait succes om het groeien van anderen."', auteur: '— Jack Welch' },
      { text: '"Je kunt anderen alleen leiden zo ver als je jezelf hebt geleid."', auteur: '— John Maxwell' },
    ],
    reflectie: [
      'Welke drie waarden definiëren jou als coach? Waar komen die vandaan?',
      'Wanneer was je de afgelopen maand het minst trots op jezelf als coach? Wat zegt dat over jou?',
      'Welk gedrag van spelers triggert jou het sterkst — en waarom denk je dat dat zo is?',
      'Hoe zou een speler die vorig jaar bij jou speelde jou nu omschrijven? Klopt dat met wie je wil zijn?',
      'Wat is jouw grootste blinde vlek als coach? Wie durft jou dat eerlijk te vertellen?',
    ],
    boeken: [
      { titel: 'Legacy', auteur: 'James Kerr', waarom: 'Hoe de All Blacks een cultuur bouwen vanuit waarden en zelfkennis. Elk hoofdstuk een les over leiderschap van binnenuit.' },
      { titel: 'Dare to Lead', auteur: 'Brené Brown', waarom: 'Over moedig leiden vanuit kwetsbaarheid. Vereiste literatuur voor elke coach die echt verbinding wil maken.' },
      { titel: 'The Inner Game of Tennis', auteur: 'W. Timothy Gallwey', waarom: 'Klassiek werk over de innerlijke stem van de coach. Hoe jouw twijfels en oordelen de prestaties van spelers beïnvloeden.' },
      { titel: 'The Talent Code', auteur: 'Daniel Coyle', waarom: 'Waarom sommige coaches talent ontwikkelen en anderen niet. Gedreven door zelfbewustzijn en gerichte feedback.' },
    ],
    videos: [
      { titel: 'The Power of Vulnerability', spreker: 'Brené Brown (TED Talk)', url: 'ted.com/talks/brene_brown_the_power_of_vulnerability', notitie: 'Bekijk: hoe kwetsbaarheid moed is, niet zwakte. Essentieel voor coaches.' },
      { titel: 'How Great Leaders Inspire Action', spreker: 'Simon Sinek (TED Talk)', url: 'ted.com/talks/simon_sinek_how_great_leaders_inspire_action', notitie: 'De "Golden Circle": start met waarom. Wat is jouw waarom als coach?' },
    ],
    podcasts: [
      { naam: 'Finding Mastery', afl: 'Afl. met Pete Carroll — coaching vanuit waarden en identiteit', url: 'findingmastery.com' },
      { naam: 'The High Performance Podcast', afl: 'Afl. met Jürgen Klopp — wie je bent maakt wie je coacht', url: 'thehighperformancepodcast.com' },
    ],
    actie: 'Vraag deze week aan één vertrouwde collega of speler: "Wat zie jij in mij als coach dat ik misschien zelf niet zie?" Schrijf het op zonder te verdedigen.',
    commitment: 'Mijn persoonlijke groeipunt als coach dit seizoen is:',
  },
  {
    num: 2, kleur: '#2F6FB0',
    title: 'Coachingstijl & Autonomie',
    vraag: 'Motiveer jij spelers — of leer je hen zichzelf te motiveren?',
    theorie: 'De Zelfdeterminatietheorie (Deci & Ryan, 1985) toont aan dat mensen het meest gemotiveerd zijn wanneer drie basisbehoeften vervuld zijn: autonomie (ik heb keuze), competentie (ik kan het), en verbondenheid (ik hoor erbij). Controlerende coaches die alleen via druk en dwang werken, ondermijnen intrinsieke motivatie. Autonomy-supportive coaching leidt aantoonbaar tot betere prestaties, minder burnout en hogere pleziersbeleving op lange termijn.',
    bron: 'Deci & Ryan (1985, 2000) · Mageau & Vallerand (2003) · Amorose & Anderson-Butcher (2007)',
    quotes: [
      { text: '"De beste coaches creëren omstandigheden waar spelers zichzelf willen overtreffen — niet omdat ze moeten, maar omdat ze willen."', auteur: '— Daniel Pink' },
      { text: '"Controle is de vijand van autonomie. En autonomie is de motor van groei."', auteur: '— Edward Deci' },
    ],
    reflectie: [
      'Geef spelers bij jou echt inspraak in trainingsinhoud, regels of teamafspraken? Of is dat schijnautonomie?',
      'Wanneer geef jij instructies vs. wanneer stel jij vragen? Wat is de verhouding?',
      'Welke speler in jouw team heeft de meest controlerende omgeving nodig — en welke de meeste vrijheid? Behandel je hen anders?',
      'Hoe reageer jij als een speler iets anders wil proberen dan jij aangeeft? Wat zegt dat over jouw stijl?',
      'Wat zou er veranderen in jouw training als je één sessie volledig door de spelers liet invullen?',
    ],
    boeken: [
      { titel: 'Drive', auteur: 'Daniel Pink', waarom: 'De wetenschap van motivatie in één toegankelijk boek. Intrinsiek vs. extrinsiek, en wat coaches verkeerd doen met beloningen.' },
      { titel: 'Mindset', auteur: 'Carol Dweck', waarom: 'Fixed vs. growth mindset. Hoe jij als coach een groeiklimaat creëert — of net vernietigt — met woorden en reacties.' },
      { titel: 'Why Motivating People Doesn\'t Work and What Does', auteur: 'Susan Fowler', waarom: 'Praktisch boek over optimale motivatie. Vertaalt ZDT direct naar de praktijk van coaches.' },
    ],
    videos: [
      { titel: 'The Puzzle of Motivation', spreker: 'Daniel Pink (TED Talk)', url: 'ted.com/talks/dan_pink_the_puzzle_of_motivation', notitie: 'Bekijk: het Candle Problem-experiment. Externe beloningen doden creatief denken.' },
      { titel: 'The Power of Believing You Can Improve', spreker: 'Carol Dweck (TED Talk)', url: 'ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve', notitie: 'Hoe "nog niet" krachtiger is dan "nee". Toepasbaar in elke coachingsinteractie.' },
    ],
    podcasts: [
      { naam: 'The Science of Sport', afl: 'Episode over intrinsieke motivatie in jeugdsport', url: 'scienceofsport.com' },
      { naam: 'Kwame Christian — Negotiate Anything', afl: 'Hoe je mensen beweegt zonder te dwingen', url: 'negotiateanything.com' },
    ],
    actie: 'Observeer jezelf één week lang: noteer elke keer dat je een instructie geeft vs. een vraag stelt. Wat is de verhouding? Wat wil je veranderen?',
    commitment: 'Eén manier waarop ik meer autonomie geef aan mijn spelers:',
  },
  {
    num: 3, kleur: '#1E8A5B',
    title: 'De Coach-Sporter Relatie',
    vraag: 'Hoe goed kennen jouw spelers jou — en hoe goed ken jij hen?',
    theorie: 'Het 3C+1-model van Jowett (2007) beschrijft de coach-sporter relatie via vier dimensies: Closeness (emotionele nabijheid), Commitment (wederzijdse inzet), Complementarity (samenwerking) en Co-orientation (gedeeld begrip). Onderzoek toont consistent dat de kwaliteit van deze relatie de sterkste enkelvoudige voorspeller is van sportprestaties, welbevinden en plezier. Spelers presteren beter voor coaches die hen kennen als mens, niet alleen als atleet.',
    bron: 'Jowett & Ntoumanis (2004) · Jowett (2007) · Lorimer & Jowett (2009)',
    quotes: [
      { text: '"Spelers spelen voor coaches die hen kennen als persoon. Ze spelen harder voor coaches die hen respecteren als mens."', auteur: '— John Wooden' },
      { text: '"De coach-sporter relatie is de meest invloedrijke menselijke relatie in de sport."', auteur: '— Sophia Jowett' },
    ],
    reflectie: [
      'Weet jij van elke speler in jouw team: wat hen echt bezig houdt buiten de sport? Naam één ding per speler.',
      'Welke spelers in jouw team voelen zich het minst verbonden met jou? Wat doe jij actief om dat te veranderen?',
      'Hoe toon jij commitment aan jouw spelers — buiten de training en wedstrijd?',
      'Wanneer heeft een speler voor het laatst iets persoonlijks met jou gedeeld? Hoe heb jij gereageerd?',
      'Hoe balanced is de relatie: invest jij evenveel in de stille, gemiddelde speler als in de ster?',
    ],
    boeken: [
      { titel: 'The Relationship Coach', auteur: 'Sophia Jowett & Marc Lafrenière', waarom: 'Het standaardwerk over coach-sporter relaties. Theorie direct vertaald naar praktijk.' },
      { titel: 'It\'s Your Ship', auteur: 'D. Michael Abrashoff', waarom: 'Hoe een marinier zijn team transformeerde door elke persoon écht te leren kennen. Directe vertaling naar sport.' },
      { titel: 'The Culture Code', auteur: 'Daniel Coyle', waarom: 'Drie skills die cultuur maken: veiligheid, kwetsbaarheid, en gedeeld doel. Hoofdstuk over New Zealand All Blacks is een must.' },
    ],
    videos: [
      { titel: 'Building a Psychologically Safe Workplace', spreker: 'Amy Edmondson (TEDx)', url: 'youtube.com/watch?v=LhoLuui9gX8', notitie: 'Hoe veiligheid in relaties prestaties verhoogt. Rechtstreeks toepasbaar in teamcontext.' },
      { titel: 'Every Kid Needs a Champion', spreker: 'Rita Pierson (TED Talk)', url: 'ted.com/talks/rita_pierson_every_kid_needs_a_champion', notitie: '"Kids don\'t learn from people they don\'t like." Krachtig voor coaches van jeugd.' },
    ],
    podcasts: [
      { naam: 'Finding Mastery', afl: 'Afl. met Gregg Popovich — relatieopbouw als prestatiedriver', url: 'findingmastery.com' },
      { naam: 'The Coach2 Podcast', afl: 'Over individueel verbinding maken in een teamcontext', url: 'coachingforleaders.com' },
    ],
    actie: 'Plan deze week een informeel 1-op-1 gesprek met een speler die je het minst goed kent. Geen sport-agenda — gewoon echt luisteren. Noteer wat je leert.',
    commitment: 'Eén speler bij wie ik bewust meer zal investeren in de relatie:',
  },
  {
    num: 4, kleur: '#C7842F',
    title: 'Feedback & Communicatie',
    vraag: 'Hoe geef jij feedback — en wat hoort de speler effectief?',
    theorie: 'Feedback is het krachtigste leerinstrument in de sport — maar ook het meest misbruikte. Onderzoek van Hattie & Timperley (2007) toont dat effectieve feedback zich richt op de taak en het leerproces, niet op de persoon. Het SBI-model (Situation–Behavior–Impact) geeft structuur: beschrijf de situatie, het specifieke gedrag en de impact. Positief-correctief feedback (niet de sandwichmethode) is 4-5x effectiever dan puur kritisch feedback bij jeugd.',
    bron: 'Hattie & Timperley (2007) · Magill (2011) · Amorose (2007) · Kim Scott (2017)',
    quotes: [
      { text: '"Feedback is een cadeau — maar alleen als de ontvanger het ook zo ervaart."', auteur: '— Sheila Heen' },
      { text: '"Het probleem is niet dat mensen het oneens zijn. Het probleem is dat ze dat niet eerlijk zeggen."', auteur: '— Kim Scott' },
    ],
    reflectie: [
      'Wat is de verhouding positieve vs. correctieve feedback die jij geeft tijdens een training? Denk je dat dat klopt?',
      'Geef je feedback op de persoon of op het gedrag? Noem een recent voorbeeld van elk.',
      'Welke speler in jouw team krijgt systematisch minder feedback van jou? Waarom?',
      'Hoe reageert jij als een speler jouw feedback weerspreekt of niet accepteert?',
      'Wanneer heb jij voor het laatst feedback gevraagd aan een speler over jouw eigen coaching?',
    ],
    boeken: [
      { titel: 'Radical Candor', auteur: 'Kim Scott', waarom: 'Care personally, challenge directly. Het beste raamwerk voor eerlijke én respectvolle feedback. Hoofdstuk 3 is goud.' },
      { titel: 'Thanks for the Feedback', auteur: 'Douglas Stone & Sheila Heen', waarom: 'Hoe je feedback geeft én ontvangt. Onmisbaar voor coaches die ook zelf willen groeien.' },
      { titel: 'Nonviolent Communication', auteur: 'Marshall Rosenberg', waarom: 'Communiceren vanuit behoeften, niet verwijten. Verandert hoe je met spelers én ouders praat.' },
    ],
    videos: [
      { titel: 'How to Give and Receive Feedback', spreker: 'Sheila Heen (Harvard)', url: 'youtube.com/watch?v=FQNbaKkYk_Q', notitie: 'Drie soorten feedback. Leer welke jij geeft en welke je zou moeten geven.' },
      { titel: 'Radical Candor', spreker: 'Kim Scott (FirstRound Talk)', url: 'youtube.com/watch?v=4yODalLQ2lM', notitie: 'Het 2x2 raster: ruinous empathy vs. obnoxious aggression vs. manipulative insincerity vs. radical candor.' },
    ],
    podcasts: [
      { naam: 'Coaching Real Leaders', afl: 'HBR Podcast — moeilijke feedbackgesprekken voeren', url: 'hbr.org/podcasts/coaching-real-leaders' },
      { naam: 'Dare to Lead met Brené Brown', afl: 'Afl. over eerlijke gesprekken en "clear is kind"', url: 'brenebrown.com/podcast' },
    ],
    actie: 'Geef de komende week aan drie spelers specifieke SBI-feedback: "In [situatie] deed jij [gedrag] — de impact was [effect]." Geen beoordeling, geen interpretatie.',
    commitment: 'Eén communicatiegewoonte die ik wil veranderen in mijn coaching:',
  },
  {
    num: 5, kleur: '#7A52C7',
    title: 'Motivatieklimaat Bouwen',
    vraag: 'Wat beloon jij eigenlijk — winnen of leren?',
    theorie: 'De Achievement Goal Theory (Ames, 1992) onderscheidt twee klimaten: een mastery-klimaat (gericht op leren, vooruitgang, inzet) en een performance-klimaat (gericht op winnen, vergelijken, rangschikken). Onderzoek in jeugdsport toont consistent: spelers in een mastery-klimaat hebben meer plezier, persisteren langer, maken minder fouten door angst, en presteren op lange termijn beter. Het klimaat wordt gecreëerd door de coach — via feedback, groepering, evaluatie en tijdsinvestering.',
    bron: 'Ames (1992) · Nicholls (1989) · Smith, Smoll & Cumming (2007) · Ntoumanis & Biddle (1999)',
    quotes: [
      { text: '"Vertel me hoe je de score bijhoudt en ik zeg je hoe mensen zich gedragen."', auteur: '— Albert Ames' },
      { text: '"In een groeiklimaat is de mislukking niet het tegenovergestelde van succes. Het is een onderdeel ervan."', auteur: '— Carol Dweck' },
    ],
    reflectie: [
      'Wat is de eerste reactie die je geeft als een team een wedstrijd verliest maar goed gespeeld heeft? En als ze winnen maar slecht speelden?',
      'Hoe evalueer jij spelers? Op basis van inzet en groei — of op basis van vergelijking met anderen?',
      'Welke signalen in jouw training tonen spelers dat fouten maken veilig is?',
      'Hoe praat jij over de sterke spelers vs. de zwakkere? Wat horen de anderen daarin?',
      'Als je morgen kon kiezen: team dat altijd wint maar niet groeit, of team dat verliest maar elke week beter wordt — wat kies je? Waarom?',
    ],
    boeken: [
      { titel: 'Mindset', auteur: 'Carol Dweck', waarom: 'Het standaardwerk over fixed vs. growth mindset. Hoofdstukken 4 en 5 gaan specifiek over sport en coaching.' },
      { titel: 'Peak', auteur: 'Anders Ericsson & Robert Pool', waarom: 'Deliberate practice: hoe je een klimaat bouwt waar spelers echt leren. Gebaseerd op 30 jaar eliteonderzoek.' },
      { titel: 'The Culture Code', auteur: 'Daniel Coyle', waarom: 'Hoe de beste teams ter wereld een klimaat van veilig leren bouwen. Concrete lessen uit Navy SEALs, Pixar en de All Blacks.' },
    ],
    videos: [
      { titel: 'The Power of Believing That You Can Improve', spreker: 'Carol Dweck (TED Talk)', url: 'ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve', notitie: 'Het "nog niet"-principe. Bekijk en beslis: gebruik jij dit in jouw coaching?' },
      { titel: 'How to Build a High Performing Team', spreker: 'Daniel Coyle (Google Talk)', url: 'youtube.com/watch?v=KpSNGeDGDKA', notitie: 'De drie ingrediënten van cultuur: safety signals, vulnerability loops, shared purpose.' },
    ],
    podcasts: [
      { naam: 'The Science of Sport', afl: 'Motivatieklimaat in jeugdsport — wat de wetenschap zegt', url: 'scienceofsport.com' },
      { naam: 'Finding Mastery', afl: 'Afl. met Carol Dweck — mindset in sport', url: 'findingmastery.com' },
    ],
    actie: 'Analyseer je eerstvolgende training: tel hoe vaak je inspanning/leerproces beloont vs. hoe vaak je resultaat/correctheid beloont. Wat verander je volgende keer?',
    commitment: 'Eén concreet element in mijn training dat ik aanpas om een sterker mastery-klimaat te bouwen:',
  },
  {
    num: 6, kleur: '#C73F62',
    title: 'Emotieregulatie van de Coach',
    vraag: 'Wat doen jouw emoties met je spelers — ook als je denkt dat je niets zegt?',
    theorie: 'Emotionele besmetting (Hatfield, Cacioppo & Rapson, 1994) toont aan dat mensen elkaars emoties onbewust overnemen via micro-expressies, stemtoon en lichaamstaal. Als coach ben jij de dominante emotionele zender in je groep: jouw spanning wordt hun spanning, jouw kalmte wordt hun kalmte. Neuropsychologisch staat dit bekend als limbic resonance — de amygdala van jouw spelers spiegelt letterlijk de jouwe. Zelfregulatie is geen zachte vaardigheid; het is een prestatievariabele.',
    bron: 'Hatfield et al. (1994) · Lewis, Amini & Lannon (2000) · Gross (1998) · Goleman (1995)',
    quotes: [
      { text: '"Je kunt je emoties niet verbergen voor mensen die van je afhangen. Ze voelen alles."', auteur: '— Daniel Goleman' },
      { text: '"De kalme coach creëert kalme atleten. De angstige coach creëert angstige atleten. Altijd."', auteur: '— Steve Peters' },
    ],
    reflectie: [
      'Wat zijn jouw drie grootste emotionele triggers als coach? (Bijv: verlies, gebrek aan inzet, fouten onder druk.)',
      'Hoe merk je fysiek dat je spanning oploopt tijdens een wedstrijd? Wat doet dat met jouw lichaamstaal?',
      'Wanneer heb je voor het laatst een emotionele reactie gehad die je later betreurde? Wat was de trigger?',
      'Hoe bereid jij jou voor op een emotioneel zware wedstrijd of training? Heb je een routine?',
      'Wat doen jouw spelers als jij gespannen bent? Observeer dit de komende weken bewust.',
    ],
    boeken: [
      { titel: 'The Chimp Paradox', auteur: 'Steve Peters', waarom: 'Hoe de emotionele hersenen werken — en hoe je ze beheert. Gebruikt door Team GB en Chris Hoy. Praktisch en toegankelijk.' },
      { titel: 'Emotional Intelligence', auteur: 'Daniel Goleman', waarom: 'Het wetenschappelijke fundament van EQ. Lees Deel 2: waarom emoties besmettelijk zijn en hoe je dat als leider beheert.' },
      { titel: 'Performing Under Pressure', auteur: 'Weisinger & Pawliw-Fry', waarom: 'Concreet: hoe druk prestatievermogen vernietigt en hoe je dat ombuigt. Inclusief toolkit voor coaches.' },
    ],
    videos: [
      { titel: 'The Hand Model of the Brain', spreker: 'Daniel Siegel', url: 'youtube.com/watch?v=gm9CIJ74Oxw', notitie: 'Leg dit model ook uit aan je spelers. Begrijpen hoe de hersenen werken onder druk is bevrijdend.' },
      { titel: 'Managing Your Emotions as a Coach', spreker: 'Steve Peters (Sport Interview)', url: 'youtube.com/results?search_query=steve+peters+chimp+paradox+coaching', notitie: 'Hoe Peters met elitesporters werkt aan emotionele controle in de coach.' },
    ],
    podcasts: [
      { naam: 'The High Performance Podcast', afl: 'Afl. over prestatieangst en drukregulatie bij coaches', url: 'thehighperformancepodcast.com' },
      { naam: 'Finding Mastery', afl: 'Afl. met Michael Gervais — zelfregulatie als fundament van coaching', url: 'findingmastery.com' },
    ],
    actie: 'Ontwikkel een pre-wedstrijd routine van 5 minuten die jou emotioneel kalibreeert. Box breathing (4-4-4-4), body scan, of een intentie-zin. Test het 3 wedstrijden lang.',
    commitment: 'Mijn persoonlijke emotionele trigger als coach waar ik aan wil werken:',
  },
  {
    num: 7, kleur: '#1C2433',
    title: 'Teamdynamiek & Cohesie',
    vraag: 'Bouw jij een groep sporters — of een echt team?',
    theorie: 'Groepscohesie in sport heeft twee dimensies (Carron et al., 1985): taakcohesie (samen werken naar een doel) en sociale cohesie (elkaar graag zien). Beide zijn belangrijk, maar taakcohesie is de sterkere voorspeller van prestatie. Tuckman\'s fasenmodel (Forming → Storming → Norming → Performing → Adjourning) beschrijft hoe teams groeien. Coaches die de Storming-fase vermijden of onderdrukken, houden hun team kunstmatig in de Norming-fase — zonder echte verbinding.',
    bron: 'Carron et al. (1985) · Tuckman (1965) · Lencioni (2002) · Festinger et al. (1950)',
    quotes: [
      { text: '"Individuele toewijding aan een groepsinspanning — dat is wat een team, een bedrijf, een samenleving laat werken."', auteur: '— Vince Lombardi' },
      { text: '"Het vertrouwen van een team bouw je op in de moeilijke momenten, niet in de makkelijke."', auteur: '— Patrick Lencioni' },
    ],
    reflectie: [
      'In welke Tuckman-fase zit jouw team nu? Wat zijn de signalen daarvoor?',
      'Zijn er subgroepen of kliekjes in jouw team? Wat doet dat met de cohesie — en wat doe jij eraan?',
      'Hoe zorg jij er actief voor dat alle spelers een duidelijke, gewaardeerde rol hebben?',
      'Wanneer heb jij als coach bewust ruimte gegeven aan "Storming" — conflict en spanning — in plaats van het glad te strijken?',
      'Wat is het gedeelde verhaal van jouw team? Weten spelers waarom ze samen spelen?',
    ],
    boeken: [
      { titel: 'The Five Dysfunctions of a Team', auteur: 'Patrick Lencioni', waarom: 'De piramide van teamfalen: van gebrek aan vertrouwen tot onachtzaamheid voor resultaten. Korte fabel, diepe inzichten.' },
      { titel: 'Legacy', auteur: 'James Kerr', waarom: 'Hoe de All Blacks teamidentiteit, rollen en rituelen bewust bouwen. Het beste sportboek over teamcultuur.' },
      { titel: 'Tribal Leadership', auteur: 'Dave Logan, John King & Halee Fischer-Wright', waarom: 'De vijf niveaus van teamcultuur — van "mijn leven is klote" tot "wij zijn geweldig". Waar zit jouw team?' },
    ],
    videos: [
      { titel: 'How to Build a High Performing Team', spreker: 'Patrick Lencioni', url: 'youtube.com/watch?v=GCxct4CR-To', notitie: 'De vijf dysfuncties live toegelicht. Bekijk met pen en papier.' },
      { titel: 'The Secrets of Great Teamwork', spreker: 'Martine Haas & Mark Mortensen (HBR)', url: 'youtube.com/watch?v=hHJ3KIBqrNc', notitie: 'Wat maakt teams echt goed? Onderzoek van Harvard op honderden teams.' },
    ],
    podcasts: [
      { naam: 'At the Table met Patrick Lencioni', afl: 'Hoe gezonde teams omgaan met conflict', url: 'tablegroup.com/at-the-table' },
      { naam: 'The Science of Sport', afl: 'Cohesie in teamsport — wat werkt en wat niet', url: 'scienceofsport.com' },
    ],
    actie: 'Organiseer deze maand één teamactiviteit die niets met sport te maken heeft. Observeer wie leiderschap neemt, wie terugtrekt, wie verbindt. Noteer het.',
    commitment: 'Eén concreet initiatief dat ik neem om de teamcohesie te versterken:',
  },
  {
    num: 8, kleur: '#3A8A8A',
    title: 'Ouders als Partner',
    vraag: 'Hoe maak jij van ouders een kracht voor het team — in plaats van een bedreiging?',
    theorie: 'Ouders zijn de meest onderzochte externe factor in jeugdsport (Côté, 1999; Wuerth et al., 2004). Hun impact is niet neutraal: te weinig betrokkenheid correleert met vroegtijdige uitval, maar overmatige druk correleert met angst, burnout en sportverlating. De Expertise-fase (Bloom, 1985) toont dat succesvolle sporters ouders hadden die in de specialisatiefase bewust meer distantie namen. Coaches die ouders actief informeren, betrekken én begrenzen, presteren aantoonbaar beter.',
    bron: 'Côté (1999) · Wuerth, Lee & Alfermann (2004) · Bloom (1985) · Ginsburg et al. (2014)',
    quotes: [
      { text: '"De beste ouder van een jonge sporter is degene die na de wedstrijd niets anders zegt dan: \'Ik vond het geweldig om je te zien spelen.\'"', auteur: '— Dr. John O\'Sullivan' },
      { text: '"Ouders die hun kind perfect willen maken, stelen hen de kans om dat zelf te ontdekken."', auteur: '— Tim Elmore' },
    ],
    reflectie: [
      'Welke ouder in jouw team zorgt het vaakst voor spanning? Heb jij een eerlijk gesprek gehad over wat je van hen verwacht?',
      'Hoe communiceer jij met ouders? Wat weten zij over jouw filosofie en aanpak?',
      'Wanneer heb je een grens moeten stellen bij een ouder? Hoe heb je dat gedaan?',
      'Zijn er ouders die jouw relatie met specifieke spelers ondermijnen? Wat doe jij daarmee?',
      'Hoe betrek jij ouders positief bij het team — zonder hen het team te laten overnemen?',
    ],
    boeken: [
      { titel: 'Whose Game Is It, Anyway?', auteur: 'Richard Ginsburg, Stephen Durant & Amy Baltzell', waarom: 'Het meest complete boek over ouders in jeugdsport. Praktisch, eerlijk en evidence-based.' },
      { titel: 'Changing the Game', auteur: 'John O\'Sullivan', waarom: 'Waarom jeugdsport kapot gaat — en hoe coaches én ouders dat kunnen keren. Krachtig manifest.' },
      { titel: 'How Children Succeed', auteur: 'Paul Tough', waarom: 'Over karakter, grit en wat kinderen echt nodig hebben van volwassenen. Herschrijft het gesprek over succes en ouderrol.' },
    ],
    videos: [
      { titel: 'What Makes a Nightmare Sports Parent — and What Makes a Great One', spreker: 'John O\'Sullivan (TEDx)', url: 'youtube.com/watch?v=VXw0XGOFQvw', notitie: 'De meest bekeken TEDx-talk over jeugdsport en ouders. Stuur door naar jouw ouders.' },
      { titel: 'Developing Mental Toughness in Young Athletes', spreker: 'Jim Thompson (Positive Coaching Alliance)', url: 'youtube.com/results?search_query=positive+coaching+alliance+parents', notitie: 'Hoe je ouders meeneemt in een positieve cultuur.' },
    ],
    podcasts: [
      { naam: 'Changing the Game Project Podcast', afl: 'Ouders in jeugdsport — de grens tussen steun en druk', url: 'changingthegameproject.com/podcast' },
      { naam: 'The High Performance Podcast', afl: 'Rol van ouders in het vormen van elitesporters', url: 'thehighperformancepodcast.com' },
    ],
    actie: 'Schrijf deze week een ouderbrief of houd een ouderbijeenkomst van 30 min. Leg jouw filosofie uit: wat jij doet, wat je van hen vraagt en wat je hen belooft.',
    commitment: 'Mijn aanpak om ouders beter te begeleiden dit seizoen:',
  },
  {
    num: 9, kleur: '#F05A28',
    title: 'Mentale Gezondheid & Signalen',
    vraag: 'Herken jij het verschil tussen een sporter die het moeilijk heeft en één die mentaal gevaar loopt?',
    theorie: 'Mentale gezondheidsproblemen komen vaker voor bij sporters dan bij niet-sporters (Gouttebarge et al., 2019). Coaches zijn vaak de eerste volwassenen die signalen opvangen — vóór ouders of school. De Duty of Care-verplichting verplicht coaches actief te zorgen voor het welzijn van hun sporters. Burn-out bij jeugd (Raedeke, 1997) kent drie dimensies: emotionele uitputting, depersonalisatie (sport voelt zinloos), en gereduceerd gevoel van eigenwaarde. Vroeg herkennen is levensreddend.',
    bron: 'Gouttebarge et al. (2019) · Raedeke (1997) · Rice et al. (2016) · UK Sport Duty of Care (2017)',
    quotes: [
      { text: '"Zorg voor de persoon achter de atleet. De prestaties volgen vanzelf."', auteur: '— Aine O\'Connor, hoofd mentale gezondheid British Athletics' },
      { text: '"Als een coach vraagt hoe het gaat en écht luistert naar het antwoord, kan dat een leven veranderen."', auteur: '— Michael Phelps' },
    ],
    reflectie: [
      'Welke signalen van mentale overbelasting herken jij bij sporters? Maak een concrete lijst van 5 tekenen.',
      'Hoe vraag jij aan spelers hoe het écht gaat — op een manier dat ze eerlijk durven antwoorden?',
      'Wat doe jij als je vermoedt dat een speler het mentaal niet goed heeft? Heb je een protocol?',
      'Waar liggen de grenzen van jouw rol als coach? Wanneer verwijs je door — en naar wie?',
      'Hoe bescherm jij jouw eigen mentale gezondheid als coach? Wat doe jij aan zelfzorg?',
    ],
    boeken: [
      { titel: 'Why Has Nobody Told Me This Before?', auteur: 'Dr. Julie Smith', waarom: 'Psychiater legt mentale gezondheidstools uit voor iedereen. Helpt coaches begrijpen wat spelers doormaken.' },
      { titel: 'The Brave Athlete', auteur: 'Simon Marshall & Lesley Paterson', waarom: 'Het hersenwetenschappelijk handboek voor atleten over angst, motivatie en zelfkritiek. Lees als coach om je spelers beter te begrijpen.' },
      { titel: 'Lost Connections', auteur: 'Johann Hari', waarom: 'Depressie en angst zijn sociaal, niet alleen biochemisch. Herschrijft hoe je kijkt naar sporters die zich terugtrekken.' },
    ],
    videos: [
      { titel: 'Michael Phelps on Mental Health in Sport', spreker: 'Michael Phelps (Realmindful)', url: 'youtube.com/results?search_query=michael+phelps+mental+health+athlete', notitie: 'De meest succesvolle Olympiër ooit over depressie en de rol van coaches. Krachtig.' },
      { titel: 'The Secret of Becoming Mentally Strong', spreker: 'Amy Morin (TEDx)', url: 'youtube.com/watch?v=TFbv757kup4', notitie: 'Gewoontes die mentale kracht ondermijnen. Herken je dit bij je spelers — of jezelf?' },
    ],
    podcasts: [
      { naam: 'The Mind Your Mental Health Podcast', afl: 'Mentale gezondheid in jeugdsport', url: 'mindyourmentalhealth.ca' },
      { naam: 'Finding Mastery', afl: 'Afl. over athlete mental health en coach responsibility', url: 'findingmastery.com' },
    ],
    actie: 'Maak een "signaalkaart" voor jezelf: 5 gedragsveranderingen die erop wijzen dat een speler het moeilijk heeft. Spreek ook af wie jouw aanspreekpunt is (vertrouwenspersoon, school, CLB) als je moet doorverwijzen.',
    commitment: 'Mijn actieplan als ik merk dat een speler mentaal in de knoop zit:',
  },
  {
    num: 10, kleur: '#1C2433',
    title: 'De Reflectieve Coach',
    vraag: 'Hoe leer jij als coach — en hoe weet je of je beter wordt?',
    theorie: 'Donald Schön (1983) onderscheidt twee vormen van professioneel leren: reflection-in-action (tijdens de coaching bijsturen) en reflection-on-action (achteraf analyseren). Deliberate practice (Ericsson, 1993) toont dat expertise niet komt van ervaring alleen, maar van bewuste, gefocuste oefening op zwakke punten met directe feedback. De beste coaches zijn levenslange leerders die systematisch reflecteren, peer-coaching gebruiken en video-analyse inzetten.',
    bron: 'Schön (1983) · Ericsson (1993) · Cushion et al. (2010) · Côté & Gilbert (2009)',
    quotes: [
      { text: '"Een coach die stopt met leren, is een coach die gestopt is met coachen — hij weet het alleen nog niet."', auteur: '— John Wooden' },
      { text: '"Het is niet de ervaring die je beter maakt. Het is de geëvalueerde ervaring."', auteur: '— John Maxwell' },
    ],
    reflectie: [
      'Hoe leer jij als coach vandaag? Noem drie concrete bronnen van groei die je het afgelopen jaar hebt gebruikt.',
      'Wanneer heb je voor het laatst een eigen training of wedstrijd geanalyseerd — met video of met aantekeningen?',
      'Wie is jouw coach? Wie begeleidt jou in jouw groei als coach?',
      'Wat is het grootste gat tussen wie je wil zijn als coach en wie je nu bent? Wat doe je actief om dat te dichten?',
      'Als je terugkijkt op vijf jaar coachen: wat heb je fundamenteel veranderd in je aanpak? Wat triggerde die verandering?',
    ],
    boeken: [
      { titel: 'Peak', auteur: 'Anders Ericsson & Robert Pool', waarom: 'De wetenschap van deliberate practice. Hoe de beste in hun vak worden wie ze zijn — en wat dit betekent voor jouw eigen groei als coach.' },
      { titel: 'Range', auteur: 'David Epstein', waarom: 'Brede ervaringen maken betere coaches. Tegenhanger van overspecialisatie. Herschrijft het debat over vroeg vs. laat specialiseren.' },
      { titel: 'The Reflective Practitioner', auteur: 'Donald Schön', waarom: 'Het fundament van professioneel leren. Hoe experts leren door te doen en te reflecteren. Academisch maar onmisbaar.' },
      { titel: 'Bounce', auteur: 'Matthew Syed', waarom: 'Talent is een mythe. Deliberate practice, mentale sterktes en de rol van coaches in het vormen van kampioenen.' },
    ],
    videos: [
      { titel: 'The Making of an Expert', spreker: 'Anders Ericsson (Stanford)', url: 'youtube.com/results?search_query=anders+ericsson+deliberate+practice+talk', notitie: 'Deliberate practice vs. naïeve practice. De meeste coaches doen het tweede. Wil je het eerste doen?' },
      { titel: 'Atul Gawande on Coaching', spreker: 'Atul Gawande (New Yorker Talk)', url: 'youtube.com/results?search_query=atul+gawande+coaching+newyorker', notitie: 'Waarom zelfs de beste chirurgen een coach nodig hebben. Heb jij een coach?' },
    ],
    podcasts: [
      { naam: 'The James Clear Podcast', afl: 'Gewoontes en systemen voor continue groei als professional', url: 'jamesclear.com/podcast' },
      { naam: 'The Tim Ferriss Show', afl: 'Afl. met Anders Ericsson — hoe experts experts worden', url: 'tim.blog/podcast' },
    ],
    actie: 'Start een coachingsdagboek. Schrijf na elke training/wedstrijd 3 dingen: (1) Wat ging goed en waarom? (2) Wat zou ik anders doen? (3) Wat leer ik hieruit over mezelf als coach?',
    commitment: 'Mijn plan om systematischer te reflecteren op mijn coaching dit seizoen:',
  },
];

// ============================================================
// EN DATA
// ============================================================
const modulesEN = [
  {
    num: 1, kleur: '#F05A28',
    title: 'Self-Knowledge as a Coach',
    vraag: 'Who are you as a coach — and how does that affect what happens with your players?',
    theorie: 'Coaches are the most influential adults in young athletes\' lives, after parents. But that influence is never neutral: it always reflects who the coach is as a person. The Johari Window (Luft & Ingham, 1955) shows that effective coaching starts with shrinking your "blind spot" — the things others see in you that you don\'t see yourself. Coaches with high self-awareness use power, pressure, and relationships more consciously.',
    bron: 'Luft & Ingham (1955) · Rhind & Jowett (2010) · Côté & Gilbert (2009)',
    quotes: [
      { text: '"Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others."', auteur: '— Jack Welch' },
      { text: '"You can only lead others as far as you have led yourself."', auteur: '— John Maxwell' },
    ],
    reflectie: [
      'What three values define you as a coach? Where do those come from?',
      'When were you least proud of yourself as a coach this past month? What does that say about you?',
      'What player behavior triggers you most strongly — and why do you think that is?',
      'How would a player from last year describe you now? Does that match who you want to be?',
      'What is your biggest blind spot as a coach? Who is willing to tell you that honestly?',
    ],
    boeken: [
      { titel: 'Legacy', auteur: 'James Kerr', waarom: 'How the All Blacks build a culture from values and self-knowledge. Every chapter is a lesson in leading from within.' },
      { titel: 'Dare to Lead', auteur: 'Brené Brown', waarom: 'On leading courageously through vulnerability. Required reading for every coach who wants to create real connection.' },
      { titel: 'The Inner Game of Tennis', auteur: 'W. Timothy Gallwey', waarom: 'Classic work on the coach\'s inner voice. How your doubts and judgments influence player performance.' },
      { titel: 'The Talent Code', auteur: 'Daniel Coyle', waarom: 'Why some coaches develop talent and others don\'t. Driven by self-awareness and targeted feedback.' },
    ],
    videos: [
      { titel: 'The Power of Vulnerability', spreker: 'Brené Brown (TED Talk)', url: 'ted.com/talks/brene_brown_the_power_of_vulnerability', notitie: 'Watch: how vulnerability is courage, not weakness. Essential for coaches.' },
      { titel: 'How Great Leaders Inspire Action', spreker: 'Simon Sinek (TED Talk)', url: 'ted.com/talks/simon_sinek_how_great_leaders_inspire_action', notitie: 'The "Golden Circle": start with why. What is YOUR why as a coach?' },
    ],
    podcasts: [
      { naam: 'Finding Mastery', afl: 'Episode with Pete Carroll — coaching from values and identity', url: 'findingmastery.com' },
      { naam: 'The High Performance Podcast', afl: 'Episode with Jürgen Klopp — who you are shapes how you coach', url: 'thehighperformancepodcast.com' },
    ],
    actie: 'Ask one trusted colleague or player this week: "What do you see in me as a coach that I might not see myself?" Write it down without defending yourself.',
    commitment: 'My personal growth point as a coach this season is:',
  },
  {
    num: 2, kleur: '#2F6FB0',
    title: 'Coaching Style & Autonomy',
    vraag: 'Do you motivate players — or do you teach them to motivate themselves?',
    theorie: 'Self-Determination Theory (Deci & Ryan, 1985) shows that people are most motivated when three basic needs are met: autonomy (I have choice), competence (I can do it), and relatedness (I belong). Controlling coaches who rely solely on pressure and enforcement undermine intrinsic motivation. Autonomy-supportive coaching demonstrably leads to better performance, less burnout, and higher long-term enjoyment of sport.',
    bron: 'Deci & Ryan (1985, 2000) · Mageau & Vallerand (2003) · Amorose & Anderson-Butcher (2007)',
    quotes: [
      { text: '"The best coaches create conditions where players want to surpass themselves — not because they have to, but because they want to."', auteur: '— Daniel Pink' },
      { text: '"Control is the enemy of autonomy. And autonomy is the engine of growth."', auteur: '— Edward Deci' },
    ],
    reflectie: [
      'Do your players genuinely have input in training content, rules, or team agreements? Or is it fake autonomy?',
      'When do you give instructions vs. when do you ask questions? What is the ratio?',
      'Which player on your team needs the most structured environment — and which needs the most freedom? Do you treat them differently?',
      'How do you react when a player wants to try something different than what you suggest? What does that say about your style?',
      'What would change in your training if you let players design one session entirely themselves?',
    ],
    boeken: [
      { titel: 'Drive', auteur: 'Daniel Pink', waarom: 'The science of motivation in one accessible book. Intrinsic vs. extrinsic, and what coaches get wrong about rewards.' },
      { titel: 'Mindset', auteur: 'Carol Dweck', waarom: 'Fixed vs. growth mindset. How you as a coach create — or destroy — a growth climate with your words and reactions.' },
      { titel: 'Why Motivating People Doesn\'t Work and What Does', auteur: 'Susan Fowler', waarom: 'Practical book on optimal motivation. Translates SDT directly into coaching practice.' },
    ],
    videos: [
      { titel: 'The Puzzle of Motivation', spreker: 'Daniel Pink (TED Talk)', url: 'ted.com/talks/dan_pink_the_puzzle_of_motivation', notitie: 'Watch: the Candle Problem experiment. External rewards kill creative thinking.' },
      { titel: 'The Power of Believing You Can Improve', spreker: 'Carol Dweck (TED Talk)', url: 'ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve', notitie: 'How "not yet" is more powerful than "no." Applicable in every coaching interaction.' },
    ],
    podcasts: [
      { naam: 'The Science of Sport', afl: 'Episode on intrinsic motivation in youth sport', url: 'scienceofsport.com' },
      { naam: 'Kwame Christian — Negotiate Anything', afl: 'How to move people without forcing them', url: 'negotiateanything.com' },
    ],
    actie: 'Observe yourself for one week: note each time you give an instruction vs. ask a question. What is the ratio? What do you want to change?',
    commitment: 'One way I will give more autonomy to my players:',
  },
  {
    num: 3, kleur: '#1E8A5B',
    title: 'The Coach-Athlete Relationship',
    vraag: 'How well do your players know you — and how well do you know them?',
    theorie: 'Jowett\'s 3C+1 model (2007) describes the coach-athlete relationship through four dimensions: Closeness (emotional nearness), Commitment (mutual dedication), Complementarity (working together), and Co-orientation (shared understanding). Research consistently shows that the quality of this relationship is the single strongest predictor of athletic performance, wellbeing, and enjoyment. Athletes perform better for coaches who know them as people, not just as athletes.',
    bron: 'Jowett & Ntoumanis (2004) · Jowett (2007) · Lorimer & Jowett (2009)',
    quotes: [
      { text: '"Players play for coaches who know them as a person. They play harder for coaches who respect them as a human being."', auteur: '— John Wooden' },
      { text: '"The coach-athlete relationship is the most influential human relationship in sport."', auteur: '— Sophia Jowett' },
    ],
    reflectie: [
      'Do you know about every player on your team: what truly occupies them outside sport? Name one thing per player.',
      'Which players on your team feel least connected to you? What are you actively doing to change that?',
      'How do you show commitment to your players — beyond training and games?',
      'When did a player last share something personal with you? How did you respond?',
      'How balanced is the relationship: do you invest as much in the quiet, average player as in the star?',
    ],
    boeken: [
      { titel: 'The Relationship Coach', auteur: 'Sophia Jowett & Marc Lafrenière', waarom: 'The definitive work on coach-athlete relationships. Theory translated directly into practice.' },
      { titel: 'It\'s Your Ship', auteur: 'D. Michael Abrashoff', waarom: 'How a Navy commander transformed his team by truly getting to know every person. Direct translation to sport.' },
      { titel: 'The Culture Code', auteur: 'Daniel Coyle', waarom: 'Three skills that build culture: safety, vulnerability, and shared purpose. The chapter on the All Blacks is a must.' },
    ],
    videos: [
      { titel: 'Building a Psychologically Safe Workplace', spreker: 'Amy Edmondson (TEDx)', url: 'youtube.com/watch?v=LhoLuui9gX8', notitie: 'How safety in relationships boosts performance. Directly applicable in team context.' },
      { titel: 'Every Kid Needs a Champion', spreker: 'Rita Pierson (TED Talk)', url: 'ted.com/talks/rita_pierson_every_kid_needs_a_champion', notitie: '"Kids don\'t learn from people they don\'t like." Powerful for youth coaches.' },
    ],
    podcasts: [
      { naam: 'Finding Mastery', afl: 'Episode with Gregg Popovich — relationship-building as a performance driver', url: 'findingmastery.com' },
      { naam: 'The Coach2 Podcast', afl: 'On making individual connection in a team context', url: 'coachingforleaders.com' },
    ],
    actie: 'Schedule an informal 1-on-1 conversation this week with a player you know least well. No sports agenda — just genuinely listen. Write down what you learn.',
    commitment: 'One player in whom I will consciously invest more in the relationship:',
  },
  {
    num: 4, kleur: '#C7842F',
    title: 'Feedback & Communication',
    vraag: 'How do you give feedback — and what does the player actually hear?',
    theorie: 'Feedback is the most powerful learning tool in sport — but also the most misused. Research by Hattie & Timperley (2007) shows that effective feedback focuses on the task and learning process, not the person. The SBI model (Situation–Behavior–Impact) provides structure: describe the situation, the specific behavior, and the impact. Positive-corrective feedback (not the sandwich method) is 4-5x more effective than purely critical feedback with youth athletes.',
    bron: 'Hattie & Timperley (2007) · Magill (2011) · Amorose (2007) · Kim Scott (2017)',
    quotes: [
      { text: '"Feedback is a gift — but only when the recipient experiences it that way."', auteur: '— Sheila Heen' },
      { text: '"The problem isn\'t that people disagree. The problem is that they don\'t say it honestly."', auteur: '— Kim Scott' },
    ],
    reflectie: [
      'What is the ratio of positive to corrective feedback you give during a training? Do you think that\'s accurate?',
      'Do you give feedback on the person or on the behavior? Give a recent example of each.',
      'Which player on your team systematically receives less feedback from you? Why?',
      'How do you react when a player contradicts or doesn\'t accept your feedback?',
      'When did you last ask a player for feedback on your own coaching?',
    ],
    boeken: [
      { titel: 'Radical Candor', auteur: 'Kim Scott', waarom: 'Care personally, challenge directly. The best framework for honest yet respectful feedback. Chapter 3 is gold.' },
      { titel: 'Thanks for the Feedback', auteur: 'Douglas Stone & Sheila Heen', waarom: 'How to give AND receive feedback. Essential for coaches who also want to grow themselves.' },
      { titel: 'Nonviolent Communication', auteur: 'Marshall Rosenberg', waarom: 'Communicating from needs, not blame. Changes how you talk to players and parents.' },
    ],
    videos: [
      { titel: 'How to Give and Receive Feedback', spreker: 'Sheila Heen (Harvard)', url: 'youtube.com/watch?v=FQNbaKkYk_Q', notitie: 'Three types of feedback. Learn which ones you give and which you should be giving.' },
      { titel: 'Radical Candor', spreker: 'Kim Scott (FirstRound Talk)', url: 'youtube.com/watch?v=4yODalLQ2lM', notitie: 'The 2×2 grid: ruinous empathy vs. obnoxious aggression vs. manipulative insincerity vs. radical candor.' },
    ],
    podcasts: [
      { naam: 'Coaching Real Leaders', afl: 'HBR Podcast — having difficult feedback conversations', url: 'hbr.org/podcasts/coaching-real-leaders' },
      { naam: 'Dare to Lead with Brené Brown', afl: 'Episode on honest conversations and "clear is kind"', url: 'brenebrown.com/podcast' },
    ],
    actie: 'Give specific SBI feedback to three players this week: "In [situation] you did [behavior] — the impact was [effect]." No judgment, no interpretation.',
    commitment: 'One communication habit I want to change in my coaching:',
  },
  {
    num: 5, kleur: '#7A52C7',
    title: 'Building a Motivation Climate',
    vraag: 'What are you actually rewarding — winning or learning?',
    theorie: 'Achievement Goal Theory (Ames, 1992) distinguishes two climates: a mastery climate (focused on learning, progress, effort) and a performance climate (focused on winning, comparing, ranking). Research in youth sport consistently shows: players in a mastery climate have more fun, persist longer, make fewer anxiety-driven errors, and perform better long-term. The climate is created by the coach — through feedback, grouping, evaluation, and time investment.',
    bron: 'Ames (1992) · Nicholls (1989) · Smith, Smoll & Cumming (2007) · Ntoumanis & Biddle (1999)',
    quotes: [
      { text: '"Tell me how you keep score, and I\'ll tell you how people will behave."', auteur: '— Albert Ames' },
      { text: '"In a growth climate, failure is not the opposite of success. It is part of it."', auteur: '— Carol Dweck' },
    ],
    reflectie: [
      'What is your first reaction when a team loses but played well? And when they win but played poorly?',
      'How do you evaluate players? Based on effort and growth — or based on comparison with others?',
      'What signals in your training show players that making mistakes is safe?',
      'How do you talk about stronger players vs. weaker ones? What do others hear in that?',
      'If you could choose tomorrow: a team that always wins but doesn\'t grow, or one that loses but improves every week — which do you choose? Why?',
    ],
    boeken: [
      { titel: 'Mindset', auteur: 'Carol Dweck', waarom: 'The definitive work on fixed vs. growth mindset. Chapters 4 and 5 focus specifically on sport and coaching.' },
      { titel: 'Peak', auteur: 'Anders Ericsson & Robert Pool', waarom: 'Deliberate practice: how to build a climate where players truly learn. Based on 30 years of elite research.' },
      { titel: 'The Culture Code', auteur: 'Daniel Coyle', waarom: 'How the world\'s best teams build a safe learning climate. Concrete lessons from Navy SEALs, Pixar, and the All Blacks.' },
    ],
    videos: [
      { titel: 'The Power of Believing That You Can Improve', spreker: 'Carol Dweck (TED Talk)', url: 'ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve', notitie: 'The "not yet" principle. Watch and decide: do you use this in your coaching?' },
      { titel: 'How to Build a High Performing Team', spreker: 'Daniel Coyle (Google Talk)', url: 'youtube.com/watch?v=KpSNGeDGDKA', notitie: 'Three ingredients of culture: safety signals, vulnerability loops, shared purpose.' },
    ],
    podcasts: [
      { naam: 'The Science of Sport', afl: 'Motivation climate in youth sport — what the science says', url: 'scienceofsport.com' },
      { naam: 'Finding Mastery', afl: 'Episode with Carol Dweck — mindset in sport', url: 'findingmastery.com' },
    ],
    actie: 'Analyze your next training session: count how often you reward effort/process vs. how often you reward result/correctness. What will you change next time?',
    commitment: 'One concrete element in my training I will adjust to build a stronger mastery climate:',
  },
  {
    num: 6, kleur: '#C73F62',
    title: 'Emotional Self-Regulation',
    vraag: 'What do your emotions do to your players — even when you think you\'re saying nothing?',
    theorie: 'Emotional contagion (Hatfield, Cacioppo & Rapson, 1994) shows that people unconsciously adopt each other\'s emotions through micro-expressions, tone of voice, and body language. As a coach you are the dominant emotional broadcaster in your group: your tension becomes their tension, your calm becomes their calm. Neuropsychologically this is known as limbic resonance — your players\' amygdalae literally mirror yours. Self-regulation is not a soft skill; it is a performance variable.',
    bron: 'Hatfield et al. (1994) · Lewis, Amini & Lannon (2000) · Gross (1998) · Goleman (1995)',
    quotes: [
      { text: '"You cannot hide your emotions from people who depend on you. They feel everything."', auteur: '— Daniel Goleman' },
      { text: '"The calm coach creates calm athletes. The anxious coach creates anxious athletes. Always."', auteur: '— Steve Peters' },
    ],
    reflectie: [
      'What are your three biggest emotional triggers as a coach? (E.g.: losing, lack of effort, mistakes under pressure.)',
      'How do you physically notice that tension is building during a game? What does that do to your body language?',
      'When did you last have an emotional reaction you later regretted? What was the trigger?',
      'How do you prepare yourself for an emotionally demanding game or training? Do you have a routine?',
      'What do your players do when you are tense? Consciously observe this over the coming weeks.',
    ],
    boeken: [
      { titel: 'The Chimp Paradox', auteur: 'Steve Peters', waarom: 'How the emotional brain works — and how to manage it. Used by Team GB and Chris Hoy. Practical and accessible.' },
      { titel: 'Emotional Intelligence', auteur: 'Daniel Goleman', waarom: 'The scientific foundation of EQ. Read Part 2: why emotions are contagious and how you manage that as a leader.' },
      { titel: 'Performing Under Pressure', auteur: 'Weisinger & Pawliw-Fry', waarom: 'Concrete: how pressure destroys performance and how to reverse that. Includes toolkit for coaches.' },
    ],
    videos: [
      { titel: 'The Hand Model of the Brain', spreker: 'Daniel Siegel', url: 'youtube.com/watch?v=gm9CIJ74Oxw', notitie: 'Teach this model to your players too. Understanding how the brain works under pressure is liberating.' },
      { titel: 'Managing Your Emotions as a Coach', spreker: 'Steve Peters (Sport Interview)', url: 'youtube.com/results?search_query=steve+peters+chimp+paradox+coaching', notitie: 'How Peters works with elite athletes on emotional control in the coach.' },
    ],
    podcasts: [
      { naam: 'The High Performance Podcast', afl: 'Episode on performance anxiety and pressure regulation in coaches', url: 'thehighperformancepodcast.com' },
      { naam: 'Finding Mastery', afl: 'Episode with Michael Gervais — self-regulation as the foundation of coaching', url: 'findingmastery.com' },
    ],
    actie: 'Develop a 5-minute pre-game routine that emotionally calibrates you. Box breathing (4-4-4-4), body scan, or an intention sentence. Test it for 3 consecutive games.',
    commitment: 'My personal emotional trigger as a coach I want to work on:',
  },
  {
    num: 7, kleur: '#1C2433',
    title: 'Team Dynamics & Cohesion',
    vraag: 'Are you building a group of athletes — or a real team?',
    theorie: 'Group cohesion in sport has two dimensions (Carron et al., 1985): task cohesion (working together toward a goal) and social cohesion (liking each other). Both matter, but task cohesion is the stronger predictor of performance. Tuckman\'s stage model (Forming → Storming → Norming → Performing → Adjourning) describes how teams grow. Coaches who avoid or suppress the Storming phase artificially keep their team in the Norming phase — without real connection.',
    bron: 'Carron et al. (1985) · Tuckman (1965) · Lencioni (2002) · Festinger et al. (1950)',
    quotes: [
      { text: '"Individual commitment to a group effort — that is what makes a team work, a company work, a society work."', auteur: '— Vince Lombardi' },
      { text: '"A team\'s trust is built in the difficult moments, not the easy ones."', auteur: '— Patrick Lencioni' },
    ],
    reflectie: [
      'In which Tuckman phase is your team right now? What are the signals for that?',
      'Are there subgroups or cliques in your team? What does that do to cohesion — and what are you doing about it?',
      'How do you actively ensure all players have a clear, valued role?',
      'When have you deliberately made space for "Storming" — conflict and tension — instead of smoothing it over?',
      'What is the shared story of your team? Do players know why they play together?',
    ],
    boeken: [
      { titel: 'The Five Dysfunctions of a Team', auteur: 'Patrick Lencioni', waarom: 'The pyramid of team failure: from absence of trust to inattention to results. Short fable, deep insights.' },
      { titel: 'Legacy', auteur: 'James Kerr', waarom: 'How the All Blacks consciously build team identity, roles, and rituals. The best sports book on team culture.' },
      { titel: 'Tribal Leadership', auteur: 'Dave Logan, John King & Halee Fischer-Wright', waarom: 'Five levels of team culture — from "my life is terrible" to "we are great." Where does your team sit?' },
    ],
    videos: [
      { titel: 'How to Build a High Performing Team', spreker: 'Patrick Lencioni', url: 'youtube.com/watch?v=GCxct4CR-To', notitie: 'The five dysfunctions explained live. Watch with pen and paper.' },
      { titel: 'The Secrets of Great Teamwork', spreker: 'Martine Haas & Mark Mortensen (HBR)', url: 'youtube.com/watch?v=hHJ3KIBqrNc', notitie: 'What truly makes teams great? Harvard research across hundreds of teams.' },
    ],
    podcasts: [
      { naam: 'At the Table with Patrick Lencioni', afl: 'How healthy teams handle conflict', url: 'tablegroup.com/at-the-table' },
      { naam: 'The Science of Sport', afl: 'Cohesion in team sport — what works and what doesn\'t', url: 'scienceofsport.com' },
    ],
    actie: 'Organize one team activity this month that has nothing to do with sport. Observe who takes leadership, who withdraws, who connects. Write it down.',
    commitment: 'One concrete initiative I will take to strengthen team cohesion:',
  },
  {
    num: 8, kleur: '#3A8A8A',
    title: 'Parents as Partners',
    vraag: 'How do you make parents a strength for the team — instead of a threat?',
    theorie: 'Parents are the most studied external factor in youth sport (Côté, 1999; Wuerth et al., 2004). Their impact is not neutral: too little involvement correlates with early dropout, but excessive pressure correlates with anxiety, burnout, and sport abandonment. Bloom\'s Expertise Phase (1985) shows that successful athletes had parents who consciously stepped back during the specialization phase. Coaches who actively inform, involve, and set boundaries with parents demonstrably perform better.',
    bron: 'Côté (1999) · Wuerth, Lee & Alfermann (2004) · Bloom (1985) · Ginsburg et al. (2014)',
    quotes: [
      { text: '"The best sports parent says nothing to their child after a game except: \'I loved watching you play.\'"', auteur: '— Dr. John O\'Sullivan' },
      { text: '"Parents who try to make their child perfect steal the child\'s chance to discover that themselves."', auteur: '— Tim Elmore' },
    ],
    reflectie: [
      'Which parent on your team most frequently causes tension? Have you had an honest conversation about what you expect from them?',
      'How do you communicate with parents? What do they know about your philosophy and approach?',
      'When have you needed to set a boundary with a parent? How did you handle it?',
      'Are there parents who undermine your relationship with specific players? What do you do about that?',
      'How do you positively involve parents with the team — without letting them take it over?',
    ],
    boeken: [
      { titel: 'Whose Game Is It, Anyway?', auteur: 'Richard Ginsburg, Stephen Durant & Amy Baltzell', waarom: 'The most complete book on parents in youth sport. Practical, honest, and evidence-based.' },
      { titel: 'Changing the Game', auteur: 'John O\'Sullivan', waarom: 'Why youth sport is breaking down — and how coaches and parents can turn it around. Powerful manifesto.' },
      { titel: 'How Children Succeed', auteur: 'Paul Tough', waarom: 'On character, grit, and what children truly need from adults. Rewrites the conversation about success and parental roles.' },
    ],
    videos: [
      { titel: 'What Makes a Nightmare Sports Parent — and What Makes a Great One', spreker: 'John O\'Sullivan (TEDx)', url: 'youtube.com/watch?v=VXw0XGOFQvw', notitie: 'The most-watched TEDx talk on youth sport and parents. Share with your parents.' },
      { titel: 'Developing Mental Toughness in Young Athletes', spreker: 'Jim Thompson (Positive Coaching Alliance)', url: 'youtube.com/results?search_query=positive+coaching+alliance+parents', notitie: 'How to bring parents into a positive culture.' },
    ],
    podcasts: [
      { naam: 'Changing the Game Project Podcast', afl: 'Parents in youth sport — the line between support and pressure', url: 'changingthegameproject.com/podcast' },
      { naam: 'The High Performance Podcast', afl: 'The role of parents in shaping elite athletes', url: 'thehighperformancepodcast.com' },
    ],
    actie: 'Write a parent letter this week or hold a 30-minute parent meeting. Explain your philosophy: what you do, what you ask of them, and what you promise them.',
    commitment: 'My approach to better guide parents this season:',
  },
  {
    num: 9, kleur: '#F05A28',
    title: 'Mental Health & Warning Signs',
    vraag: 'Do you recognize the difference between an athlete who is struggling and one who is in mental danger?',
    theorie: 'Mental health problems are more common in athletes than non-athletes (Gouttebarge et al., 2019). Coaches are often the first adults to pick up signals — before parents or school. The Duty of Care obligation requires coaches to actively ensure the wellbeing of their athletes. Burnout in youth (Raedeke, 1997) has three dimensions: emotional exhaustion, depersonalization (sport feels meaningless), and reduced sense of competence. Early recognition is life-changing.',
    bron: 'Gouttebarge et al. (2019) · Raedeke (1997) · Rice et al. (2016) · UK Sport Duty of Care (2017)',
    quotes: [
      { text: '"Take care of the person behind the athlete. The performances will follow."', auteur: '— Áine O\'Connor, British Athletics' },
      { text: '"When a coach asks how someone is doing and truly listens to the answer, that can change a life."', auteur: '— Michael Phelps' },
    ],
    reflectie: [
      'What signals of mental overload do you recognize in athletes? Make a concrete list of 5 signs.',
      'How do you ask players how they are really doing — in a way that makes them feel safe to answer honestly?',
      'What do you do when you suspect a player is not doing well mentally? Do you have a protocol?',
      'Where are the limits of your role as a coach? When do you refer on — and to whom?',
      'How do you protect your own mental health as a coach? What do you do for self-care?',
    ],
    boeken: [
      { titel: 'Why Has Nobody Told Me This Before?', auteur: 'Dr. Julie Smith', waarom: 'A psychiatrist explains mental health tools for everyone. Helps coaches understand what their players are going through.' },
      { titel: 'The Brave Athlete', auteur: 'Simon Marshall & Lesley Paterson', waarom: 'The neuroscience manual for athletes on anxiety, motivation, and self-criticism. Read as a coach to better understand your players.' },
      { titel: 'Lost Connections', auteur: 'Johann Hari', waarom: 'Depression and anxiety are social, not only biochemical. Rewrites how you look at players who withdraw.' },
    ],
    videos: [
      { titel: 'Michael Phelps on Mental Health in Sport', spreker: 'Michael Phelps (Realmindful)', url: 'youtube.com/results?search_query=michael+phelps+mental+health+athlete', notitie: 'The most successful Olympian ever on depression and the role of coaches. Powerful.' },
      { titel: 'The Secret of Becoming Mentally Strong', spreker: 'Amy Morin (TEDx)', url: 'youtube.com/watch?v=TFbv757kup4', notitie: 'Habits that undermine mental strength. Do you recognize these in your players — or yourself?' },
    ],
    podcasts: [
      { naam: 'The Mind Your Mental Health Podcast', afl: 'Mental health in youth sport', url: 'mindyourmentalhealth.ca' },
      { naam: 'Finding Mastery', afl: 'Episode on athlete mental health and coach responsibility', url: 'findingmastery.com' },
    ],
    actie: 'Create a "signal card" for yourself: 5 behavioral changes that indicate a player is struggling. Also agree on who your contact person is (trusted person, school counselor) if you need to refer someone.',
    commitment: 'My action plan if I notice a player is struggling mentally:',
  },
  {
    num: 10, kleur: '#1C2433',
    title: 'The Reflective Coach',
    vraag: 'How do you learn as a coach — and how do you know you\'re getting better?',
    theorie: 'Donald Schön (1983) distinguishes two forms of professional learning: reflection-in-action (adjusting during coaching) and reflection-on-action (analyzing afterward). Deliberate practice (Ericsson, 1993) shows that expertise comes not from experience alone, but from conscious, focused practice on weak points with immediate feedback. The best coaches are lifelong learners who systematically reflect, use peer-coaching, and employ video analysis.',
    bron: 'Schön (1983) · Ericsson (1993) · Cushion et al. (2010) · Côté & Gilbert (2009)',
    quotes: [
      { text: '"A coach who stops learning is a coach who has stopped coaching — they just don\'t know it yet."', auteur: '— John Wooden' },
      { text: '"It\'s not the experience that makes you better. It\'s the evaluated experience."', auteur: '— John Maxwell' },
    ],
    reflectie: [
      'How do you learn as a coach today? Name three concrete sources of growth you have used in the past year.',
      'When did you last analyze your own training or game — with video or notes?',
      'Who is your coach? Who guides you in your growth as a coach?',
      'What is the biggest gap between who you want to be as a coach and who you are now? What are you actively doing to close it?',
      'Looking back over five years of coaching: what have you fundamentally changed in your approach? What triggered that change?',
    ],
    boeken: [
      { titel: 'Peak', auteur: 'Anders Ericsson & Robert Pool', waarom: 'The science of deliberate practice. How the best in their field become who they are — and what this means for your own growth as a coach.' },
      { titel: 'Range', auteur: 'David Epstein', waarom: 'Broad experiences make better coaches. Counter to overspecialization. Rewrites the early vs. late specialization debate.' },
      { titel: 'The Reflective Practitioner', auteur: 'Donald Schön', waarom: 'The foundation of professional learning. How experts learn through doing and reflecting. Academic but indispensable.' },
      { titel: 'Bounce', auteur: 'Matthew Syed', waarom: 'Talent is a myth. Deliberate practice, mental strengths, and the role of coaches in shaping champions.' },
    ],
    videos: [
      { titel: 'The Making of an Expert', spreker: 'Anders Ericsson (Stanford)', url: 'youtube.com/results?search_query=anders+ericsson+deliberate+practice+talk', notitie: 'Deliberate practice vs. naive practice. Most coaches do the second. Do you want to do the first?' },
      { titel: 'Atul Gawande on Coaching', spreker: 'Atul Gawande (New Yorker Talk)', url: 'youtube.com/results?search_query=atul+gawande+coaching+newyorker', notitie: 'Why even the best surgeons need a coach. Do you have a coach?' },
    ],
    podcasts: [
      { naam: 'The James Clear Podcast', afl: 'Habits and systems for continuous growth as a professional', url: 'jamesclear.com/podcast' },
      { naam: 'The Tim Ferriss Show', afl: 'Episode with Anders Ericsson — how experts become experts', url: 'tim.blog/podcast' },
    ],
    actie: 'Start a coaching journal. After every training/game, write 3 things: (1) What went well and why? (2) What would I do differently? (3) What does this teach me about myself as a coach?',
    commitment: 'My plan to reflect more systematically on my coaching this season:',
  },
];

// ============================================================
// HTML BUILDER
// ============================================================
function buildModuleHtml(m, lang) {
  const isNL = lang === 'NL';
  const labelModule = isNL ? 'Module' : 'Module';
  const labelTheorie = isNL ? 'KERNTHEORIE' : 'CORE THEORY';
  const labelReflectie = isNL ? 'ZELFREFLECTIE' : 'SELF-REFLECTION';
  const labelNota = isNL ? 'NOTITIES' : 'NOTES';
  const labelBoeken = isNL ? 'BOEKEN' : 'BOOKS';
  const labelVideos = 'VIDEO\'S / TED TALKS';
  const labelPodcasts = 'PODCASTS';
  const labelActie = isNL ? 'ACTIE DEZE WEEK' : 'ACTION THIS WEEK';
  const labelBadge = isNL ? 'Coachestraject' : 'Coaches Track';
  const labelPag = isNL ? 'Pagina' : 'Page';
  const labelWaarom = isNL ? 'Waarom: ' : 'Why: ';
  const labelBron = isNL ? 'Bron: ' : 'Source: ';

  const noteLines1 = Array.from({length: 5}, () => '<div class="note-line"></div>').join('');
  const noteLines2 = Array.from({length: 3}, () => '<div class="commit-line"></div>').join('');

  const accentColor = m.kleur;

  return `
  <!-- MODULE ${m.num} PAGE 1 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        ${logo(44)}
        <div>
          <div class="wordmark">CHARACTER<span>First</span></div>
          <span class="badge">${labelBadge}</span>
        </div>
      </div>
      <div class="module-label">${labelModule} ${m.num}/10<br>Coaches Track</div>
    </div>
    <div class="divider" style="background:${accentColor}"></div>

    <div>
      <div class="eyebrow" style="color:${accentColor}">${labelModule} ${m.num}</div>
      <div class="title">${m.title}</div>
      <div class="core-question" style="border-color:${accentColor};color:${accentColor}">${m.vraag}</div>
    </div>

    <div class="theory-block" style="border-color:${accentColor}">
      <div class="section-label" style="color:${accentColor}">${labelTheorie}</div>
      <p>${m.theorie}</p>
      <p class="source">${labelBron}${m.bron}</p>
    </div>

    <div class="quotes-row">
      ${m.quotes.map(q => `
      <div class="quote-card">
        <div class="qt">${q.text}</div>
        <div class="qa">${q.auteur}</div>
      </div>`).join('')}
    </div>

    <div class="reflection-block">
      <div class="reflection-label" style="color:${accentColor};border-color:${accentColor}">${labelReflectie}</div>
      ${m.reflectie.map((q, i) => `
      <div class="reflection-q">
        <div class="qnum" style="background:${accentColor}">${i+1}</div>
        <div class="qtext">${q}</div>
      </div>
      <div class="answer-line"></div>`).join('')}
    </div>

    <div class="notes-mini" style="min-height:0;flex:1 1 auto">
      <div class="section-label" style="color:var(--stone)">${labelNota}</div>
      ${noteLines1}
    </div>

    <div class="footer">
      <span>characterfirst.be · info@characterfirst.be</span>
      <span>${labelPag} 1/2 · ${labelModule} ${m.num}: ${m.title}</span>
    </div>
  </div>

  <!-- MODULE ${m.num} PAGE 2 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        ${logo(44)}
        <div>
          <div class="wordmark">CHARACTER<span>First</span></div>
          <span class="badge">${labelBadge}</span>
        </div>
      </div>
      <div class="module-label">${labelModule} ${m.num}/10<br>${m.title}</div>
    </div>
    <div class="divider" style="background:${accentColor}"></div>

    <div class="resources-grid">
      <!-- BOEKEN -->
      <div class="resource-section">
        <div class="res-header"><span class="res-icon">📚</span>${labelBoeken}</div>
        ${m.boeken.map(b => `
        <div class="resource-item">
          <div class="res-dot" style="background:${accentColor}"></div>
          <div class="res-content">
            <div class="res-title">${b.titel}</div>
            <div class="res-author">${b.auteur}</div>
            <div class="res-why"><strong>${labelWaarom}</strong>${b.waarom}</div>
          </div>
        </div>`).join('')}
      </div>

      <!-- VIDEOS -->
      <div class="resource-section">
        <div class="res-header"><span class="res-icon">🎬</span>${labelVideos}</div>
        ${m.videos.map(v => `
        <div class="resource-item">
          <div class="res-dot" style="background:${accentColor}"></div>
          <div class="res-content">
            <div class="res-title">${v.titel}</div>
            <div class="res-author">${v.spreker}</div>
            <div class="res-url">🔗 ${v.url}</div>
            <div class="res-why">${v.notitie}</div>
          </div>
        </div>`).join('')}
      </div>

      <!-- PODCASTS -->
      <div class="resource-section">
        <div class="res-header"><span class="res-icon">🎙</span>${labelPodcasts}</div>
        ${m.podcasts.map(p => `
        <div class="resource-item">
          <div class="res-dot" style="background:${accentColor}"></div>
          <div class="res-content">
            <div class="res-title">${p.naam}</div>
            <div class="res-why">${p.afl}</div>
            <div class="res-url">🔗 ${p.url}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- ACTION -->
    <div class="action-block" style="border-color:${accentColor};background:${accentColor}18">
      <div class="action-label" style="color:${accentColor}">⚡ ${labelActie}</div>
      <div class="action-desc">${m.actie}</div>
      <div class="commit-box">
        <strong>${m.commitment}</strong>
        ${noteLines2}
      </div>
    </div>

    <div class="footer">
      <span>characterfirst.be · info@characterfirst.be</span>
      <span>${labelPag} 2/2 · ${labelModule} ${m.num}: ${m.title}</span>
    </div>
  </div>`;
}

async function generate(modules, outDir, lang) {
  const browser = await chromium.launch();
  const suffix = lang === 'NL' ? 'NL' : 'EN';
  for (const m of modules) {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <style>${CSS}</style></head><body>${buildModuleHtml(m, lang)}</body></html>`;
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const fname = `CF_Coach_M${String(m.num).padStart(2,'0')}_${suffix}.pdf`;
    await page.pdf({
      path: path.join(outDir, fname),
      width: '210mm', height: '297mm',
      printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    await page.close();
    console.log(`${lang} M${m.num} → ${Math.round(fs.statSync(path.join(outDir, fname)).size/1024)}KB`);
  }
  await browser.close();
}

(async () => {
  await generate(modulesNL, OUT_NL, 'NL');
  await generate(modulesEN, OUT_EN, 'EN');
  console.log('Done! 20 PDFs gegenereerd.');
})();
