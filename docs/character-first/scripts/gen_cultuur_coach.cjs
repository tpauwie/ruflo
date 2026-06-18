'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first';
const OUT_NL = path.join(BASE, 'werkbladen-pdf/cultuur-coach');
const OUT_EN = path.join(BASE, 'werkbladen-pdf/cultuur-coach-en');
[OUT_NL, OUT_EN].forEach(d => fs.mkdirSync(d, { recursive: true }));

function logo(size = 80) {
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
    --canvas: #FAF7F2;
    --mist: #F0ECE4;
    --stone: #6E6A63;
    --line: #E4DFD6;
    --blue: #2F6FB0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #ddd; font-family: Arial, sans-serif; }
  .page {
    width: 210mm; height: 297mm; overflow: hidden;
    padding: 12mm 14mm 10mm; background: var(--canvas);
    display: flex; flex-direction: column; gap: 8px;
    page-break-after: always; break-after: page;
    position: relative;
  }
  /* Header */
  .header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .wordmark { font-family: "Arial Black", Arial, sans-serif; font-size: 18px; font-weight: 900; color: var(--navy); }
  .wordmark span { color: var(--orange); }
  .badge {
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em;
    background: rgba(30,138,91,.12); color: var(--green);
    border: 1.5px solid var(--green); border-radius: 20px;
    padding: 3px 10px;
  }
  .session-label { font-size: 11px; color: var(--stone); text-align: right; line-height: 1.3; }
  /* Divider */
  .divider { height: 2px; background: var(--orange); border-radius: 1px; flex-shrink: 0; }
  /* Title block */
  .title-block { flex-shrink: 0; }
  .eyebrow {
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .15em; color: var(--orange); margin-bottom: 3px;
  }
  .title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 22px; font-weight: 900;
    color: var(--navy); line-height: 1.15;
  }
  .subtitle { font-size: 13px; color: var(--stone); margin-top: 3px; }
  /* Section label */
  .section-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .12em; color: var(--navy);
    border-left: 3px solid var(--orange); padding-left: 8px; margin-bottom: 4px;
  }
  /* Objective block */
  .objective-block {
    background: rgba(240,90,40,.07); border-left: 3px solid var(--orange);
    border-radius: 6px; padding: 8px 12px; flex-shrink: 0;
  }
  .objective-block p { font-size: 12px; color: var(--navy); line-height: 1.5; }
  /* Coach note */
  .coach-note {
    background: rgba(47,111,176,.08); border-left: 3px solid var(--blue);
    border-radius: 6px; padding: 8px 12px; flex-shrink: 0;
  }
  .coach-note .section-label { color: var(--blue); border-color: var(--blue); }
  .coach-note p { font-size: 12px; color: var(--navy); line-height: 1.5; }
  /* Activity cards */
  .activities { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .activity-card {
    border: 1.5px solid var(--line); border-radius: 8px; padding: 8px 12px;
    background: #fff;
  }
  .activity-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .activity-num {
    width: 22px; height: 22px; border-radius: 50%; background: var(--navy);
    color: #fff; font-size: 11px; font-weight: 900; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
    font-family: "Arial Black", Arial, sans-serif;
  }
  .activity-title { font-family: "Arial Black", Arial, sans-serif; font-size: 13px; font-weight: 900; color: var(--navy); }
  .activity-meta { font-size: 10px; color: var(--stone); margin-bottom: 4px; }
  .activity-desc { font-size: 11px; color: #444; line-height: 1.45; }
  /* Discussion block */
  .discussion-block {
    background: rgba(30,138,91,.07); border-left: 3px solid var(--green);
    border-radius: 6px; padding: 8px 12px; flex-shrink: 0;
  }
  .discussion-block .section-label { color: var(--green); border-color: var(--green); }
  .discussion-block ul { padding-left: 16px; }
  .discussion-block ul li { font-size: 11px; color: var(--navy); line-height: 1.5; margin-bottom: 2px; }
  /* Notes area */
  .notes-area { flex: 1 1 auto; min-height: 0; }
  .notes-lines { display: flex; flex-direction: column; gap: 0; }
  .note-line { border-bottom: 1px solid var(--line); height: 22px; }
  /* Quote block */
  .quote-block {
    background: var(--navy); border-radius: 8px; padding: 10px 14px;
    border-left: 4px solid var(--orange); flex-shrink: 0;
  }
  .quote-text { font-size: 12px; color: #fff; font-style: italic; line-height: 1.5; margin-bottom: 3px; }
  .quote-author { font-size: 10px; color: var(--orange); font-family: "Arial Black", Arial, sans-serif; font-weight: 900; }
  /* Closing block */
  .closing-block {
    background: rgba(28,36,51,.06); border-radius: 6px; padding: 8px 12px; flex-shrink: 0;
  }
  .closing-block p { font-size: 11px; color: var(--navy); line-height: 1.5; }
  /* Footer */
  .footer {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line); padding-top: 5px; flex-shrink: 0;
  }
  .footer-left { font-size: 9px; color: var(--stone); }
  .footer-right { font-size: 9px; color: var(--stone); text-align: right; }
  .footer .credit { color: var(--stone); }
  /* Print */
  @media print {
    body { background: white; }
    .page { margin: 0; }
  }
`;

const sessionsNL = [
  {
    num: 1, title: 'Onze identiteit', subtitle: 'Wie zijn wij als team?',
    doel: 'Je helpt het team een gedeelde identiteit vormen. Spelers benoemen waarden die zij persoonlijk en als team belangrijk vinden. Ze koppelen die waarden aan hun gedrag op en naast het veld.',
    coachNote: 'Stel open vragen, geef geen antwoorden. Jouw rol is facilitator. Zorg dat iedere speler aan het woord komt. Noteer de meest genoemde waarden, dit wordt de basis van de cultuurafspraken. Valkuil: laat niet één luide speler de discussie domineren.',
    activities: [
      { title: 'Check-in: één woord', tijd: '5 min', desc: 'Vraag iedere speler: noem één woord dat jou als sporter typeert. Schrijf alle woorden op het bord. Zoek clusters.' },
      { title: 'Onze kernwaarden', tijd: '15 min', desc: 'Laat het team in duo\'s drie waarden kiezen die zij als team willen tonen. Plenaire uitwisseling: welke waarden komen het meest voor? Kies samen drie tot vijf teamwaarden.' },
      { title: 'Identiteitskaart invullen', tijd: '10 min', desc: 'Spelers vullen individueel de identiteitskaart in: als team zijn wij, we geloven in, we kiezen ervoor om.' },
    ],
    discussie: [
      'Waarom koos jij deze waarden?',
      'Hoe ziet een speler eruit die deze waarden elke dag leeft?',
      'Wat verandert er als iedereen dit doet?',
    ],
    afsluiting: 'Vat de drie tot vijf gekozen teamwaarden samen en schrijf ze op een groot vel. Vertel de groep: dit is wie wij zijn, dit wordt ons fundament voor de rest van het seizoen.',
    quote: '"Cultuur is niet één aspect van het spel, het is het spel."',
    quoteAuthor: 'Lou Gerstner, CEO IBM',
  },
  {
    num: 2, title: 'Ons teamcontract', subtitle: 'Afspraken maken die ertoe doen',
    doel: 'Je begeleidt het team bij het opstellen van concrete gedragsafspraken. Het teamcontract wordt door alle spelers ondertekend. Het vormt het referentiepunt voor de rest van het seizoen.',
    coachNote: 'Laat het team zelf de regels formuleren, eigenaarschap is cruciaal. Jouw rol: zorg dat afspraken specifiek en gedragsgericht zijn, niet vaag. "We respecteren elkaar" is te vaag. "We luisteren tot de coach klaar is met spreken" is concreet.',
    activities: [
      { title: 'Wat werkte, wat werkte niet?', tijd: '10 min', desc: 'Bespreek vorig seizoen, of de trainingen tot nu toe. Welk gedrag maakte het team sterker? Welk gedrag kostte energie of vertrouwen? Schrijf de antwoorden in twee kolommen op het bord.' },
      { title: 'Afspraken formuleren', tijd: '15 min', desc: 'Laat groepjes van drie elk twee afspraken formuleren op basis van de vorige stap. Plenair: selecteer samen de zes tot acht sterkste afspraken. Check: zijn ze specifiek genoeg?' },
      { title: 'Ondertekenen en committeren', tijd: '5 min', desc: 'Druk het contract af of schrijf het groot op. Iedereen, ook jij als coach, zet zijn handtekening. Bewaar het en hang het zichtbaar op. Valkuil: sla deze stap niet over, het tekenen maakt het concreet.' },
    ],
    discussie: [
      'Wat doe jij als iemand een afspraak niet nakomt?',
      'Hoe houd je elkaar verantwoordelijk zonder te straffen?',
      'Wat is jouw persoonlijke commitment aan dit contract?',
    ],
    afsluiting: 'Lees het volledige contract voor. Vraag iedere speler kort: wat is jouw persoonlijke toezegging? Sluit af met een teamritueel, een klap, een roep, een cirkel, iets dat van jullie is.',
    quote: '"Afspraken, geen regels. Een regel kan je breken. Een afspraak hou je samen na."',
    quoteAuthor: 'Atul Gawande',
  },
  {
    num: 3, title: 'Vertrouwen en veiligheid', subtitle: 'De basis van een sterk team',
    doel: 'Je creëert omstandigheden waarin spelers zich veilig voelen om fouten te maken, eerlijk te zijn en kwetsbaar te zijn. Psychologische veiligheid is de belangrijkste voorspeller van teamprestaties.',
    coachNote: 'Toon kwetsbaarheid zelf. Deel een moment waarop jij als coach een fout maakte en wat je ervan leerde. Als de coach dit kan, kunnen de spelers het ook. Wees alert op spelers die zwijgen, check ze individueel na de sessie.',
    activities: [
      { title: 'Vertrouwensmeter', tijd: '5 min', desc: 'Spelers geven anoniem op een papiertje een cijfer van 1 tot 10: hoe veilig voel ik mij in dit team om fouten te maken? Verzamel, bereken het gemiddelde, bespreek.' },
      { title: 'Fouten als leermomenten', tijd: '15 min', desc: 'Iedereen noemt in de groep één sportmoment waarop hij of zij een fout maakte en wat hij of zij leerde. Coach gaat als eerste. Nadruk: geen oordeel, geen gelach, alleen luisteren.' },
      { title: 'Vertrouwensafspraken toevoegen', tijd: '10 min', desc: 'Voeg twee afspraken toe aan het teamcontract die specifiek over veiligheid gaan. Bijvoorbeeld: we reageren niet negatief op fouten tijdens de training, en we bespreken problemen intern, niet via social media.' },
    ],
    discussie: [
      'Wanneer voelde jij je niet veilig in een team? Wat was het effect?',
      'Wat kun jij doen om het veiliger te maken voor anderen?',
      'Hoe reageert dit team als iemand een grote fout maakt in een wedstrijd?',
    ],
    afsluiting: 'Sluit af met een commitment-ronde: iedere speler zegt één ding dat hij of zij zal doen om het team veiliger te maken. Schrijf dit op het bord en fotografeer het.',
    quote: '"Kwetsbaarheid is geen zwakte. Het is de moed om jezelf te laten zien."',
    quoteAuthor: 'Brené Brown',
  },
  {
    num: 4, title: 'Conflict en herstel', subtitle: 'Moeilijke gesprekken voeren',
    doel: 'Je leert spelers hoe ze conflicten constructief aanpakken. Conflictvermijding verzwakt een team. Goed conflictmanagement maakt een team sterker. Spelers oefenen directe, respectvolle communicatie.',
    coachNote: 'Jouw rol tijdens conflicten: niet onmiddellijk oplossen, maar begeleiden. Geef ruimte aan beide kanten. Gebruik de ik-boodschap techniek: ik voel X als jij Y doet, ik vraag je om Z. Oefen dit zelf ook. Valkuil: kies geen kant voordat je beide versies hebt gehoord.',
    activities: [
      { title: 'Conflictstijlen herkennen', tijd: '10 min', desc: 'Bespreek vier conflictstijlen: vermijden, aanvallen, toegeven, samenwerken. Vraag: welke herken jij bij jezelf? Welke is het meest effectief voor het team? Antwoord: samenwerken.' },
      { title: 'Roleplay: moeilijk gesprek', tijd: '15 min', desc: 'Duo\'s spelen een scenario na: speler A is boos op speler B omdat hij altijd te laat komt. Gebruik de ik-boodschap structuur. Na drie minuten: wissel rollen en bespreek plenair wat werkte.' },
      { title: 'Herstelprotocol opstellen', tijd: '5 min', desc: 'Stel samen een kort herstelprotocol op. Wat doe je na een conflict? Eén: afkoelen, 24 uur. Twee: direct gesprek, geen derden. Drie: coach als bemiddelaar indien nodig. Vier: afspraak herstellen.' },
    ],
    discussie: [
      'Hoe los jij nu conflicten op binnen het team?',
      'Wat is het verschil tussen een conflict dat het team verzwakt en één dat het sterker maakt?',
      'Wanneer betrek je de coach erbij en wanneer los je het zelf op?',
    ],
    afsluiting: 'Hang het herstelprotocol op naast het teamcontract. Leg uit: conflicten zijn normaal, wat telt is hoe je ermee omgaat. Teams die conflicten goed verwerken, zijn de sterkste teams.',
    quote: '"Vrede is niet de afwezigheid van conflict. Het is de manier waarop je conflict op een vredevolle manier aanpakt."',
    quoteAuthor: 'Ronald Reagan',
  },
  {
    num: 5, title: 'Cultuur in actie', subtitle: 'Plannen voor het seizoen',
    doel: 'Je verankert de cultuurafspraken in de dagelijkse training en wedstrijdroutine. De cultuur wordt operationeel: spelers weten wat ze van zichzelf en elkaar mogen verwachten.',
    coachNote: 'Dit is de integratiesessie: breng alles samen. Verwijs naar sessies 1 tot 4 en laat spelers zien hoeveel ze al opgebouwd hebben. Jouw taak is nu zorgen dat de cultuur niet verwatert zodra het seizoen begint. Plan check-ins op vaste momenten.',
    activities: [
      { title: 'Cultuurterugblik', tijd: '10 min', desc: 'Laat spelers terugblikken op sessies 1 tot 4. Wat hebben we afgesproken? Wat hebben we geleerd over vertrouwen, conflict en identiteit? Maak een visuele samenvatting op het bord.' },
      { title: 'Cultuurmomenten inplannen', tijd: '10 min', desc: 'Plan samen concrete cultuurmomenten voor het seizoen. Bijvoorbeeld: maandelijkse check-in, een cultuurcaptain aanstellen, rituelen voor wedstrijddag. Schrijf dit op en zet het in de teamkalender.' },
      { title: 'Individueel commitment', tijd: '10 min', desc: 'Iedere speler schrijft op een kaartje: mijn bijdrage aan de cultuur dit seizoen is. Kaartjes worden bewaard door de coach en na twee maanden teruggegeven als herinnering.' },
    ],
    discussie: [
      'Wat neem jij mee uit deze preseason cultuurweek?',
      'Welke afspraak vind jij persoonlijk het moeilijkst om na te komen? Hoe pak jij dat aan?',
      'Hoe ziet ons team eruit over drie maanden als we dit echt naleven?',
    ],
    afsluiting: 'Sluit de preseason cultuurweek af met een krachtig moment: lees samen het teamcontract voor, iedereen staat recht, één hand in het midden. Dit is wie wij zijn. Win the person. Win the team.',
    quote: '"Kampioenen gedragen zich als kampioenen voordat ze kampioenen zijn."',
    quoteAuthor: 'Bill Walsh',
  },
];

const sessionsEN = [
  {
    num: 1, title: 'Our identity', subtitle: 'Who are we as a team?',
    doel: 'You help the team form a shared identity. Players name values that matter to them personally and as a team. They connect those values to their behavior on and off the court.',
    coachNote: 'Ask open questions, don\'t give answers. Your role is facilitator. Make sure every player gets to speak. Note the most frequently mentioned values, these become the foundation of the culture agreements. Pitfall: don\'t let one loud player dominate the discussion.',
    activities: [
      { title: 'Check-in: one word', tijd: '5 min', desc: 'Ask each player: name one word that describes you as an athlete. Write all words on the board. Look for clusters.' },
      { title: 'Our core values', tijd: '15 min', desc: 'Let the team work in pairs to choose three values they want to show as a team. Plenary exchange: which values come up most? Choose three to five team values together.' },
      { title: 'Fill in the identity card', tijd: '10 min', desc: 'Players individually complete the identity card: as a team we are, we believe in, we choose to.' },
    ],
    discussie: [
      'Why did you choose these values?',
      'What does a player look like who lives these values every day?',
      'What changes if everyone does this?',
    ],
    afsluiting: 'Summarize the three to five chosen team values and write them on a large sheet. Tell the group: this is who we are, this becomes our foundation for the rest of the season.',
    quote: '"Culture is not just one aspect of the game, it is the game."',
    quoteAuthor: 'Lou Gerstner, CEO IBM',
  },
  {
    num: 2, title: 'Our team contract', subtitle: 'Making agreements that matter',
    doel: 'You guide the team in creating concrete behavioral agreements. The team contract is signed by all players. It becomes the reference point for the rest of the season.',
    coachNote: 'Let the team formulate the rules themselves, ownership is crucial. Your role: make sure agreements are specific and behavior-oriented, not vague. "We respect each other" is too vague. "We listen until the coach finishes speaking" is concrete.',
    activities: [
      { title: 'What worked, what didn\'t?', tijd: '10 min', desc: 'Discuss last season, or training so far. What behavior made the team stronger? What behavior cost energy or trust? Write the answers in two columns on the board.' },
      { title: 'Formulating agreements', tijd: '15 min', desc: 'Groups of three each formulate two agreements based on the previous step. Plenary: select the six to eight strongest agreements together. Check: are they specific enough?' },
      { title: 'Sign and commit', tijd: '5 min', desc: 'Print or write out the contract. Everyone, including you as coach, signs it. Keep it and hang it visibly. Pitfall: don\'t skip this step, signing makes it concrete.' },
    ],
    discussie: [
      'What will you do if someone doesn\'t follow an agreement?',
      'How do you hold each other accountable without punishing?',
      'What is your personal commitment to this contract?',
    ],
    afsluiting: 'Read the full contract aloud. Ask each player briefly: what is your personal pledge? Close with a team ritual, a clap, a chant, a circle, something that is yours.',
    quote: '"Agreements, not rules. You can break a rule. You own an agreement."',
    quoteAuthor: 'Atul Gawande',
  },
  {
    num: 3, title: 'Trust and safety', subtitle: 'The foundation of a strong team',
    doel: 'You create conditions where players feel safe to make mistakes, be honest, and be vulnerable. Psychological safety is the strongest predictor of team performance.',
    coachNote: 'Show vulnerability yourself. Share a moment when you as a coach made a mistake and what you learned from it. If the coach can do this, so can the players. Watch for players who stay silent, check in with them individually after the session.',
    activities: [
      { title: 'Trust meter', tijd: '5 min', desc: 'Players anonymously write a number from 1 to 10 on a piece of paper: how safe do I feel in this team to make mistakes? Collect, calculate the average, discuss.' },
      { title: 'Mistakes as learning moments', tijd: '15 min', desc: 'Everyone shares in the group one sports moment when they made a mistake and what they learned. Coach goes first. Emphasis: no judgment, no laughter, only listening.' },
      { title: 'Adding trust agreements', tijd: '10 min', desc: 'Add two agreements to the team contract specifically about safety. For example: we don\'t respond negatively to mistakes during training, and we discuss problems internally, not on social media.' },
    ],
    discussie: [
      'When did you feel unsafe in a team? What was the effect?',
      'What can you do to make it safer for others?',
      'How does this team respond when someone makes a big mistake in a game?',
    ],
    afsluiting: 'Close with a commitment round: each player says one thing they will do to make the team safer. Write this on the board and photograph it.',
    quote: '"Vulnerability is not weakness. It is our greatest measure of courage."',
    quoteAuthor: 'Brené Brown',
  },
  {
    num: 4, title: 'Conflict and recovery', subtitle: 'Having difficult conversations',
    doel: 'You teach players how to handle conflicts constructively. Conflict avoidance weakens a team. Good conflict management makes a team stronger. Players practice direct, respectful communication.',
    coachNote: 'Your role during conflicts: don\'t solve it immediately, guide it instead. Give space to both sides. Use the I-message technique: I feel X when you do Y, I ask you to do Z. Practice this yourself too. Pitfall: don\'t pick a side before you\'ve heard both versions.',
    activities: [
      { title: 'Recognizing conflict styles', tijd: '10 min', desc: 'Discuss four conflict styles: avoiding, attacking, giving in, collaborating. Ask: which do you recognize in yourself? Which is most effective for the team? Answer: collaborating.' },
      { title: 'Roleplay: difficult conversation', tijd: '15 min', desc: 'Pairs act out a scenario: player A is upset with player B for always being late. Use the I-message structure. After three minutes: switch roles and discuss what worked.' },
      { title: 'Setting up a recovery protocol', tijd: '5 min', desc: 'Together set up a short recovery protocol. What do you do after a conflict? One: cool down, 24 hours. Two: direct conversation, no third parties. Three: coach as mediator if needed. Four: restore the agreement.' },
    ],
    discussie: [
      'How do you currently resolve conflicts within the team?',
      'What is the difference between a conflict that weakens the team and one that makes it stronger?',
      'When do you involve the coach and when do you solve it yourself?',
    ],
    afsluiting: 'Hang the recovery protocol next to the team contract. Explain: conflicts are normal, what matters is how you deal with them. Teams that process conflicts well are the strongest teams.',
    quote: '"Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means."',
    quoteAuthor: 'Ronald Reagan',
  },
  {
    num: 5, title: 'Culture in action', subtitle: 'Planning for the season',
    doel: 'You embed the culture agreements in daily training and match routines. The culture becomes operational: players know what they can expect from themselves and each other.',
    coachNote: 'This is the integration session: bring everything together. Reference sessions 1 to 4 and let players see how much they\'ve already built. Your job now is to make sure the culture doesn\'t fade once the season begins. Schedule check-ins at fixed moments.',
    activities: [
      { title: 'Culture review', tijd: '10 min', desc: 'Let players look back at sessions 1 to 4. What did we agree on? What did we learn about trust, conflict, and identity? Make a visual summary on the board.' },
      { title: 'Scheduling culture moments', tijd: '10 min', desc: 'Plan concrete culture moments for the season together. For example: a monthly check-in, appoint a culture captain, game day rituals. Write this down and put it in the team calendar.' },
      { title: 'Individual commitment', tijd: '10 min', desc: 'Each player writes on a card: my contribution to the culture this season is. Cards are kept by the coach and returned after two months as a reminder.' },
    ],
    discussie: [
      'What will you take away from this preseason culture week?',
      'Which agreement do you personally find hardest to keep? How will you approach that?',
      'What will our team look like in three months if we really live this?',
    ],
    afsluiting: 'Close the preseason culture week with a powerful moment: read the team contract together, everyone stands up, one hand in the middle. This is who we are. Win the person. Win the team.',
    quote: '"Champions behave like champions before they are champions."',
    quoteAuthor: 'Bill Walsh',
  },
];

function buildHtml(sessions, lang) {
  const isNL = lang === 'NL';
  const labelSession = isNL ? 'Sessie' : 'Session';
  const labelDoel = isNL ? 'DOELSTELLING COACH' : 'COACH OBJECTIVE';
  const labelCoachNote = isNL ? 'COACHNOTA' : 'COACH NOTE';
  const labelActiviteiten = isNL ? 'ACTIVITEITEN' : 'ACTIVITIES';
  const labelDiscussie = isNL ? 'DISCUSSIEVRAGEN' : 'DISCUSSION QUESTIONS';
  const labelAfsluiting = isNL ? 'AFSLUITING' : 'CLOSING';
  const labelNota = isNL ? 'NOTITIES' : 'NOTES';
  const badgeText = isNL ? 'Preseason · Coach' : 'Preseason · Coach';
  const pageLabel = isNL ? 'Pagina' : 'Page';

  return sessions.map((s, idx) => {
    const lines1 = Array.from({length: 8}, () => '<div class="note-line"></div>').join('');
    const lines2 = Array.from({length: 10}, () => '<div class="note-line"></div>').join('');

    return `
    <!-- SESSION ${s.num} PAGE 1 -->
    <div class="page">
      <div class="header">
        <div class="header-left">
          ${logo(48)}
          <div>
            <div class="wordmark">CHARACTER<span>First</span></div>
            <span class="badge">${badgeText}</span>
          </div>
        </div>
        <div class="session-label">${labelSession} ${s.num}/5<br>Preseason Cultuur</div>
      </div>
      <div class="divider"></div>
      <div class="title-block">
        <div class="eyebrow">${labelSession} ${s.num}: Coach</div>
        <div class="title">${s.title}</div>
        <div class="subtitle">${s.subtitle}</div>
      </div>

      <div class="objective-block">
        <div class="section-label">${labelDoel}</div>
        <p>${s.doel}</p>
      </div>

      <div class="coach-note">
        <div class="section-label">${labelCoachNote}</div>
        <p>${s.coachNote}</p>
      </div>

      <div class="section-label" style="margin-top:4px">${labelActiviteiten}</div>
      <div class="activities">
        ${s.activities.map((a, i) => `
        <div class="activity-card">
          <div class="activity-header">
            <div class="activity-num">${i + 1}</div>
            <div class="activity-title">${a.title}</div>
          </div>
          <div class="activity-meta">⏱ ${a.tijd}</div>
          <div class="activity-desc">${a.desc}</div>
        </div>`).join('')}
      </div>

      <div class="notes-area">
        <div class="section-label">${labelNota}</div>
        <div class="notes-lines">${lines1}</div>
      </div>

      <div class="footer">
        <div class="footer-left">characterfirst.be · info@characterfirst.be</div>
        <span class="credit">Created by Tom Pauwaert</span>
        <div class="footer-right">${pageLabel} 1/2 · ${labelSession} ${s.num}</div>
      </div>
    </div>

    <!-- SESSION ${s.num} PAGE 2 -->
    <div class="page">
      <div class="header">
        <div class="header-left">
          ${logo(48)}
          <div>
            <div class="wordmark">CHARACTER<span>First</span></div>
            <span class="badge">${badgeText}</span>
          </div>
        </div>
        <div class="session-label">${labelSession} ${s.num}/5<br>${s.title}</div>
      </div>
      <div class="divider"></div>

      <div class="discussion-block">
        <div class="section-label">${labelDiscussie}</div>
        <ul>
          ${s.discussie.map(q => `<li>${q}</li>`).join('')}
        </ul>
      </div>

      <div class="closing-block">
        <div class="section-label" style="border-color:var(--navy)">${labelAfsluiting}</div>
        <p>${s.afsluiting}</p>
      </div>

      <div class="section-label" style="margin-top:6px">${labelNota}</div>
      <div class="notes-area">
        <div class="notes-lines">${lines2}</div>
      </div>

      <div class="quote-block">
        <div class="quote-text">${s.quote}</div>
        <div class="quote-author">${s.quoteAuthor}</div>
      </div>

      <div class="footer">
        <div class="footer-left">characterfirst.be · info@characterfirst.be</div>
        <span class="credit">Created by Tom Pauwaert</span>
        <div class="footer-right">${pageLabel} 2/2 · ${labelSession} ${s.num}</div>
      </div>
    </div>`;
  }).join('\n');
}

async function generate(sessions, outDir, lang) {
  const browser = await chromium.launch();
  for (const s of sessions) {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <style>${CSS}</style></head><body>${buildHtml([s], lang)}</body></html>`;
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const suffix = lang === 'NL' ? 'NL' : 'EN';
    const fname = `CF_Cultuur_Coach_S${s.num}_${suffix}.pdf`;
    await page.pdf({
      path: path.join(outDir, fname),
      width: '210mm', height: '297mm',
      printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    await page.close();
    console.log(`${lang} S${s.num} → ${Math.round(fs.statSync(path.join(outDir, fname)).size / 1024)}KB`);
  }
  await browser.close();
}

(async () => {
  await generate(sessionsNL, OUT_NL, 'NL');
  await generate(sessionsEN, OUT_EN, 'EN');
  console.log('Done!');
})();
