/* Explicit language choice takes precedence; pages also work without JavaScript. */
(() => {
  'use strict';
  const supported = ['tr', 'en', 'ar'];
  const key = 'iwsgames.language';
  const path = location.pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
  const match = location.pathname.match(/^\/(en|ar)(?:\/|$)/);
  const current = match ? match[1] : 'tr';
  const url = new URL(location.href);
  const requested = url.searchParams.get('lang');
  let saved = null; try { saved = localStorage.getItem(key); } catch {}
  const chosen = supported.includes(requested) ? requested : (match ? current : (supported.includes(saved) ? saved : 'tr'));
  function target(language) { const next = new URL(location.href); next.pathname = (language === 'tr' ? '' : '/' + language) + path; next.searchParams.delete('lang'); return next; }
  try { localStorage.setItem(key, chosen); } catch {}
  if (chosen !== current) { location.replace(target(chosen).href); return; }
  if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); history.replaceState(null, '', url.href); }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-site-language]').forEach(link => {
      const language = link.dataset.siteLanguage;
      const next = target(language); next.searchParams.set('lang', language); link.href = next.href;
      link.addEventListener('click', () => { const currentTarget=target(language); currentTarget.searchParams.set('lang',language); link.href=currentTarget.href; try { localStorage.setItem(key, language); } catch {} });
    });
  });
})();
