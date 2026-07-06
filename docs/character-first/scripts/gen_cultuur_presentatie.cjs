'use strict';
// Coachpresentaties voor het Cultuurprogramma (verkort 2 sessies + volledig 5 sessies), NL + EN.
// 16:9 slidedecks die de coach projecteert tijdens de sessie. Eén PDF per sessie per taal.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first';
const OUT = path.join(BASE, 'presentaties-cultuur');
fs.mkdirSync(OUT, { recursive: true });

function logo(size = 46) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#0E121B"/>
    <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
    <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
    <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2.5" opacity=".5"/>
    <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
          font-family="Arial Black,Arial,sans-serif" font-weight="900"
          font-size="13" fill="#fff" letter-spacing="3">CF</text>
  </svg>`;
}

const CSS = `
  :root{--orange:#F05A28;--navy:#1C2433;--green:#1E8A5B;--canvas:#FAF7F2;--mist:#F0ECE4;--stone:#6E6A63;--line:#E4DFD6;--blue:#2F6FB0;}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;}
  body{font-family:'Inter',Arial,sans-serif;background:#ccc;}
  .slide{width:1280px;height:720px;overflow:hidden;position:relative;page-break-after:always;break-after:page;padding:64px 80px;display:flex;flex-direction:column;background:var(--canvas);}
  .slide:last-child{page-break-after:auto;}
  /* topbar */
  .topbar{display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
  .brand{display:flex;align-items:center;gap:12px;}
  .wordmark{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:20px;color:var(--navy);letter-spacing:.02em;}
  .wordmark span{color:var(--orange);}
  .sesstag{font-size:13px;color:var(--stone);text-align:right;line-height:1.35;}
  .sesstag b{color:var(--navy);font-family:'Archivo',sans-serif;font-weight:800;}
  .rule{height:3px;background:var(--orange);border-radius:2px;margin:14px 0 0;flex-shrink:0;}
  /* generic body */
  .body{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0;}
  .eyebrow{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:var(--orange);display:flex;align-items:center;gap:14px;margin-bottom:22px;}
  .eyebrow::before{content:'';width:42px;height:4px;background:var(--orange);border-radius:2px;}
  .h{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;color:var(--navy);letter-spacing:-.01em;line-height:1.05;}
  .foot{display:flex;justify-content:space-between;align-items:center;flex-shrink:0;font-size:12px;color:var(--stone);border-top:1px solid var(--line);padding-top:12px;}
  /* TITLE slide */
  .slide.cover{background:linear-gradient(150deg,#1C2433,#0E121B);color:#fff;justify-content:space-between;}
  .cover .wordmark{color:#fff;}
  .cover .bgword{position:absolute;font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:280px;color:rgba(240,90,40,.06);bottom:-40px;right:-20px;line-height:1;letter-spacing:-.04em;pointer-events:none;}
  .cover .vlabel{font-family:'Archivo',sans-serif;font-weight:800;font-size:16px;letter-spacing:.18em;text-transform:uppercase;color:var(--orange);}
  .cover .ctitle{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:88px;line-height:.98;color:#fff;letter-spacing:-.02em;margin-top:18px;}
  .cover .csub{font-size:26px;color:rgba(250,247,242,.66);margin-top:20px;}
  .cover .foot{border-top-color:rgba(255,255,255,.14);color:rgba(250,247,242,.4);}
  /* objective / note paragraph */
  .lead{font-size:27px;line-height:1.5;color:var(--navy);max-width:1000px;}
  .lead.note{border-left:5px solid var(--blue);padding-left:26px;}
  .lead.warn{border-left:5px solid var(--orange);padding-left:26px;}
  ul.big{list-style:none;display:flex;flex-direction:column;gap:18px;}
  ul.big li{font-size:26px;line-height:1.4;color:var(--navy);padding-left:44px;position:relative;}
  ul.big li::before{content:'✓';position:absolute;left:0;top:-2px;color:var(--orange);font-weight:900;font-size:28px;font-family:'Archivo',sans-serif;}
  ul.q li::before{content:'?';color:var(--blue);}
  ul.dot li{padding-left:34px;}
  ul.dot li::before{content:'';width:12px;height:12px;border-radius:50%;background:var(--orange);top:9px;}
  /* agenda */
  .agenda{display:flex;flex-direction:column;gap:16px;}
  .arow{display:flex;align-items:center;gap:22px;background:#fff;border:1.5px solid var(--line);border-left:5px solid var(--orange);border-radius:12px;padding:20px 26px;}
  .anum{width:44px;height:44px;border-radius:50%;background:var(--navy);color:#fff;font-family:'Archivo',sans-serif;font-weight:900;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .atitle{font-family:'Archivo',sans-serif;font-weight:800;font-size:24px;color:var(--navy);flex:1;}
  .atime{font-size:17px;color:var(--stone);font-weight:600;white-space:nowrap;}
  /* exercise slide */
  .exhead{display:flex;align-items:center;gap:24px;margin-bottom:26px;}
  .exnum{width:74px;height:74px;border-radius:50%;background:var(--orange);color:#fff;font-family:'Archivo',sans-serif;font-weight:900;font-size:34px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .extitle{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:44px;color:var(--navy);line-height:1.02;letter-spacing:-.01em;}
  .extime{display:inline-block;margin-top:8px;font-size:16px;color:var(--stone);font-weight:600;}
  .exbody{font-size:26px;line-height:1.5;color:#333;max-width:1040px;}
  .exscript{margin-top:22px;background:rgba(30,138,91,.08);border-left:5px solid var(--green);border-radius:0 10px 10px 0;padding:18px 24px;font-size:22px;line-height:1.5;color:var(--navy);font-style:italic;}
  /* quote slide */
  .slide.quote{background:linear-gradient(150deg,#1C2433,#0E121B);color:#fff;justify-content:center;}
  .quote .wordmark{color:#fff;}
  .quote .qmark{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:120px;color:var(--orange);line-height:.6;}
  .quote .qtext{font-family:'Archivo',sans-serif;font-weight:800;font-size:44px;line-height:1.25;color:#fff;max-width:1040px;margin-top:10px;letter-spacing:-.01em;}
  .quote .qauthor{font-size:20px;color:var(--orange);font-family:'Archivo',sans-serif;font-weight:800;margin-top:26px;letter-spacing:.02em;}
  .quote .foot{border-top-color:rgba(255,255,255,.14);color:rgba(250,247,242,.4);}
  .tagline-big{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;font-size:60px;color:#fff;line-height:1.05;letter-spacing:-.02em;}
  .tagline-big span{color:var(--orange);}
`;

// ---- helpers to build slides ---------------------------------------------
function topbar(L, s){
  return `<div class="topbar">
    <div class="brand">${logo(46)}<div class="wordmark">CHARACTER<span>First</span></div></div>
    <div class="sesstag">${L.vLabel}<br><b>${L.session} ${s.n} / ${s.total}</b></div>
  </div><div class="rule"></div>`;
}
function foot(L, s, page, pages){
  return `<div class="foot"><span>characterfirst.be · info@characterfirst.be</span><span>${L.session} ${s.n} · ${page}/${pages}</span></div>`;
}

function buildDeck(s, L){
  const slides = [];
  // count total content pages for footer (cover + doel + note + agenda + N exercises + questions + closing + quote)
  const nEx = s.exercises.length;
  const pages = 6 + nEx; // doel, note, agenda, exercises, questions, closing (quote+cover excluded from numbering)
  let p = 0;

  // COVER
  slides.push(`<div class="slide cover">
    <div class="topbar"><div class="brand">${logo(46)}<div class="wordmark">CHARACTER<span>First</span></div></div>
      <div class="sesstag" style="color:rgba(250,247,242,.5)">${L.vLabel}<br><b style="color:#fff">${L.session} ${s.n} / ${s.total}</b></div></div>
    <div class="bgword">${s.n}</div>
    <div style="position:relative;z-index:2">
      <div class="vlabel">${L.coachPres}</div>
      <div class="ctitle">${s.title}</div>
      <div class="csub">${s.subtitle}</div>
    </div>
    <div class="foot"><span>${L.tagline}</span><span>characterfirst.be</span></div>
  </div>`);

  // DOEL
  p++;
  const doelBody = Array.isArray(s.objectives)
    ? `<ul class="big">${s.objectives.map(o=>`<li>${o}</li>`).join('')}</ul>`
    : `<p class="lead">${s.objectives}</p>`;
  slides.push(`<div class="slide">${topbar(L,s)}
    <div class="body"><div class="eyebrow">${L.goal}</div>${doelBody}</div>
    ${foot(L,s,p,pages)}</div>`);

  // COACHNOTA / LET OP
  p++;
  const noteBody = Array.isArray(s.coachNote)
    ? `<ul class="big dot">${s.coachNote.map(o=>`<li>${o}</li>`).join('')}</ul>`
    : `<p class="lead note">${s.coachNote}</p>`;
  slides.push(`<div class="slide">${topbar(L,s)}
    <div class="body"><div class="eyebrow" style="color:var(--blue)">${s.noteLabel||L.coachNote}</div>${noteBody}</div>
    ${foot(L,s,p,pages)}</div>`);

  // AGENDA
  p++;
  slides.push(`<div class="slide">${topbar(L,s)}
    <div class="body"><div class="eyebrow">${L.agenda}</div>
      <div class="agenda">${s.exercises.map((e,i)=>`
        <div class="arow"><div class="anum">${i+1}</div><div class="atitle">${e.title}</div><div class="atime">${e.time}</div></div>`).join('')}
      </div></div>
    ${foot(L,s,p,pages)}</div>`);

  // EXERCISES
  s.exercises.forEach((e,i)=>{
    p++;
    slides.push(`<div class="slide">${topbar(L,s)}
      <div class="body">
        <div class="exhead"><div class="exnum">${i+1}</div>
          <div><div class="extitle">${e.title}</div><div class="extime">⏱ ${e.time} · ${L.exercise} ${i+1}/${nEx}</div></div></div>
        <div class="exbody">${e.text}</div>
        ${e.script?`<div class="exscript">${e.script}</div>`:''}
      </div>
      ${foot(L,s,p,pages)}</div>`);
  });

  // DISCUSSIEVRAGEN
  p++;
  slides.push(`<div class="slide">${topbar(L,s)}
    <div class="body"><div class="eyebrow" style="color:var(--blue)">${L.questions}</div>
      <ul class="big q">${s.questions.map(q=>`<li>${q}</li>`).join('')}</ul></div>
    ${foot(L,s,p,pages)}</div>`);

  // AFSLUITING
  p++;
  slides.push(`<div class="slide">${topbar(L,s)}
    <div class="body"><div class="eyebrow" style="color:var(--green)">${L.closing}</div>
      <p class="lead" style="border-left:5px solid var(--green);padding-left:26px">${s.closing}</p></div>
    ${foot(L,s,p,pages)}</div>`);

  // QUOTE / TAGLINE
  if (s.quote){
    slides.push(`<div class="slide quote">
      <div class="topbar"><div class="brand">${logo(46)}<div class="wordmark">CHARACTER<span>First</span></div></div></div>
      <div class="body" style="flex:1;justify-content:center">
        <div class="qmark">&ldquo;</div>
        <div class="qtext">${s.quote.t}</div>
        <div class="qauthor">${s.quote.a}</div>
      </div>
      <div class="foot"><span>${L.tagline}</span><span>characterfirst.be</span></div>
    </div>`);
  } else {
    slides.push(`<div class="slide quote">
      <div class="topbar"><div class="brand">${logo(46)}<div class="wordmark">CHARACTER<span>First</span></div></div></div>
      <div class="body" style="flex:1;justify-content:center">
        <div class="tagline-big">Win the person.<br><span>Win the team.</span></div>
      </div>
      <div class="foot"><span>${L.thanks}</span><span>characterfirst.be</span></div>
    </div>`);
  }

  return slides.join('\n');
}

// ---- LABELS ---------------------------------------------------------------
const LABELS = {
  NL: { session:'Sessie', goal:'Doel van deze sessie', coachNote:'Coachnota', agenda:'Overzicht van de sessie',
        exercise:'Oefening', questions:'Discussievragen', closing:'Afsluiting', coachPres:'Coachpresentatie',
        tagline:'Win the person. Win the team.', thanks:'Bedankt · characterfirst.be' },
  EN: { session:'Session', goal:'Goal of this session', coachNote:'Coach note', agenda:'Session overview',
        exercise:'Exercise', questions:'Discussion questions', closing:'Closing', coachPres:'Coach presentation',
        tagline:'Win the person. Win the team.', thanks:'Thank you · characterfirst.be' },
};

// ==========================================================================
// CONTENT
// ==========================================================================
// -- SHORT (verkort, 2 sessies) --------------------------------------------
const shortNL = [
  { n:1,total:2,title:'Wie zijn wij?',subtitle:'Verkorte cultuurreeks · sessie 1 van 2',
    objectives:['Spelers benoemen drie waarden die het team dit seizoen wil uitstralen','Spelers bepalen samen wat ze behouden en wat ze loslaten','Elke speler legt een persoonlijke, ondertekende belofte aan het team vast'],
    noteLabel:'Let op', coachNote:['Laat de discussie niet vervallen tot klagen over vorig seizoen. Stuur naar wie jullie willen zijn.','Forceer niemand om te delen. Vrijwilligheid houdt de veiligheid hoog en de antwoorden eerlijk.','Bewaak de tijd: elke oefening heeft een richttijd. Liever kort en scherp dan lang en vaag.'],
    exercises:[
      {title:'Drie woorden voor ons team',time:'10 min',text:'Spelers schrijven eerst individueel drie woorden die zij over het team willen horen — over gedrag en karakter, niet over het klassement. Daarna combineren jullie de meest gekozen woorden tot drie teamwoorden.',script:'"Twee minuten alleen schrijven, geen overleg. Drie woorden die jij wil dat mensen over ons team zeggen."'},
      {title:'Cultuurankers',time:'12 min',text:'Twee kolommen: wat willen we bewaren (gedrag, gewoontes, momenten) en wat laten we bewust los? Maak elk punt concreet in zichtbaar gedrag.',script:'"Links: wat bewaren we als team. Rechts: wat laten we achter? Twee minuten schrijven, dan korte bespreking."'},
      {title:'Teamcontract ondertekenen',time:'8 min',text:'Elke speler schrijft drie concrete, meetbare beloftes aan het team en ondertekent met naam en datum. Een contract dat spelers zelf schrijven werkt sterker dan regels van bovenaf.',script:'"Schrijf drie beloftes die je zelf kunt checken. Onderteken daarna met naam en datum."'},
    ],
    questions:['Welk woord koos bijna iedereen, en wat zegt dat over wie jullie al zijn?','Wat loslaten is voor jou persoonlijk het moeilijkst dit seizoen?','Welke belofte durf je hardop uit te spreken voor het hele team?','Hoe zorg je dat dit contract niet vergeten wordt na vandaag?'],
    closing:'Hang de drie cultuurwoorden zichtbaar op in de kleedkamer en bewaar de ondertekende contracten. Breng ze halverwege het seizoen terug: "Wat beloofde je, en hoe gaat het?"',
    quote:null },
  { n:2,total:2,title:'Hoe werken wij?',subtitle:'Verkorte cultuurreeks · sessie 2 van 2',
    objectives:['Spelers brengen in kaart hoe veilig ze zich voelen in het team','Spelers oefenen hoe ze elkaar aanspreken zonder de relatie te beschadigen','Spelers kiezen rituelen die de cultuur elke week levend houden'],
    noteLabel:'Let op', coachNote:['De vertrouwensbarometer kan gevoelig liggen na een moeilijke periode. Luister eerst, stel daarna pas vragen.','Sla het voordoen van "ik zie, ik voel, ik vraag" niet over. Spelers moeten het format eerst zien.','Hou rituelen klein. Een ritueel dat als last voelt, verdwijnt binnen twee weken.'],
    exercises:[
      {title:'Vertrouwensbarometer',time:'10 min',text:'Spelers scoren anoniem van 1 tot 10 hoe veilig ze zich voelen in vier concrete situaties. Verschuif van diagnose naar actie: "Wat moet er veranderen om één punt hoger te scoren?"',script:'"Geef eerlijk een score van 1 tot 10. Geen goed of fout. Niemand hoeft zijn scores te tonen."'},
      {title:'Het moeilijke gesprek',time:'12 min',text:'Doe het model eerst zelf voor. Spelers schrijven dan: IK ZIE (feit, geen oordeel), IK VOEL (het effect), IK VRAAG JE OM (één concrete actie). Zo voeren ze moeilijke gesprekken zonder aanval.',script:'"Ik zie … ik voel … ik vraag je om … Geen namen nodig op papier."'},
      {title:'Rituelen en cultuurbelofte',time:'10 min',text:'Spelers kiezen drie kleine rituelen (voor training, na een wedstrijd, bij een moeilijk moment) en schrijven één zin over hun bijdrage aan de cultuur. Onderteken. Kies rituelen die minstens acht weken vol te houden zijn.',script:'"Drie rituelen + één zin: wat draag jij bij aan onze cultuur? Onderteken."'},
    ],
    questions:['Welke vertrouwensvraag voelde het gevaarlijkst om eerlijk te beantwoorden, en waarom?','Heb je ooit iemand aangesproken op gedrag? Wat werkte en wat niet?','Welk ritueel zou ons team direct veranderen, ook als het maar 30 seconden duurt?','Wat wil jij dat een nieuw teamlid over vijf jaar over deze groep zegt?'],
    closing:'Introduceer het eerste ritueel op de eerstvolgende training en benoem dat het van de spelers zelf komt. Gebruik het "ik zie, ik voel, ik vraag"-model ook zelf. Plan een korte terugblik na zes weken.',
    quote:null },
];
const shortEN = [
  { n:1,total:2,title:'Who are we?',subtitle:'Short culture track · session 1 of 2',
    objectives:['Players name three values the team wants to show this season','Players decide together what to keep and what to let go','Each player records a personal, signed promise to the team'],
    noteLabel:'Watch out', coachNote:['Do not let the discussion slide into complaining about last season. Redirect toward who you want to be.','Never force anyone to share. Voluntary participation keeps safety high and answers honest.','Guard the time: each exercise has a target time. Short and sharp beats long and vague.'],
    exercises:[
      {title:'Three words for our team',time:'10 min',text:'Players first write three words individually that they want people to say about the team — about behavior and character, not standings. Then combine the most chosen words into three team words.',script:'"Two minutes writing alone, no talking. Three words you want people to say about our team."'},
      {title:'Culture anchors',time:'12 min',text:'Two columns: what do we keep (behaviors, habits, moments) and what do we consciously let go? Make each point concrete in visible behavior.',script:'"Left: what we keep as a team. Right: what we leave behind? Two minutes, then a short discussion."'},
      {title:'Sign the team contract',time:'8 min',text:'Each player writes three concrete, measurable promises to the team and signs with name and date. A contract players write themselves works stronger than rules from above.',script:'"Write three promises you can check yourself. Then sign with name and date."'},
    ],
    questions:['Which word did almost everyone choose, and what does that say about who you already are?','What is personally hardest for you to let go of this season?','Which promise do you dare to say out loud in front of the whole team?','How do you make sure this contract is not forgotten after today?'],
    closing:'Display the three culture words visibly in the locker room and keep the signed contracts. Bring them back midseason: "What did you promise, and how is it going?"',
    quote:null },
  { n:2,total:2,title:'How do we work?',subtitle:'Short culture track · session 2 of 2',
    objectives:['Players map how safe they feel in the team','Players practice holding each other accountable without damaging the relationship','Players choose rituals that keep the culture alive every week'],
    noteLabel:'Watch out', coachNote:['The trust barometer can be sensitive after a hard period. Listen first, ask questions later.','Do not skip modeling the "I see, I feel, I ask" exercise. Players need to see the format first.','Keep rituals small. A ritual that feels like a burden disappears within two weeks.'],
    exercises:[
      {title:'Trust barometer',time:'10 min',text:'Players anonymously score from 1 to 10 how safe they feel in four concrete situations. Shift from diagnosis to action: "What needs to change to score one point higher?"',script:'"Give an honest score from 1 to 10. No right or wrong. No one has to show their scores."'},
      {title:'The difficult conversation',time:'12 min',text:'Model it yourself first. Players then write: I SEE (fact, no judgment), I FEEL (the effect), I ASK YOU TO (one concrete action). This lets them have hard talks without attacking.',script:'"I see … I feel … I ask you to … No names needed on paper."'},
      {title:'Rituals and culture promise',time:'10 min',text:'Players choose three small rituals (before training, after a game, in a hard moment) and write one sentence about their contribution to the culture. Sign. Choose rituals you can keep up for at least eight weeks.',script:'"Three rituals + one sentence: what do you contribute to our culture? Sign."'},
    ],
    questions:['Which trust question felt most dangerous to answer honestly, and why?','Have you ever addressed someone about their behavior? What worked and what did not?','Which ritual would change our team immediately, even if it only takes 30 seconds?','What do you want a new teammate to say about this group in five years?'],
    closing:'Introduce the first ritual at the very next practice and name that it comes from the players. Use the "I see, I feel, I ask" model yourself too. Plan a short review after six weeks.',
    quote:null },
];

// -- FULL (volledig, 5 sessies) --------------------------------------------
const Q = {
  1:{t:'"Cultuur is niet één aspect van het spel, het is het spel."',a:'Lou Gerstner, CEO IBM',
     te:'"Culture is not just one aspect of the game, it is the game."'},
  2:{t:'"Afspraken, geen regels. Een regel kan je breken. Een afspraak hou je samen na."',a:'Atul Gawande',
     te:'"Agreements, not rules. You can break a rule. You own an agreement."'},
  3:{t:'"Kwetsbaarheid is geen zwakte. Het is de moed om jezelf te laten zien."',a:'Brené Brown',
     te:'"Vulnerability is not weakness. It is our greatest measure of courage."'},
  4:{t:'"Vrede is niet de afwezigheid van conflict, maar de manier waarop je het aanpakt."',a:'Ronald Reagan',
     te:'"Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means."'},
  5:{t:'"Kampioenen gedragen zich als kampioenen voordat ze kampioenen zijn."',a:'Bill Walsh',
     te:'"Champions behave like champions before they are champions."'},
};
const fullNL = [
  { n:1,total:5,title:'Onze identiteit',subtitle:'Wie zijn wij als team?',
    objectives:'Je helpt het team een gedeelde identiteit vormen. Spelers benoemen waarden die zij belangrijk vinden en koppelen die aan hun gedrag op en naast het veld.',
    coachNote:'Stel open vragen, geef geen antwoorden — jij bent facilitator. Zorg dat iedere speler aan het woord komt en noteer de meest genoemde waarden. Valkuil: laat niet één luide speler de discussie domineren.',
    exercises:[
      {title:'Check-in: één woord',time:'5 min',text:'Vraag iedere speler één woord dat hem als sporter typeert. Schrijf alle woorden op het bord en zoek clusters.'},
      {title:'Onze kernwaarden',time:'15 min',text:'In duo\'s kiezen spelers drie waarden die zij als team willen tonen. Plenair: welke komen het meest voor? Kies samen drie tot vijf teamwaarden.'},
      {title:'Identiteitskaart invullen',time:'10 min',text:'Spelers vullen individueel de identiteitskaart in: als team zijn wij …, we geloven in …, we kiezen ervoor om …'},
    ],
    questions:['Waarom koos jij deze waarden?','Hoe ziet een speler eruit die deze waarden elke dag leeft?','Wat verandert er als iedereen dit doet?'],
    closing:'Vat de gekozen teamwaarden samen op een groot vel. Vertel de groep: dit is wie wij zijn, dit wordt ons fundament voor de rest van het seizoen.',
    quote:{t:Q[1].t,a:Q[1].a} },
  { n:2,total:5,title:'Ons teamcontract',subtitle:'Afspraken maken die ertoe doen',
    objectives:'Je begeleidt het team bij het opstellen van concrete gedragsafspraken. Het teamcontract wordt door alle spelers ondertekend en vormt het referentiepunt voor de rest van het seizoen.',
    coachNote:'Laat het team zelf de regels formuleren — eigenaarschap is cruciaal. Zorg dat afspraken specifiek en gedragsgericht zijn. "We respecteren elkaar" is te vaag. "We luisteren tot de coach klaar is met spreken" is concreet.',
    exercises:[
      {title:'Wat werkte, wat werkte niet?',time:'10 min',text:'Bespreek vorig seizoen of de trainingen tot nu toe. Welk gedrag maakte het team sterker, welk gedrag kostte energie of vertrouwen? Schrijf het in twee kolommen.'},
      {title:'Afspraken formuleren',time:'15 min',text:'Groepjes van drie formuleren elk twee afspraken. Plenair: selecteer samen de zes tot acht sterkste. Check: zijn ze specifiek genoeg?'},
      {title:'Ondertekenen en committeren',time:'5 min',text:'Schrijf het contract groot uit. Iedereen, ook jij als coach, ondertekent. Hang het zichtbaar op. Sla deze stap niet over: het tekenen maakt het concreet.'},
    ],
    questions:['Wat doe jij als iemand een afspraak niet nakomt?','Hoe houd je elkaar verantwoordelijk zonder te straffen?','Wat is jouw persoonlijke commitment aan dit contract?'],
    closing:'Lees het volledige contract voor en vraag iedere speler kort naar zijn persoonlijke toezegging. Sluit af met een teamritueel: een klap, een roep, een cirkel — iets dat van jullie is.',
    quote:{t:Q[2].t,a:Q[2].a} },
  { n:3,total:5,title:'Vertrouwen en veiligheid',subtitle:'De basis van een sterk team',
    objectives:'Je creëert omstandigheden waarin spelers zich veilig voelen om fouten te maken, eerlijk te zijn en kwetsbaar te zijn. Psychologische veiligheid is de belangrijkste voorspeller van teamprestaties.',
    coachNote:'Toon zelf kwetsbaarheid: deel een moment waarop jij een fout maakte en wat je leerde. Als de coach dit kan, kunnen de spelers het ook. Wees alert op spelers die zwijgen en check ze individueel na de sessie.',
    exercises:[
      {title:'Vertrouwensmeter',time:'5 min',text:'Spelers geven anoniem een cijfer van 1 tot 10: hoe veilig voel ik mij om fouten te maken? Verzamel, bereken het gemiddelde, bespreek.'},
      {title:'Fouten als leermomenten',time:'15 min',text:'Iedereen noemt één sportmoment waarop hij een fout maakte en wat hij leerde. De coach gaat als eerste. Nadruk: geen oordeel, geen gelach, alleen luisteren.'},
      {title:'Vertrouwensafspraken toevoegen',time:'10 min',text:'Voeg twee afspraken over veiligheid toe aan het teamcontract. Bijvoorbeeld: we reageren niet negatief op fouten tijdens training, en problemen bespreken we intern, niet via social media.'},
    ],
    questions:['Wanneer voelde jij je niet veilig in een team? Wat was het effect?','Wat kun jij doen om het veiliger te maken voor anderen?','Hoe reageert dit team als iemand een grote fout maakt in een wedstrijd?'],
    closing:'Sluit af met een commitment-ronde: iedere speler zegt één ding dat hij zal doen om het team veiliger te maken. Schrijf dit op het bord en fotografeer het.',
    quote:{t:Q[3].t,a:Q[3].a} },
  { n:4,total:5,title:'Conflict en herstel',subtitle:'Moeilijke gesprekken voeren',
    objectives:'Je leert spelers conflicten constructief aanpakken. Conflictvermijding verzwakt een team; goed conflictmanagement maakt het sterker. Spelers oefenen directe, respectvolle communicatie.',
    coachNote:'Jouw rol bij conflict: niet meteen oplossen, maar begeleiden. Geef ruimte aan beide kanten. Gebruik de ik-boodschap: ik voel X als jij Y doet, ik vraag je om Z. Kies geen kant voor je beide versies hebt gehoord.',
    exercises:[
      {title:'Conflictstijlen herkennen',time:'10 min',text:'Bespreek vier stijlen: vermijden, aanvallen, toegeven, samenwerken. Vraag: welke herken jij bij jezelf? Welke is het meest effectief voor het team? (Antwoord: samenwerken.)'},
      {title:'Roleplay: moeilijk gesprek',time:'15 min',text:'Duo\'s spelen een scenario na met de ik-boodschap-structuur (bv. iemand komt altijd te laat). Na drie minuten: wissel rollen en bespreek plenair wat werkte.'},
      {title:'Herstelprotocol opstellen',time:'5 min',text:'Stel samen een kort protocol op: 1) afkoelen (24u), 2) direct gesprek, geen derden, 3) coach als bemiddelaar indien nodig, 4) afspraak herstellen.'},
    ],
    questions:['Hoe los jij nu conflicten op binnen het team?','Wat is het verschil tussen een conflict dat het team verzwakt en één dat het sterker maakt?','Wanneer betrek je de coach erbij en wanneer los je het zelf op?'],
    closing:'Hang het herstelprotocol naast het teamcontract. Leg uit: conflicten zijn normaal, wat telt is hoe je ermee omgaat. Teams die conflicten goed verwerken, zijn de sterkste teams.',
    quote:{t:Q[4].t,a:Q[4].a} },
  { n:5,total:5,title:'Cultuur in actie',subtitle:'Plannen voor het seizoen',
    objectives:'Je verankert de cultuurafspraken in de dagelijkse training- en wedstrijdroutine. De cultuur wordt operationeel: spelers weten wat ze van zichzelf en elkaar mogen verwachten.',
    coachNote:'Dit is de integratiesessie: breng alles samen. Verwijs naar sessies 1 tot 4 en laat spelers zien hoeveel ze opbouwden. Jouw taak nu: zorgen dat de cultuur niet verwatert zodra het seizoen begint. Plan check-ins op vaste momenten.',
    exercises:[
      {title:'Cultuurterugblik',time:'10 min',text:'Laat spelers terugblikken op sessies 1 tot 4. Wat hebben we afgesproken en geleerd over identiteit, vertrouwen en conflict? Maak een visuele samenvatting op het bord.'},
      {title:'Cultuurmomenten inplannen',time:'10 min',text:'Plan concrete momenten voor het seizoen: een maandelijkse check-in, een cultuurcaptain, rituelen voor wedstrijddag. Zet ze in de teamkalender.'},
      {title:'Individueel commitment',time:'10 min',text:'Iedere speler schrijft op een kaartje: mijn bijdrage aan de cultuur dit seizoen is … De coach bewaart de kaartjes en geeft ze na twee maanden terug als herinnering.'},
    ],
    questions:['Wat neem jij mee uit deze preseason cultuurweek?','Welke afspraak vind jij persoonlijk het moeilijkst om na te komen, en hoe pak je dat aan?','Hoe ziet ons team eruit over drie maanden als we dit echt naleven?'],
    closing:'Sluit af met een krachtig moment: lees samen het teamcontract voor, iedereen staat recht, één hand in het midden. Dit is wie wij zijn. Win the person. Win the team.',
    quote:{t:Q[5].t,a:Q[5].a} },
];
const fullEN = [
  { n:1,total:5,title:'Our identity',subtitle:'Who are we as a team?',
    objectives:'You help the team form a shared identity. Players name values that matter to them and connect those values to their behavior on and off the court.',
    coachNote:'Ask open questions, do not give answers — you are the facilitator. Make sure every player speaks and note the most mentioned values. Pitfall: do not let one loud player dominate the discussion.',
    exercises:[
      {title:'Check-in: one word',time:'5 min',text:'Ask each player one word that describes them as an athlete. Write all words on the board and look for clusters.'},
      {title:'Our core values',time:'15 min',text:'In pairs, players choose three values they want to show as a team. Plenary: which come up most? Choose three to five team values together.'},
      {title:'Fill in the identity card',time:'10 min',text:'Players individually complete the identity card: as a team we are …, we believe in …, we choose to …'},
    ],
    questions:['Why did you choose these values?','What does a player look like who lives these values every day?','What changes if everyone does this?'],
    closing:'Summarize the chosen team values on a large sheet. Tell the group: this is who we are, this becomes our foundation for the rest of the season.',
    quote:{t:Q[1].te,a:Q[1].a} },
  { n:2,total:5,title:'Our team contract',subtitle:'Making agreements that matter',
    objectives:'You guide the team in creating concrete behavioral agreements. The team contract is signed by all players and becomes the reference point for the rest of the season.',
    coachNote:'Let the team formulate the rules themselves — ownership is crucial. Make sure agreements are specific and behavior-oriented. "We respect each other" is too vague. "We listen until the coach finishes speaking" is concrete.',
    exercises:[
      {title:'What worked, what did not?',time:'10 min',text:'Discuss last season or training so far. What behavior made the team stronger, what cost energy or trust? Write it in two columns.'},
      {title:'Formulating agreements',time:'15 min',text:'Groups of three each formulate two agreements. Plenary: select the six to eight strongest together. Check: are they specific enough?'},
      {title:'Sign and commit',time:'5 min',text:'Write the contract out large. Everyone, including you as coach, signs it. Hang it visibly. Do not skip this step: signing makes it concrete.'},
    ],
    questions:['What will you do if someone does not follow an agreement?','How do you hold each other accountable without punishing?','What is your personal commitment to this contract?'],
    closing:'Read the full contract aloud and ask each player briefly for their personal pledge. Close with a team ritual: a clap, a chant, a circle — something that is yours.',
    quote:{t:Q[2].te,a:Q[2].a} },
  { n:3,total:5,title:'Trust and safety',subtitle:'The foundation of a strong team',
    objectives:'You create conditions where players feel safe to make mistakes, be honest and be vulnerable. Psychological safety is the strongest predictor of team performance.',
    coachNote:'Show vulnerability yourself: share a moment when you made a mistake and what you learned. If the coach can do this, so can the players. Watch for players who stay silent and check in with them individually afterwards.',
    exercises:[
      {title:'Trust meter',time:'5 min',text:'Players anonymously give a number from 1 to 10: how safe do I feel to make mistakes? Collect, calculate the average, discuss.'},
      {title:'Mistakes as learning moments',time:'15 min',text:'Everyone shares one sports moment when they made a mistake and what they learned. The coach goes first. Emphasis: no judgment, no laughter, only listening.'},
      {title:'Adding trust agreements',time:'10 min',text:'Add two safety agreements to the team contract. For example: we do not respond negatively to mistakes during training, and we discuss problems internally, not on social media.'},
    ],
    questions:['When did you feel unsafe in a team? What was the effect?','What can you do to make it safer for others?','How does this team respond when someone makes a big mistake in a game?'],
    closing:'Close with a commitment round: each player says one thing they will do to make the team safer. Write it on the board and photograph it.',
    quote:{t:Q[3].te,a:Q[3].a} },
  { n:4,total:5,title:'Conflict and recovery',subtitle:'Having difficult conversations',
    objectives:'You teach players to handle conflict constructively. Conflict avoidance weakens a team; good conflict management makes it stronger. Players practice direct, respectful communication.',
    coachNote:'Your role during conflict: do not solve it immediately, guide it. Give space to both sides. Use the I-message: I feel X when you do Y, I ask you to do Z. Do not pick a side before you have heard both versions.',
    exercises:[
      {title:'Recognizing conflict styles',time:'10 min',text:'Discuss four styles: avoiding, attacking, giving in, collaborating. Ask: which do you recognize in yourself? Which is most effective for the team? (Answer: collaborating.)'},
      {title:'Roleplay: difficult conversation',time:'15 min',text:'Pairs act out a scenario using the I-message structure (e.g. someone is always late). After three minutes: switch roles and discuss what worked.'},
      {title:'Setting up a recovery protocol',time:'5 min',text:'Together set up a short protocol: 1) cool down (24h), 2) direct conversation, no third parties, 3) coach as mediator if needed, 4) restore the agreement.'},
    ],
    questions:['How do you currently resolve conflicts within the team?','What is the difference between a conflict that weakens the team and one that makes it stronger?','When do you involve the coach and when do you solve it yourself?'],
    closing:'Hang the recovery protocol next to the team contract. Explain: conflicts are normal, what matters is how you deal with them. Teams that process conflict well are the strongest teams.',
    quote:{t:Q[4].te,a:Q[4].a} },
  { n:5,total:5,title:'Culture in action',subtitle:'Planning for the season',
    objectives:'You embed the culture agreements in daily training and match routines. The culture becomes operational: players know what they can expect from themselves and each other.',
    coachNote:'This is the integration session: bring everything together. Reference sessions 1 to 4 and show players how much they built. Your job now: keep the culture from fading once the season starts. Schedule check-ins at fixed moments.',
    exercises:[
      {title:'Culture review',time:'10 min',text:'Let players look back at sessions 1 to 4. What did we agree on and learn about identity, trust and conflict? Make a visual summary on the board.'},
      {title:'Scheduling culture moments',time:'10 min',text:'Plan concrete moments for the season: a monthly check-in, a culture captain, game-day rituals. Put them in the team calendar.'},
      {title:'Individual commitment',time:'10 min',text:'Each player writes on a card: my contribution to the culture this season is … The coach keeps the cards and returns them after two months as a reminder.'},
    ],
    questions:['What will you take away from this preseason culture week?','Which agreement do you personally find hardest to keep, and how will you approach that?','What will our team look like in three months if we really live this?'],
    closing:'Close with a powerful moment: read the team contract together, everyone stands up, one hand in the middle. This is who we are. Win the person. Win the team.',
    quote:{t:Q[5].te,a:Q[5].a} },
];

// ==========================================================================
async function render(browser, sessions, L, lang, prefix){
  for (const s of sessions){
    const L2 = { ...L, vLabel: (prefix==='Kort'
      ? (lang==='NL'?'Verkorte reeks':'Short track')
      : (lang==='NL'?'Volledig programma':'Full program')) };
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>${CSS}</style></head><body>${buildDeck(s, L2)}</body></html>`;
    const page = await browser.newPage({ viewport:{width:1280,height:720} });
    await page.setContent(html, { waitUntil:'networkidle' });
    await page.waitForTimeout(300);
    const fname = `CF_Cultuur_${prefix}_Presentatie_S${s.n}_${lang}.pdf`;
    await page.pdf({ path: path.join(OUT, fname), width:'1280px', height:'720px',
      printBackground:true, margin:{top:0,right:0,bottom:0,left:0} });
    await page.close();
    console.log(`${fname} → ${Math.round(fs.statSync(path.join(OUT,fname)).size/1024)}KB`);
  }
}

module.exports = { buildDeck, CSS, LABELS, shortNL, shortEN, fullNL, fullEN };

if (require.main === module) {
  (async () => {
    const browser = await chromium.launch();
    await render(browser, shortNL, LABELS.NL, 'NL', 'Kort');
    await render(browser, shortEN, LABELS.EN, 'EN', 'Kort');
    await render(browser, fullNL,  LABELS.NL, 'NL', 'Volledig');
    await render(browser, fullEN,  LABELS.EN, 'EN', 'Volledig');
    await browser.close();
    console.log('Done!');
  })();
}
