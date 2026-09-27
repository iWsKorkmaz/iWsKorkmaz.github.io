/* Progressive enhancement: native details keep the full catalogue usable without JavaScript. */
(() => {
  'use strict';
  const results = document.getElementById('catalog-results');
  if (!results) return;
  const search = document.getElementById('feature-search');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('no-results');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const expand = document.getElementById('expand-all');
  const collapse = document.getElementById('collapse-all');
  const fold = value => value.toLocaleLowerCase('tr-TR').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/[’'`]/g, ' ').trim();
  const modules = [...results.querySelectorAll('.mmo-module')].map(node => ({node, group:node.dataset.group, text:fold(node.textContent), size:node.querySelectorAll('.mmo-detail-grid > li').length}));
  let active = 'all';
  let hadQuery = false;
  function apply() {
    const terms = fold(search.value).split(/\s+/).filter(Boolean).map(term => /^[\u0621-\u064A]+$/.test(term) && term.length > 3 ? term.replace(/^ال/, '') : term);
    let visible = 0, details = 0;
    for (const item of modules) {
      const match = (active === 'all' || item.group === active) && terms.every(term => item.text.includes(term));
      item.node.hidden = !match;
      if (match) { visible++; details += item.size; if (terms.length) item.node.open = true; else if (hadQuery) item.node.open = false; }
    }
    hadQuery = terms.length > 0;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
    count.textContent = `${visible} / ${modules.length} sistem alanı · ${details} özellik ve ayar ayrıntısı`;
    empty.hidden = visible !== 0;
    expand.disabled = collapse.disabled = visible === 0;
  }
  function reset() { search.value = ''; active = 'all'; apply(); }
  function openLinkedModule() {
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const item = modules.find(module => module.node.id === id);
    if (!item) return;
    if (item.node.hidden) reset();
    item.node.open = true;
    requestAnimationFrame(() => item.node.scrollIntoView({block:'start', behavior:'auto'}));
  }
  search.addEventListener('input', apply);
  search.addEventListener('keydown', event => { if (event.key === 'Escape') { reset(); search.focus(); } });
  buttons.forEach(button => button.addEventListener('click', () => { active = button.dataset.filter; apply(); }));
  document.getElementById('clear-search').addEventListener('click', () => { search.value = ''; apply(); search.focus(); });
  document.getElementById('reset-filters').addEventListener('click', () => { reset(); search.focus(); });
  expand.addEventListener('click', () => modules.forEach(item => { if (!item.node.hidden) item.node.open = true; }));
  collapse.addEventListener('click', () => modules.forEach(item => { if (!item.node.hidden) item.node.open = false; }));
  window.addEventListener('hashchange', openLinkedModule);
  let printState = [];
  window.addEventListener('beforeprint', () => { printState = modules.map(item => ({open:item.node.open, hidden:item.node.hidden})); modules.forEach(item => { item.node.open = true; item.node.hidden = false; }); });
  window.addEventListener('afterprint', () => { modules.forEach((item,index) => { if (printState[index]) { item.node.open = printState[index].open; item.node.hidden = printState[index].hidden; } }); });
  document.querySelectorAll('[data-enhanced]').forEach(node => { node.hidden = false; });
  apply();
  openLinkedModule();
})();
