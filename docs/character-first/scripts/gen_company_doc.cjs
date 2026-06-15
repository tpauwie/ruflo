'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first';
const OUT = path.join(BASE, 'company-docs');
fs.mkdirSync(OUT, { recursive: true });

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

function logoLight(size = 80) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#FAF7F2"/>
    <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
    <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
    <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2" opacity=".45"/>
    <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
          font-family="Arial Black,Arial,sans-serif" font-weight="900"
          font-size="14" fill="#1C2433" letter-spacing="3">CF</text>
  </svg>`;
}

const CSS = `
  :root {
    --orange: #F05A28; --navy: #1C2433; --green: #1E8A5B;
    --blue: #2F6FB0; --canvas: #FAF7F2; --mist: #F0ECE4;
    --stone: #6E6A63; --line: #E4DFD6; --ember: #D44A1A;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #bbb; font-family: Arial, sans-serif; }

  .page {
    width: 210mm; height: 297mm; overflow: hidden;
    background: var(--canvas);
    display: flex; flex-direction: column;
    page-break-after: always; break-after: page;
  }

  /* ── PAGE 1: COVER ── */
  .cover-top {
    background: var(--navy);
    flex: 0 0 58%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 20mm 16mm 14mm;
    position: relative;
  }
  .cover-top::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 18px;
    background: var(--canvas);
    clip-path: ellipse(55% 100% at 50% 100%);
  }
  .cover-wordmark {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 38px; font-weight: 900; color: #fff;
    letter-spacing: .02em; margin-top: 14px; text-align: center;
  }
  .cover-wordmark span { color: var(--orange); }
  .cover-tagline {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 13px; font-weight: 900; color: rgba(255,255,255,.55);
    text-transform: uppercase; letter-spacing: .22em; margin-top: 6px; text-align: center;
  }
  .cover-divider {
    width: 48px; height: 3px; background: var(--orange);
    border-radius: 2px; margin: 14px auto 0;
  }
  .cover-bottom {
    flex: 1 1 auto;
    display: flex; flex-direction: column;
    padding: 10mm 16mm 10mm;
    gap: 10px;
  }
  .cover-hero {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 17px; font-weight: 900; color: var(--navy);
    line-height: 1.3;
  }
  .cover-hero span { color: var(--orange); }
  .cover-intro {
    font-size: 12.5px; color: var(--stone); line-height: 1.6;
  }
  .cover-pills {
    display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;
  }
  .pill {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em;
    border-radius: 20px; padding: 4px 11px; border: 1.5px solid;
  }
  .pill-orange { background: rgba(240,90,40,.1); color: var(--orange); border-color: var(--orange); }
  .pill-navy   { background: rgba(28,36,51,.08); color: var(--navy); border-color: var(--navy); }
  .pill-green  { background: rgba(30,138,91,.1); color: var(--green); border-color: var(--green); }
  .cover-mission {
    background: var(--orange); border-radius: 10px;
    padding: 12px 16px; margin-top: 4px;
  }
  .cover-mission .cm-label {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 9px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .15em; color: rgba(255,255,255,.7); margin-bottom: 4px;
  }
  .cover-mission p {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 13px; font-weight: 900; color: #fff; line-height: 1.4;
  }
  .cover-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16mm 8mm;
    flex-shrink: 0;
  }
  .cover-footer span { font-size: 9px; color: var(--stone); }

  /* ── PAGE 2: WHAT WE DO ── */
  .page-inner { padding: 12mm 14mm 9mm; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .page-header {
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .page-header-left { display: flex; align-items: center; gap: 10px; }
  .ph-wordmark { font-family: "Arial Black", Arial, sans-serif; font-size: 15px; font-weight: 900; color: var(--navy); }
  .ph-wordmark span { color: var(--orange); }
  .ph-page { font-size: 9.5px; color: var(--stone); text-align: right; }
  .ph-divider { height: 2px; background: var(--orange); border-radius: 1px; flex-shrink: 0; }
  .section-eyebrow {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .16em; color: var(--orange); margin-bottom: 2px;
  }
  .section-title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 20px; font-weight: 900;
    color: var(--navy); line-height: 1.1; margin-bottom: 6px;
  }
  .section-intro { font-size: 11.5px; color: var(--stone); line-height: 1.5; margin-bottom: 8px; }

  /* Track cards */
  .tracks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex-shrink: 0; }
  .track-card {
    border-radius: 10px; padding: 11px 13px;
    border: 1.5px solid var(--line); background: #fff;
    display: flex; flex-direction: column; gap: 5px;
  }
  .track-card.featured { border-color: var(--orange); background: rgba(240,90,40,.04); }
  .track-icon { font-size: 20px; flex-shrink: 0; }
  .track-title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 12px; font-weight: 900;
    color: var(--navy); line-height: 1.2;
  }
  .track-subtitle { font-size: 9.5px; color: var(--stone); }
  .track-desc { font-size: 10.5px; color: #444; line-height: 1.5; flex: 1; }
  .track-tags { display: flex; gap: 5px; flex-wrap: wrap; }
  .track-tag {
    font-family: "Arial Black", Arial, sans-serif; font-size: 8.5px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .07em;
    border-radius: 10px; padding: 2px 8px; border: 1px solid;
  }
  .tag-orange { color: var(--orange); border-color: var(--orange); background: rgba(240,90,40,.08); }
  .tag-blue   { color: var(--blue);   border-color: var(--blue);   background: rgba(47,111,176,.08); }
  .tag-green  { color: var(--green);  border-color: var(--green);  background: rgba(30,138,91,.08); }
  .tag-navy   { color: var(--navy);   border-color: var(--navy);   background: rgba(28,36,51,.07); }

  /* ── PAGE 3: HOW IT WORKS ── */
  .evidence-block {
    background: var(--navy); border-radius: 10px; padding: 12px 15px;
    display: flex; gap: 14px; align-items: flex-start; flex-shrink: 0;
  }
  .ev-text .ev-title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 13px; font-weight: 900;
    color: #fff; margin-bottom: 4px;
  }
  .ev-text p { font-size: 10.5px; color: rgba(255,255,255,.75); line-height: 1.5; }
  .sports-row { display: flex; gap: 8px; flex-shrink: 0; }
  .sport-card {
    flex: 1; background: #fff; border: 1.5px solid var(--line);
    border-radius: 8px; padding: 8px 10px; text-align: center;
  }
  .sport-icon { font-size: 24px; margin-bottom: 4px; }
  .sport-name {
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    color: var(--navy);
  }
  .sport-stat { font-size: 9px; color: var(--stone); margin-top: 2px; }
  /* Free vs Premium */
  .pricing-row { display: flex; gap: 8px; flex-shrink: 0; }
  .pricing-card {
    flex: 1; border-radius: 10px; padding: 11px 13px;
  }
  .pricing-card.free { background: var(--mist); border: 1.5px solid var(--line); }
  .pricing-card.premium { background: var(--navy); }
  .pricing-label {
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .1em; margin-bottom: 6px;
  }
  .pricing-card.free .pricing-label { color: var(--navy); }
  .pricing-card.premium .pricing-label { color: var(--orange); }
  .pricing-card ul { padding-left: 14px; }
  .pricing-card.free ul li { font-size: 10.5px; color: var(--navy); line-height: 1.6; }
  .pricing-card.premium ul li { font-size: 10.5px; color: rgba(255,255,255,.85); line-height: 1.6; }
  /* Values row */
  .values-row { display: flex; gap: 6px; flex-shrink: 0; }
  .value-chip {
    flex: 1; background: #fff; border: 1.5px solid var(--line);
    border-radius: 8px; padding: 7px 8px; text-align: center;
  }
  .value-emoji { font-size: 16px; }
  .value-name {
    font-family: "Arial Black", Arial, sans-serif; font-size: 9.5px; font-weight: 900;
    color: var(--navy); display: block; margin-top: 3px;
  }
  .value-desc { font-size: 8.5px; color: var(--stone); line-height: 1.3; margin-top: 2px; }

  /* ── PAGE 4: CTA ── */
  .cta-top {
    background: var(--orange); padding: 12mm 14mm 10mm;
    flex-shrink: 0;
  }
  .cta-top .ct-eyebrow {
    font-family: "Arial Black", Arial, sans-serif; font-size: 10px; font-weight: 900;
    text-transform: uppercase; letter-spacing: .16em; color: rgba(255,255,255,.7); margin-bottom: 4px;
  }
  .cta-top .ct-title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 26px; font-weight: 900;
    color: #fff; line-height: 1.1; margin-bottom: 8px;
  }
  .cta-top .ct-subtitle { font-size: 12px; color: rgba(255,255,255,.85); line-height: 1.5; }
  .cta-steps { padding: 0 14mm; margin-top: 10mm; flex-shrink: 0; }
  .steps-row { display: flex; gap: 8px; }
  .step-card {
    flex: 1; background: #fff; border: 1.5px solid var(--line);
    border-radius: 10px; padding: 11px 12px; text-align: center;
  }
  .step-num {
    width: 28px; height: 28px; border-radius: 50%; background: var(--orange);
    color: #fff; font-family: "Arial Black", Arial, sans-serif; font-size: 14px; font-weight: 900;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 6px;
  }
  .step-title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 11px; font-weight: 900;
    color: var(--navy); margin-bottom: 3px;
  }
  .step-desc { font-size: 10px; color: var(--stone); line-height: 1.4; }
  .contact-block { padding: 0 14mm; margin-top: 8mm; flex-shrink: 0; }
  .contact-inner {
    background: var(--navy); border-radius: 10px; padding: 12px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .contact-left .cl-title {
    font-family: "Arial Black", Arial, sans-serif; font-size: 14px; font-weight: 900;
    color: #fff; margin-bottom: 4px;
  }
  .contact-left .cl-details { font-size: 11px; color: rgba(255,255,255,.75); line-height: 1.6; }
  .contact-left .cl-details strong { color: var(--orange); }
  .quote-block-p4 {
    padding: 0 14mm; margin-top: 8mm; flex-shrink: 0;
  }
  .quote-block-p4 .qb {
    border-left: 4px solid var(--orange); padding-left: 14px;
  }
  .qb-text {
    font-family: "Arial Black", Arial, sans-serif; font-size: 15px; font-weight: 900;
    color: var(--navy); line-height: 1.3; font-style: italic;
  }
  .qb-auth { font-size: 10px; color: var(--stone); margin-top: 5px; }
  .page-footer-inner {
    padding: 0 14mm 8mm; margin-top: auto; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line); padding-top: 5mm;
  }
  .page-footer-inner span { font-size: 8.5px; color: var(--stone); }
`;

// ============================================================
// CONTENT
// ============================================================
const content = {
  EN: {
    tagline: 'Win the person. Win the team.',
    heroTitle: 'We train character the same way coaches train technique.',
    heroIntro: 'Sport is the perfect classroom for life. Yet most programmes only develop athletic skills — not the person behind the jersey. Character First fills that gap with a complete, evidence-based character development system for young athletes aged 14 and above.',
    pills: ['Evidence-Based', 'Ages 14+', 'NL & EN'],
    missionLabel: 'Our Mission',
    mission: 'Every young athlete grows as a person, not just as an athlete. Sport is our stage — character is our goal.',
    // Page 2
    p2eyebrow: 'Our Programme',
    p2title: 'Four Tracks. One System.',
    p2intro: 'Character First offers four integrated programme tracks — covering the team, the coach, and the individual player. Every track is available in Dutch and English and comes with print-ready worksheets, facilitation guides, and mentorship tools.',
    tracks: [
      {
        icon: '📋', featured: true,
        title: 'Monthly Character Programme',
        subtitle: '8 lessons · Player + Coach worksheets',
        desc: 'A full-season programme with 8 monthly themes: self-knowledge, stress & pressure, my role, communication, team first, resilience, leadership, and physical wellbeing. Includes player worksheets, coach facilitation guides, and combined full versions.',
        tags: [{ label: 'Full Season', cls: 'tag-orange' }, { label: 'Team', cls: 'tag-navy' }, { label: 'Coach', cls: 'tag-blue' }],
      },
      {
        icon: '🌱', featured: false,
        title: 'Preseason Culture Programme',
        subtitle: '5 sessions · Team identity & agreements',
        desc: 'Five structured sessions to build a strong team culture before the season starts: team identity, team contract, trust & safety, conflict & recovery, and culture in action. Player and coach versions included.',
        tags: [{ label: 'Preseason', cls: 'tag-green' }, { label: 'Team', cls: 'tag-navy' }],
      },
      {
        icon: '🎓', featured: false,
        title: 'Coaches Development Track',
        subtitle: '10 self-study modules · Evidence-based',
        desc: 'An in-depth personal development journey for coaches. Each of the 10 modules covers one competency — from self-knowledge and feedback to emotional regulation and mental health awareness — with books, TED Talks, podcasts, and weekly action tasks.',
        tags: [{ label: 'Coach', cls: 'tag-blue' }, { label: '10 Modules', cls: 'tag-navy' }],
      },
      {
        icon: '🤝', featured: false,
        title: 'Individual Mentorship Programme',
        subtitle: '8 sessions · 1-on-1 with a CF mentor',
        desc: 'A personal journey for the individual player, guided by a Character First mentor. Eight sessions covering identity, personal story, goals, self-talk, resilience, role models, team contribution, and future vision.',
        tags: [{ label: 'Individual', cls: 'tag-orange' }, { label: '1-on-1', cls: 'tag-green' }],
      },
    ],
    // Page 3
    p3eyebrow: 'Our Approach',
    p3title: 'Not a Workshop. A System.',
    evidenceTitle: 'Grounded in Science',
    evidenceText: 'Every programme element is rooted in peer-reviewed research: Self-Determination Theory (Deci & Ryan), Achievement Goal Theory (Ames), coach-athlete relationship research (Jowett), and resilience science. This is not motivational content — it is structured character training.',
    sportsTitle: 'The Three Biggest Sports in Belgium',
    sports: [
      { icon: '⚽', name: 'Football', stat: '#1 most played sport' },
      { icon: '🏀', name: 'Basketball', stat: 'Fast-growing youth sport' },
      { icon: '🏐', name: 'Volleyball', stat: 'Strong club network' },
    ],
    pricingTitle: 'Free & Premium',
    free: {
      label: '🎁 Free',
      items: [
        'Player worksheets for all 8 monthly themes (NL + EN)',
        'Coach facilitation guides for all 8 themes',
        'Preseason culture player worksheets',
        'Access to the Character First brand & tools',
      ],
    },
    premium: {
      label: '⭐ Premium',
      items: [
        'Full combined worksheets (player + coach, 2 pages)',
        'Complete coaches development track (10 modules)',
        'Individual mentorship programme (8 sessions)',
        'Mentor facilitation guides for all programmes',
        'Priority support & custom content options',
      ],
    },
    valuesTitle: 'Our Four Core Values',
    values: [
      { emoji: '🔥', name: 'Courageous', desc: 'We challenge and push beyond comfort zones' },
      { emoji: '🌱', name: 'Growth-First', desc: 'Progress over perfection — always' },
      { emoji: '🎯', name: 'Evidence-Based', desc: 'No hype. Only what research supports.' },
      { emoji: '🤝', name: 'Together', desc: 'The strongest player makes the team stronger' },
    ],
    // Page 4
    ctaEyebrow: 'Get Started',
    ctaTitle: 'Ready to build character\nthat lasts beyond sport?',
    ctaSubtitle: 'Join the clubs and coaches who are choosing to develop the person behind the athlete. Start free today — or contact us to explore a premium plan for your team or organisation.',
    steps: [
      { num: '1', title: 'Start Free', desc: 'Download all free worksheets in Dutch & English — no sign-up required.' },
      { num: '2', title: 'Choose a Plan', desc: 'Explore our premium tracks for coaches, mentors & clubs. Flexible pricing.' },
      { num: '3', title: 'We Support You', desc: 'Our team is available to guide implementation at your club or organisation.' },
    ],
    contactTitle: 'Get in touch',
    contactDetails: [
      { label: 'Email', value: 'info@characterfirst.be' },
      { label: 'Website', value: 'characterfirst.be' },
    ],
    quoteText: '"Win the person. Win the team."',
    quoteAuth: '— Character First · Evidence-based character development for athletes 14+',
    pageLabels: ['Page 1 of 4', 'Page 2 of 4', 'Page 3 of 4', 'Page 4 of 4'],
    footer: 'characterfirst.be · info@characterfirst.be',
  },
  NL: {
    tagline: 'Win the person. Win the team.',
    heroTitle: 'Wij trainen karakter zoals coaches techniek trainen.',
    heroIntro: 'Sport is het perfecte klaslokaal voor het leven. Toch ontwikkelen de meeste programma\'s alleen sportieve vaardigheden — niet de persoon achter het shirt. Character First vult die leemte met een compleet, evidence-based systeem voor karakterontwikkeling bij jonge sporters vanaf 14 jaar.',
    pills: ['Evidence-Based', 'Vanaf 14 jaar', 'NL & EN'],
    missionLabel: 'Onze Missie',
    mission: 'Elke jonge sporter groeit als mens, niet alleen als atleet. Sport is ons podium — karakter is ons doel.',
    p2eyebrow: 'Ons Programma',
    p2title: 'Vier Trajecten. Één Systeem.',
    p2intro: 'Character First biedt vier geïntegreerde programmatrajecten — voor het team, de coach en de individuele speler. Elk traject is beschikbaar in het Nederlands en Engels en bevat drukklare werkbladen, begeleidingsgidsen en mentorshaptools.',
    tracks: [
      {
        icon: '📋', featured: true,
        title: 'Maandelijks Karakterprogramma',
        subtitle: '8 lessen · Speler + Coach werkbladen',
        desc: 'Een seizoensprogramma met 8 maandelijkse thema\'s: zelfkennis, druk & stress, mijn rol, communicatie, team eerst, veerkracht, leiderschap en fysiek welzijn. Inclusief spelerwerkbladen, coachgidsen en gecombineerde volledige versies.',
        tags: [{ label: 'Volledig Seizoen', cls: 'tag-orange' }, { label: 'Team', cls: 'tag-navy' }, { label: 'Coach', cls: 'tag-blue' }],
      },
      {
        icon: '🌱', featured: false,
        title: 'Preseason Cultuurprogramma',
        subtitle: '5 sessies · Teamidentiteit & afspraken',
        desc: 'Vijf gestructureerde sessies om een sterke teamcultuur te bouwen voor het seizoen begint: teamidentiteit, teamcontract, vertrouwen & veiligheid, conflict & herstel, en cultuur in actie. Speler- en coachversies inbegrepen.',
        tags: [{ label: 'Preseason', cls: 'tag-green' }, { label: 'Team', cls: 'tag-navy' }],
      },
      {
        icon: '🎓', featured: false,
        title: 'Coachestraject',
        subtitle: '10 zelfstudie-modules · Evidence-based',
        desc: 'Een diepgaand persoonlijk ontwikkelingstraject voor coaches. Elk van de 10 modules behandelt één competentie — van zelfkennis en feedback tot emotieregulatie en mentale gezondheid — met boeken, TED Talks, podcasts en wekelijkse acties.',
        tags: [{ label: 'Coach', cls: 'tag-blue' }, { label: '10 Modules', cls: 'tag-navy' }],
      },
      {
        icon: '🤝', featured: false,
        title: 'Individueel Mentorshiptraject',
        subtitle: '8 sessies · 1-op-1 met een CF mentor',
        desc: 'Een persoonlijk traject voor de individuele speler, begeleid door een Character First mentor. Acht sessies rond identiteit, persoonlijk verhaal, doelen, innerlijke stem, veerkracht, rolmodellen, teambijdrage en toekomstvisie.',
        tags: [{ label: 'Individueel', cls: 'tag-orange' }, { label: '1-op-1', cls: 'tag-green' }],
      },
    ],
    p3eyebrow: 'Onze Aanpak',
    p3title: 'Geen Workshop. Een Systeem.',
    evidenceTitle: 'Gegrond in wetenschap',
    evidenceText: 'Elk programma-element is gebaseerd op peer-reviewed onderzoek: Zelfdeterminatietheorie (Deci & Ryan), Achievement Goal Theory (Ames), coach-sporter relatieonderzoek (Jowett) en veerkrachtwetenschap. Dit is geen motivatie-inhoud — dit is gestructureerde karaktertraining.',
    sportsTitle: 'De Drie Grootste Sporten in België',
    sports: [
      { icon: '⚽', name: 'Voetbal', stat: '#1 meest beoefende sport' },
      { icon: '🏀', name: 'Basketbal', stat: 'Snelst groeiende jeugdsport' },
      { icon: '🏐', name: 'Volleybal', stat: 'Sterk clubnetwerk' },
    ],
    pricingTitle: 'Gratis & Premium',
    free: {
      label: '🎁 Gratis',
      items: [
        'Spelerwerkbladen voor alle 8 maandthema\'s (NL + EN)',
        'Coachgidsen voor alle 8 thema\'s',
        'Preseason cultuurwerkbladen voor spelers',
        'Toegang tot het Character First merk & tools',
      ],
    },
    premium: {
      label: '⭐ Premium',
      items: [
        'Gecombineerde werkbladen (speler + coach, 2 pagina\'s)',
        'Volledig coachestraject (10 modules)',
        'Individueel mentorshiptraject (8 sessies)',
        'Mentorgidsen voor alle programma\'s',
        'Prioritaire ondersteuning & op maat gemaakte inhoud',
      ],
    },
    valuesTitle: 'Onze Vier Kernwaarden',
    values: [
      { emoji: '🔥', name: 'Moedig', desc: 'Wij dagen uit en vermijden de comfortzone niet' },
      { emoji: '🌱', name: 'Groeigericht', desc: 'Vooruitgang boven perfectie — altijd' },
      { emoji: '🎯', name: 'Onderbouwd', desc: 'Geen hype. Alleen wat onderzoek ondersteunt.' },
      { emoji: '🤝', name: 'Samen', desc: 'De sterkste speler maakt het team sterker' },
    ],
    ctaEyebrow: 'Aan de Slag',
    ctaTitle: 'Klaar om karakter te bouwen\ndat voorbij de sport blijft?',
    ctaSubtitle: 'Sluit je aan bij de clubs en coaches die kiezen voor de persoon achter de atleet. Start vandaag gratis — of neem contact op om een premium plan voor jouw team of organisatie te verkennen.',
    steps: [
      { num: '1', title: 'Start Gratis', desc: 'Download alle gratis werkbladen in Nederlands & Engels — geen aanmelding vereist.' },
      { num: '2', title: 'Kies een Plan', desc: 'Ontdek onze premium trajecten voor coaches, mentoren & clubs. Flexibele prijzen.' },
      { num: '3', title: 'Wij Begeleiden', desc: 'Ons team helpt bij de implementatie in jouw club of organisatie.' },
    ],
    contactTitle: 'Neem Contact Op',
    contactDetails: [
      { label: 'E-mail', value: 'info@characterfirst.be' },
      { label: 'Website', value: 'characterfirst.be' },
    ],
    quoteText: '"Win the person. Win the team."',
    quoteAuth: '— Character First · Evidence-based karakterontwikkeling voor sporters vanaf 14 jaar',
    pageLabels: ['Pagina 1 van 4', 'Pagina 2 van 4', 'Pagina 3 van 4', 'Pagina 4 van 4'],
    footer: 'characterfirst.be · info@characterfirst.be',
  },
};

function buildHtml(c) {
  return `
  <!-- PAGE 1: COVER -->
  <div class="page">
    <div class="cover-top">
      ${logoLight(90)}
      <div class="cover-wordmark">CHARACTER<span>First</span></div>
      <div class="cover-tagline">${c.tagline}</div>
      <div class="cover-divider"></div>
    </div>
    <div class="cover-bottom">
      <div class="cover-hero">${c.heroTitle.replace('character', '<span>character</span>').replace('karakter', '<span>karakter</span>')}</div>
      <div class="cover-intro">${c.heroIntro}</div>
      <div class="cover-pills">
        ${c.pills.map(p => `<span class="pill pill-orange">${p}</span>`).join('')}
      </div>
      <div class="cover-mission">
        <div class="cm-label">${c.missionLabel}</div>
        <p>${c.mission}</p>
      </div>
    </div>
    <div class="cover-footer">
      <span>${c.footer}</span>
      <span>${c.pageLabels[0]}</span>
    </div>
  </div>

  <!-- PAGE 2: WHAT WE DO -->
  <div class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="page-header-left">
          ${logo(36)}
          <div class="ph-wordmark">CHARACTER<span>First</span></div>
        </div>
        <div class="ph-page">${c.pageLabels[1]}</div>
      </div>
      <div class="ph-divider"></div>
      <div class="section-eyebrow">${c.p2eyebrow}</div>
      <div class="section-title">${c.p2title}</div>
      <div class="section-intro">${c.p2intro}</div>
      <div class="tracks-grid">
        ${c.tracks.map(t => `
        <div class="track-card${t.featured ? ' featured' : ''}">
          <div class="track-icon">${t.icon}</div>
          <div class="track-title">${t.title}</div>
          <div class="track-subtitle">${t.subtitle}</div>
          <div class="track-desc">${t.desc}</div>
          <div class="track-tags">
            ${t.tags.map(tg => `<span class="track-tag ${tg.cls}">${tg.label}</span>`).join('')}
          </div>
        </div>`).join('')}
      </div>
      <div class="cover-footer" style="padding:0;margin-top:auto">
        <span>${c.footer}</span>
        <span>${c.pageLabels[1]}</span>
      </div>
    </div>
  </div>

  <!-- PAGE 3: HOW IT WORKS -->
  <div class="page">
    <div class="page-inner">
      <div class="page-header">
        <div class="page-header-left">
          ${logo(36)}
          <div class="ph-wordmark">CHARACTER<span>First</span></div>
        </div>
        <div class="ph-page">${c.pageLabels[2]}</div>
      </div>
      <div class="ph-divider"></div>
      <div class="section-eyebrow">${c.p3eyebrow}</div>
      <div class="section-title">${c.p3title}</div>

      <div class="evidence-block">
        <div class="ev-text">
          <div class="ev-title">🔬 ${c.evidenceTitle}</div>
          <p>${c.evidenceText}</p>
        </div>
      </div>

      <div style="font-family:'Arial Black',Arial,sans-serif;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:var(--navy);margin-bottom:5px">${c.sportsTitle}</div>
      <div class="sports-row">
        ${c.sports.map(s => `
        <div class="sport-card">
          <div class="sport-icon">${s.icon}</div>
          <div class="sport-name">${s.name}</div>
          <div class="sport-stat">${s.stat}</div>
        </div>`).join('')}
      </div>

      <div style="font-family:'Arial Black',Arial,sans-serif;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:var(--navy);margin-bottom:5px">${c.pricingTitle}</div>
      <div class="pricing-row">
        <div class="pricing-card free">
          <div class="pricing-label">${c.free.label}</div>
          <ul>${c.free.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div class="pricing-card premium">
          <div class="pricing-label">${c.premium.label}</div>
          <ul>${c.premium.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      </div>

      <div style="font-family:'Arial Black',Arial,sans-serif;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:var(--navy);margin-bottom:5px">${c.valuesTitle}</div>
      <div class="values-row">
        ${c.values.map(v => `
        <div class="value-chip">
          <div class="value-emoji">${v.emoji}</div>
          <span class="value-name">${v.name}</span>
          <div class="value-desc">${v.desc}</div>
        </div>`).join('')}
      </div>

      <div class="cover-footer" style="padding:0;margin-top:auto">
        <span>${c.footer}</span>
        <span>${c.pageLabels[2]}</span>
      </div>
    </div>
  </div>

  <!-- PAGE 4: CTA -->
  <div class="page">
    <div class="cta-top">
      <div class="ct-eyebrow">${c.ctaEyebrow}</div>
      <div class="ct-title">${c.ctaTitle.replace('\n', '<br>')}</div>
      <div class="ct-subtitle">${c.ctaSubtitle}</div>
    </div>

    <div class="cta-steps">
      <div class="steps-row">
        ${c.steps.map(s => `
        <div class="step-card">
          <div class="step-num">${s.num}</div>
          <div class="step-title">${s.title}</div>
          <div class="step-desc">${s.desc}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="contact-block">
      <div class="contact-inner">
        <div class="contact-left">
          <div class="cl-title">${c.contactTitle}</div>
          <div class="cl-details">
            ${c.contactDetails.map(d => `<strong>${d.label}:</strong> ${d.value}<br>`).join('')}
          </div>
        </div>
        ${logo(64)}
      </div>
    </div>

    <div class="quote-block-p4">
      <div class="qb">
        <div class="qb-text">${c.quoteText}</div>
        <div class="qb-auth">${c.quoteAuth}</div>
      </div>
    </div>

    <div class="page-footer-inner">
      <span>${c.footer}</span>
      <span>${c.pageLabels[3]}</span>
    </div>
  </div>`;
}

async function generate(lang) {
  const c = content[lang];
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${buildHtml(c)}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  const fname = `CF_Company_Document_${lang}.pdf`;
  await page.pdf({
    path: path.join(OUT, fname),
    width: '210mm', height: '297mm',
    printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await page.close();
  await browser.close();
  console.log(`${lang} → ${Math.round(fs.statSync(path.join(OUT,fname)).size/1024)}KB`);
}

(async () => {
  await generate('EN');
  await generate('NL');
  console.log('Done!');
})();
