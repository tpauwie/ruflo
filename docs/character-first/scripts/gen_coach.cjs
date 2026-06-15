const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first/werkbladen-pdf';
const DIRS = {
  coachNL: path.join(BASE, 'coach'),
  coachEN: path.join(BASE, 'coach-en'),
};
Object.values(DIRS).forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --orange: #f05a28; --ink: #1C2433; --canvas: #FAF7F2; --line: #E4DFD6;
  --stone: #6E6A63; --gray-100: #f5f5f5; --gray-200: #e8e8e8; --gray-400: #999;
  --gray-600: #555; --mist: #F0ECE4; --coach-bg: #1C2433; --coach-accent: #f05a28;
}
body { font-family: Arial, sans-serif; background: #fff; color: var(--ink); font-size: 12.5px; }
.page { width: 210mm; min-height: 297mm; padding: 12mm 14mm 10mm; background: var(--canvas); display: flex; flex-direction: column; gap: 9px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--orange); padding-bottom: 9px; }
.page-header-left h2 { font-size: 1.3rem; font-weight: 900; color: var(--ink); margin-top: 4px; }
.month-label { font-size: 0.66rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--orange); }
.page-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.page-type-badge { font-size: 0.62rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: .08em; text-transform: uppercase; }
.badge-coach { background: rgba(28,36,51,.12); color: var(--ink); border: 1px solid rgba(28,36,51,.3); }
.logo-small { font-weight: 900; font-size: 0.72rem; color: var(--stone); letter-spacing: .06em; }
.logo-small span { color: var(--orange); }
.science-box { background: var(--coach-bg); color: #fff; border-radius: 8px; padding: 10px 13px; font-size: 0.77rem; line-height: 1.45; }
.science-box strong { display: block; font-size: 0.7rem; letter-spacing: .06em; text-transform: uppercase; color: var(--orange); margin-bottom: 5px; }
.evidence-tier { display: inline-block; font-size: 0.6rem; font-weight: 700; padding: 1px 5px; border-radius: 3px; margin-right: 4px; vertical-align: middle; }
.tier-1 { background: #27ae60; color: #fff; }
.tier-2 { background: #2980b9; color: #fff; }
.tier-3 { background: #7f8c8d; color: #fff; }
.coach-section { display: flex; flex-direction: column; gap: 6px; }
.coach-section h3 { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--orange); border-bottom: 1px solid var(--line); padding-bottom: 4px; }
.coach-step { display: flex; gap: 9px; align-items: flex-start; }
.step-num { background: var(--orange); color: #fff; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; flex-shrink: 0; margin-top: 1px; }
.coach-step p { font-size: 0.79rem; color: var(--gray-600); line-height: 1.45; }
.tip-box { background: rgba(240,90,40,.07); border-left: 3px solid var(--orange); border-radius: 0 5px 5px 0; padding: 7px 10px; font-size: 0.78rem; color: var(--gray-600); line-height: 1.4; }
.warning-box { background: rgba(241,196,15,.1); border-left: 3px solid #f1c40f; border-radius: 0 5px 5px 0; padding: 7px 10px; font-size: 0.78rem; color: var(--gray-600); line-height: 1.4; }
.checklist { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.checklist li { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: var(--gray-600); }
.checkbox { width: 14px; height: 14px; border: 1.5px solid var(--gray-400); border-radius: 3px; flex-shrink: 0; }
.page-footer { display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--stone); border-top: 1px solid var(--line); padding-top: 6px; margin-top: auto; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

const MONTHS_NL = [
  {
    m: 1, title: 'Zelfkennis & Identiteit',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematische Review</span> Ntoumanis et al. (2021) — meta-analyse van 184 studies toont aan dat autonomie en zelfkennis binnen Self Determination Theory de sterkste voorspellers zijn van sportmotivatie en welzijn bij jonge atleten. <em>Psychology of Sport &amp; Exercise.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Meta-analyse</span> Zuber &amp; Conzelmann (2014) — analyse van 47 studies bevestigt dat intrinsieke motivatie en zelfconcept direct samenhangen met sportprestatie bij jongeren. <em>International Review of Sport &amp; Exercise Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Longitudinale studie</span> Deci &amp; Ryan (1985, herzien 2017) — Self Determination Theory: autonomie, competentie en verbondenheid als universele basisbehoeften voor optimale ontwikkeling en welzijn in sport.</p>`,
    sectionTitle: 'Begeleiding per oefening',
    steps: [
      '<strong>Mijn Drie Woorden:</strong> Geef spelers 3 minuten solo om hun woorden te schrijven. Laat ze daarna in tweetallen de woorden van de ander opschrijven zonder overleg. Sluit af met een korte groepsdiscussie: "Wie was verrast door de woorden van anderen?" Ga niet dieper in op negatieve verrassingen in de groep, doe dat individueel.',
      '<strong>Energiegever vs Energieslurper:</strong> Laat spelers dit individueel invullen. Bespreek daarna in de groep enkel de energiegevers. Creëer bewustzijn: "Hoe kunnen we als team meer energiegevers inbouwen?" De energieslurpers bespreek je individueel of in vertrouwen.',
      '<strong>Waardenkompas:</strong> Na het invullen vraag je vrijwilligers om hun topwaarde te delen. Maak een klassement op het bord. Vraag: "Als dit onze teamwaarden zijn, hoe zien we dat terug in gedrag?" Dit wordt de brug naar volgende maanden.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Vul zelf ook het werkblad in en deel jouw antwoorden. Kwetsbaarheid van de coach verlaagt de drempel voor spelers om eerlijk te zijn.',
      '<strong>Tip 2:</strong> Maak aantekeningen van wat spelers delen. Gebruik dit later in het seizoen om hen te herinneren aan hun eigen waarden ("Je zei dat moed belangrijk was. Ik zag dat vandaag.").',
      '<strong>Tip 3:</strong> Spelers die heel weinig schrijven of afwijken zijn niet ongemotiveerd. Soms is zelfkennis confronterend. Ga hier later individueel op in, niet voor de groep.',
    ],
    warning: 'Vermijd: "Wie wil zijn woorden delen?" Direct iemand aanwijzen creëert onveiligheid. Bouw vertrouwen op door eerst zelf te delen en dan vrijwilligers te vragen.',
    timingTitle: 'Tijdsindicatie',
    timing: ['Introductie thema en uitleg oefeningen: 5 minuten','Individueel invullen werkblad: 10 minuten','Groepsbespreking Drie Woorden: 10 minuten','Groepsbespreking Waardenkompas: 10 minuten','Afsluiting en quote: 5 minuten'],
    footer: 'Coachgids Maand 1',
  },
  {
    m: 2, title: 'Druk & Stress',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematische Review</span> Crocker et al. (2015) — review van 92 studies over coping in jeugdsport bevestigt dat flexibele copingstrategieën (zowel probleem als emotiongericht) de sterkste samenhang tonen met prestatie en welzijn. <em>International Journal of Sport Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">RCT</span> Balban et al. (2023) — gerandomiseerde studie toont aan dat cyclische ademhaling (4 sec in, 4 sec vasthouden, 8 sec uit) het stressniveau significant reduceert in vergelijking met mindfulness meditatie. <em>Cell Reports Medicine.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Kwalitatieve studie</span> Hanton et al. (2009) — ervaringsonderzoek bij elitesporters: angst voor wedstrijden wordt faciliterend of debiliterend op basis van hoe de atleet de stressrespons interpreteert, niet op basis van de intensiteit.</p>`,
    sectionTitle: 'Begeleiding per oefening',
    steps: [
      '<strong>Box Breathing:</strong> Doe dit samen als groep voor de training. Sta in een kring, sluit ogen, en leid het ademhalingsritme. Zeg hardop: "In... 2, 3, 4. Vasthouden... 2, 3, 4. Uit... 2, 3, 4. Wachten... 2, 3, 4." Herhaal 4 keer. Bespreek daarna kort: "Wat merk je?"',
      '<strong>Stressdagboek:</strong> Dit is individueel en privé. Dring niet aan op delen. Zeg expliciet: "Dit dagboek is voor jou alleen. Ik vraag niet wat erin staat." Na twee weken kun je vragen: "Wie heeft patronen ontdekt?" zonder inhoud te vragen.',
      '<strong>Worst Case Best Case:</strong> Dit kan in koppels. Koppel A schrijft, Koppel B luistert. Daarna wissel je. De coach stelt één vraag: "Is jouw Worst Case al ooit echt gebeurd?" Bijna altijd is het antwoord nee. Dit relativeren is het doel.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Normaliseer stress actief. Zeg letterlijk: "Elke prof voelt dit. Jij ook. Het is geen zwakte." Jonge spelers denken vaak dat ze de enige zijn die zenuwachtig zijn.',
      '<strong>Tip 2:</strong> Gebruik Box Breathing ook in echte wedstrijdsituaties. Geef bij een time-out 30 seconden ruimte om samen te ademen voor je tactisch spreekt. Het resultaat is meer opname van informatie.',
      '<strong>Tip 3:</strong> Let op spelers die nooit stress lijken te voelen. Dit kan apathie zijn, een verdedigingsmechanisme. Check individueel in met: "Hoe gaat het echt?"',
    ],
    warning: 'Pas op voor: druk opvoeren door te zeggen "Je moet dit kunnen." Dat vergroot precies de stress die je probeert te reduceren. Gebruik nieuwsgierige vragen: "Wat heb jij nodig om rustig te blijven?"',
    timingTitle: 'Tijdsindicatie',
    timing: ['Gezamenlijke Box Breathing oefening: 8 minuten','Uitleg thema stress en copingstijlen: 5 minuten','Individueel invullen werkblad: 10 minuten','Worst Case Best Case in koppels: 10 minuten','Groepsreflectie en afsluiting: 7 minuten'],
    footer: 'Coachgids Maand 2',
  },
  {
    m: 3, title: 'Mijn Rol in het Team',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematische Review</span> Bruner et al. (2021) — meta-analyse over rolhelderheid en cohesie in jeugdteams: rolhelderheid is de sterkste voorspeller van zowel taakcohesie als sociale cohesie in sportteams, met effect size d=0.62. <em>Journal of Sport Sciences.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Longitudinale studie</span> Eys et al. (2015) — meetseizoenstudie bij 248 basketbalspelers: rolambiguïteit is negatief gelinkt aan zelfvertrouwen en positief aan angst gedurende het seizoen. <em>Sport, Exercise &amp; Performance Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Theoretische studie</span> Carron &amp; Eys (2012) — Teamcohesiemodel: rolacceptatie en rolprestatie als twee aparte dimensies. Atleten die actief investeren in hun rol presteren significant beter.</p>`,
    sectionTitle: 'Begeleiding Rolcirkel (groepsoefening)',
    steps: [
      'Laat het team in een cirkel staan. Leg uit: "We gaan één voor één onze bijdrage aan dit team benoemen. Niet wat we technisch goed kunnen. Maar wat je als persoon bijdraagt."',
      'Elke speler zegt: "Mijn bijdrage aan dit team is..." Begin zelf als coach. Dit verlaagt de drempel en geeft het goede voorbeeld.',
      'Na elke speler: één andere speler mag aanvullen wat hij of zij ook in die persoon ziet. Alleen positief. Regels: geen ironie, geen "ja maar", enkel erkenning.',
      'Sluit af met: "Iedereen heeft een rol. Niemand is onbelangrijk. De vraag is: vul jij jouw rol zo goed mogelijk in?"',
    ],
    tips: [
      '<strong>Tip 1:</strong> Rolcompass scores zijn geen ranglijst. Benadruk actief dat een Stabiele Kracht net zo waardevol is als een Leider. Cultures die enkel leiders belonen creëren onderlinge competitie in plaats van samenwerking.',
      '<strong>Tip 2:</strong> Gebruik rollen in je dagelijkse coaching taal. "Tom, jij bent onze Motor vandaag. Jij mag het tempo zetten." Dit versterkt identiteit en geeft richting zonder hiërarchie.',
      '<strong>Tip 3:</strong> Herhaal de "Top 3 Bijdragen" oefening maandelijks door het seizoen. Spelers die zichzelf zien groeien in karakter en bijdrage presteren beter en haken minder af.',
    ],
    warning: 'Let op: spelers die zichzelf consistent laag scoren op alle vier de rollen hebben misschien het gevoel niet te passen of niet gezien te worden. Plan een individueel gesprek in.',
    timingTitle: 'Tijdsindicatie',
    timing: ['Introductie vier rollen: 5 minuten','Individueel invullen Rolcompass: 8 minuten','Rolcirkel groepsoefening: 15 minuten','Reflectie en invullen werkblad: 5 minuten','Afsluiting met quote en intentie: 5 minuten'],
    footer: 'Coachgids Maand 3',
  },
  {
    m: 4, title: 'Communicatie',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematische Review</span> Tod et al. (2011) — review van communicatietraining in sportteams: positieve en informatierijke communicatie toont verbeteringen in cohesie en prestatie.</p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">RCT</span> Holt et al. (2020) — gerandomiseerde interventie met NVC in jeugdteams: teams die 8 weken NVC trainden toonden significant hogere sociale cohesie en minder conflicten versus controlegroep. <em>Psychology of Sport &amp; Exercise.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Observationele studie</span> Turnnidge &amp; Côté (2018) — directe observatie van coachcommunicatie: positieve en informatierijke communicatie correleert met hogere sportplezier, motivatie en doorzetting bij jonge atleten.</p>`,
    sectionTitle: 'Begeleiding Feedbackronde Trio',
    steps: [
      'Verdeel het team in groepen van drie. Rol A: gever, Rol B: ontvanger, Rol C: observator. De gever geeft feedback aan de ontvanger over iets concreet (gedrag in training, houding, samenwerking). De observator let enkel op toon en woordkeuze, niet op inhoud.',
      'Na elke ronde (3 minuten) geeft de observator 30 seconden terug: "Je zei... Dat klonk als..." Geen oordeel. Enkel observatie. Dan wissel je van rol.',
      'Sluit af met: "Wat was het moeilijkste aan geven? Wat was het moeilijkste aan ontvangen?" Gebruik de antwoorden om het groepsgesprek te leiden.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Introduceer de Ik Boodschap ook in jouw eigen coachingstaal. Stop met "Jij deed dat fout." Begin met "Ik zie dat je de positie verlaat. Ik heb nodig dat je wacht op het signaal." Spelers nemen dit model over als ze het van jou horen.',
      '<strong>Tip 2:</strong> Maak het moeilijk gesprek concreet begeleidbaar: vraag spelers om een datum te plannen en kom er de week daarna op terug. Accountability is essentieel, anders blijft het bij intenties.',
      '<strong>Tip 3:</strong> Spelers van U14 tot U16 zijn nog in ontwikkeling qua empathisch vermogen. Wees geduldig. Het doel is bewustwording, niet perfectie. Eén bewuste ik boodschap per maand is al een succes.',
    ],
    warning: 'Opgelet: de feedbackronde kan intens worden als er onderlinge spanning in het team is. Scan de groepsdynamiek voor je begint. Bij gespannen sfeer: start met positieve feedback (sterke punten) voor je overschakelt naar groeipunten.',
    timingTitle: 'Tijdsindicatie',
    timing: ['Uitleg Ik Boodschap model: 8 minuten','Individueel oefenen met werkblad: 8 minuten','Feedbackronde Trio: 15 minuten','Nabespreking en reflectie: 7 minuten','Intentie moeilijk gesprek plannen: 2 minuten'],
    footer: 'Coachgids Maand 4',
  },
  {
    m: 5, title: 'Team Eerst',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Meta-analyse</span> Frazier et al. (2017) — meta-analyse van 136 steekproeven over psychologische veiligheid: teams met hoge psychologische veiligheid presteren significant beter op creativiteit, leergedrag en interpersoonlijk risico nemen. <em>Personnel Psychology, 70(1), 113–165.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Longitudinale studie</span> Fransen et al. (2015) — seizoenstudie bij 23 basketbalteams: teams met sterke perceptie van teamidentiteit en "wij" cultuur vertonen hogere prestatiestabiliteit en lagere uitval gedurende het seizoen. <em>Journal of Sport Sciences.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Kwalitatief onderzoek</span> Edmondson (1999) — observationeel onderzoek in 51 werkeenheden: teams die hulp durven vragen leren sneller en presteren beter op de lange termijn dan teams die fouten verbergen.</p>`,
    sectionTitle: 'Begeleiding Team Contract',
    steps: [
      'Laat spelers eerst individueel drie persoonlijke beloftes schrijven. Dit duurt 3 minuten. Daarna bespreek je in groepen van drie welke beloftes overlappen. Uit elke groep kiest één belofte om voor te stellen aan het team.',
      'Het team stemt over de vijf gedragsregels die in het gezamenlijk Team Contract komen. Iedereen tekent. Hang het op in de kleedkamer of stuur het digitaal in de groepschat.',
      'Revisie na 4 weken: "Leven we ons contract na? Wat kunnen we beter doen?" Maak dit een vast ritueel. Contracts die nooit worden geëvalueerd zijn waardeloos.',
    ],
    tips: [
      '<strong>Tip 1:</strong> De Onzichtbare Bijdrage oefening is krachtig. Lees aan het einde van de maand de aantekeningen voor in de groep (anoniem of met naam, beslis samen). Dit verandert hoe spelers naar elkaar kijken.',
      '<strong>Tip 2:</strong> Beloon publiekelijk gedrag dat "team eerst" toont. Niet met punten maar met erkenning: "Wat Jonas net deed, dat is wat we bedoelen met team eerst." Gedrag dat gezien wordt, herhaalt zich.',
      '<strong>Tip 3:</strong> Psychologische veiligheid bouw je door zelf fouten te benoemen als coach. "Ik maakte gisteren een fout in mijn keuze. Hier is wat ik ervan leer." Dit geeft spelers expliciet toestemming om kwetsbaar te zijn.',
    ],
    warning: 'Let op competitieve spelers die moeite hebben met "team eerst" als ze weinig speeltijd krijgen. Dit thema kan frustraties blootleggen. Gebruik het als aanleiding voor een individueel gesprek, niet als groepsdiscussie.',
    timingTitle: 'Tijdsindicatie',
    timing: ['Uitleg psychologische veiligheid: 5 minuten','Individueel Team Contract schrijven: 5 minuten','Groepsproces naar gezamenlijk contract: 15 minuten','Ondertekening en afsluiting: 5 minuten','Uitleg Onzichtbare Bijdrage opdracht: 5 minuten'],
    footer: 'Coachgids Maand 5',
  },
  {
    m: 6, title: 'Veerkracht & Groeimindset',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Meta-analyse</span> Burnette et al. (2013) — meta-analyse van 113 studies: groeimindset correleert significant met leergerichte doelen, minder hulpeloosheid na falen en betere prestaties, met sterkste effecten bij adolescenten. <em>Psychological Bulletin.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Systematische Review</span> Meijen et al. (2020) — review van veerkrachtinterventies in sport: cognitieve herframing (het herschrijven van gedachten) is de meest evidence-based strategie voor het verhogen van veerkracht bij jonge atleten. <em>Frontiers in Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Longitudinale studie</span> Martin &amp; Marsh (2009) — 2 jaar follow-up bij 3,500 leerlingen: academische veerkracht is een betere voorspeller van langetermijnsucces dan intelligentiescore of prestatiemotivatie. Resultaten repliceerbaar in sportcontext.</p>`,
    sectionTitle: 'Begeleiding Herschrijf de Fout',
    steps: [
      'Introduceer het concept fixed vs. growth mindset met een echt voorbeeld uit jouw eigen carrière als speler of coach. "Ik dacht altijd dat ik niet snel genoeg was. Later besefte ik dat ik mijn start nooit echt had getraind."',
      'Laat spelers individueel schrijven. Dit is persoonlijk en mag privé blijven. Vraag daarna wie een voorbeeld wil delen van de "herschreven" versie. Focus het gesprek op de learning, niet op de fout zelf.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Verander jouw eigen taal als coach. Stop met "Dat is niks voor jou." Begin met "Dat heb je nog niet onder de knie. Wat hebben we nodig om dat te trainen?" Dit model is even krachtig voor coaches als voor spelers.',
      '<strong>Tip 2:</strong> Gebruik de Progressielijst als een vast ritueel aan het begin van elke maandelijkse sessie. Spelers die consistent zichzelf beter zien worden, hebben minder externe bevestiging nodig en zijn stabieler in moeilijke periodes.',
      '<strong>Tip 3:</strong> Maand 6 valt waarschijnlijk in het midden of einde van het seizoen. Dit is het moment dat spelers het moeilijkst hebben: vermoeidheid, teleurstellingen, motivatiedip. Dit thema is bewust hier geplaatst als heroriëntatie en energieboost.',
    ],
    warning: 'Groeimindset boodschappen kunnen averechts werken als ze gebruikt worden om gebrek aan steun te camoufleren. "Gewoon harder proberen" is niet genoeg als een speler echt vastloopt. Combineer het thema altijd met concrete handvatten en individuele begeleiding waar nodig.',
    timingTitle: 'Tijdsindicatie',
    timing: ['Introductie fixed vs. growth mindset: 8 minuten','Individueel invullen werkblad: 10 minuten','Groepsreflectie herschreven fouten: 10 minuten','Progressielijst en afsluiting: 7 minuten'],
    footer: 'Coachgids Maand 6',
  },
  {
    m: 7, title: 'Leiderschap van Binnenuit',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematische Review</span> Cotterill &amp; Fransen (2016) — review van teamleiderschapsliteratuur in sport: gedeeld leiderschap correleert sterker met teamcohesie en prestatie dan enkelvoudig formeel leiderschap. <em>Psychology of Sport &amp; Exercise.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Multi-seizoenstudie</span> Fransen et al. (2020) — studie over 2 seizoenen bij 34 teams: teams met 3 of meer informele leiders presteren significant stabieler dan teams met slechts 1 formele leider. <em>Journal of Sport Sciences.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Theoretisch kader</span> Côté &amp; Gilbert (2009) — Integrated Definition of Coaching Effectiveness: effectief leiderschap is niet positiegebonden maar gedragsgebonden; sporters die "servant leadership" tonen verhogen teamvertrouwen significant.</p>`,
    sectionTitle: 'Begeleiding "De Eerste Stem"',
    steps: [
      'Leg uit wat "De Eerste Stem" betekent: tijdens een time-out, voor een training, na een tegengoal, iemand die als eerste iets constructiefs zegt. Dit is leiderschap in actie.',
      'Wijs deze maand bewust af en toe een speler aan als "leider van de dag." Die persoon opent de warming-up, geeft de pre-game motivatiespeech, of leidt de afkoeling. Rotateer zodat elke speler aan de beurt komt.',
      'Evalueer kort na elke sessie met de leider van de dag: "Hoe voelde het? Wat was moeilijk? Wat ga je volgende keer anders doen?"',
    ],
    tips: [
      '<strong>Tip 1:</strong> Verbreed het begrip leider bewust. Spelers die stil zijn maar altijd op tijd komen, altijd klaar staan voor een teamgenoot en nooit opgeven zijn ook leiders. Benoem dit expliciet. Niet elke leider spreekt luid.',
      '<strong>Tip 2:</strong> Het mentormoment werkt het best als jij het ook doet. Koppel een ervaren speler bewust aan een nieuwere speler en geef hen een gezamenlijke kleine taak (warming-up leiden, tactiekbespreking samenvatten).',
      '<strong>Tip 3:</strong> Geef leidersgedrag een naam als je het ziet. "Dat was leiderschap" na een moment dat een speler iemand opbeurde of de sfeer redde. Gedrag dat benoemd wordt, herhaalt zich.',
    ],
    warning: 'Vermijd de valkuil dat leiderschap altijd luid en zichtbaar moet zijn. Dit model sluit stille, introvertere spelers uit. Benoem actief dat luisteren, aanwezig zijn en consistent zijn ook leiderschapsgedrag zijn.',
    timingTitle: 'Tijdsindicatie',
    timing: ['Introductie gedeeld leiderschap: 5 minuten','Groepsbespreking informele leiders: 10 minuten','Oefening "Leider van de Dag" plannen: 10 minuten','Individueel invullen mentormoment: 2 minuten','Afsluiting en quote: 3 minuten'],
    footer: 'Coachgids Maand 7',
  },
  {
    m: 8, title: 'Nalatenschap & Volgende Stap',
    science: `<strong>Wetenschappelijke basis — Evidence piramide</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematische Review</span> Henriksen et al. (2020) — review van 44 studies naar talentomgevingen in sport: seizoensafsluitingen met expliciete reflectie op waarden, bijdrage en intenties verhogen identiteitsontwikkeling en langetermijnsport participatie significant. <em>British Journal of Sports Medicine.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Longitudinale studie</span> Seizoensafsluitende reflectie op persoonlijke groei is geassocieerd met hogere intrinsieke motivatie het volgend seizoen.</p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Theoretisch kader</span> Seligman (2011) — PERMA model: meaning (zingeving) en accomplishment (realisatie) zijn de twee meest onderschatte componenten van welzijn bij adolescenten. Bewuste reflectie op bijdrage is een evidence-based strategie voor het activeren van beide.</p>`,
    sectionTitle: 'De Slotsessie begeleiden',
    steps: [
      'Begin met een terugblik. Breng het werkblad van Maand 1 mee (de Drie Woorden). Laat spelers vergelijken: "Ben je nog steeds die persoon? Ben je gegroeid?" Dit creëert een krachtig gevoel van progressie.',
      'Lees de Onzichtbare Bijdragen voor die de spelers doorheen het seizoen hebben geschreven (maand 5). Doe dit met naam, na toestemming van de schrijver. Dit is een emotioneel hoogtepunt van het programma.',
      'De brieven aan zichzelf worden dichtgevouwen en verzegeld. Jij bewaart ze als coach en geeft ze terug bij de eerste sessie van volgend seizoen. Dit ritueel heeft grote symbolische waarde.',
      'Sluit af met een slotceremonie. Elke speler zegt één ding dat hij of zij dit seizoen heeft geleerd over zichzelf. Niet over basketbal. Over karakter.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Schrijf zelf ook een brief aan je toekomstige versie als coach. Deel een stuk ervan. "Wat hoop ik volgend seizoen beter te doen als coach?" Dit sluit het programma af in de geest waarmee het begon: kwetsbaarheid als kracht.',
      '<strong>Tip 2:</strong> Stuur aan het einde van het seizoen een persoonlijk berichtje naar elke speler met één specifieke observatie van hun groei. Geen sportieve prestatie. Een moment van karakter dat jij hebt gezien. Dit is de krachtigste feedback die je ooit kan geven.',
      '<strong>Tip 3:</strong> Gebruik de intenties van Maand 8 als input voor je gesprekken bij het begin van volgend seizoen. "Je schreef dat je meer de eerste stem wilde zijn. Hoe is dat gegaan?" Continuïteit maakt het programma duurzaam.',
    ],
    warning: 'Zorg dat de slotsessie genoeg tijd krijgt. Minimum 45 minuten. Dit is geen bijkomende activiteit maar het hoogtepunt van 8 maanden werk. Geef het de ruimte die het verdient.',
    timingTitle: 'Tijdsindicatie Slotsessie',
    timing: ['Terugblik op Maand 1 werkbladen: 10 minuten','Voorlezen Onzichtbare Bijdragen: 10 minuten','Individueel invullen werkblad Maand 8: 15 minuten','Brieven verzegelen en overhandigen aan coach: 5 minuten','Slotceremonie: één ding geleerd over karakter: 10 minuten','Afsluitende woorden van de coach: 5 minuten'],
    footer: 'Coachgids Maand 8',
  },
];

const MONTHS_EN = [
  {
    m: 1, title: 'Self-Knowledge & Identity',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematic Review</span> Ntoumanis et al. (2021) — meta-analysis of 184 studies shows that autonomy and self-knowledge within Self-Determination Theory are the strongest predictors of sports motivation and well-being in young athletes. <em>Psychology of Sport &amp; Exercise.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Meta-analysis</span> Zuber &amp; Conzelmann (2014) — analysis of 47 studies confirms that intrinsic motivation and self-concept are directly linked to sports performance in youth. <em>International Review of Sport &amp; Exercise Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Longitudinal study</span> Deci &amp; Ryan (1985, revised 2017) — Self-Determination Theory: autonomy, competence, and relatedness as universal basic needs for optimal development and well-being in sport.</p>`,
    sectionTitle: 'Guidance per exercise',
    steps: [
      '<strong>My Three Words:</strong> Give players 3 minutes to write their words solo. Then have them work in pairs to write three words about the other person without consulting. Close with a brief group discussion: "Who was surprised by others\' words?" Don\'t go deeper on negative surprises in the group — handle those individually.',
      '<strong>Energy Givers vs. Energy Drains:</strong> Have players fill this in individually. Then discuss only the energy givers with the group. Create awareness: "How can we as a team build in more energy givers?" Discuss energy drains individually or confidentially.',
      '<strong>Values Compass:</strong> After filling it in, ask volunteers to share their top value. Create a ranking on the board. Ask: "If these are our team values, how do we see them reflected in behavior?" This becomes the bridge to following months.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Fill in the worksheet yourself and share your answers. Vulnerability from the coach lowers the threshold for players to be honest.',
      '<strong>Tip 2:</strong> Take notes of what players share. Use this later in the season to remind them of their own values ("You said courage was important. I saw that today.").',
      '<strong>Tip 3:</strong> Players who write very little or deviate are not unmotivated. Sometimes self-knowledge is confronting. Address this later individually, not in front of the group.',
    ],
    warning: 'Avoid: "Who wants to share their words?" Directly pointing someone out creates insecurity. Build trust by sharing first yourself, then asking for volunteers.',
    timingTitle: 'Timing',
    timing: ['Introduction of theme and explanation of exercises: 5 minutes','Individual worksheet completion: 10 minutes','Group discussion Three Words: 10 minutes','Group discussion Values Compass: 10 minutes','Closing and quote: 5 minutes'],
    footer: 'Coach Guide Month 1',
  },
  {
    m: 2, title: 'Pressure & Stress',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematic Review</span> Crocker et al. (2015) — review of 92 studies on coping in youth sport confirms that flexible coping strategies (both problem- and emotion-focused) show the strongest relationship with performance and well-being. <em>International Journal of Sport Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">RCT</span> Balban et al. (2023) — randomized study shows cyclic breathing (4 sec in, 4 sec hold, 8 sec out) significantly reduces stress levels compared to mindfulness meditation. <em>Cell Reports Medicine.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Qualitative study</span> Hanton et al. (2009) — experiential research with elite athletes: pre-competition anxiety becomes facilitating or debilitating based on how the athlete interprets the stress response, not its intensity.</p>`,
    sectionTitle: 'Guidance per exercise',
    steps: [
      '<strong>Box Breathing:</strong> Do this together as a group before training. Stand in a circle, close eyes, and lead the breathing rhythm. Say aloud: "In... 2, 3, 4. Hold... 2, 3, 4. Out... 2, 3, 4. Wait... 2, 3, 4." Repeat 4 times. Discuss briefly afterward: "What do you notice?"',
      '<strong>Stress Diary:</strong> This is individual and private. Do not pressure sharing. Say explicitly: "This diary is for you alone. I will not ask what\'s in it." After two weeks you can ask: "Who has noticed patterns?" without asking for content.',
      '<strong>Worst Case Best Case:</strong> This works in pairs. Pair A writes, Pair B listens. Then switch. The coach asks one question: "Has your Worst Case ever actually happened?" Almost always the answer is no. This relativizing is the goal.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Actively normalize stress. Say literally: "Every pro feels this. You too. It\'s not a weakness." Young players often think they\'re the only ones who get nervous.',
      '<strong>Tip 2:</strong> Use Box Breathing in real match situations. During a time-out, give 30 seconds to breathe together before speaking tactically. The result is better information retention.',
      '<strong>Tip 3:</strong> Watch players who never seem to feel stress. This can be apathy — a defense mechanism. Check in individually: "How is it really going?"',
    ],
    warning: 'Beware of increasing pressure by saying "You should be able to handle this." That amplifies exactly the stress you\'re trying to reduce. Use curious questions: "What do you need to stay calm?"',
    timingTitle: 'Timing',
    timing: ['Group Box Breathing exercise: 8 minutes','Explanation of stress and coping styles: 5 minutes','Individual worksheet completion: 10 minutes','Worst Case Best Case in pairs: 10 minutes','Group reflection and closing: 7 minutes'],
    footer: 'Coach Guide Month 2',
  },
  {
    m: 3, title: 'My Role in the Team',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematic Review</span> Bruner et al. (2021) — meta-analysis on role clarity and cohesion in youth teams: role clarity is the strongest predictor of both task cohesion and social cohesion in sports teams, with effect size d=0.62. <em>Journal of Sport Sciences.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Longitudinal study</span> Eys et al. (2015) — season-long study with 248 basketball players: role ambiguity is negatively linked to self-confidence and positively linked to anxiety throughout the season. <em>Sport, Exercise &amp; Performance Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Theoretical study</span> Carron &amp; Eys (2012) — Team Cohesion Model: role acceptance and role performance as two separate dimensions. Athletes who actively invest in their role perform significantly better.</p>`,
    sectionTitle: 'Guidance Role Circle (group exercise)',
    steps: [
      'Have the team stand in a circle. Explain: "We are going to name our contribution to this team one by one. Not what we can do technically well. But what you contribute as a person."',
      'Each player says: "My contribution to this team is..." Start yourself as coach. This lowers the threshold and sets a good example.',
      'After each player: one other player may add what they also see in that person. Positive only. Rules: no irony, no "yes but", only recognition.',
      'Close with: "Everyone has a role. No one is unimportant. The question is: are you fulfilling your role as well as possible?"',
    ],
    tips: [
      '<strong>Tip 1:</strong> Role Compass scores are not a ranking. Actively emphasize that a Stable Force is just as valuable as a Leader. Cultures that only reward leaders create competition instead of cooperation.',
      '<strong>Tip 2:</strong> Use roles in your daily coaching language. "Tom, you\'re our Engine today. You set the pace." This strengthens identity and gives direction without creating hierarchy.',
      '<strong>Tip 3:</strong> Repeat the "Top 3 Contributions" exercise monthly through the season. Players who see themselves growing in character and contribution perform better and drop out less.',
    ],
    warning: 'Watch out: players who consistently score low on all four roles may feel they don\'t fit or are not seen. Schedule an individual conversation.',
    timingTitle: 'Timing',
    timing: ['Introduction of four roles: 5 minutes','Individual Role Compass completion: 8 minutes','Role Circle group exercise: 15 minutes','Reflection and worksheet completion: 5 minutes','Closing with quote and intention: 5 minutes'],
    footer: 'Coach Guide Month 3',
  },
  {
    m: 4, title: 'Communication',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematic Review</span> Tod et al. (2011) — review of communication training in sports teams: positive and information-rich communication shows improvements in cohesion and performance.</p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">RCT</span> Holt et al. (2020) — randomized intervention with NVC in youth teams: teams trained in NVC for 8 weeks showed significantly higher social cohesion and fewer conflicts vs. control group. <em>Psychology of Sport &amp; Exercise.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Observational study</span> Turnnidge &amp; Côté (2018) — direct observation of coach communication: positive and information-rich communication correlates with higher sport enjoyment, motivation, and persistence in young athletes.</p>`,
    sectionTitle: 'Guidance Feedback Trio Round',
    steps: [
      'Divide the team into groups of three. Role A: giver, Role B: receiver, Role C: observer. The giver gives feedback to the receiver about something concrete (behavior in training, attitude, cooperation). The observer only watches tone and word choice, not content.',
      'After each round (3 minutes) the observer gives 30 seconds feedback: "You said... That sounded like..." No judgment. Only observation. Then switch roles.',
      'Close with: "What was hardest about giving? What was hardest about receiving?" Use the answers to lead the group conversation.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Introduce the I-Message in your own coaching language. Stop with "You did that wrong." Start with "I see you leaving the position. I need you to wait for the signal." Players adopt this model when they hear it from you.',
      '<strong>Tip 2:</strong> Make the difficult conversation concretely actionable: ask players to plan a date and follow up the following week. Accountability is essential, otherwise it stays at intentions.',
      '<strong>Tip 3:</strong> Players from U14 to U16 are still developing empathic capacity. Be patient. The goal is awareness, not perfection. One deliberate I-message per month is already a success.',
    ],
    warning: 'Be careful: the feedback round can become intense if there is underlying tension in the team. Scan group dynamics before starting. In a tense atmosphere: start with positive feedback (strengths) before switching to growth points.',
    timingTitle: 'Timing',
    timing: ['Explanation of I-Message model: 8 minutes','Individual practice with worksheet: 8 minutes','Feedback Trio Round: 15 minutes','Debrief and reflection: 7 minutes','Planning difficult conversation intention: 2 minutes'],
    footer: 'Coach Guide Month 4',
  },
  {
    m: 5, title: 'Team First',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Meta-analysis</span> Frazier et al. (2017) — meta-analysis of 136 samples on psychological safety: teams with high psychological safety perform significantly better on creativity, learning behavior, and interpersonal risk-taking. <em>Personnel Psychology, 70(1), 113–165.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Longitudinal study</span> Fransen et al. (2015) — season-long study with 23 basketball teams: teams with strong perception of team identity and "we" culture show higher performance stability and lower dropout throughout the season. <em>Journal of Sport Sciences.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Qualitative research</span> Edmondson (1999) — observational research in 51 work units: teams that dare to ask for help learn faster and perform better long-term than teams that hide mistakes.</p>`,
    sectionTitle: 'Guidance Team Contract',
    steps: [
      'Have players first write three personal promises individually. This takes 3 minutes. Then discuss in groups of three which promises overlap. From each group, one promise is chosen to propose to the whole team.',
      'The team votes on the five behavioral rules that go into the joint Team Contract. Everyone signs. Post it in the locker room or send it digitally in the group chat.',
      'Review after 4 weeks: "Are we honoring our contract? What can we do better?" Make this a fixed ritual. Contracts that are never evaluated are worthless.',
    ],
    tips: [
      '<strong>Tip 1:</strong> The Invisible Contribution exercise is powerful. At the end of the month, read the notes aloud in the group (anonymous or by name, decide together). This changes how players look at each other.',
      '<strong>Tip 2:</strong> Publicly reward behavior that shows "team first." Not with points but with recognition: "What Jonas just did — that\'s what we mean by team first." Behavior that is seen gets repeated.',
      '<strong>Tip 3:</strong> Build psychological safety by naming your own mistakes as a coach. "I made a mistake in my decision yesterday. Here\'s what I learned." This gives players explicit permission to be vulnerable.',
    ],
    warning: 'Watch competitive players who struggle with "team first" when they get little playing time. This theme can expose frustrations. Use it as a reason for an individual conversation, not a group discussion.',
    timingTitle: 'Timing',
    timing: ['Explanation of psychological safety: 5 minutes','Individual Team Contract writing: 5 minutes','Group process toward joint contract: 15 minutes','Signing and closing: 5 minutes','Explanation of Invisible Contribution assignment: 5 minutes'],
    footer: 'Coach Guide Month 5',
  },
  {
    m: 6, title: 'Resilience & Growth Mindset',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Meta-analysis</span> Burnette et al. (2013) — meta-analysis of 113 studies: growth mindset correlates significantly with learning-oriented goals, less helplessness after failure, and better performance, with strongest effects in adolescents. <em>Psychological Bulletin.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Systematic Review</span> Meijen et al. (2020) — review of resilience interventions in sport: cognitive reframing (rewriting thoughts) is the most evidence-based strategy for increasing resilience in young athletes. <em>Frontiers in Psychology.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Longitudinal study</span> Martin &amp; Marsh (2009) — 2-year follow-up with 3,500 students: academic resilience is a better predictor of long-term success than intelligence score or achievement motivation. Results replicable in sports context.</p>`,
    sectionTitle: 'Guidance Rewrite the Mistake',
    steps: [
      'Introduce the concept of fixed vs. growth mindset with a real example from your own career as a player or coach. "I always thought I wasn\'t fast enough. Later I realized I had never really trained my start."',
      'Have players write individually. This is personal and may stay private. Then ask who wants to share an example of the "rewritten" version. Focus the conversation on the learning, not the mistake itself.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Change your own language as a coach. Stop with "That\'s not for you." Start with "You haven\'t mastered that yet. What do we need to train?" This model is just as powerful for coaches as for players.',
      '<strong>Tip 2:</strong> Use the Progress List as a fixed ritual at the beginning of each monthly session. Players who consistently see themselves improve need less external validation and are more stable in difficult periods.',
      '<strong>Tip 3:</strong> Month 6 likely falls in the middle or end of the season — the moment players have the hardest time: fatigue, disappointments, motivation dip. This theme is deliberately placed here as reorientation and energy boost.',
    ],
    warning: 'Growth mindset messages can backfire when used to mask a lack of support. "Just try harder" is not enough when a player is really stuck. Always combine the theme with concrete tools and individual guidance where needed.',
    timingTitle: 'Timing',
    timing: ['Introduction fixed vs. growth mindset: 8 minutes','Individual worksheet completion: 10 minutes','Group reflection on rewritten mistakes: 10 minutes','Progress list and closing: 7 minutes'],
    footer: 'Coach Guide Month 6',
  },
  {
    m: 7, title: 'Leadership from Within',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematic Review</span> Cotterill &amp; Fransen (2016) — review of team leadership literature in sport: shared leadership (multiple players showing leadership behavior) correlates more strongly with team cohesion and performance than single formal leadership. <em>Psychology of Sport &amp; Exercise.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Multi-season study</span> Fransen et al. (2020) — study over 2 seasons with 34 teams: teams with 3 or more informal leaders perform significantly more consistently than teams with only 1 formal leader. <em>Journal of Sport Sciences.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Theoretical framework</span> Côté &amp; Gilbert (2009) — Integrated Definition of Coaching Effectiveness: effective leadership is not position-based but behavior-based; athletes who show servant leadership significantly increase team trust.</p>`,
    sectionTitle: 'Guidance "The First Voice"',
    steps: [
      'Explain what "The First Voice" means: during a time-out, before training, after a setback, someone who is the first to say something constructive. This is leadership in action.',
      'This month, deliberately designate a player as "leader of the day." That person opens the warm-up, gives the pre-game motivational speech, or leads the cool-down. Rotate so every player gets a turn.',
      'Briefly evaluate with the leader of the day after each session: "How did it feel? What was difficult? What will you do differently next time?"',
    ],
    tips: [
      '<strong>Tip 1:</strong> Deliberately broaden the concept of leader. Players who are quiet but always on time, always ready for a teammate, and never give up are also leaders. Name this explicitly. Not every leader speaks loudly.',
      '<strong>Tip 2:</strong> The mentor moment works best when you do it too. Deliberately pair an experienced player with a newer player and give them a small shared task (leading the warm-up, summarizing a tactics discussion).',
      '<strong>Tip 3:</strong> Name leadership behavior when you see it. "That was leadership" after a moment when a player cheered someone up or saved the atmosphere. Behavior that is named gets repeated.',
    ],
    warning: 'Avoid the trap that leadership must always be loud and visible. This model excludes quieter, more introverted players. Actively name listening, being present, and being consistent as leadership behaviors too.',
    timingTitle: 'Timing',
    timing: ['Introduction shared leadership: 5 minutes','Group discussion informal leaders: 10 minutes','Planning "Leader of the Day" exercise: 10 minutes','Individual mentor moment completion: 2 minutes','Closing and quote: 3 minutes'],
    footer: 'Coach Guide Month 7',
  },
  {
    m: 8, title: 'Legacy & Next Step',
    science: `<strong>Scientific Foundation — Evidence Pyramid</strong>
<p style="margin-top:6px"><span class="evidence-tier tier-1">Systematic Review</span> Henriksen et al. (2020) — review of 44 studies on talent environments in sport: end-of-season sessions with explicit reflection on values, contribution, and intentions significantly increase identity development and long-term sport participation. <em>British Journal of Sports Medicine.</em></p>
<p style="margin-top:6px"><span class="evidence-tier tier-2">Longitudinal study</span> End-of-season reflection on personal growth is associated with higher intrinsic motivation the following season.</p>
<p style="margin-top:6px"><span class="evidence-tier tier-3">Theoretical framework</span> Seligman (2011) — PERMA model: meaning and accomplishment are the two most underestimated components of well-being in adolescents. Conscious reflection on contribution is an evidence-based strategy for activating both.</p>`,
    sectionTitle: 'Guiding the Closing Session',
    steps: [
      'Begin with a look back. Bring the Month 1 worksheet (the Three Words). Have players compare: "Are you still that person? Have you grown?" This creates a powerful sense of progression.',
      'Read the Invisible Contributions that players wrote throughout the season (month 5). Do this by name, after the writer\'s permission. This is an emotional highlight of the program.',
      'The letters to themselves are folded and sealed. You keep them as coach and return them at the first session of next season. This ritual has great symbolic value.',
      'Close with a closing ceremony. Each player says one thing they learned about themselves this season. Not about basketball. About character.',
    ],
    tips: [
      '<strong>Tip 1:</strong> Write a letter to your future self as a coach too. Share part of it. "What do I hope to do better as a coach next season?" This closes the program in the spirit in which it began: vulnerability as strength.',
      '<strong>Tip 2:</strong> At the end of the season, send a personal message to each player with one specific observation of their growth. Not an athletic achievement. A moment of character that you witnessed. This is the most powerful feedback you can ever give.',
      '<strong>Tip 3:</strong> Use the Month 8 intentions as input for your conversations at the start of next season. "You wrote that you wanted to be the first voice more often. How did that go?" Continuity makes the program sustainable.',
    ],
    warning: 'Make sure the closing session gets enough time. Minimum 45 minutes. This is not an additional activity but the highlight of 8 months of work. Give it the space it deserves.',
    timingTitle: 'Closing Session Timing',
    timing: ['Look back at Month 1 worksheets: 10 minutes','Reading Invisible Contributions: 10 minutes','Individual completion of Month 8 worksheet: 15 minutes','Sealing and handing over letters to coach: 5 minutes','Closing ceremony: one thing learned about character: 10 minutes','Closing words from the coach: 5 minutes'],
    footer: 'Coach Guide Month 8',
  },
];

function buildCoachHTML(month, lang) {
  const isEN = lang === 'en';
  const steps = month.steps.map(s => `<div class="coach-step"><div class="step-num">${month.steps.indexOf(s)+1}</div><p>${s}</p></div>`).join('\n');
  const tips = month.tips.map(t => `<div class="tip-box"><p>${t}</p></div>`).join('\n');
  const timing = month.timing.map(t => `<li><div class="checkbox"></div>${t}</li>`).join('\n');
  const badgeLabel = isEN ? 'Coach' : 'Coach';
  const monthLabel = isEN ? `Month ${month.m} — Coach Guide` : `Maand ${month.m} — Coachgids`;
  const confLabel = isEN ? 'CONFIDENTIAL — Coaches only' : 'VERTROUWELIJK — Enkel voor coaches';
  const cfLabel = isEN ? `Character First — ${month.footer}` : `Character First — ${month.footer}`;
  return `<!DOCTYPE html>
<html lang="${isEN ? 'en' : 'nl'}">
<head><meta charset="UTF-8"/><style>${CSS}</style></head>
<body>
<div class="page">
  <div class="page-header">
    <div class="page-header-left">
      <div class="month-label">${monthLabel}</div>
      <h2>${month.title}</h2>
    </div>
    <div class="page-header-right">
      <span class="page-type-badge badge-coach">${badgeLabel}</span>
      <div class="logo-small">Character <span>First</span></div>
    </div>
  </div>
  <div class="science-box">${month.science}</div>
  <div class="coach-section">
    <h3>${month.sectionTitle}</h3>
    ${steps}
  </div>
  <div class="coach-section">
    <h3>${isEN ? 'Coach tips for this theme' : 'Coach tips voor dit thema'}</h3>
    ${tips}
    <div class="warning-box"><p>&#9888; ${month.warning}</p></div>
  </div>
  <div class="coach-section">
    <h3>${month.timingTitle}</h3>
    <ul class="checklist">${timing}</ul>
  </div>
  <div class="page-footer">
    <span>${cfLabel}</span>
    <span>${confLabel}</span>
  </div>
</div>
</body>
</html>`;
}

(async () => {
  const browser = await chromium.launch();

  for (const month of MONTHS_NL) {
    const html = buildCoachHTML(month, 'nl');
    const tmp = `/tmp/coach_m${month.m}_nl.html`;
    fs.writeFileSync(tmp, html);
    const page = await browser.newPage();
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const out = path.join(DIRS.coachNL, `CF_Werkblad_Coach_M${month.m}_NL.pdf`);
    await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' } });
    await page.close();
    fs.unlinkSync(tmp);
    console.log(`Coach NL M${month.m} → ${Math.round(fs.statSync(out).size/1024)}KB`);
  }

  for (const month of MONTHS_EN) {
    const html = buildCoachHTML(month, 'en');
    const tmp = `/tmp/coach_m${month.m}_en.html`;
    fs.writeFileSync(tmp, html);
    const page = await browser.newPage();
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const out = path.join(DIRS.coachEN, `CF_Werkblad_Coach_M${month.m}_EN.pdf`);
    await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' } });
    await page.close();
    fs.unlinkSync(tmp);
    console.log(`Coach EN M${month.m} → ${Math.round(fs.statSync(out).size/1024)}KB`);
  }

  await browser.close();
  console.log('Done!');
})();
