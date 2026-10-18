/* «Где купить»: список магазинов, карта, выбор навигатора, ошибки. */
(function (A) {
  const R = A.router, ui = A.ui, D = A.data, S = A.state;
  const storeById = (id) => D.stores.find((s) => s.id === id) || D.stores[0];

  const offlineMarkup = (from) => stateScreen({
    title: A.t('off.title'), icon: A.I.wifiOff,
    text: A.t('off.text'),
    pill: A.t('off.pill'), retry: `data-act="retry-net" data-from="${from || 'stores'}"`, titleTop: 'Wine AZZA',
  });

  function stateScreen(o) {
    return `${ui.toprow(o.titleTop || A.t('title.buy'))}
      <div class="state-center"><div class="state-icon">${o.icon}</div><h2>${o.title}</h2><p>${o.text}</p>
        ${o.pill ? `<span class="pill-note">${o.pill}</span>` : ''}
        <div class="row">${ui.btn(A.t('btn.return'), 'secondary', 'data-back')}${ui.btn(A.t('btn.retry'), 'primary', o.retry)}</div></div>`;
  }

  /* ---------- список магазинов ---------- */
  function notice() {
    return `<div class="notice">${A.I.info}<div><b>${A.t('stores.notice.t')}</b><p>${A.t('stores.notice.d')}</p><a role="button" tabindex="0" data-act="geo-settings">${A.t('stores.notice.a')}</a></div></div>`;
  }
  function prompt() {
    return `<div class="overlay"></div><div class="modal" role="dialog" aria-label="${A.t('geo.aria')}">
      <div class="round-icon">${A.I.locate('#7A1722', 32)}</div><h2>${A.t('geo.title')}</h2>
      <p>${A.t('geo.text')}</p>
      <div class="row">${ui.btn(A.t('geo.no'), 'secondary', 'data-act="geo-no"')}${ui.btn(A.t('geo.yes'), 'primary', 'data-act="geo-yes"')}</div></div>`;
  }
  function listCards(filter) {
    const geo = S.geo === 'granted';
    let list = D.stores.slice();
    if (filter === 'open') list = list.filter((s) => s.open);
    if (geo) list.sort((a, b) => a.km - b.km); else list.sort((a, b) => a.name.localeCompare(b.name));
    return list.map((s) => ui.storeCard(s, { geo })).join('');
  }
  function chipsRow(filter) {
    return [['all', 'chip.all'], ['open', 'chip.open'], ['near', 'chip.near']].map(([id, l]) => ui.chip(A.t(l), { active: filter === id, attrs: `data-act="filter" data-f="${id}"` })).join('');
  }

  R.register('stores', {
    backTo: 'home', needsNet: true,
    render(ctx) {
      const showNotice = S.geo !== 'granted';
      const askNow = S.geo === 'unknown' && ctx.params.prompt !== '0';
      return `${ui.toprow(A.t('title.buy'))}
        <div class="stores-scroll scroll" data-stores>
          ${showNotice ? `<div class="stores-notice">${notice()}</div>` : ''}
          <div class="stores-chips chips nowrap" data-chips>${chipsRow('all')}</div>
          <div class="stores-list" data-list>${listCards('all')}</div>
        </div>${askNow ? prompt() : ''}`;
    },
    mount(el) { el._filter = 'all'; },
    act: {
      filter(el, ctx, btn) {
        const f = btn.dataset.f;
        if (f === 'near' && S.geo !== 'granted') { ui.toast(A.t('geo.need')); return; }
        el._filter = f;
        el.querySelector('[data-chips]').innerHTML = chipsRow(f);
        el.querySelector('[data-list]').innerHTML = listCards(f === 'near' ? 'all' : f);
      },
      'geo-yes'(el) { S.geo = 'granted'; ui.closeOverlay(el, () => R.go('stores', { prompt: '0' }, { replace: true, dir: 'fade' })); },
      'geo-no'(el) { S.geo = 'denied'; ui.closeOverlay(el, () => R.go('stores', { prompt: '0' }, { replace: true, dir: 'fade' })); },
      'geo-settings'() { ui.toast(A.t('geo.settings')); },
    },
  });

  /* ---------- карта ---------- */
  const IMG_W = 1024, IMG_H = 1822;
  function pinHtml(s, sel) {
    return `<button class="map-pin ${sel ? 'sel' : ''} ${sel && !s.open ? 'closed' : ''}" data-act="pin" data-store="${s.id}" style="left:${(s.ix / IMG_W * 100).toFixed(3)}%;top:${(s.iy / IMG_H * 100).toFixed(3)}%" aria-label="${ui.esc(s.name)}"><i></i></button>`;
  }
  function cardHtml(s) {
    const geo = S.geo === 'granted';
    return `<div class="map-card" data-store="${s.id}"><div class="mc-top"><div class="mc-info"><b>${ui.esc(s.name)}</b><span>${ui.esc(s.address)}</span><span class="h">${ui.esc(s.hours)}</span></div>
      <div class="sc-status">${ui.statusChip(s)}<span class="sc-dist">${geo ? s.distance : '—'}</span></div></div>
      ${ui.btn(A.t('map.route'), 'secondary btn-block', `data-act="route" data-store="${s.id}"`)}</div>`;
  }
  function navSheet(s) {
    return `<div class="overlay" data-act="close-nav"></div><div class="sheet" role="dialog" aria-label="${A.t('map.route')}">
      <div class="grab"></div><div class="sheet-title">${A.t('map.route')}</div>
      <div class="sheet-sub">${ui.esc(A.t('nav.sub', { name: s.name, addr: s.address }))}</div>
      ${D.apps.list.map((n) => `<button class="app-row" data-act="open-app" data-app="${n}"><span class="app-ic">${A.I.nav}</span><span>${n}</span></button>`).join('')}
    </div>`;
  }

  R.register('map', {
    backTo: 'stores', needsNet: true,
    render(ctx) {
      if (!S.mapOk) return stateScreen({ title: A.t('map.fail.t'), icon: A.I.map('#7A1722', 48), text: A.t('map.fail.d'), retry: 'data-act="retry-map"' });
      const sel = storeById(ctx.params.store);
      return `<div class="map-wrap"><div class="map-img"><img src="assets/images/map-sample.png" alt="${A.t('map.alt')}" draggable="false">${D.stores.map((s) => pinHtml(s, s.id === sel.id)).join('')}</div><i class="map-you" aria-label="${A.t('map.you')}"></i></div>
        ${ui.toprow('Wine AZZA', { right: { icon: A.I.locate(), attrs: `data-act="locate" aria-label="${A.t('map.locate')}"` } })}
        <div class="map-card-host" data-card>${cardHtml(sel)}</div>
        ${ctx.params.sheet === 'nav' ? navSheet(sel) : ''}`;
    },
    mount(el, ctx) { el._store = storeById(ctx.params.store).id; },
    act: {
      pin(el, ctx, btn) { selectStore(el, btn.dataset.store); },
      route(el, ctx, btn) { el._store = btn.dataset.store; el.insertAdjacentHTML('beforeend', navSheet(storeById(btn.dataset.store))); },
      'close-nav'(el) { ui.closeOverlay(el); },
      'open-app'(el, ctx, btn) { ui.closeOverlay(el, () => ui.toast(A.t('nav.opening', { app: btn.dataset.app }))); },
      locate() { ui.toast(S.geo === 'granted' ? A.t('map.you') : A.t('geo.off')); },
      'retry-map'(el) { ui.toast(A.t('map.loading')); setTimeout(() => { S.mapOk = true; R.go('map', {}, { replace: true, dir: 'fade' }); }, 700); },
    },
  });

  /** Выбор метки: подсветка на карте и замена карточки внизу. */
  function selectStore(el, id) {
    if (el._store === id) return;
    el._store = id;
    el.querySelectorAll('.map-pin').forEach((p) => {
      const s = storeById(p.dataset.store); const on = s.id === id;
      p.classList.toggle('sel', on); p.classList.toggle('closed', on && !s.open);
    });
    el.querySelector('[data-card]').innerHTML = cardHtml(storeById(id));
    try { history.replaceState(null, '', '#/map?store=' + id); } catch (e) { /* file:// */ }
    const cur = R.current(); if (cur) cur.params = Object.assign({}, cur.params, { store: id });
  }

  R.register('offline', {
    render(ctx) { return offlineMarkup(ctx.params.from); },
    act: {
      'retry-net'(el, ctx, btn) { ui.toast(A.t('off.checking')); setTimeout(() => { S.net = 'online'; R.go(btn.dataset.from || 'stores', {}, { replace: true, dir: 'fade' }); }, 800); },
    },
  });
})(window.Azza = window.Azza || {});
