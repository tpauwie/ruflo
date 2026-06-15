'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/ruflo/docs/character-first';
const OUT = path.join(BASE, 'company-docs');
fs.mkdirSync(OUT, { recursive: true });

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
function logoDark(size = 80) {
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

/* Decorative SVG pattern for cover — abstract triangles */
function coverPattern() {
  return `<svg width="210mm" height="170mm" viewBox="0 0 794 643" xmlns="http://www.w3.org/2000/svg"
       style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:.07">
    <polygon points="600,0 794,0 794,220" fill="#F05A28"/>
    <polygon points="0,643 260,643 0,380" fill="#F05A28"/>
    <polygon points="700,643 794,500 794,643" fill="#FAF7F2" opacity=".4"/>
    <circle cx="150" cy="120" r="180" fill="none" stroke="#FAF7F2" stroke-width="1.5"/>
    <circle cx="680" cy="520" r="140" fill="none" stroke="#FAF7F2" stroke-width="1"/>
    <circle cx="400" cy="320" r="260" fill="none" stroke="#FAF7F2" stroke-width=".8" opacity=".5"/>
    <line x1="0" y1="320" x2="794" y2="320" stroke="#FAF7F2" stroke-width=".6" opacity=".3"/>
  </svg>`;
}

const CSS = `
  :root {
    --orange: #F05A28; --navy: #1C2433; --green: #1E8A5B;
    --blue: #2F6FB0; --canvas: #FAF7F2; --mist: #F0ECE4;
    --stone: #6E6A63; --line: #E4DFD6; --ember: #C7421A;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #999; font-family: Arial, sans-serif; }

  .page {
    width: 210mm; height: 297mm; overflow: hidden;
    background: var(--canvas);
    display: flex; flex-direction: column;
    page-break-after: always; break-after: page;
    position: relative;
  }

  /* ─────────────────────────────
     PAGE 1 — COVER
  ───────────────────────────── */
  .p1-top {
    background: var(--navy);
    flex: 0 0 170mm;
    position: relative;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 0;
    overflow: hidden;
  }
  .p1-top-content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column;
    align-items: center; gap: 0;
  }
  .p1-logo-row { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
  .p1-wordmark {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 52px; font-weight: 900; color: #fff;
    letter-spacing: .04em; line-height: 1;
  }
  .p1-wordmark span { color: var(--orange); }
  .p1-tagline {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 14px; font-weight: 900; color: rgba(255,255,255,.5);
    text-transform: uppercase; letter-spacing: .26em; text-align: center;
    margin-top: 4px;
  }
  .p1-divider { width: 60px; height: 4px; background: var(--orange); border-radius: 2px; margin: 18px auto; }
  .p1-hero {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 22px; font-weight: 900; color: #fff;
    line-height: 1.25; text-align: center;
    max-width: 148mm; margin: 0 auto;
  }
  .p1-hero span { color: var(--orange); }
  .p1-sub {
    font-size: 12px; color: rgba(255,255,255,.65); line-height: 1.6;
    text-align: center; max-width: 138mm; margin: 10px auto 0;
  }
  /* curved bottom */
  .p1-wave {
    position: absolute; bottom: -1px; left: 0; right: 0;
    height: 28px; background: var(--canvas);
    clip-path: ellipse(55% 100% at 50% 100%);
    z-index: 3;
  }

  /* stats strip */
  .p1-stats {
    flex: 1 1 auto;
    display: flex; align-items: center;
    padding: 0 14mm;
    gap: 0;
  }
  .p1-stat {
    flex: 1; text-align: center;
    padding: 0 8px;
    border-right: 1.5px solid var(--line);
  }
  .p1-stat:last-child { border-right: none; }
  .p1-stat-num {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 34px; font-weight: 900; color: var(--orange);
    line-height: 1;
  }
  .p1-stat-label {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 9px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .12em; color: var(--navy); margin-top: 4px;
  }

  /* mission bar */
  .p1-mission {
    flex-shrink: 0; background: var(--orange);
    padding: 10px 14mm;
    display: flex; align-items: center; gap: 14px;
  }
  .p1-mission-label {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 9px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .14em; color: rgba(255,255,255,.65);
    white-space: nowrap; flex-shrink: 0;
  }
  .p1-mission-text {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 12.5px; font-weight: 900; color: #fff; line-height: 1.35;
  }

  /* footer */
  .p1-footer {
    flex-shrink: 0; padding: 7px 14mm;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line);
  }
  .p1-footer span { font-size: 9px; color: var(--stone); }

  /* ─────────────────────────────
     PAGE 2 — WHAT WE DO
  ───────────────────────────── */
  .ph {
    flex-shrink: 0; padding: 9mm 14mm 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ph-left { display: flex; align-items: center; gap: 10px; }
  .ph-wm {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 14px; font-weight: 900; color: var(--navy);
  }
  .ph-wm span { color: var(--orange); }
  .ph-pg { font-size: 9px; color: var(--stone); }
  .ph-bar { height: 2.5px; background: var(--orange); border-radius: 2px; margin: 6px 14mm 0; flex-shrink: 0; }

  .p2-intro-band {
    flex-shrink: 0; background: var(--navy);
    margin: 7mm 14mm 0; border-radius: 12px;
    padding: 14px 18px;
    display: flex; gap: 16px; align-items: center;
  }
  .p2-intro-icon {
    font-size: 40px; flex-shrink: 0;
  }
  .p2-intro-title {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 22px; font-weight: 900; color: #fff; line-height: 1.1;
    margin-bottom: 5px;
  }
  .p2-intro-title span { color: var(--orange); }
  .p2-intro-sub { font-size: 11px; color: rgba(255,255,255,.72); line-height: 1.5; }

  .p2-eyebrow {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 9.5px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .16em; color: var(--orange);
    margin: 8mm 14mm 5px;
  }
  .tracks-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin: 0 14mm; flex: 1;
  }
  .tc {
    border-radius: 12px; padding: 13px 14px;
    border: 2px solid var(--line); background: #fff;
    display: flex; flex-direction: column; gap: 5px;
    position: relative; overflow: hidden;
  }
  .tc.feat { border-color: var(--orange); background: rgba(240,90,40,.04); }
  .tc-accent {
    position: absolute; top: 0; right: 0;
    width: 40px; height: 40px;
    border-radius: 0 12px 0 40px;
  }
  .tc.feat .tc-accent { background: rgba(240,90,40,.12); }
  .tc:not(.feat) .tc-accent { background: rgba(47,111,176,.08); }
  .tc-icon { font-size: 26px; }
  .tc-title {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 13px; font-weight: 900; color: var(--navy); line-height: 1.2;
  }
  .tc-sub { font-size: 10px; color: var(--stone); margin-bottom: 2px; }
  .tc-desc { font-size: 10.5px; color: #444; line-height: 1.5; flex: 1; }
  .tc-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 4px; }
  .tag {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 8px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .07em; border-radius: 10px; padding: 2px 8px; border: 1.5px solid;
  }
  .tag-o { color: var(--orange); border-color: var(--orange); background: rgba(240,90,40,.08); }
  .tag-b { color: var(--blue); border-color: var(--blue); background: rgba(47,111,176,.08); }
  .tag-g { color: var(--green); border-color: var(--green); background: rgba(30,138,91,.08); }
  .tag-n { color: var(--navy); border-color: var(--navy); background: rgba(28,36,51,.07); }

  .p2-footer {
    flex-shrink: 0; padding: 5mm 14mm 6mm;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line); margin-top: 5mm;
  }
  .p2-footer span { font-size: 9px; color: var(--stone); }

  /* ─────────────────────────────
     PAGE 3 — HOW IT WORKS
  ───────────────────────────── */
  .ev-band {
    background: var(--navy); border-radius: 12px;
    padding: 16px 18px; margin: 7mm 14mm 0;
    flex-shrink: 0;
    display: flex; gap: 0; flex-direction: column;
  }
  .ev-title {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 16px; font-weight: 900; color: #fff; margin-bottom: 7px;
  }
  .ev-title span { color: var(--orange); }
  .ev-text { font-size: 11px; color: rgba(255,255,255,.75); line-height: 1.6; }
  .ev-sources {
    display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;
  }
  .ev-chip {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 8.5px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em;
    border-radius: 6px; padding: 3px 9px;
    background: rgba(240,90,40,.25); color: #fff; border: 1px solid rgba(240,90,40,.5);
  }

  .row-label {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 9.5px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .14em; color: var(--navy);
    margin: 7mm 14mm 4px;
  }

  .sports-row { display: flex; gap: 8px; margin: 0 14mm; flex-shrink: 0; }
  .sp-card {
    flex: 1; background: #fff; border: 2px solid var(--line);
    border-radius: 12px; padding: 14px 10px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .sp-icon { font-size: 34px; }
  .sp-name {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 12px; font-weight: 900; color: var(--navy);
  }
  .sp-stat { font-size: 10px; color: var(--stone); line-height: 1.3; }

  .pricing-row { display: flex; gap: 8px; margin: 0 14mm; flex-shrink: 0; }
  .pr-card { flex: 1; border-radius: 12px; padding: 14px 16px; }
  .pr-card.free { background: var(--mist); border: 2px solid var(--line); }
  .pr-card.prem { background: var(--navy); }
  .pr-label {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 11px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .08em; margin-bottom: 8px;
  }
  .pr-card.free .pr-label { color: var(--navy); }
  .pr-card.prem .pr-label { color: var(--orange); }
  .pr-card ul { padding-left: 0; list-style: none; }
  .pr-card.free ul li {
    font-size: 10.5px; color: var(--navy); line-height: 1.7;
    padding-left: 14px; position: relative;
  }
  .pr-card.free ul li::before { content: "✓"; position: absolute; left: 0; color: var(--green); font-weight: 900; }
  .pr-card.prem ul li {
    font-size: 10.5px; color: rgba(255,255,255,.85); line-height: 1.7;
    padding-left: 14px; position: relative;
  }
  .pr-card.prem ul li::before { content: "★"; position: absolute; left: 0; color: var(--orange); font-size: 9px; top: 1px; }

  .values-strip { display: flex; gap: 6px; margin: 0 14mm; flex-shrink: 0; }
  .vc {
    flex: 1; background: #fff; border: 1.5px solid var(--line);
    border-radius: 10px; padding: 10px 8px; text-align: center;
  }
  .vc-emoji { font-size: 22px; }
  .vc-name {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 10px; font-weight: 900; color: var(--navy);
    display: block; margin: 4px 0 2px;
  }
  .vc-desc { font-size: 8.5px; color: var(--stone); line-height: 1.35; }

  /* ─────────────────────────────
     PAGE 4 — CTA
  ───────────────────────────── */
  .p4-hero {
    background: var(--orange);
    flex: 0 0 100mm;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    justify-content: center; padding: 0 14mm;
  }
  .p4-hero::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 24px; background: var(--canvas);
    clip-path: ellipse(58% 100% at 50% 100%);
  }
  .p4-bg-circle {
    position: absolute; right: -60px; top: -80px;
    width: 280px; height: 280px; border-radius: 50%;
    background: rgba(255,255,255,.07);
  }
  .p4-bg-circle2 {
    position: absolute; left: -40px; bottom: -60px;
    width: 180px; height: 180px; border-radius: 50%;
    background: rgba(0,0,0,.08);
  }
  .p4-eyebrow {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 10px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .2em; color: rgba(255,255,255,.65); margin-bottom: 8px;
    position: relative; z-index: 1;
  }
  .p4-title {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 30px; font-weight: 900; color: #fff;
    line-height: 1.1; margin-bottom: 10px;
    position: relative; z-index: 1;
  }
  .p4-sub {
    font-size: 12px; color: rgba(255,255,255,.82); line-height: 1.55;
    max-width: 140mm; position: relative; z-index: 1;
  }

  .p4-steps { padding: 9mm 14mm 0; flex-shrink: 0; }
  .steps-row { display: flex; gap: 8px; }
  .step-card {
    flex: 1; background: #fff; border: 2px solid var(--line);
    border-radius: 12px; padding: 13px 14px;
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;
  }
  .step-num {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--orange); color: #fff;
    font-family: "Arial Black", Arial, sans-serif; font-size: 18px; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
  }
  .step-title {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 12px; font-weight: 900; color: var(--navy);
  }
  .step-desc { font-size: 10px; color: var(--stone); line-height: 1.4; }

  .p4-contact { margin: 8mm 14mm 0; flex-shrink: 0; }
  .contact-inner {
    background: var(--navy); border-radius: 12px;
    padding: 16px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .contact-left { flex: 1; }
  .cl-title {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 18px; font-weight: 900; color: #fff; margin-bottom: 8px;
  }
  .cl-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .cl-chip {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em;
    background: var(--orange); color: #fff; border-radius: 4px; padding: 2px 6px; flex-shrink: 0;
  }
  .cl-val { font-size: 11px; color: rgba(255,255,255,.85); }

  .p4-quote { padding: 7mm 14mm 0; flex-shrink: 0; }
  .qb { border-left: 5px solid var(--orange); padding-left: 16px; }
  .qb-text {
    font-family: "Arial Black", Arial, sans-serif;
    font-size: 16px; font-weight: 900; color: var(--navy);
    line-height: 1.3; font-style: italic;
  }
  .qb-auth { font-size: 10px; color: var(--stone); margin-top: 5px; }

  .p4-footer {
    margin-top: auto; flex-shrink: 0;
    padding: 5mm 14mm 6mm;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--line);
  }
  .p4-footer span { font-size: 9px; color: var(--stone); }
`;

const content = {
  EN: {
    tagline: 'Win the person. Win the team.',
    hero: 'We train <span>character</span> the same way coaches train technique.',
    sub: 'Sport is the perfect classroom for life. Most programmes develop athletic skills — not the person behind the jersey. Character First fills that gap with a complete, evidence-based character development system for young athletes aged 14 and above.',
    missionLabel: 'Our Mission',
    mission: 'Every young athlete grows as a person, not just as an athlete. Sport is our stage — character is our goal.',
    stats: [
      { num: '4', label: 'Programme Tracks' },
      { num: '14+', label: 'Age Group' },
      { num: '136', label: 'Ready-to-use PDFs' },
      { num: '2', label: 'Languages: NL & EN' },
    ],
    p2title: 'Four Tracks.\nOne System.',
    p2intro: 'Character First offers four integrated programme tracks — covering the team, the coach, and the individual player. Every track is available in Dutch and English and comes with print-ready worksheets, facilitation guides, and mentorship tools.',
    tracks: [
      {
        icon: '📋', feat: true,
        title: 'Monthly Character Programme',
        sub: '8 sessions · Player + Coach worksheets',
        desc: 'A full-season programme with 8 monthly themes: self-knowledge, stress & pressure, my role, communication, team first, resilience, leadership, and physical wellbeing. Includes player worksheets, coach facilitation guides, and combined full versions.',
        tags: [{ t: 'Full Season', c: 'tag-o' }, { t: 'Team', c: 'tag-n' }, { t: 'Coach', c: 'tag-b' }],
      },
      {
        icon: '🌱', feat: false,
        title: 'Preseason Culture Programme',
        sub: '5 sessions · Team identity & agreements',
        desc: 'Five structured sessions to build a strong team culture before the season starts: identity, team contract, trust & safety, conflict & recovery, and culture in action. Player and coach versions included.',
        tags: [{ t: 'Preseason', c: 'tag-g' }, { t: 'Team', c: 'tag-n' }],
      },
      {
        icon: '🎓', feat: false,
        title: 'Coaches Development Track',
        sub: '10 self-study modules · Evidence-based',
        desc: 'An in-depth personal development journey for coaches. 10 modules covering self-knowledge, feedback, emotional regulation, team dynamics, and mental health — with books, TED Talks, podcasts, and weekly action tasks.',
        tags: [{ t: 'Coach', c: 'tag-b' }, { t: '10 Modules', c: 'tag-n' }],
      },
      {
        icon: '🤝', feat: false,
        title: 'Individual Mentorship',
        sub: '8 sessions · 1-on-1 with a CF mentor',
        desc: 'A personal journey for the individual player, guided by a Character First mentor. Eight sessions covering identity, personal story, goals, self-talk, resilience, role models, team contribution, and future vision.',
        tags: [{ t: 'Individual', c: 'tag-o' }, { t: '1-on-1', c: 'tag-g' }],
      },
    ],
    // P3
    evTitle: '🔬 Grounded in <span>Science</span>',
    evText: 'Every programme element is rooted in peer-reviewed research. We apply Self-Determination Theory (Deci & Ryan), Achievement Goal Theory (Ames), coach-athlete relationship research (Jowett\'s 3C+1 model), and resilience science. This is not motivational content — it is structured character training with measurable outcomes.',
    evSources: ['Self-Determination Theory', 'Achievement Goal Theory', "Jowett's 3C+1", 'Resilience Science'],
    sportsTitle: 'The Three Biggest Sports in Belgium',
    sports: [
      { icon: '⚽', name: 'Football', stat: '#1 most played sport\nin Belgium' },
      { icon: '🏀', name: 'Basketball', stat: 'Fast-growing\nyouth sport' },
      { icon: '🏐', name: 'Volleyball', stat: 'Strong club\nnetwork nationwide' },
    ],
    pricingTitle: 'Free & Premium',
    free: {
      label: '🎁 Free — Start Today',
      items: [
        'Player worksheets for all 8 monthly themes (NL + EN)',
        'Coach facilitation guides for all 8 themes',
        'Preseason culture player worksheets (5 sessions)',
        'Access to the Character First tools & brand',
      ],
    },
    prem: {
      label: '⭐ Premium — Full System',
      items: [
        'Full combined worksheets (player + coach, 2 pages)',
        'Complete coaches development track (10 modules)',
        'Individual mentorship programme (8 sessions)',
        'Mentor facilitation guides for all programmes',
        'Priority support & custom content options',
      ],
    },
    valuesTitle: 'Our Core Values',
    values: [
      { e: '🔥', n: 'Courageous', d: 'Challenge beyond the comfort zone' },
      { e: '🌱', n: 'Growth-First', d: 'Progress over perfection — always' },
      { e: '🎯', n: 'Evidence-Based', d: 'No hype. Research-backed only.' },
      { e: '🤝', n: 'Together', d: 'The strongest player lifts the team' },
    ],
    // P4
    ctaEyebrow: 'Get Started',
    ctaTitle: 'Ready to build character\nthat lasts beyond sport?',
    ctaSub: 'Join clubs and coaches who choose to develop the person behind the athlete. Start free today — or contact us to explore a premium plan for your team or organisation.',
    steps: [
      { n: '1', t: 'Start Free', d: 'Download all free worksheets in Dutch & English — no sign-up required.' },
      { n: '2', t: 'Choose a Plan', d: 'Explore premium tracks for coaches, mentors & clubs. Flexible pricing.' },
      { n: '3', t: 'We Support You', d: 'Our team guides implementation at your club or organisation.' },
    ],
    contactTitle: 'Get in touch',
    contacts: [
      { l: 'Email', v: 'info@characterfirst.be' },
      { l: 'Website', v: 'characterfirst.be' },
    ],
    quoteText: '"Win the person. Win the team."',
    quoteAuth: '— Character First · Evidence-based character development for athletes 14+',
    pages: ['Page 1 of 4', 'Page 2 of 4', 'Page 3 of 4', 'Page 4 of 4'],
    footer: 'characterfirst.be · info@characterfirst.be',
  },
  NL: {
    tagline: 'Win the person. Win the team.',
    hero: 'Wij trainen <span>karakter</span> zoals coaches techniek trainen.',
    sub: 'Sport is het perfecte klaslokaal voor het leven. De meeste programma\'s ontwikkelen sportieve vaardigheden — niet de persoon achter het shirt. Character First vult die leemte met een compleet, evidence-based systeem voor karakterontwikkeling bij jonge sporters vanaf 14 jaar.',
    missionLabel: 'Onze Missie',
    mission: 'Elke jonge sporter groeit als mens, niet alleen als atleet. Sport is ons podium — karakter is ons doel.',
    stats: [
      { num: '4', label: 'Programmatrajecten' },
      { num: '14+', label: 'Leeftijdsgroep' },
      { num: '136', label: 'Gebruiksklare PDF\'s' },
      { num: '2', label: 'Talen: NL & EN' },
    ],
    p2title: 'Vier Trajecten.\nEén Systeem.',
    p2intro: 'Character First biedt vier geïntegreerde programmatrajecten — voor het team, de coach en de individuele speler. Elk traject is beschikbaar in het Nederlands en Engels en bevat drukklare werkbladen, begeleidingsgidsen en mentorshaptools.',
    tracks: [
      {
        icon: '📋', feat: true,
        title: 'Maandelijks Karakterprogramma',
        sub: '8 sessies · Speler + Coach werkbladen',
        desc: 'Een seizoensprogramma met 8 maandelijkse thema\'s: zelfkennis, druk & stress, mijn rol, communicatie, team eerst, veerkracht, leiderschap en fysiek welzijn. Inclusief spelerwerkbladen, coachgidsen en gecombineerde volledige versies.',
        tags: [{ t: 'Volledig Seizoen', c: 'tag-o' }, { t: 'Team', c: 'tag-n' }, { t: 'Coach', c: 'tag-b' }],
      },
      {
        icon: '🌱', feat: false,
        title: 'Preseason Cultuurprogramma',
        sub: '5 sessies · Teamidentiteit & afspraken',
        desc: 'Vijf gestructureerde sessies om een sterke teamcultuur te bouwen vóór het seizoen: teamidentiteit, teamcontract, vertrouwen & veiligheid, conflict & herstel, en cultuur in actie. Speler- en coachversies inbegrepen.',
        tags: [{ t: 'Preseason', c: 'tag-g' }, { t: 'Team', c: 'tag-n' }],
      },
      {
        icon: '🎓', feat: false,
        title: 'Coachestraject',
        sub: '10 zelfstudie-modules · Evidence-based',
        desc: 'Een diepgaand persoonlijk ontwikkelingstraject voor coaches. 10 modules over zelfkennis, feedback, emotieregulatie, teamdynamiek en mentale gezondheid — met boeken, TED Talks, podcasts en wekelijkse actietaken.',
        tags: [{ t: 'Coach', c: 'tag-b' }, { t: '10 Modules', c: 'tag-n' }],
      },
      {
        icon: '🤝', feat: false,
        title: 'Individueel Mentorshiptraject',
        sub: '8 sessies · 1-op-1 met een CF mentor',
        desc: 'Een persoonlijk traject voor de individuele speler, begeleid door een Character First mentor. Acht sessies rond identiteit, persoonlijk verhaal, doelen, innerlijke stem, veerkracht, rolmodellen, teambijdrage en toekomst.',
        tags: [{ t: 'Individueel', c: 'tag-o' }, { t: '1-op-1', c: 'tag-g' }],
      },
    ],
    evTitle: '🔬 Gegrond in <span>Wetenschap</span>',
    evText: 'Elk programma-element is gebaseerd op peer-reviewed onderzoek. We passen Zelfdeterminatietheorie (Deci & Ryan), Achievement Goal Theory (Ames), coach-sporter relatieonderzoek (Jowett\'s 3C+1 model) en veerkrachtwetenschap toe. Dit is geen motivatie-inhoud — dit is gestructureerde karaktertraining met meetbare uitkomsten.',
    evSources: ['Zelfdeterminatietheorie', 'Achievement Goal Theory', "Jowett's 3C+1", 'Veerkrachtwetenschap'],
    sportsTitle: 'De Drie Grootste Sporten in België',
    sports: [
      { icon: '⚽', name: 'Voetbal', stat: '#1 meest beoefende\nsport in België' },
      { icon: '🏀', name: 'Basketbal', stat: 'Snelst groeiende\njeugdsport' },
      { icon: '🏐', name: 'Volleybal', stat: 'Sterk clubnetwerk\nin heel België' },
    ],
    pricingTitle: 'Gratis & Premium',
    free: {
      label: '🎁 Gratis — Start Vandaag',
      items: [
        'Spelerwerkbladen voor alle 8 maandthema\'s (NL + EN)',
        'Coachgidsen voor alle 8 thema\'s',
        'Preseason cultuurwerkbladen voor spelers (5 sessies)',
        'Toegang tot de Character First tools & het merk',
      ],
    },
    prem: {
      label: '⭐ Premium — Volledig Systeem',
      items: [
        'Gecombineerde werkbladen (speler + coach, 2 pagina\'s)',
        'Volledig coachestraject (10 modules)',
        'Individueel mentorshiptraject (8 sessies)',
        'Mentorgidsen voor alle programma\'s',
        'Prioritaire ondersteuning & op maat gemaakte inhoud',
      ],
    },
    valuesTitle: 'Onze Kernwaarden',
    values: [
      { e: '🔥', n: 'Moedig', d: 'Uitdagen voorbij de comfortzone' },
      { e: '🌱', n: 'Groeigericht', d: 'Vooruitgang boven perfectie — altijd' },
      { e: '🎯', n: 'Onderbouwd', d: 'Geen hype. Alleen wat onderzoek steunt.' },
      { e: '🤝', n: 'Samen', d: 'De sterkste speler tilt het team omhoog' },
    ],
    ctaEyebrow: 'Aan de Slag',
    ctaTitle: 'Klaar om karakter te bouwen\ndat voorbij de sport blijft?',
    ctaSub: 'Sluit je aan bij clubs en coaches die kiezen voor de persoon achter de atleet. Start vandaag gratis — of neem contact op voor een premium plan voor jouw team of organisatie.',
    steps: [
      { n: '1', t: 'Start Gratis', d: 'Download alle gratis werkbladen in NL & EN — geen registratie vereist.' },
      { n: '2', t: 'Kies een Plan', d: 'Ontdek premium trajecten voor coaches, mentoren & clubs. Flexibele prijzen.' },
      { n: '3', t: 'Wij Begeleiden', d: 'Ons team helpt bij de implementatie in jouw club of organisatie.' },
    ],
    contactTitle: 'Neem Contact Op',
    contacts: [
      { l: 'E-mail', v: 'info@characterfirst.be' },
      { l: 'Website', v: 'characterfirst.be' },
    ],
    quoteText: '"Win the person. Win the team."',
    quoteAuth: '— Character First · Evidence-based karakterontwikkeling voor sporters vanaf 14 jaar',
    pages: ['Pagina 1 van 4', 'Pagina 2 van 4', 'Pagina 3 van 4', 'Pagina 4 van 4'],
    footer: 'characterfirst.be · info@characterfirst.be',
  },
};

function buildHtml(c) {
  return `
  <!-- PAGE 1: COVER -->
  <div class="page">
    <div class="p1-top">
      ${coverPattern()}
      <div class="p1-top-content">
        <div class="p1-logo-row">
          ${logoLight(72)}
          <div class="p1-wordmark">CHARACTER<span>First</span></div>
        </div>
        <div class="p1-tagline">${c.tagline}</div>
        <div class="p1-divider"></div>
        <div class="p1-hero">${c.hero}</div>
        <div class="p1-sub">${c.sub}</div>
      </div>
      <div class="p1-wave"></div>
    </div>

    <div class="p1-stats">
      ${c.stats.map(s => `
      <div class="p1-stat">
        <div class="p1-stat-num">${s.num}</div>
        <div class="p1-stat-label">${s.label}</div>
      </div>`).join('')}
    </div>

    <div class="p1-mission">
      <div class="p1-mission-label">${c.missionLabel}</div>
      <div class="p1-mission-text">${c.mission}</div>
    </div>

    <div class="p1-footer">
      <span>${c.footer}</span>
      <span>${c.pages[0]}</span>
    </div>
  </div>

  <!-- PAGE 2: WHAT WE DO -->
  <div class="page">
    <div class="ph">
      <div class="ph-left">${logoDark(34)} <div class="ph-wm">CHARACTER<span>First</span></div></div>
      <div class="ph-pg">${c.pages[1]}</div>
    </div>
    <div class="ph-bar"></div>

    <div class="p2-intro-band">
      <div class="p2-intro-icon">🏆</div>
      <div>
        <div class="p2-intro-title">${c.p2title.replace('\n','<br>')}</div>
        <div class="p2-intro-sub">${c.p2intro}</div>
      </div>
    </div>

    <div class="p2-eyebrow">${c.pages[1].includes('van') ? 'Onze Trajecten' : 'Our Tracks'}</div>

    <div class="tracks-grid">
      ${c.tracks.map(t => `
      <div class="tc${t.feat ? ' feat' : ''}">
        <div class="tc-accent"></div>
        <div class="tc-icon">${t.icon}</div>
        <div class="tc-title">${t.title}</div>
        <div class="tc-sub">${t.sub}</div>
        <div class="tc-desc">${t.desc}</div>
        <div class="tc-tags">${t.tags.map(tg => `<span class="tag ${tg.c}">${tg.t}</span>`).join('')}</div>
      </div>`).join('')}
    </div>

    <div class="p2-footer">
      <span>${c.footer}</span>
      <span>${c.pages[1]}</span>
    </div>
  </div>

  <!-- PAGE 3: HOW IT WORKS -->
  <div class="page">
    <div class="ph">
      <div class="ph-left">${logoDark(34)} <div class="ph-wm">CHARACTER<span>First</span></div></div>
      <div class="ph-pg">${c.pages[2]}</div>
    </div>
    <div class="ph-bar"></div>

    <div class="ev-band">
      <div class="ev-title">${c.evTitle}</div>
      <div class="ev-text">${c.evText}</div>
      <div class="ev-sources">
        ${c.evSources.map(s => `<span class="ev-chip">${s}</span>`).join('')}
      </div>
    </div>

    <div class="row-label">${c.sportsTitle}</div>
    <div class="sports-row">
      ${c.sports.map(s => `
      <div class="sp-card">
        <div class="sp-icon">${s.icon}</div>
        <div class="sp-name">${s.name}</div>
        <div class="sp-stat">${s.stat.replace('\n','<br>')}</div>
      </div>`).join('')}
    </div>

    <div class="row-label" style="margin-top:6mm">${c.pricingTitle}</div>
    <div class="pricing-row">
      <div class="pr-card free">
        <div class="pr-label">${c.free.label}</div>
        <ul>${c.free.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
      <div class="pr-card prem">
        <div class="pr-label">${c.prem.label}</div>
        <ul>${c.prem.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    </div>

    <div class="row-label" style="margin-top:6mm">${c.valuesTitle}</div>
    <div class="values-strip">
      ${c.values.map(v => `
      <div class="vc">
        <div class="vc-emoji">${v.e}</div>
        <span class="vc-name">${v.n}</span>
        <div class="vc-desc">${v.d}</div>
      </div>`).join('')}
    </div>

    <div class="p2-footer">
      <span>${c.footer}</span>
      <span>${c.pages[2]}</span>
    </div>
  </div>

  <!-- PAGE 4: CTA -->
  <div class="page">
    <div class="p4-hero">
      <div class="p4-bg-circle"></div>
      <div class="p4-bg-circle2"></div>
      <div class="p4-eyebrow">${c.ctaEyebrow}</div>
      <div class="p4-title">${c.ctaTitle.replace('\n','<br>')}</div>
      <div class="p4-sub">${c.ctaSub}</div>
    </div>

    <div class="p4-steps">
      <div class="steps-row">
        ${c.steps.map(s => `
        <div class="step-card">
          <div class="step-num">${s.n}</div>
          <div class="step-title">${s.t}</div>
          <div class="step-desc">${s.d}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="p4-contact">
      <div class="contact-inner">
        <div class="contact-left">
          <div class="cl-title">${c.contactTitle}</div>
          ${c.contacts.map(ct => `
          <div class="cl-row">
            <span class="cl-chip">${ct.l}</span>
            <span class="cl-val">${ct.v}</span>
          </div>`).join('')}
        </div>
        ${logoLight(72)}
      </div>
    </div>

    <div class="p4-quote">
      <div class="qb">
        <div class="qb-text">${c.quoteText}</div>
        <div class="qb-auth">${c.quoteAuth}</div>
      </div>
    </div>

    <div class="p4-footer">
      <span>${c.footer}</span>
      <span>${c.pages[3]}</span>
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
  console.log(`${lang} → ${Math.round(fs.statSync(path.join(OUT, fname)).size / 1024)}KB`);
}

(async () => {
  await generate('EN');
  await generate('NL');
  console.log('Done!');
})();
