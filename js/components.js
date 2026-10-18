/* Общие компоненты: иконки и функции, возвращающие HTML. */
(function (A) {
  const stroke = (d, c = 'currentColor', w = 1.8) =>
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const I = {
    back: stroke('M19 12H5m6-6-6 6 6 6'),
    chevR: (c, w) => stroke('m9 6 6 6-6 6', c || 'currentColor', w || 2),
    chevThin: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="${c || 'currentColor'}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chevD: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="#746E65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sliders: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 8h9M17 8h3M4 16h3M11 16h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="15" cy="8" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="16" r="2" stroke="currentColor" stroke-width="1.8"/></svg>',
    share: stroke('M12 15V4m0 0L8 8m4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5'),
    search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    close: stroke('M6 6l12 12M18 6 6 18', 'currentColor', 1.8),
    pin: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="${c || '#7A1722'}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.5" stroke="${c || '#7A1722'}" stroke-width="1.8"/></svg>`,
    clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#7A1722" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="#7A1722" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    map: (c, s) => `<svg width="${s || 24}" height="${s || 24}" viewBox="0 0 24 24" fill="none"><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" stroke="${c || 'currentColor'}" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="${c || 'currentColor'}" stroke-width="1.8"/></svg>`,
    locate: (c, s) => `<svg width="${s || 22}" height="${s || 22}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="${c || 'currentColor'}" stroke-width="1.8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="${c || 'currentColor'}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#7A1722" stroke-width="1.8"/><path d="M12 11v5" stroke="#7A1722" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="1" fill="#7A1722"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="#7A1722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wifiOff: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M2 9a15 15 0 0 1 4.5-2.7M22 9a15 15 0 0 0-8.5-3.9M5 12.5a10 10 0 0 1 3-2M19 12.5a10 10 0 0 0-5.2-2.9M8.5 16a5 5 0 0 1 7 0" stroke="#7A1722" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="19" r="1.2" fill="#7A1722"/><path d="m3 3 18 18" stroke="#7A1722" stroke-width="1.8" stroke-linecap="round"/></svg>',
    nav: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m4 11 16-7-7 16-2-7-7-2Z" stroke="#7A1722" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 4h3l1.5 4-2 1.5a10 10 0 0 0 5 5L15 12.5l4 1.5v3c0 1-1 2-2 2C10 19 5 14 5 6c0-1 0-2 1-2Z" stroke="#7A1722" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    bottle: '<svg width="60" height="150" viewBox="0 0 60 150" fill="none"><path d="M24 4h12v28c0 10 14 22 14 44v64c0 5-4 8-8 8H18c-4 0-8-3-8-8V76c0-22 14-34 14-44V4Z" stroke="#746E65" stroke-width="2" stroke-linejoin="round"/><rect x="14" y="88" width="32" height="38" rx="3" stroke="#746E65" stroke-width="1.6"/></svg>',
    // значки уровней (экспорт из Figma, компонент chip-recommend)
    badgeBest: A.badgeBestSvg || '',
    badgeGreat: '<svg viewBox="0 0 16 16" fill="none"><path d="M1.58691 12.2336V5.70026C1.58691 4.76693 1.98691 4.43359 2.92025 4.43359H3.58691C4.52025 4.43359 4.92025 4.76693 4.92025 5.70026V12.2336C4.92025 13.1669 4.52025 13.5003 3.58691 13.5003H2.92025C1.98691 13.5003 1.58691 13.1669 1.58691 12.2336Z" fill="#C99130"/><path d="M5.75195 12.4645C5.75195 12.8088 5.92913 13.1289 6.22092 13.3118L7.05357 13.8336C7.32024 14.1003 7.92024 14.2336 8.32024 14.2336H10.8536C11.6536 14.2336 12.5202 13.6336 12.7202 12.8336L14.3202 7.96697C14.6536 7.03364 14.0536 6.23364 13.0536 6.23364H10.3869C9.9869 6.23364 9.65357 5.9003 9.72024 5.43364L10.0536 3.3003C10.1869 2.7003 9.7869 2.03364 9.1869 1.83364C8.65357 1.63364 7.9869 1.9003 7.72024 2.3003L5.95925 4.59024C5.82483 4.76503 5.75195 4.97934 5.75195 5.19984V12.4645Z" fill="#C99130"/></svg>',
    badgeGood: '<svg viewBox="0 0 16 16" fill="none"><path d="M7.16695 1.63327C7.6269 1.24006 8.37999 1.24011 8.84664 1.63327L9.90035 2.5405C10.1004 2.7137 10.4737 2.85299 10.7402 2.853H11.874C12.5805 2.85324 13.1601 3.43359 13.1601 4.14011V5.27292C13.1601 5.53292 13.3003 5.91374 13.4736 6.11374L14.3798 7.16647C14.7732 7.62647 14.7732 8.38047 14.3798 8.84714L13.4736 9.89987C13.3003 10.0998 13.1602 10.4731 13.1601 10.7397V11.8735C13.16 12.58 12.5804 13.1594 11.874 13.1596H10.7402C10.4803 13.1596 10.1004 13.2999 9.90035 13.4731L8.84664 14.3803C8.38668 14.7734 7.63354 14.7734 7.16695 14.3803L6.11324 13.4731C5.91317 13.2999 5.53994 13.1596 5.2734 13.1596H4.12008C3.41352 13.1596 2.83403 12.5801 2.83395 11.8735V10.7329C2.83378 10.473 2.69382 10.0998 2.5273 9.89987L1.62691 8.8403C1.24025 8.3803 1.24025 7.63331 1.62691 7.17331L2.5273 6.11374C2.69397 5.91374 2.83395 5.53975 2.83395 5.27975V4.13327C2.83399 3.42668 3.4135 2.84721 4.12008 2.84714H5.2734C5.53326 2.84714 5.91316 2.70686 6.11324 2.53366L7.16695 1.63327ZM11.1201 5.67917C10.7291 5.28905 10.0961 5.29019 9.70602 5.68112L7.1943 8.19675L6.29586 7.2944C5.90615 6.9031 5.27215 6.90179 4.88082 7.29147C4.48974 7.6812 4.48828 8.31526 4.87789 8.70651L6.48531 10.3198C6.67279 10.5077 6.92783 10.6136 7.19332 10.6137C7.45885 10.6138 7.7137 10.5077 7.90133 10.3198L11.1211 7.09323C11.5111 6.70238 11.5108 6.06931 11.1201 5.67917Z" fill="#45634F"/></svg>',
    logo: 'assets/images/logo.png',
  };

  const BADGE_LABEL = { get best() { return A.t('badge.best'); }, get great() { return A.t('badge.great'); }, get good() { return A.t('badge.good'); } };

  function badge(kind) {
    if (!kind) return '';
    const icon = kind === 'best' ? I.badgeBest : kind === 'great' ? I.badgeGreat : I.badgeGood;
    return `<span class="badge ${kind}">${icon}<span>${BADGE_LABEL[kind]}</span></span>`;
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtPrice = (p) => (Math.round(p * 10) / 10).toFixed(1).replace(/\.0$/, '') + ' ₼';
  const fmtPriceDot = (p) => p.toFixed(1) + ' ₼';

  function btn(label, kind, attrs, extra) {
    return `<button class="btn btn-${kind || 'primary'} ${extra || ''}" ${attrs || ''}>${label}</button>`;
  }

  function iconBtn(icon, attrs, cls) {
    return `<button class="iconbtn ${cls || ''}" ${attrs || ''}>${icon}</button>`;
  }

  /** Верхняя панель: назад + заголовок + правая кнопка. */
  function toprow(title, o) {
    o = o || {};
    const right = o.right ? iconBtn(o.right.icon, o.right.attrs || '', o.right.cls || '') : iconBtn(I.back, 'tabindex="-1" aria-hidden="true"', 'ghost');
    const left = o.noBack ? iconBtn(I.back, 'tabindex="-1" aria-hidden="true"', 'ghost') : iconBtn(I.back, o.backAttrs || `data-back aria-label="${A.t('back')}"`);
    return `<div class="toprow ${o.tight ? 'tight' : ''}">${left}<div class="page-title">${esc(title)}</div>${right}</div>`;
  }

  function footer(buttonsHtml, two) {
    return `<div class="footer ${two ? 'two' : ''}">${buttonsHtml}</div>`;
  }

  function chip(label, o) {
    o = o || {};
    return `<button class="chip ${o.active ? 'active' : ''} ${o.white ? 'white' : ''}" ${o.attrs || ''}>${esc(label)}</button>`;
  }

  function wineTags(w) {
    const color = A.i18n.colorName(w.color);
    return color + (A.engine ? ' · ' + A.engine.styleShort(w) : '');
  }

  function wineRow(w, badgeKind, attrs) {
    const meta = [A.i18n.countryName(w), A.i18n.regionPart(w), w.grape].filter(Boolean).join(' · ');
    return `<div class="wine-row" role="button" tabindex="0" data-go="wine" data-id="${w.id}" ${attrs || ''}>
      <div class="wine-bottle"><img src="${w.photo}" alt="${esc(w.name)}" onerror="this.replaceWith(Azza.ui.bottleStub())"></div>
      <div class="wine-info">
        <div class="wine-name">${esc(w.name)}</div>
        <div class="wine-meta">${esc(meta)}</div>
        <div class="wine-tags">${esc(wineTags(w))}</div>
        <div class="wine-bottom">${badge(badgeKind)}<span style="flex:1"></span><span class="price">${fmtPriceDot(w.price)}</span></div>
      </div></div>`;
  }

  function bottleStub() {
    const d = document.createElement('div');
    d.innerHTML = I.bottle;
    d.firstChild.setAttribute('width', '40');
    d.firstChild.setAttribute('height', '100');
    return d.firstChild;
  }

  function statusChip(s) {
    return `<span class="status-chip ${s.open ? '' : 'closed'}">${A.t(s.open ? 'store.open' : 'store.closed')}</span>`;
  }

  function storeCard(s, o) {
    o = o || {};
    const dist = o.geo ? s.distance : '—';
    return `<div class="store-card" role="button" tabindex="0" data-go="map" data-store="${s.id}">
      <div class="sc-top"><div class="sc-pin">${I.pin('#7A1722')}</div>
        <div class="sc-info"><div class="sc-name">${esc(s.name)}</div><div class="sc-addr">${esc(s.address)}</div><div class="sc-hours">${esc(s.hours)}</div></div>
        <div class="sc-status">${statusChip(s)}<span class="sc-dist">${dist}</span></div></div>
      <div class="sc-divider"></div>
      <div class="sc-link"><span>${A.t('store.link')}</span>${I.chevThin('#7A1722')}</div></div>`;
  }

  function toast(msg) {
    const host = document.querySelector('.phone');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    host.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  /** Закрывает шторку/модалку с анимацией. */
  function closeOverlay(root, done) {
    const els = root.querySelectorAll('.overlay, .sheet, .modal');
    els.forEach((e) => e.classList.add('leaving'));
    setTimeout(() => { els.forEach((e) => e.remove()); if (done) done(); }, 240);
  }

  A.I = I;
  A.ui = { badge, btn, iconBtn, toprow, footer, chip, wineRow, bottleStub, storeCard, statusChip, toast, closeOverlay, esc, fmtPrice, fmtPriceDot, wineTags, BADGE_LABEL };
})(window.Azza = window.Azza || {});
