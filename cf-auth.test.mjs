import { parseHTML } from 'linkedom';
import fs from 'fs';

const ROOT = 'docs/character-first';
const authSrc = fs.readFileSync(`${ROOT}/cf-auth.js`, 'utf8');

let pass = 0, fail = 0;
const fails = [];
function check(name, cond) {
  if (cond) { pass++; }
  else { fail++; fails.push(name); console.log('  ✗ ' + name); }
}

// Run cf-auth.js against a page with a mocked environment.
function runAuth({ file, htmlPath, access }) {
  const html = fs.readFileSync(`${ROOT}/${htmlPath}`, 'utf8');
  const { document: doc, Event } = parseHTML(html);
  const isEN = htmlPath.startsWith('en/');
  const pathname = '/docs/character-first/' + htmlPath;

  let replacedTo = null;
  const location = { pathname, replace: (u) => { replacedTo = u; } };
  const store = {};
  if (access) store['cf_access'] = '1';
  const localStorage = { getItem: (k) => (k in store ? store[k] : null) };

  // cf-auth.js references globals: location, localStorage, document
  const fn = new Function('location', 'localStorage', 'document', authSrc);
  fn(location, localStorage, doc);

  // fire DOMContentLoaded for the onReady handlers
  doc.dispatchEvent(new Event('DOMContentLoaded'));

  return { doc, replacedTo, isEN, file };
}

const FULL = {
  nl: ['oefeningen.html', 'werkbladen.html', 'week-werkbladen.html'],
  en: ['library.html', 'week-worksheets.html'],
};
const TEASER = {
  nl: ['library.html', 'season.html', 'mentale-weerbaarheid.html', 'coach-jaar.html', 'coach-maand.html'],
  en: ['season.html', 'resilience.html', 'coach-year.html', 'coach-month.html', 'exercises.html', 'worksheets.html'],
};

console.log('== FULL-GATE pages: locked -> must redirect to login ==');
for (const [lang, list] of Object.entries(FULL)) {
  const login = lang === 'en' ? 'access.html' : 'toegang.html';
  for (const f of list) {
    const p = lang === 'en' ? 'en/' + f : f;
    const r = runAuth({ file: f, htmlPath: p, access: false });
    const want = `${login}?redirect=${encodeURIComponent(f)}`;
    check(`${p} locked -> redirect ${want}`, r.replacedTo === want);
  }
}

console.log('== FULL-GATE pages: unlocked -> NO redirect ==');
for (const [lang, list] of Object.entries(FULL)) {
  for (const f of list) {
    const p = lang === 'en' ? 'en/' + f : f;
    const r = runAuth({ file: f, htmlPath: p, access: true });
    check(`${p} unlocked -> no redirect`, r.replacedTo === null);
  }
}

console.log('== TEASER pages: locked -> NO redirect, lock CTAs point to login ==');
for (const [lang, list] of Object.entries(TEASER)) {
  const login = lang === 'en' ? 'access.html' : 'toegang.html';
  for (const f of list) {
    const p = lang === 'en' ? 'en/' + f : f;
    const r = runAuth({ file: f, htmlPath: p, access: false });
    check(`${p} locked -> no redirect`, r.replacedTo === null);
    const ctas = [...r.doc.querySelectorAll('.premium-lock .lock-cta, .premium-lock a, a.lock-cta')];
    if (ctas.length) {
      const want = `${login}?redirect=${encodeURIComponent(f)}`;
      const allOk = ctas.every(a => a.getAttribute('href') === want);
      check(`${p} -> ${ctas.length} lock CTA(s) routed to ${login}`, allOk);
    } else {
      check(`${p} -> has lock CTA elements`, false);
    }
  }
}

console.log('== TEASER pages: unlocked -> premium-locked removed, locks hidden ==');
for (const [lang, list] of Object.entries(TEASER)) {
  for (const f of list) {
    const p = lang === 'en' ? 'en/' + f : f;
    const r = runAuth({ file: f, htmlPath: p, access: true });
    check(`${p} unlocked -> no .premium-locked left`, r.doc.querySelectorAll('.premium-locked').length === 0);
    const locks = [...r.doc.querySelectorAll('.premium-lock, .premium-banner')];
    check(`${p} unlocked -> locks hidden`, locks.every(el => el.style.display === 'none'));
  }
}

console.log('== LOGIN pages: code CF2026 sets access + sanitizes redirect ==');
for (const lp of ['toegang.html', 'en/access.html']) {
  const html = fs.readFileSync(`${ROOT}/${lp}`, 'utf8');
  // pull the CODES object + redirect sanitizer presence
  check(`${lp} has CF2026 code`, /['"\`]CF2026['"\`]\s*:/.test(html));
  check(`${lp} sets cf_access on success`, /setItem\(\s*['"\`]cf_access['"\`]\s*,\s*['"\`]1['"\`]\s*\)/.test(html));
  check(`${lp} sanitizes redirect param`, /\[a-z0-9_-\]\+\\\.html|\[a-z0-9_-\]\+\.html/i.test(html));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
if (fail) { console.log('FAILED:', fails.join(' | ')); process.exit(1); }
