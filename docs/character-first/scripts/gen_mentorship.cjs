'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first';
const OUT_SPELER_NL = path.join(BASE, 'werkbladen-pdf/mentorship-speler');
const OUT_SPELER_EN = path.join(BASE, 'werkbladen-pdf/mentorship-speler-en');
const OUT_MENTOR_NL = path.join(BASE, 'werkbladen-pdf/mentorship-mentor');
const OUT_MENTOR_EN = path.join(BASE, 'werkbladen-pdf/mentorship-mentor-en');
[OUT_SPELER_NL, OUT_SPELER_EN, OUT_MENTOR_NL, OUT_MENTOR_EN].forEach(d => fs.mkdirSync(d, { recursive: true }));

function logo(size = 44) {
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

// ============================================================
// CSS SPELER (warm, journal, oranje)
// ============================================================
const CSS_SPELER = `
  :root {
    --orange: #F05A28; --navy: #1C2433; --green: #1E8A5B;
    --canvas: #FAF7F2; --mist: #F0ECE4; --stone: #6E6A63; --line: #E4DFD6;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #ccc; font-family: Arial, sans-serif; }
  .page {
    width: 210mm; height: 297mm; overflow: hidden;
    padding: 11mm 13mm 9mm; background: var(--canvas);
    display: flex; flex-direction: column; gap: 7px;
    page-break-after: always; break-after: page;
  }
  .header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .wordmark { font-family: "Arial Black", Arial, sans-serif; font-size: 17px; font-weight: 900; color: var(--navy); }
  .wordmark span { color: var(--orange); }
  .badge {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em;
    background: rgba(240,90,40,.12); color: var(--orange);
    border: 1.5px solid var(--orange); border-radius: 20px; padding: 3px 9px;
  }
  .session-label { font-size: 10px; color: var(--stone); text-align: right; line-height: 1.4; }
  .divider { height: 2px; background: var(--orange); border-radius: 1px; flex-shrink: 0; }
  .eyebrow {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .15em; color: var(--orange); margin-bottom: 2px;
  }
  .title { font-family: "Arial Black", Arial, sans-serif; font-size: 22px; font-weight: 900; color: var(--navy); line-height: 1.1; }
  .intro-q { font-size: 12px; color: var(--stone); font-style: italic; margin-top: 3px; line-height: 1.4; }
  /* Quote opener */
  .quote-opener {
    background: var(--navy); border-radius: 8px; padding: 9px 13px;
    border-left: 4px solid var(--orange); flex-shrink: 0;
  }
  .qo-text { font-size: 11.5px; color: #fff; font-style: italic; line-height: 1.5; margin-bottom: 3px; }
  .qo-auth { font-size: 9.5px; color: var(--orange); font-family: "Arial Black", Arial, sans-serif; font-weight: 900; }
  /* Section label */
  .section-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .12em; color: var(--orange);
    border-left: 3px solid var(--orange); padding-left: 7px; margin-bottom: 4px;
  }
  /* Exercise block */
  .exercise-block {
    background: rgba(240,90,40,.06); border: 1.5px solid rgba(240,90,40,.25);
    border-radius: 8px; padding: 8px 12px; flex-shrink: 0;
  }
  .exercise-block p { font-size: 11px; color: var(--navy); line-height: 1.5; }
  .exercise-block .ex-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em; color: var(--orange); margin-bottom: 4px;
  }
  /* Write lines */
  .write-lines { display: flex; flex-direction: column; gap: 0; }
  .w-line { border-bottom: 1px solid var(--line); height: 21px; }
  /* Prep/debrief blocks */
  .prep-block {
    background: rgba(28,36,51,.05); border-left: 3px solid var(--navy);
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .prep-block .pb-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em; color: var(--navy); margin-bottom: 4px;
  }
  .prep-block ul { padding-left: 14px; }
  .prep-block ul li { font-size: 10.5px; color: var(--navy); line-height: 1.5; margin-bottom: 2px; }
  /* Reflection questions */
  .refl-q { display: flex; gap: 7px; align-items: flex-start; margin-bottom: 4px; }
  .refl-num {
    width: 18px; height: 18px; border-radius: 50%; background: var(--orange);
    color: #fff; font-size: 9.5px; font-weight: 900; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; font-family: "Arial Black", Arial, sans-serif;
  }
  .refl-text { font-size: 10.5px; color: var(--navy); line-height: 1.4; flex: 1; }
  /* Commit box */
  .commit-box {
    background: rgba(240,90,40,.07); border: 1.5px dashed var(--orange);
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .commit-box p { font-size: 10.5px; color: var(--navy); line-height: 1.4; margin-bottom: 4px; }
  .commit-box strong { color: var(--orange); }
  .c-line { border-bottom: 1px solid var(--line); height: 20px; margin-top: 3px; }
  /* Notes */
  .notes-flex { flex: 1 1 auto; min-height: 0; }
  /* Footer */
  .footer {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line); padding-top: 4px; flex-shrink: 0;
  }
  .footer span { font-size: 8.5px; color: var(--stone); }
  .footer .credit { color: var(--stone); }
`;

// ============================================================
// CSS MENTOR (professioneel, blauw)
// ============================================================
const CSS_MENTOR = `
  :root {
    --blue: #2F6FB0; --navy: #1C2433; --orange: #F05A28;
    --green: #1E8A5B; --canvas: #FAF7F2; --mist: #F0ECE4;
    --stone: #6E6A63; --line: #E4DFD6;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #ccc; font-family: Arial, sans-serif; }
  .page {
    width: 210mm; height: 297mm; overflow: hidden;
    padding: 11mm 13mm 9mm; background: var(--canvas);
    display: flex; flex-direction: column; gap: 6px;
    page-break-after: always; break-after: page;
  }
  .header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .wordmark { font-family: "Arial Black", Arial, sans-serif; font-size: 17px; font-weight: 900; color: var(--navy); }
  .wordmark span { color: var(--orange); }
  .badge {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em;
    background: rgba(47,111,176,.12); color: var(--blue);
    border: 1.5px solid var(--blue); border-radius: 20px; padding: 3px 9px;
  }
  .session-label { font-size: 10px; color: var(--stone); text-align: right; line-height: 1.4; }
  .divider { height: 2px; background: var(--blue); border-radius: 1px; flex-shrink: 0; }
  .eyebrow {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .15em; color: var(--blue); margin-bottom: 2px;
  }
  .title { font-family: "Arial Black", Arial, sans-serif; font-size: 22px; font-weight: 900; color: var(--navy); line-height: 1.1; }
  .mentor-focus { font-size: 11.5px; color: var(--blue); font-style: italic; margin-top: 3px; line-height: 1.4; border-left: 3px solid var(--blue); padding-left: 8px; }
  /* Session goal */
  .goal-block {
    background: rgba(47,111,176,.07); border-left: 3px solid var(--blue);
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .goal-block .gl { font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; color: var(--blue); margin-bottom: 3px; }
  .goal-block p { font-size: 11px; color: var(--navy); line-height: 1.5; }
  /* Section label */
  .section-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .12em; color: var(--blue);
    border-left: 3px solid var(--blue); padding-left: 7px; margin-bottom: 4px;
  }
  /* Conversation cards */
  .conv-cards { display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
  .conv-card { background: #fff; border: 1.5px solid var(--line); border-radius: 7px; padding: 7px 10px; }
  .conv-card .phase {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .08em; color: var(--blue); margin-bottom: 3px;
  }
  .conv-card .starter { font-size: 11px; color: var(--navy); font-style: italic; line-height: 1.4; margin-bottom: 3px; }
  .conv-card .tip { font-size: 10px; color: var(--stone); line-height: 1.4; }
  /* Observe block */
  .observe-block {
    background: rgba(30,138,91,.07); border-left: 3px solid var(--green);
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .observe-block .ol { font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; color: var(--green); margin-bottom: 3px; }
  .observe-block ul { padding-left: 14px; }
  .observe-block ul li { font-size: 10.5px; color: var(--navy); line-height: 1.5; margin-bottom: 2px; }
  /* Warning block */
  .warn-block {
    background: rgba(199,63,98,.07); border-left: 3px solid #C73F62;
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .warn-block .wl { font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; color: #C73F62; margin-bottom: 3px; }
  .warn-block p { font-size: 10.5px; color: var(--navy); line-height: 1.5; }
  /* Closing */
  .closing-block {
    background: rgba(28,36,51,.05); border-left: 3px solid var(--navy);
    border-radius: 6px; padding: 7px 11px; flex-shrink: 0;
  }
  .closing-block .cl { font-family: "Arial Black", Arial, sans-serif; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; color: var(--navy); margin-bottom: 3px; }
  .closing-block p { font-size: 10.5px; color: var(--navy); line-height: 1.5; }
  /* Notes */
  .notes-flex { flex: 1 1 auto; min-height: 0; }
  .w-line { border-bottom: 1px solid var(--line); height: 20px; }
  /* Footer */
  .footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 4px; flex-shrink: 0; }
  .footer span { font-size: 8.5px; color: var(--stone); }
  .footer .credit { color: var(--stone); }
`;

// ============================================================
// SESSION DATA NL
// ============================================================
const sessionsNL = [
  {
    num: 1,
    title: 'Wie ben ik?',
    subtitle: 'Jouw identiteit als sporter en mens',
    quote: { text: '"Ken jezelf. Zonder zelfkennis is alle andere kennis zinloos."', auteur: 'Socrates' },
    introQ: 'Wat maakt jou uniek — niet als sporter, maar als persoon?',
    oefening: {
      label: 'Kernwaarden-oefening',
      tekst: 'Kies uit deze lijst de 5 waarden die het best bij jou passen: Moed · Eerlijkheid · Loyaliteit · Doorzettingsvermogen · Creativiteit · Zorgzaamheid · Ambitie · Humor · Rust · Leiderschap · Empathie · Discipline · Vrijheid · Trouw · Nieuwsgierigheid\n\nSchrijf jouw top 5 hieronder en leg uit WAAROM je elke waarde koos.',
    },
    schrijfVragen: [
      'Mijn 5 kernwaarden zijn... (en waarom)',
      'Als ik mijzelf in drie woorden zou omschrijven aan iemand die mij niet kent...',
      'Wat onderscheidt mij als persoon van wie ik ben als sporter?',
    ],
    voorGesprek: [
      'Denk na over één moment dit jaar waarop je echt jezelf was — wat deed je toen?',
      'Breng dit werkblad ingevuld mee naar het gesprek.',
      'Schrijf op wat je aan het gesprek wil vragen aan jouw Character First mentor.',
    ],
    naGesprek: [
      'Wat heeft het gesprek je geleerd over jezelf?',
      'Welke waarde wil je de komende maand bewust leven?',
    ],
    actie: 'Schrijf voor de volgende sessie je persoonlijke "identiteitszin": "Ik ben iemand die..." — één zin die jou als persoon definieert.',
    // MENTOR DATA
    doel: 'De sporter helpen een bewust beeld te vormen van zijn/haar identiteit — los van sportprestaties. Vertrouwen opbouwen als basis voor het hele traject.',
    mentorFocus: 'Eerste sessie: luisteren is alles. Jouw taak is nog niet begeleiden maar verbinden.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Voordat we beginnen — hoe gaat het echt? Niet als sporter, maar als persoon?"', tip: 'Houd lange stiltes vol. Niet invullen. De sporter mag zoeken.' },
      { fase: 'Verkennen (15 min)', starter: '"Welke waarde heb jij gekozen en wat betekent die voor jou in het dagelijks leven?"', tip: 'Vraag naar concrete voorbeelden. "Kun je me een moment vertellen waarop je dat hebt geleefd?"' },
      { fase: 'Verdiepen (10 min)', starter: '"Is de persoon die je thuis bent dezelfde als de sporter op het veld? Wat verschilt er?"', tip: 'Niemand is overal dezelfde. Dat is een rijkdom, geen probleem.' },
      { fase: 'Afsluiten (5 min)', starter: '"Wat neem je mee van vandaag? Eén woord of zin."', tip: 'Formuleer samen de actie voor de volgende sessie. Laat de sporter die zelf verwoorden.' },
    ],
    observeer: [
      'Hoe gemakkelijk praat de sporter over zichzelf als persoon vs. als atleet?',
      'Welke waarden noemt hij/zij spontaan — nog voor de oefening?',
      'Is er spanning of schroom? Dat is normale informatie, geen probleem om op te lossen.',
      'Wat zegt de lichaamstaal wanneer hij/zij over bepaalde waarden spreekt?',
    ],
    opgelet: 'Eerste sessies leggen het fundament van vertrouwen. Stel geen moeilijke vragen te vroeg. Als een sporter terughoudend is, normaliseer dat: "Je hoeft niet alles te delen — neem de tijd."',
    afsluiting: 'Bevestig wat je hebt gehoord: "Wat ik van jou onthoud is..." — dit toont de sporter dat je echt geluisterd hebt. Geef de actieopdracht mee en bevestig de volgende sessie.',
  },
  {
    num: 2,
    title: 'Mijn verhaal',
    subtitle: 'De momenten die mij gevormd hebben',
    quote: { text: '"Je bent niet je verleden. Maar je verleden heeft je gemaakt. Ken het."', auteur: 'Carl Jung (parafrase)' },
    introQ: 'Welke momenten in jouw leven hebben gemaakt wie je vandaag bent?',
    oefening: {
      label: 'Mijn sportlijn',
      tekst: 'Teken hieronder een tijdlijn van jouw sportcarrière. Markeer:\n🔥 Momenten van vuur — wanneer voelde je je het meest levend als sporter?\n💥 Keerpunten — momenten die alles veranderden (positief of negatief)\n🌱 Groeimomenten — tegenslagen die je sterker maakten',
    },
    schrijfVragen: [
      'Het moment dat mij het meest gevormd heeft als sporter is... omdat...',
      'Een keerpunt waarbij ik bijna gestopt ben (of echt gestopt ben) was... Wat heeft me doorheen geholpen?',
      'Als ik terugkijk: welke volwassene heeft het grootste positieve verschil gemaakt? Waarom die persoon?',
    ],
    voorGesprek: [
      'Denk aan één verhaal dat jij altijd vertelt over jezelf als sporter. Waarom dat verhaal?',
      'Welk moment in jouw sport wil je NOOIT vergeten — en waarom?',
    ],
    naGesprek: [
      'Welk deel van mijn verhaal had ik nog nooit hardop verteld?',
      'Wat zegt mijn verhaal over wie ik ben en wat ik wil?',
    ],
    actie: 'Schrijf voor de volgende sessie een korte brief aan jouw 10-jarige zelf: "Wat zou je jou willen vertellen?"',
    // MENTOR
    doel: 'De sporter helpen zijn/haar persoonlijk verhaal te kennen en te waarderen. Narratieve identiteit is de basis van veerkracht.',
    mentorFocus: 'Jij bent de getuige van een verhaal dat de sporter misschien zelf nog nooit zo gehoord heeft. Houd de ruimte heilig.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Vertel me eens — hoe ben jij eigenlijk in deze sport beland? Wie had er invloed op?"', tip: 'Laat het verhaal organisch komen. Onderbreek niet.' },
      { fase: 'Verkennen (15 min)', starter: '"Welk moment op jouw tijdlijn raakt je het meest als je er nu naar kijkt?"', tip: 'Emotie is welkom. Normaliseer: "Het is oké als iets voelt." Niet oplossen, alleen aanwezig zijn.' },
      { fase: 'Verdiepen (10 min)', starter: '"Wie was de meest invloedrijke persoon in jouw sportloopbaan? Wat deed die persoon dat verschil maakte?"', tip: 'Dit geeft jou als mentor inzicht in wat de sporter nodig heeft van een begeleidingsrelatie.' },
      { fase: 'Afsluiten (5 min)', starter: '"Als jouw verhaal een titel zou hebben — welke zou dat zijn?"', tip: 'Een krachtige afsluiter die de sporter helpt zijn verhaal te bezitten.' },
    ],
    observeer: [
      'Welke episodes vermijdt de sporter — sprong hij/zij er snel overheen?',
      'Welke mensen noemt hij/zij — en met welke emotie?',
      'Is er een patroon in de keerpunten? (bijv. altijd externe factoren, of altijd eigen keuzes)',
      'Hoe praat de sporter over zijn/haar laagste punt? Schaamte? Trots op overleven? Nog pijn?',
    ],
    opgelet: 'Moeilijke verhalen kunnen opkomen: blessures, verlies, pesten, falen. Jij hoeft dat niet op te lossen. Gebruik: "Dank je dat je dat deelt. Dat klinkt zwaar geweest." Dan pas verder.',
    afsluiting: 'Reflecteer het patroon dat je hoorde: "Wat me opvalt in jouw verhaal is..." Koppel dit aan de volgende sessie over doelen: "Wat vertelt jouw verleden jou over wat je wil voor de toekomst?"',
  },
  {
    num: 3,
    title: 'Mijn doelen',
    subtitle: 'Dromen vertalen naar richting',
    quote: { text: '"Een doel zonder plan is gewoon een wens."', auteur: 'Antoine de Saint-Exupéry' },
    introQ: 'Wat wil jij echt — als sporter én als mens?',
    oefening: {
      label: 'Droom groot, denk concreet',
      tekst: 'Stap 1 — Schrijf ZONDER filters: wat wil jij bereiken in de sport? (Niets is te groot)\nStap 2 — Schrijf ZONDER filters: wat wil jij bereiken als mens buiten de sport?\nStap 3 — Kies uit beide lijsten jouw TOP 1 doel voor dit seizoen en TOP 1 doel voor over 3 jaar.',
    },
    schrijfVragen: [
      'Mijn grootste sportdroom (zonder rem) is...',
      'Over 3 jaar wil ik als persoon... (los van sport)',
      'Mijn doel voor dit seizoen is... Hoe ziet succes er concreet uit? Wat doe ik anders dan nu?',
    ],
    voorGesprek: [
      'Vraag jezelf: zijn dit MIJN doelen — of de doelen van mijn coach/ouders/omgeving?',
      'Wat zou je doen als niemand je beoordeelde?',
    ],
    naGesprek: [
      'Welk doel voelt het meest als van míj?',
      'Wat is de eerste kleine stap die ik volgende week kan zetten?',
    ],
    actie: 'Schrijf jouw seizoensdoel op een kaartje en plak het op een plek die je elke dag ziet. Vertel het ook aan één persoon die je vertrouwt.',
    // MENTOR
    doel: 'De sporter helpen onderscheid te maken tussen eigen doelen en opgelegde doelen. Intrinsieke motivatie is de enige duurzame motor.',
    mentorFocus: 'Wees alert: veel sporters hebben doelen van anderen overgenomen. Jouw taak is het echte verlangen te achterhalen.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Als je vandaag kon kiezen zonder enige beperking — wat zou jij willen bereiken?"', tip: 'Merk op hoe spontaan vs. hoe aarzelend het antwoord komt. Dat zegt veel.' },
      { fase: 'Verkennen (15 min)', starter: '"Is dit doel iets dat jíj wil — of iets wat anderen voor jou willen? Hoe weet je dat?"', tip: 'Geen oordeel. "Beide kan ook." Maar help de sporter het onderscheid voelen.' },
      { fase: 'Verdiepen (10 min)', starter: '"Stel dat je dit doel haalt — hoe voel jij je dan? Wat verandert er in jouw leven?"', tip: 'Dit raakt de diepere motivatie achter het doel (identiteit, waarde, verbondenheid).' },
      { fase: 'Afsluiten (5 min)', starter: '"Wat is de éérste concrete stap — niet de grote sprong, maar de eerste stap?"', tip: 'Kleine stappen maken grote doelen geloofwaardig.' },
    ],
    observeer: [
      'Worden de doelen spontaan of traag geformuleerd? (Snel = eigen. Traag = misschien van anderen.)',
      'Wat is de emotie achter het doel? Enthousiasme, verplichting, angst, trots?',
      'Noemt de sporter anderen bij zijn doelen? ("Mijn coach wil dat ik...", "Mijn ouders denken...")',
      'Is er een doel dat hij/zij met schroom of fluisterend noemt — dat is vaak het echte doel.',
    ],
    opgelet: 'Als een sporter geen eigen doelen heeft, forceer dan niet. Gebruik: "Wat heeft jou vroeger enthousiast gemaakt?" om terug te gaan naar innerlijke motivatie.',
    afsluiting: 'Benoem het eigenaarschap: "Dit zijn JOUW doelen. Niet die van je coach of je ouders. Wij gaan je helpen die te bereiken." Krachtig moment van agency geven.',
  },
  {
    num: 4,
    title: 'Mijn innerlijke stem',
    subtitle: 'Wat zeg jij tegen jezelf als het moeilijk wordt?',
    quote: { text: '"Je hebt meer gesprekken met jezelf dan met iedereen anders. Zorg dat ze goed zijn."', auteur: 'Zig Ziglar' },
    introQ: 'Hoe klinkt jouw innerlijke stem — als coach, of als criticus?',
    oefening: {
      label: 'Mijn stemmen in kaart',
      tekst: 'Denk aan een recent moment waarop je een grote fout maakte of teleurstellend presteerde.\n\nSchrijf EXACT op wat er door je hoofd ging:\n— De eerste gedachte (raak, eerlijk):\n— De zin die je het meest herhaalde:\n— Wat je tegen jezelf zei "als innerlijke coach":\n\nVraag jezelf dan: zou ik dit zeggen tegen mijn beste vriend? Wat zou ik hem/haar wél zeggen?',
    },
    schrijfVragen: [
      'Mijn innerlijke criticus zegt het vaakst...',
      'Als ik mijn beste vriend zou coachen in mijn situatie, zou ik zeggen...',
      'Één zin die ik mezelf wil leren zeggen als het moeilijk wordt:',
    ],
    voorGesprek: [
      'Observeer jezelf deze week: wanneer is jouw innerlijke stem het hardst? (wedstrijd, training, na een fout?)',
      'Schrijf één positieve zin op die je jezelf wil leren zeggen.',
    ],
    naGesprek: [
      'Wat heb ik geleerd over de manier waarop ik met mezelf praat?',
      'Welke zin neem ik mee als mijn nieuwe innerlijke coach-stem?',
    ],
    actie: 'Kies één "anchor-zin" — een zin die jij jezelf zegt als je het moeilijk hebt. Oefen die zin drie keer hardop voor elke training deze week.',
    // MENTOR
    doel: 'De sporter bewust maken van zijn/haar zelfpraat-patronen en ze helpen een constructievere innerlijke stem te ontwikkelen.',
    mentorFocus: 'Dit is een kwetsbare sessie. Veel sporters schamen zich voor negatieve zelfpraat. Normaliseer het actief.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Hoe praat jij met jezelf als je een fout maakt? Mag je me dat eerlijk vertellen?"', tip: 'Ga zelf eerst: "Ik weet dat ik vroeger ook heel hard voor mezelf was..." Dat opent de deur.' },
      { fase: 'Verkennen (15 min)', starter: '"Is die innerlijke stem er altijd geweest — of heeft iemand je dat op een moment geleerd?"', tip: 'Zelfpraat heeft een oorsprong. Dat ontdekken kan bevrijdend zijn.' },
      { fase: 'Verdiepen (10 min)', starter: '"Wat zou er veranderen in jouw prestaties als die stem vriendelijker werd?"', tip: 'Onderzoek toont: zelfcompassie verhoogt prestaties. Deel dit als het past.' },
      { fase: 'Afsluiten (5 min)', starter: '"Formuleer samen een anchor-zin. Laat de sporter die kiezen."', tip: 'De zin moet van hen zijn — niet jouw voorstel. Vraag: "Welke zin klinkt als de jouwe?"' },
    ],
    observeer: [
      'Hoe snel erkent de sporter negatieve zelfpraat — of ontkent hij/zij het?',
      'Is er een patroon? (Na fouten? Onder druk? Tegenover bepaalde spelers?)',
      'Wat is de emotie als hij/zij die innerlijke stem beschrijft — schaamte, humor, pijn?',
      'Let op: extreme zelfkritiek kan een signaal zijn van iets diepers. Noteer dat.',
    ],
    opgelet: 'Als zelfkritiek extreem is ("ik ben nutteloos", "ik verdien mijn plek niet") — normaliseer, maar vlag dit intern als een aandachtspunt. Verwijs door als nodig.',
    afsluiting: 'Herhaal hun anchor-zin terug: "De zin die jij kiest is..." Maak het concreet: "Wanneer ga je die deze week gebruiken?" Dat verhoogt de kans op transfer.',
  },
  {
    num: 5,
    title: 'Omgaan met tegenslagen',
    subtitle: 'Hoe falen jou vormt',
    quote: { text: '"Ik heb meer dan 9.000 ballen gemist in mijn carrière. En daardoor heb ik gewonnen."', auteur: 'Michael Jordan' },
    introQ: 'Wat doet een tegenslag echt met jou — en wat kun jij ermee doen?',
    oefening: {
      label: 'Mijn veerkrachtkaart',
      tekst: 'Denk aan de zwaarste tegenslag die je als sporter hebt meegemaakt.\n\n1. Wat was de tegenslag? (kort)\n2. Hoe reageerde jij op dat moment? (eerlijk)\n3. Wat heb je er uiteindelijk uit geleerd?\n4. Zou je het willen wissen — of heb je er iets aan gehad?\n\nSchrijf dan: "Mijn zwaarste tegenslag heeft mij geleerd dat ik..."',
    },
    schrijfVragen: [
      'De tegenslag die mij het meest heeft gevormd als sporter is...',
      'Mijn eerste reactie op een tegenslag is gewoonlijk... (eerlijk)',
      'Eén ding dat mij altijd helpt overeind te komen is...',
    ],
    voorGesprek: [
      'Denk aan iemand die je bewondert omdat hij/zij goed omgaat met tegenslagen. Wat doet die persoon?',
      'Is er een tegenslag waar je nog niet echt mee klaar bent?',
    ],
    naGesprek: [
      'Welke tegenslag zie ik nu anders na ons gesprek?',
      'Wat wil ik anders doen als ik de volgende keer een tegenslag heb?',
    ],
    actie: 'Schrijf een brief aan een toekomstige versie van jezelf die het moeilijk heeft. Wat wil je hem/haar meegeven?',
    // MENTOR
    doel: 'De sporter helpen tegenslagen te herkaderen als leermomenten en een persoonlijk veerkrachtpatroon te ontdekken.',
    mentorFocus: 'Niet iedere tegenslag is al verwerkt. Houd ruimte voor emotie. Helden-verhalen zijn mooi maar verwerking gaat voor.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Iedereen heeft een tegenslag gehad die echt pijn deed. Wat was de jouwe?"', tip: 'Wees geduldig. Dit kan stil worden. Dat is ok.' },
      { fase: 'Verkennen (15 min)', starter: '"Hoe heb jij op dat moment voor jezelf gezorgd? Wat hielp je?"', tip: 'Focus op de veerkracht, niet op het lijden. "Hoe ben JIJ door die periode geraakt?"' },
      { fase: 'Verdiepen (10 min)', starter: '"Als je terugkijkt — wat heeft die periode jou gegeven dat je anders niet zou hebben?"', tip: 'Post-traumatic growth. Niet opdringen als de sporter er nog niet is. Voel het timing.' },
      { fase: 'Afsluiten (5 min)', starter: '"Wat wil je meenemen uit jouw eigen veerkrachtverhaal voor de volgende keer dat het moeilijk wordt?"', tip: 'Laat de sporter zijn/haar eigen veerkrachtrecept formuleren.' },
    ],
    observeer: [
      'Hoe praat de sporter over de tegenslag — in de verleden tijd (verwerkt) of de tegenwoordige tijd (nog actief)?',
      'Is er schuld (intern) of verwijt (extern)? Welke is gezonder — en welke is eerlijker?',
      'Heeft de sporter een steunnetwerk gehad? Is dat er nu nog?',
      'Let op: als iemand er echt niet over kan praten of erg emotioneel wordt, houd dan ruimte — en maak intern een notitie.',
    ],
    opgelet: 'Tegenslagen kunnen traumatisch zijn. Jij bent geen therapeut. Als een sporter iets deelt dat buiten jouw competentie valt (mentale gezondheidscrisis, misbruik, ernstig verlies), verwijs door met zorg: "Dit verdient meer aandacht dan wat wij hier kunnen bieden. Ik ken iemand die jou echt kan helpen."',
    afsluiting: 'Erken de moed: "Dank je dat je dit hebt gedeeld. Dat vraagt lef." Sluit af met de veerkrachtzin van de sporter — laat hem/haar die hardop zeggen.',
  },
  {
    num: 6,
    title: 'Mijn rolmodellen',
    subtitle: 'Wie je bewondert, zegt wie je wil zijn',
    quote: { text: '"Show me your heroes and I\'ll show you your future."', auteur: 'Napoleon Hill' },
    introQ: 'Wie inspireert jou? En wat zegt dat over wie jíj wil worden?',
    oefening: {
      label: 'Mijn drie rolmodellen',
      tekst: 'Kies drie mensen die jou inspireren (sport, muziek, familie, geschiedenis — alles mag).\n\nVoor elk persoon:\n1. Naam:\n2. Welke eigenschap bewonder ik het meest?\n3. Heb ik dat ook in mij — of is het iets wat ik wil ontwikkelen?\n\nKijk dan naar alle drie: is er een gemeenschappelijk thema in wat jij bewondert?',
    },
    schrijfVragen: [
      'Het gemeenschappelijke in mijn drie rolmodellen is...',
      'De eigenschap van mijn rolmodel die ik het meest mis in mezelf is... Hoe kan ik die ontwikkelen?',
      'Ben jij zelf een rolmodel voor iemand? Voor wie — en wat zie je in die persoon?',
    ],
    voorGesprek: [
      'Vraag jezelf: ken ik deze rolmodellen echt, of bewonder ik hun beeld? Wat weet ik over hun moeilijke momenten?',
      'Wie in je eigen omgeving is een stil rolmodel — iemand die niet beroemd is maar jou inspireert?',
    ],
    naGesprek: [
      'Wat heb ik over mezelf geleerd door te kijken naar wie ik bewonder?',
      'Welke eigenschap wil ik de komende maand actief oefenen?',
    ],
    actie: 'Zoek één interview, boek of podcast van je rolmodel op en stel jezelf één vraag: "Wat zou hij/zij doen in mijn situatie?"',
    // MENTOR
    doel: 'Via rolmodellen helpen onthullen wat de sporter diep van zichzelf verlangt — rolmodellen zijn spiegel van innerlijk verlangen.',
    mentorFocus: 'Wie iemand bewondert, vertelt jou meer dan jijzelf kan vragen. Luister naar de eigenschappen, niet de namen.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Als je aan één persoon denkt die jou echt inspireert — wie is dat meteen?"', tip: 'De spontane naam is de echte. Vraag dan pas: "Wat precies aan die persoon?"' },
      { fase: 'Verkennen (15 min)', starter: '"Wat is het gemeenschappelijke in de mensen die jij bewondert? Welk thema zie jij?"', tip: 'Laat de sporter zelf het patroon ontdekken. Dat is krachtiger dan jij het benoemen.' },
      { fase: 'Verdiepen (10 min)', starter: '"Heb jij die eigenschap ook al in jezelf? Of is het iets wat je wil worden?"', tip: 'Dit opent een gesprek over aspiratie en identiteitsontwikkeling.' },
      { fase: 'Afsluiten (5 min)', starter: '"Ben jij zelf een rolmodel voor iemand in jouw omgeving? Hoe voelt dat?"', tip: 'Veel sporters denken hier nooit aan. Dit kan een krachtig moment van eigenwaarde zijn.' },
    ],
    observeer: [
      'Kiest de sporter rolmodellen uit sport — of ook buiten de sport? (Smal vs. breed zelfbeeld)',
      'Zijn de gekozen eigenschappen prestatiegericht (winnen, snel) of karaktergericht (doorzettingsvermogen, eerlijkheid)?',
      'Hoe reageert de sporter op de vraag of hij/zij zelf een rolmodel is? Schroom of trots?',
      'Welke eigenschappen die de sporter bewondert zie JIJ al in hem/haar — die hij/zij zelf niet ziet?',
    ],
    opgelet: 'Rolmodellen kunnen ook giftig zijn (perfecte sporters die hun problemen verbergen). Als de sporter een onrealistisch ongenaakbaar beeld heeft, help dat te nuanceren: "Wat weet je over zijn/haar moeilijke momenten?"',
    afsluiting: '"Wat als ik jou vertel dat ik al [eigenschap X] in jou zie?" — Benoem iets concreets dat jij hebt geobserveerd. Dit is een cadeau dat je geeft als mentor.',
  },
  {
    num: 7,
    title: 'Mijn rol in het team',
    subtitle: 'Hoe ben ik een kracht voor anderen?',
    quote: { text: '"De sterkste speler maakt het team sterker, niet zichzelf."', auteur: 'Character First' },
    introQ: 'Wat draag jij bij aan jouw team — los van wat je scoort of presteert?',
    oefening: {
      label: 'Mijn teamrol',
      tekst: 'Denk aan jouw team. Beantwoord eerlijk:\n\n1. Welke rol speel jij in de groep? (energiegever, stille kracht, verbinder, strateeg, ...)\n2. Wat brengt jij mee dat een ander niet kan?\n3. Wanneer heb jij iemand in het team geholpen — niet met een actie in de wedstrijd, maar als persoon?\n\nSchrijf dan: "Mijn unieke bijdrage aan dit team is..."',
    },
    schrijfVragen: [
      'Als mijn team mij zou omschrijven als teamlid (niet als speler), zouden ze zeggen...',
      'Ik zorg voor anderen in het team door...',
      'Eén teamlid met wie ik de relatie wil versterken dit seizoen is... Waarom die persoon?',
    ],
    voorGesprek: [
      'Observeer jezelf de komende week: wanneer help jij iemand in het team — niet omdat het moet, maar omdat je het wil?',
      'Is er een teamlid die het momenteel moeilijk heeft? Wat kun jij doen?',
    ],
    naGesprek: [
      'Wat heb ik geleerd over mijn rol in het team?',
      'Eén concrete actie die ik neem om een positieve kracht te zijn:',
    ],
    actie: 'Doe deze week één bewuste daad voor een teamlid — niet gerelateerd aan sport. Schrijf daarna op hoe het voelde.',
    // MENTOR
    doel: 'De sporter helpen zijn/haar teamrol bewust te kennen en te waarderen — en leiderschap te zien als karakter, niet als status.',
    mentorFocus: 'Veel sporters denken dat leiderschap voor de sterren is. Jouw taak: elke sporter laten zien dat hij/zij al leidt — op zijn eigen manier.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Als jij morgen niet op training komt — wat zou het team missen? Niet technisch, maar als persoon?"', tip: 'Onverwachte vraag die direct naar bijdrage gaat.' },
      { fase: 'Verkennen (15 min)', starter: '"Wat is jouw rol in de klas, thuis, bij vrienden — is dat dezelfde rol als in het team?"', tip: 'Rollen zijn contextgebonden. Helpt de sporter zijn zelfbewustzijn verbreden.' },
      { fase: 'Verdiepen (10 min)', starter: '"Wanneer heb jij iemand in het team echt geholpen — niet met een actie, maar als mens?"', tip: 'Concrete herinnering activeert eigenwaarde als teamlid.' },
      { fase: 'Afsluiten (5 min)', starter: '"Wat wil jij dat je teamgenoten over 5 jaar nog onthouden van jou?"', tip: 'Dit is een krachtige legacy-vraag die de sporter groot laat denken.' },
    ],
    observeer: [
      'Praat de sporter makkelijk over zichzelf als teamlid — of focust hij/zij steeds op individuele prestaties?',
      'Noemt hij/zij namen van teamgenoten met zorg en aandacht — of abstract ("het team")?',
      'Is er iemand in het team die de sporter bewust vermijdt? Dat is waardevolle informatie.',
      'Hoe reageert hij/zij op de vraag wat het team zou missen zonder hem/haar? Schroom, trots, verlegenheid?',
    ],
    opgelet: 'Sporters die sterk focussen op individuele prestaties kunnen moeite hebben met deze sessie. Normaliseer: "Individuele groei en teamgroei versterken elkaar." Niet forceren naar altruïsme.',
    afsluiting: 'Benoem wat jij ziet in hem/haar als teamlid. Concreet: "In de manier waarop jij over je teamgenoten praat, zie ik iemand die echt om anderen geeft. Dat is leiderschap."',
  },
  {
    num: 8,
    title: 'Mijn toekomst',
    subtitle: 'Wie wil ik zijn — voorbij de sport',
    quote: { text: '"Het beste is altijd nog voor jou. Maar jij bepaalt waarheen."', auteur: 'Character First' },
    introQ: 'Als jij straks terugkijkt op jouw leven — wat wil je dan gezien hebben?',
    oefening: {
      label: 'Brief aan mijn toekomstige zelf',
      tekst: 'Schrijf een brief aan jezelf over 5 jaar. Begin zo:\n\n"Beste [jouw naam],\n\nAls ik nu terugkijk op de afgelopen vijf jaar, ben ik het meest trots op...\n\nIk ben de persoon geworden die...\n\nDe sport heeft mij gegeven...\n\nMaar het belangrijkste dat ik heb geleerd over het leven is...\n\nDank je dat je in mij geloofde.\n\nMet liefde,\n[jouw naam] (nu)"',
    },
    schrijfVragen: [
      'Wie wil ik zijn over 5 jaar — als sporter, als mens, in relaties?',
      'Welke waarden uit sessie 1 zijn er nog steeds in mijn leven aanwezig?',
      'Wat wil ik nooit vergeten van dit mentorshiptraject?',
    ],
    voorGesprek: [
      'Lees je brief van sessie 2 ("brief aan je 10-jarige zelf") nog eens. Wat is er veranderd?',
      'Welke vraag wil je aan je mentor stellen die je nog niet gesteld hebt?',
    ],
    naGesprek: [
      'Wat neem ik mee uit het hele traject?',
      'Welke stap zet ik als eerste nu het traject klaar is?',
    ],
    actie: 'Zegel je brief aan je toekomstige zelf in een envelop. Schrijf er "Te openen op [datum + 5 jaar]" op. Bewaar hem op een speciale plek.',
    // MENTOR
    doel: 'Het traject afronden door de sporter te helpen zijn/haar groei te zien en een richting voor de toekomst te voelen. Afscheid nemen op een betekenisvolle manier.',
    mentorFocus: 'Dit is de afsluitsessie. Jouw rol: de sporter het traject laten samenvatten — niet jij. Jij bevestigt en viert.',
    gesprekStarters: [
      { fase: 'Openen (5 min)', starter: '"Dit is onze laatste sessie. Hoe voelt dat voor jou?"', tip: 'Laat de emotie er zijn. Afsluiten is ook loslaten — voor jou en voor de sporter.' },
      { fase: 'Terugblik (15 min)', starter: '"Als je terugdenkt aan onze acht sessies — welk moment heeft jou het meest geraakt? Wat heeft het meeste veranderd?"', tip: 'Laat de sporter het traject samenvatten. Luister actief, bevestig.' },
      { fase: 'Vooruitkijken (10 min)', starter: '"Wie ben jij nu die je 8 sessies geleden niet was? Wat is er veranderd?"', tip: 'Help de sporter het eigen groeiproces te benoemen — dat verankert het.' },
      { fase: 'Afsluiten (5 min)', starter: '"Wat wil jij dat ik als jouw mentor onthoud van jou?"', tip: 'Dit geeft de sporter het gevoel dat hij/zij iets waardevols heeft nagelaten — ook voor jou.' },
    ],
    observeer: [
      'Hoe beschrijft de sporter zijn/haar groei — in termen van prestaties of in termen van karakter?',
      'Is er iets wat hij/zij wil maar nog niet heeft gezegd? (Vraag ernaar.)',
      'Hoe is de sporter in de acht sessies veranderd in hoe hij/zij over zichzelf praat?',
      'Is er iets dat jij als mentor wil meegeven dat je nog niet hebt gezegd?',
    ],
    opgelet: 'Sommige sporters willen het traject niet afsluiten. Normaliseer dat: "Groei stopt hier niet. Dit traject is een begin, geen einde." Geef een concrete doorverwijzing of volgende stap mee.',
    afsluiting: 'Geef elke sporter een persoonlijk moment: "Wat ik in jou zie na acht sessies is..." — eerlijk, specifiek, vanuit jouw hart. Dit is het meest krachtige cadeau dat je als mentor kan geven.',
  },
];

// ============================================================
// EN DATA (translated)
// ============================================================
const sessionsEN = [
  {
    num: 1,
    title: 'Who Am I?',
    subtitle: 'Your identity as an athlete and person',
    quote: { text: '"Know yourself. Without self-knowledge, all other knowledge is useless."', auteur: 'Socrates' },
    introQ: 'What makes you unique — not as an athlete, but as a person?',
    oefening: {
      label: 'Core Values Exercise',
      tekst: 'Choose from this list the 5 values that best describe you: Courage · Honesty · Loyalty · Perseverance · Creativity · Caring · Ambition · Humor · Calm · Leadership · Empathy · Discipline · Freedom · Faithfulness · Curiosity\n\nWrite your top 5 below and explain WHY you chose each one.',
    },
    schrijfVragen: [
      'My 5 core values are... (and why)',
      'If I described myself in three words to someone who doesn\'t know me...',
      'What distinguishes me as a person from who I am as an athlete?',
    ],
    voorGesprek: [
      'Think about one moment this year when you were truly yourself — what were you doing?',
      'Bring this completed worksheet to the conversation.',
      'Write down what you want to ask your Character First mentor.',
    ],
    naGesprek: [
      'What did the conversation teach me about myself?',
      'Which value do I want to consciously live over the coming month?',
    ],
    actie: 'Before the next session, write your personal "identity sentence": "I am someone who..." — one sentence that defines you as a person.',
    doel: 'Help the athlete form a conscious picture of their identity — separate from athletic performance. Build trust as the foundation for the entire journey.',
    mentorFocus: 'First session: listening is everything. Your job is not yet to guide but to connect.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"Before we start — how are you really doing? Not as an athlete, but as a person?"', tip: 'Hold long silences. Don\'t fill them in. The athlete gets to search.' },
      { fase: 'Exploring (15 min)', starter: '"Which value did you choose and what does it mean for you in daily life?"', tip: 'Ask for concrete examples. "Can you tell me a moment when you lived that?"' },
      { fase: 'Deepening (10 min)', starter: '"Is the person you are at home the same as the athlete on the field? What\'s different?"', tip: 'No one is the same everywhere. That\'s richness, not a problem.' },
      { fase: 'Closing (5 min)', starter: '"What do you take with you from today? One word or sentence."', tip: 'Formulate the action for next session together. Let the athlete phrase it themselves.' },
    ],
    observeer: [
      'How easily does the athlete talk about themselves as a person vs. as an athlete?',
      'Which values do they name spontaneously — even before the exercise?',
      'Is there tension or hesitation? That\'s normal information, not a problem to solve.',
      'What does body language say when they talk about certain values?',
    ],
    opgelet: 'First sessions lay the foundation of trust. Don\'t ask difficult questions too soon. If an athlete is reserved, normalize it: "You don\'t have to share everything — take your time."',
    afsluiting: 'Affirm what you heard: "What I remember about you is..." — this shows the athlete you truly listened. Give the action assignment and confirm the next session.',
  },
  {
    num: 2,
    title: 'My Story',
    subtitle: 'The moments that shaped me',
    quote: { text: '"You are not your past. But your past has made you. Know it."', auteur: 'Carl Jung (paraphrase)' },
    introQ: 'Which moments in your life have made you who you are today?',
    oefening: {
      label: 'My Sport Timeline',
      tekst: 'Draw a timeline of your athletic career below. Mark:\n🔥 Fire moments — when did you feel most alive as an athlete?\n💥 Turning points — moments that changed everything (positive or negative)\n🌱 Growth moments — setbacks that made you stronger',
    },
    schrijfVragen: [
      'The moment that shaped me most as an athlete is... because...',
      'A turning point when I almost quit (or did quit) was... What got me through it?',
      'Looking back: which adult made the biggest positive difference? Why that person?',
    ],
    voorGesprek: [
      'Think about one story you always tell about yourself as an athlete. Why that story?',
      'What moment in your sport do you NEVER want to forget — and why?',
    ],
    naGesprek: [
      'Which part of my story had I never told out loud before?',
      'What does my story say about who I am and what I want?',
    ],
    actie: 'Before the next session, write a short letter to your 10-year-old self: "What would you want to tell them?"',
    doel: 'Help the athlete know and appreciate their personal story. Narrative identity is the foundation of resilience.',
    mentorFocus: 'You are the witness of a story the athlete may have never heard themselves tell. Keep the space sacred.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"Tell me — how did you actually get into this sport? Who had an influence?"', tip: 'Let the story come organically. Don\'t interrupt.' },
      { fase: 'Exploring (15 min)', starter: '"Which moment on your timeline moves you most when you look at it now?"', tip: 'Emotion is welcome. Normalize it: "It\'s okay if something feels." Don\'t solve, just be present.' },
      { fase: 'Deepening (10 min)', starter: '"Who was the most influential person in your athletic career? What did they do that made a difference?"', tip: 'This gives you as mentor insight into what the athlete needs from a mentoring relationship.' },
      { fase: 'Closing (5 min)', starter: '"If your story had a title — what would it be?"', tip: 'A powerful closer that helps the athlete own their story.' },
    ],
    observeer: [
      'Which episodes does the athlete avoid — did they skip over something quickly?',
      'Which people do they mention — and with what emotion?',
      'Is there a pattern in the turning points? (E.g., always external factors, or always personal choices)',
      'How does the athlete talk about their lowest point? Shame? Pride in surviving? Still painful?',
    ],
    opgelet: 'Difficult stories may come up: injuries, loss, bullying, failure. You don\'t need to solve that. Use: "Thank you for sharing that. That sounds like it was hard." Then continue.',
    afsluiting: 'Reflect the pattern you heard: "What strikes me in your story is..." Link this to the next session on goals: "What does your past tell you about what you want for the future?"',
  },
  {
    num: 3,
    title: 'My Goals',
    subtitle: 'Translating dreams into direction',
    quote: { text: '"A goal without a plan is just a wish."', auteur: 'Antoine de Saint-Exupéry' },
    introQ: 'What do you really want — as an athlete and as a person?',
    oefening: {
      label: 'Dream Big, Think Concrete',
      tekst: 'Step 1 — Write WITHOUT filters: what do you want to achieve in sport? (Nothing is too big)\nStep 2 — Write WITHOUT filters: what do you want to achieve as a person outside sport?\nStep 3 — From both lists choose your TOP 1 goal for this season and TOP 1 goal for 3 years from now.',
    },
    schrijfVragen: [
      'My biggest sports dream (without limits) is...',
      'In 3 years I want to be (as a person, outside sport)...',
      'My goal for this season is... What does success concretely look like? What do I do differently than now?',
    ],
    voorGesprek: [
      'Ask yourself: are these MY goals — or the goals of my coach/parents/environment?',
      'What would you do if no one was judging you?',
    ],
    naGesprek: [
      'Which goal feels most like mine?',
      'What is the first small step I can take next week?',
    ],
    actie: 'Write your season goal on a card and put it somewhere you see every day. Also tell one person you trust.',
    doel: 'Help the athlete distinguish between their own goals and imposed goals. Intrinsic motivation is the only sustainable engine.',
    mentorFocus: 'Be alert: many athletes have adopted goals from others. Your job is to uncover the real desire.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"If you could choose today without any limitation — what would you want to achieve?"', tip: 'Notice how spontaneous vs. how hesitant the answer comes. That says a lot.' },
      { fase: 'Exploring (15 min)', starter: '"Is this goal something YOU want — or something others want for you? How do you know?"', tip: 'No judgment. "Both is possible too." But help the athlete feel the distinction.' },
      { fase: 'Deepening (10 min)', starter: '"Imagine you achieve this goal — how do you feel? What changes in your life?"', tip: 'This touches the deeper motivation behind the goal (identity, value, belonging).' },
      { fase: 'Closing (5 min)', starter: '"What is the very first concrete step — not the big leap, but the first step?"', tip: 'Small steps make big goals believable.' },
    ],
    observeer: [
      'Are goals formulated spontaneously or slowly? (Fast = own. Slow = possibly from others.)',
      'What is the emotion behind the goal? Enthusiasm, obligation, fear, pride?',
      'Does the athlete mention others with their goals? ("My coach wants me to...", "My parents think...")',
      'Is there a goal they mention with hesitation or quietly — that\'s often the real goal.',
    ],
    opgelet: 'If an athlete has no own goals, don\'t force it. Use: "What made you enthusiastic earlier in life?" to return to inner motivation.',
    afsluiting: 'Name the ownership: "These are YOUR goals. Not your coach\'s or your parents\'. We are going to help you achieve them." Powerful moment of giving agency.',
  },
  {
    num: 4,
    title: 'My Inner Voice',
    subtitle: 'What do you say to yourself when things get hard?',
    quote: { text: '"You have more conversations with yourself than with anyone else. Make sure they\'re good."', auteur: 'Zig Ziglar' },
    introQ: 'Does your inner voice sound like a coach — or a critic?',
    oefening: {
      label: 'Mapping My Voices',
      tekst: 'Think about a recent moment when you made a big mistake or performed disappointingly.\n\nWrite down EXACTLY what went through your head:\n— The first thought (honest, raw):\n— The sentence you repeated most:\n— What you said to yourself "as inner coach":\n\nThen ask yourself: would I say this to my best friend? What WOULD I say to them?',
    },
    schrijfVragen: [
      'My inner critic most often says...',
      'If I were coaching my best friend in my situation, I would say...',
      'One sentence I want to learn to say to myself when things get hard:',
    ],
    voorGesprek: [
      'Observe yourself this week: when is your inner voice loudest? (game, training, after a mistake?)',
      'Write down one positive sentence you want to learn to say to yourself.',
    ],
    naGesprek: [
      'What did I learn about the way I talk to myself?',
      'Which sentence do I take with me as my new inner coach voice?',
    ],
    actie: 'Choose one "anchor sentence" — a sentence you say to yourself when things are hard. Practice that sentence three times out loud before every training this week.',
    doel: 'Help the athlete become aware of their self-talk patterns and develop a more constructive inner voice.',
    mentorFocus: 'This is a vulnerable session. Many athletes are ashamed of negative self-talk. Actively normalize it.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"How do you talk to yourself when you make a mistake? Can you tell me honestly?"', tip: 'Go first yourself: "I know I used to be very hard on myself too..." That opens the door.' },
      { fase: 'Exploring (15 min)', starter: '"Has that inner voice always been there — or did someone teach it to you at some point?"', tip: 'Self-talk has an origin. Discovering it can be liberating.' },
      { fase: 'Deepening (10 min)', starter: '"What would change in your performance if that voice became kinder?"', tip: 'Research shows: self-compassion increases performance. Share this if it fits.' },
      { fase: 'Closing (5 min)', starter: '"Let\'s formulate an anchor sentence together. Let the athlete choose it."', tip: 'The sentence must be theirs — not your suggestion. Ask: "Which sentence sounds like yours?"' },
    ],
    observeer: [
      'How quickly does the athlete acknowledge negative self-talk — or do they deny it?',
      'Is there a pattern? (After mistakes? Under pressure? With certain players?)',
      'What is the emotion when they describe that inner voice — shame, humor, pain?',
      'Note: extreme self-criticism can be a signal of something deeper. Flag it.',
    ],
    opgelet: 'If self-criticism is extreme ("I\'m useless", "I don\'t deserve my spot") — normalize, but flag this internally as a point of attention. Refer if needed.',
    afsluiting: 'Repeat their anchor sentence back: "The sentence you choose is..." Make it concrete: "When are you going to use that this week?" That increases the chance of transfer.',
  },
  {
    num: 5,
    title: 'Dealing with Setbacks',
    subtitle: 'How failure shapes you',
    quote: { text: '"I\'ve missed more than 9,000 shots in my career. That\'s why I won."', auteur: 'Michael Jordan' },
    introQ: 'What does a setback really do to you — and what can you do with it?',
    oefening: {
      label: 'My Resilience Card',
      tekst: 'Think about the hardest setback you\'ve experienced as an athlete.\n\n1. What was the setback? (brief)\n2. How did you react at the time? (honestly)\n3. What did you ultimately learn from it?\n4. Would you erase it — or has it given you something?\n\nThen write: "My hardest setback taught me that I..."',
    },
    schrijfVragen: [
      'The setback that shaped me most as an athlete is...',
      'My first reaction to a setback is usually... (honestly)',
      'One thing that always helps me get back up is...',
    ],
    voorGesprek: [
      'Think about someone you admire for how they handle setbacks. What do they do?',
      'Is there a setback you haven\'t really made peace with yet?',
    ],
    naGesprek: [
      'Which setback do I see differently after our conversation?',
      'What do I want to do differently the next time I face a setback?',
    ],
    actie: 'Write a letter to a future version of yourself who is having a hard time. What do you want to tell them?',
    doel: 'Help the athlete reframe setbacks as learning opportunities and discover their personal resilience pattern.',
    mentorFocus: 'Not every setback has been processed. Hold space for emotion. Hero stories are nice but processing comes first.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"Everyone has had a setback that really hurt. What was yours?"', tip: 'Be patient. This can become quiet. That\'s okay.' },
      { fase: 'Exploring (15 min)', starter: '"How did you take care of yourself in that period? What helped you?"', tip: 'Focus on resilience, not on suffering. "How did YOU get through that period?"' },
      { fase: 'Deepening (10 min)', starter: '"Looking back — what did that period give you that you wouldn\'t otherwise have?"', tip: 'Post-traumatic growth. Don\'t push if the athlete isn\'t there yet. Feel the timing.' },
      { fase: 'Closing (5 min)', starter: '"What do you want to take from your own resilience story for the next time things get hard?"', tip: 'Let the athlete formulate their own resilience recipe.' },
    ],
    observeer: [
      'Does the athlete talk about the setback in past tense (processed) or present tense (still active)?',
      'Is there guilt (internal) or blame (external)? Which is healthier — and which is more honest?',
      'Did the athlete have a support network? Is it still there now?',
      'Note: if someone truly cannot talk about it or becomes very emotional, hold space — and make an internal note.',
    ],
    opgelet: 'Setbacks can be traumatic. You are not a therapist. If an athlete shares something beyond your competence (mental health crisis, abuse, serious loss), refer with care: "This deserves more attention than we can offer here. I know someone who can really help you."',
    afsluiting: 'Acknowledge the courage: "Thank you for sharing this. That takes courage." Close with the athlete\'s resilience sentence — let them say it out loud.',
  },
  {
    num: 6,
    title: 'My Role Models',
    subtitle: 'Who you admire reveals who you want to become',
    quote: { text: '"Show me your heroes and I\'ll show you your future."', auteur: 'Napoleon Hill' },
    introQ: 'Who inspires you? And what does that say about who YOU want to become?',
    oefening: {
      label: 'My Three Role Models',
      tekst: 'Choose three people who inspire you (sport, music, family, history — anything goes).\n\nFor each person:\n1. Name:\n2. Which quality do I admire most?\n3. Do I already have that in me — or is it something I want to develop?\n\nThen look at all three: is there a common theme in what you admire?',
    },
    schrijfVragen: [
      'The common thread in my three role models is...',
      'The quality of my role model that I feel I most lack is... How can I develop it?',
      'Are you a role model for someone? For whom — and what do you see in that person?',
    ],
    voorGesprek: [
      'Ask yourself: do I really know these role models, or do I admire their image? What do I know about their hard moments?',
      'Who in your immediate circle is a quiet role model — someone not famous but who inspires you?',
    ],
    naGesprek: [
      'What did I learn about myself by looking at who I admire?',
      'Which quality do I want to actively practice over the coming month?',
    ],
    actie: 'Find one interview, book, or podcast from your role model and ask yourself one question: "What would they do in my situation?"',
    doel: 'Use role models to reveal what the athlete deeply desires for themselves — role models are mirrors of inner longing.',
    mentorFocus: 'Who someone admires tells you more than you could directly ask. Listen to the qualities, not the names.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"If you think of one person who truly inspires you — who comes to mind immediately?"', tip: 'The spontaneous name is the real one. Then ask: "What exactly about them?"' },
      { fase: 'Exploring (15 min)', starter: '"What do the people you admire have in common? What theme do you see?"', tip: 'Let the athlete discover the pattern themselves. That\'s more powerful than you naming it.' },
      { fase: 'Deepening (10 min)', starter: '"Do you already have that quality in yourself? Or is it something you want to become?"', tip: 'This opens a conversation about aspiration and identity development.' },
      { fase: 'Closing (5 min)', starter: '"Are you a role model for someone in your circle? How does that feel?"', tip: 'Many athletes never think about this. It can be a powerful moment of self-worth.' },
    ],
    observeer: [
      'Does the athlete choose role models from sport only — or also outside? (Narrow vs. broad self-image)',
      'Are the admired qualities performance-focused (winning, fast) or character-focused (perseverance, honesty)?',
      'How does the athlete react to the question of whether they are a role model themselves? Shyness or pride?',
      'Which qualities the athlete admires do YOU already see in them — that they don\'t see themselves?',
    ],
    opgelet: 'Role models can also be toxic (perfect athletes who hide their struggles). If the athlete has an unrealistically unattainable image, help nuance it: "What do you know about their difficult moments?"',
    afsluiting: '"What if I tell you that I already see [quality X] in you?" — Name something concrete you have observed. This is a gift you give as a mentor.',
  },
  {
    num: 7,
    title: 'My Role in the Team',
    subtitle: 'How am I a force for others?',
    quote: { text: '"The strongest player makes the team stronger, not themselves."', auteur: 'Character First' },
    introQ: 'What do you contribute to your team — beyond what you score or perform?',
    oefening: {
      label: 'My Team Role',
      tekst: 'Think about your team. Answer honestly:\n\n1. What role do you play in the group? (energy-giver, quiet force, connector, strategist, ...)\n2. What do you bring that no one else can?\n3. When have you helped someone on the team — not with a game action, but as a person?\n\nThen write: "My unique contribution to this team is..."',
    },
    schrijfVragen: [
      'If my team described me as a teammate (not as a player), they would say...',
      'I take care of others on the team by...',
      'One teammate whose relationship I want to strengthen this season is... Why that person?',
    ],
    voorGesprek: [
      'Observe yourself this week: when do you help someone on the team — not because you have to, but because you want to?',
      'Is there a teammate who is struggling right now? What can you do?',
    ],
    naGesprek: [
      'What did I learn about my role in the team?',
      'One concrete action I will take to be a positive force:',
    ],
    actie: 'Do one deliberate act for a teammate this week — not related to sport. Write down afterward how it felt.',
    doel: 'Help the athlete consciously know and value their team role — and see leadership as character, not status.',
    mentorFocus: 'Many athletes think leadership is for the stars. Your job: show every athlete they are already leading — in their own way.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"If you didn\'t show up to training tomorrow — what would the team miss? Not technically, but as a person?"', tip: 'Unexpected question that goes straight to contribution.' },
      { fase: 'Exploring (15 min)', starter: '"What is your role at school, at home, with friends — is that the same role as in the team?"', tip: 'Roles are context-dependent. Helps the athlete broaden self-awareness.' },
      { fase: 'Deepening (10 min)', starter: '"When have you really helped someone on the team — not with an action, but as a human being?"', tip: 'Concrete memory activates self-worth as a teammate.' },
      { fase: 'Closing (5 min)', starter: '"What do you want your teammates to remember about you in 5 years?"', tip: 'This is a powerful legacy question that invites big thinking.' },
    ],
    observeer: [
      'Does the athlete talk easily about themselves as a teammate — or do they always focus on individual performance?',
      'Do they mention teammates\' names with care and attention — or abstractly ("the team")?',
      'Is there someone on the team the athlete consciously avoids? That\'s valuable information.',
      'How do they react to the question of what the team would miss without them? Shyness, pride, embarrassment?',
    ],
    opgelet: 'Athletes who strongly focus on individual performance may struggle with this session. Normalize: "Individual growth and team growth reinforce each other." Don\'t force altruism.',
    afsluiting: 'Name what you see in them as a teammate. Concretely: "In the way you talk about your teammates, I see someone who genuinely cares about others. That is leadership."',
  },
  {
    num: 8,
    title: 'My Future',
    subtitle: 'Who do I want to be — beyond sport',
    quote: { text: '"The best is always still ahead of you. But you decide where."', auteur: 'Character First' },
    introQ: 'When you look back on your life someday — what do you want to have seen?',
    oefening: {
      label: 'Letter to My Future Self',
      tekst: 'Write a letter to yourself five years from now. Start like this:\n\n"Dear [your name],\n\nLooking back at the past five years, I am most proud of...\n\nI have become the person who...\n\nSport has given me...\n\nBut the most important thing I learned about life is...\n\nThank you for believing in me.\n\nWith love,\n[your name] (now)"',
    },
    schrijfVragen: [
      'Who do I want to be in 5 years — as an athlete, as a person, in relationships?',
      'Which values from session 1 are still present in my life?',
      'What do I never want to forget from this mentorship journey?',
    ],
    voorGesprek: [
      'Re-read your letter from session 2 ("letter to your 10-year-old self"). What has changed?',
      'What question do you want to ask your mentor that you haven\'t asked yet?',
    ],
    naGesprek: [
      'What do I take with me from the entire journey?',
      'What is the first step I take now that the journey is complete?',
    ],
    actie: 'Seal your letter to your future self in an envelope. Write "To be opened on [date + 5 years]" on it. Keep it in a special place.',
    doel: 'Close the journey by helping the athlete see their growth and feel a direction for the future. Say goodbye in a meaningful way.',
    mentorFocus: 'This is the closing session. Your role: let the athlete summarize the journey — not you. You affirm and celebrate.',
    gesprekStarters: [
      { fase: 'Opening (5 min)', starter: '"This is our last session. How does that feel for you?"', tip: 'Let the emotion be there. Closing is also letting go — for you and for the athlete.' },
      { fase: 'Looking Back (15 min)', starter: '"Thinking back on our eight sessions — which moment touched you most? What has changed the most?"', tip: 'Let the athlete summarize the journey. Listen actively, affirm.' },
      { fase: 'Looking Forward (10 min)', starter: '"Who are you now that you weren\'t 8 sessions ago? What has changed?"', tip: 'Help the athlete name their own growth process — that anchors it.' },
      { fase: 'Closing (5 min)', starter: '"What do you want me as your mentor to remember about you?"', tip: 'This gives the athlete the feeling they\'ve left something valuable — for you too.' },
    ],
    observeer: [
      'Does the athlete describe their growth in terms of performance or character?',
      'Is there something they want to say but haven\'t yet? (Ask about it.)',
      'How has the athlete changed across eight sessions in how they talk about themselves?',
      'Is there something you as a mentor want to share that you haven\'t said yet?',
    ],
    opgelet: 'Some athletes don\'t want the journey to end. Normalize: "Growth doesn\'t stop here. This journey is a beginning, not an end." Give a concrete referral or next step.',
    afsluiting: 'Give each athlete a personal moment: "What I see in you after eight sessions is..." — honest, specific, from your heart. This is the most powerful gift you can give as a mentor.',
  },
];

// ============================================================
// HTML BUILDERS
// ============================================================
function buildSpelerPage(s, lang) {
  const isNL = lang === 'NL';
  const lSessie = isNL ? 'Sessie' : 'Session';
  const lBadge = isNL ? 'Mentorship · Jouw Traject' : 'Mentorship · Your Journey';
  const lOef = isNL ? 'OEFENING' : 'EXERCISE';
  const lSchrijf = isNL ? 'SCHRIJF' : 'WRITE';
  const lVoor = isNL ? 'VOOR ONS GESPREK' : 'BEFORE OUR CONVERSATION';
  const lNa = isNL ? 'NA ONS GESPREK' : 'AFTER OUR CONVERSATION';
  const lActie = isNL ? '⚡ MIJN ACTIE' : '⚡ MY ACTION';
  const lPag = isNL ? 'Pagina' : 'Page';
  const wlines = (n) => Array.from({length:n}, () => '<div class="w-line"></div>').join('');

  return `
  <!-- SPELER S${s.num} P1 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        ${logo(44)}
        <div><div class="wordmark">CHARACTER<span>First</span></div><span class="badge">${lBadge}</span></div>
      </div>
      <div class="session-label">${lSessie} ${s.num}/8<br>Mentorship</div>
    </div>
    <div class="divider"></div>
    <div>
      <div class="eyebrow">${lSessie} ${s.num}</div>
      <div class="title">${s.title}</div>
      <div class="intro-q">${s.introQ}</div>
    </div>
    <div class="quote-opener">
      <div class="qo-text">${s.quote.text}</div>
      <div class="qo-auth">${s.quote.auteur}</div>
    </div>
    <div class="exercise-block">
      <div class="ex-label">${lOef}: ${s.oefening.label}</div>
      <p>${s.oefening.tekst.replace(/\n/g,'<br>')}</p>
    </div>
    <div class="section-label">${lSchrijf}</div>
    ${s.schrijfVragen.map((q,i) => `<div style="font-size:10.5px;color:#333;margin-bottom:2px">${i+1}. ${q}</div>${wlines(2)}`).join('')}
    <div class="notes-flex" style="flex:1 1 auto;min-height:0">${wlines(3)}</div>
    <div class="footer"><span>characterfirst.be · info@characterfirst.be</span><span class="credit">Created by Tom Pauwaert</span><span>${lPag} 1/2 · ${lSessie} ${s.num}: ${s.title}</span></div>
  </div>

  <!-- SPELER S${s.num} P2 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        ${logo(44)}
        <div><div class="wordmark">CHARACTER<span>First</span></div><span class="badge">${lBadge}</span></div>
      </div>
      <div class="session-label">${lSessie} ${s.num}/8<br>${s.title}</div>
    </div>
    <div class="divider"></div>

    <div class="prep-block">
      <div class="pb-label">${lVoor}</div>
      <ul>${s.voorGesprek.map(v=>`<li>${v}</li>`).join('')}</ul>
    </div>

    <div class="section-label" style="margin-top:4px">${isNL ? 'VRIJE REFLECTIE' : 'FREE REFLECTION'}</div>
    <div class="notes-flex" style="flex:1 1 auto;min-height:0">${wlines(14)}</div>

    <div class="prep-block" style="border-color:var(--green)">
      <div class="pb-label" style="color:var(--green)">${lNa}</div>
      <ul>${s.naGesprek.map(v=>`<li>${v}</li>`).join('')}</ul>
    </div>
    ${wlines(2)}

    <div class="commit-box">
      <p><strong>${lActie}:</strong> ${s.actie}</p>
      <div style="font-size:10px;color:var(--stone);margin-top:4px">${isNL ? 'Mijn commitment:' : 'My commitment:'}</div>
      <div class="c-line"></div><div class="c-line"></div>
    </div>

    <div class="footer"><span>characterfirst.be · info@characterfirst.be</span><span class="credit">Created by Tom Pauwaert</span><span>${lPag} 2/2 · ${lSessie} ${s.num}: ${s.title}</span></div>
  </div>`;
}

function buildMentorPage(s, lang) {
  const isNL = lang === 'NL';
  const lSessie = isNL ? 'Sessie' : 'Session';
  const lBadge = isNL ? 'Mentorship · CF Mentor' : 'Mentorship · CF Mentor';
  const lDoel = isNL ? 'SESSIEDOEL' : 'SESSION GOAL';
  const lGesprek = isNL ? 'GESPREKSOPBOUW' : 'CONVERSATION FLOW';
  const lObserveer = isNL ? 'OBSERVEER' : 'OBSERVE';
  const lOpgelet = isNL ? '⚠ OPGELET' : '⚠ NOTE';
  const lAfsluiting = isNL ? 'AFSLUITING' : 'CLOSING';
  const lNota = isNL ? 'MENTORNOTITIES' : 'MENTOR NOTES';
  const lPag = isNL ? 'Pagina' : 'Page';
  const wlines = (n) => Array.from({length:n}, () => '<div class="w-line"></div>').join('');

  return `
  <!-- MENTOR S${s.num} P1 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        ${logo(44)}
        <div><div class="wordmark">CHARACTER<span>First</span></div><span class="badge">${lBadge}</span></div>
      </div>
      <div class="session-label">${lSessie} ${s.num}/8<br>CF Mentor</div>
    </div>
    <div class="divider"></div>
    <div>
      <div class="eyebrow">${lSessie} ${s.num} — ${isNL ? 'Mentorgids' : 'Mentor Guide'}</div>
      <div class="title">${s.title}</div>
      <div class="mentor-focus">${s.mentorFocus}</div>
    </div>

    <div class="goal-block">
      <div class="gl">${lDoel}</div>
      <p>${s.doel}</p>
    </div>

    <div class="section-label">${lGesprek}</div>
    <div class="conv-cards">
      ${s.gesprekStarters.map(g=>`
      <div class="conv-card">
        <div class="phase">${g.fase}</div>
        <div class="starter">"${g.starter}"</div>
        <div class="tip">💡 ${g.tip}</div>
      </div>`).join('')}
    </div>

    <div class="notes-flex" style="flex:1 1 auto;min-height:0">${wlines(4)}</div>
    <div class="footer"><span>characterfirst.be · info@characterfirst.be · CF Intern</span><span class="credit">Created by Tom Pauwaert</span><span>${lPag} 1/2 · ${lSessie} ${s.num}: ${s.title}</span></div>
  </div>

  <!-- MENTOR S${s.num} P2 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        ${logo(44)}
        <div><div class="wordmark">CHARACTER<span>First</span></div><span class="badge">${lBadge}</span></div>
      </div>
      <div class="session-label">${lSessie} ${s.num}/8<br>${s.title}</div>
    </div>
    <div class="divider"></div>

    <div class="observe-block">
      <div class="ol">${lObserveer}</div>
      <ul>${s.observeer.map(o=>`<li>${o}</li>`).join('')}</ul>
    </div>

    <div class="warn-block">
      <div class="wl">${lOpgelet}</div>
      <p>${s.opgelet}</p>
    </div>

    <div class="closing-block">
      <div class="cl">${lAfsluiting}</div>
      <p>${s.afsluiting}</p>
    </div>

    <div class="section-label" style="margin-top:5px">${lNota}</div>
    <div class="notes-flex" style="flex:1 1 auto;min-height:0">${wlines(12)}</div>

    <div class="footer"><span>characterfirst.be · info@characterfirst.be · CF Intern</span><span class="credit">Created by Tom Pauwaert</span><span>${lPag} 2/2 · ${lSessie} ${s.num}: ${s.title}</span></div>
  </div>`;
}

// ============================================================
// GENERATE
// ============================================================
async function generate(sessions, outDir, type, lang, cssStr, buildFn) {
  const browser = await chromium.launch();
  const suffix = lang === 'NL' ? 'NL' : 'EN';
  for (const s of sessions) {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${cssStr}</style></head><body>${buildFn(s, lang)}</body></html>`;
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const fname = `CF_Mentorship_${type}_S${String(s.num).padStart(2,'0')}_${suffix}.pdf`;
    await page.pdf({ path: path.join(outDir, fname), width: '210mm', height: '297mm', printBackground: true, margin: {top:0,right:0,bottom:0,left:0} });
    await page.close();
    console.log(`${type} ${lang} S${s.num} → ${Math.round(fs.statSync(path.join(outDir,fname)).size/1024)}KB`);
  }
  await browser.close();
}

(async () => {
  await generate(sessionsNL, OUT_SPELER_NL, 'Speler', 'NL', CSS_SPELER, buildSpelerPage);
  await generate(sessionsNL, OUT_MENTOR_NL, 'Mentor', 'NL', CSS_MENTOR, buildMentorPage);
  await generate(sessionsEN, OUT_SPELER_EN, 'Speler', 'EN', CSS_SPELER, buildSpelerPage);
  await generate(sessionsEN, OUT_MENTOR_EN, 'Mentor', 'EN', CSS_MENTOR, buildMentorPage);
  console.log('Done! 32 PDFs gegenereerd.');
})();
