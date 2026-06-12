/* Character First — unified access control (single source of truth)
 *
 * Behaviour:
 *  - One access code unlocks the WHOLE site (localStorage 'cf_access' = '1').
 *  - "Full content" premium pages redirect to the login page when locked,
 *    remembering where the user wanted to go (?redirect=).
 *  - "Teaser" pages stay visible but keep their premium sections blurred;
 *    their unlock CTAs are routed to the login page so a code can be entered.
 *  - The matching login page (toegang.html / access.html) reads ?redirect=
 *    and sends the user back after a correct code.
 *
 * Language is auto-detected from the path (/en/ => English).
 * This file lives at docs/character-first/cf-auth.js and is referenced as
 * "cf-auth.js" (NL pages) or "../cf-auth.js" (EN pages in /en/).
 */
(function () {
  var path = location.pathname;
  var isEN = path.indexOf('/en/') !== -1;
  var loginPage = isEN ? 'access.html' : 'toegang.html';
  var file = (path.split('/').pop() || 'index.html').toLowerCase();

  var hasAccess = (function () {
    try { return localStorage.getItem('cf_access') === '1'; }
    catch (e) { return false; }
  })();

  // Premium pages WITHOUT an in-page teaser/blur -> hard redirect when locked.
  // (Pages that carry their own .premium-locked teaser stay visible and just
  //  keep those sections blurred + route their unlock CTA to the login.)
  var FULL_GATE = isEN
    ? ['library.html', 'week-worksheets.html']
    : ['oefeningen.html', 'werkbladen.html', 'week-werkbladen.html'];

  var loginHref = loginPage + '?redirect=' + encodeURIComponent(file);

  function qsa(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }
  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  if (hasAccess) {
    // Unlocked: reveal every premium section across the site.
    onReady(function () {
      qsa('.premium-locked').forEach(function (el) { el.classList.remove('premium-locked'); });
      qsa('.premium-lock, .premium-banner, .premium-gate, .premium-overlay')
        .forEach(function (el) { el.style.display = 'none'; });
    });
    return;
  }

  // Locked + full-content page -> bounce to login immediately (runs in <head>).
  if (FULL_GATE.indexOf(file) !== -1) {
    location.replace(loginHref);
    return;
  }

  // Locked + teaser page -> keep blur, but make every unlock CTA open the login.
  onReady(function () {
    qsa('.premium-lock .lock-cta, .premium-lock a, .premium-banner a, a.lock-cta, a.premium-unlock')
      .forEach(function (a) { a.setAttribute('href', loginHref); });
  });
})();
