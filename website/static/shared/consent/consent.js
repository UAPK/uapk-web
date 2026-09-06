/**
 * Consent gate for the Sanker Office sites.
 *
 * Replaces the previous notice, which was not a gate: it had an accept button
 * and no way to decline, and its copy read "No cookies, no tracking" while
 * huckesanker.com, marksandmore.co and morpheusmark.com were loading the
 * Google Ads and LinkedIn tags underneath it. A banner asserting something
 * untrue is a worse position than no banner.
 *
 * How gating works: marketing scripts ship as
 *
 *     <script type="text/plain" data-consent="marketing"> ... </script>
 *
 * The browser will not execute type="text/plain", so nothing runs and no
 * cookie is set until someone accepts. On accept the block is rewritten to a
 * real script tag and Google Consent Mode v2 is moved to granted.
 *
 * Plausible is deliberately NOT gated: it is cookieless and sets no
 * identifier, so analytics keeps working for people who decline. That is the
 * whole reason the behavioural layer was built on Plausible rather than on
 * the ad tags.
 *
 * @version 2.0.0
 */
(function () {
  'use strict';

  var STORE = 'consent_v2';
  var defaults = {
    language: (document.documentElement.lang || 'en').slice(0, 2) === 'de' ? 'de' : 'en',
    privacyUrl: '/legal/privacy/',
    duration: 182,          // days; a decision is re-asked twice a year
    respectDNT: true,
    content: {
      en: {
        title: 'Cookies and measurement',
        // Names what actually loads. If a site stops loading these, change
        // the copy in the same commit.
        message: 'Analytics here is cookieless (Plausible) and always on. ' +
                 'With your consent we also load Google Ads and LinkedIn tags, ' +
                 'which set cookies and let those platforms measure ads. ' +
                 'You can decline and the site works exactly the same.',
        accept: 'Accept',
        reject: 'Decline',
        more: 'Privacy policy'
      },
      de: {
        title: 'Cookies und Messung',
        message: 'Die Reichweitenmessung hier ist cookiefrei (Plausible) und immer aktiv. ' +
                 'Mit Ihrer Einwilligung laden wir zusätzlich Google-Ads- und LinkedIn-Tags, ' +
                 'die Cookies setzen und diesen Plattformen die Messung von Anzeigen erlauben. ' +
                 'Sie können ablehnen — die Website funktioniert unverändert.',
        accept: 'Einwilligen',
        reject: 'Ablehnen',
        more: 'Datenschutzerklärung'
      }
    }
  };
  var cfg = Object.assign({}, defaults, window.consentConfig || {});
  var t = cfg.content[cfg.language] || cfg.content.en;

  // ── Consent Mode v2: deny before any tag can ask ────────────────────
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function setConsent(granted) {
    var v = granted ? 'granted' : 'denied';
    gtag('consent', granted ? 'update' : 'default', {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v,
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
  }

  function stored() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) { return null; }
      var d = JSON.parse(raw);
      var expiry = new Date(d.at);
      expiry.setDate(expiry.getDate() + cfg.duration);
      return new Date() < expiry ? d : null;
    } catch (e) { return null; }
  }

  function remember(accepted) {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        accepted: accepted, at: new Date().toISOString(), v: 2
      }));
    } catch (e) { /* private mode — the decision holds for this page only */ }
  }

  function activateMarketingScripts() {
    var blocks = document.querySelectorAll('script[type="text/plain"][data-consent="marketing"]');
    Array.prototype.forEach.call(blocks, function (old) {
      var s = document.createElement('script');
      if (old.dataset.src) { s.src = old.dataset.src; s.async = true; }
      else { s.text = old.textContent; }
      old.parentNode.replaceChild(s, old);
    });
  }

  function accept() { setConsent(true); remember(true); activateMarketingScripts(); hide(); }
  function reject() { setConsent(false); remember(false); hide(); }

  var el = null;
  function hide() {
    if (el) { el.classList.remove('consent-banner--visible'); setTimeout(function () {
      if (el && el.parentNode) { el.parentNode.removeChild(el); } el = null;
    }, 300); }
  }

  function show() {
    el = document.createElement('div');
    el.className = 'consent-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', t.title);
    el.innerHTML =
      '<div class="consent-banner__inner">' +
        '<div class="consent-banner__text">' +
          '<strong class="consent-banner__title"></strong>' +
          '<p class="consent-banner__message"></p>' +
        '</div>' +
        '<div class="consent-banner__actions">' +
          '<a class="consent-banner__link" href="' + cfg.privacyUrl + '"></a>' +
          '<button type="button" class="consent-banner__reject"></button>' +
          '<button type="button" class="consent-banner__accept"></button>' +
        '</div>' +
      '</div>';
    // textContent, not innerHTML — copy is data, never markup.
    el.querySelector('.consent-banner__title').textContent = t.title;
    el.querySelector('.consent-banner__message').textContent = t.message;
    el.querySelector('.consent-banner__link').textContent = t.more;
    var no = el.querySelector('.consent-banner__reject');
    var yes = el.querySelector('.consent-banner__accept');
    no.textContent = t.reject;
    yes.textContent = t.accept;
    no.addEventListener('click', reject);
    yes.addEventListener('click', accept);
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('consent-banner--visible'); });
  }

  function dnt() {
    return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' ||
           window.doNotTrack === '1';
  }

  // Deny first, always. Anything that asks before a choice is made gets "no".
  setConsent(false);

  function init() {
    var prior = stored();
    if (prior) {
      if (prior.accepted) { setConsent(true); activateMarketingScripts(); }
      return;                       // decision on record — do not re-ask
    }
    if (cfg.respectDNT && dnt()) { return; }   // DNT is already an answer
    show();
  }

  // Exposed so a privacy page can offer "change your choice".
  window.consentReset = function () {
    try { localStorage.removeItem(STORE); } catch (e) { /* nothing to clear */ }
    location.reload();
  };
  window.consentState = function () {
    var d = stored();
    return d ? (d.accepted ? 'accepted' : 'declined') : 'undecided';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
