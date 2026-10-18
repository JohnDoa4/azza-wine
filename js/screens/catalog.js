/* Каталог: список, поиск, фильтры. */
(function (A) {
  const R = A.router, ui = A.ui, D = A.data, S = A.state;
  const count = (n) => A.t('cat.count', { n });
  const TYPES = () => ['red', 'white', 'rose', 'sparkling'].map((k) => [k, A.t('color.' + k)]);
  const COUNTRY_CHIPS = D.countries.filter((c) => c.id !== 'all');

  const filtered = (c) => A.engine.catalog(c.q, { countries: c.countries, types: c.types, price: c.price });

  function listHtml(c) {
    const res = filtered(c);
    if (!res.length) {
      return `<div class="cat-empty"><div class="state-icon">${A.I.search}</div><h2>${A.t('cat.empty.t')}</h2>
        <p>${A.t('cat.empty.d')}</p>
        <div class="chips" style="justify-content:center">${['cat.q1', 'cat.q2', 'cat.q3', 'cat.q4'].map((k) => A.t(k)).map((q) => ui.chip(q, { attrs: `data-act="quick-q" data-q="${q}"` })).join('')}</div>
        ${ui.btn(A.t('cat.resetAll'), 'secondary', 'data-act="reset-all"')}</div>`;
    }
    return `<div class="wine-list">${res.map((w) => ui.wineRow(w, null)).join('')}</div>`;
  }

  function sliderLinear(root, get, set, onChange, min, max) {
    const handles = root.querySelectorAll('.handle');
    const fill = root.querySelector('.fill');
    const pct = (v) => (v - min) / (max - min);
    function paint() {
      const v = get(); const w = root.clientWidth;
      handles.forEach((h, i) => { h.style.left = (pct(v[i]) * w) + 'px'; });
      fill.style.left = (pct(v[0]) * w) + 'px'; fill.style.width = ((pct(v[1]) - pct(v[0])) * w) + 'px';
    }
    let active = null;
    const move = (x) => {
      const r = root.getBoundingClientRect();
      const val = Math.round(min + Math.max(0, Math.min(1, (x - r.left) / r.width)) * (max - min));
      const v = get().slice();
      if (active === 0) v[0] = Math.min(val, v[1] - 5); else v[1] = Math.max(val, v[0] + 5);
      set(v); paint(); onChange && onChange();
    };
    root.addEventListener('pointerdown', (e) => {
      const r = root.getBoundingClientRect(); const v = get();
      const x = (e.clientX - r.left) / r.width * (max - min) + min;
      active = Math.abs(x - v[0]) <= Math.abs(x - v[1]) ? 0 : 1;
      try { root.setPointerCapture(e.pointerId); } catch (_) { /* синтетические события */ } move(e.clientX);
    });
    root.addEventListener('pointermove', (e) => { if (active !== null && e.buttons) move(e.clientX); });
    root.addEventListener('pointerup', () => { active = null; });
    requestAnimationFrame(paint);
    return paint;
  }

  function filterSheet(c) {
    const chips = (items, sel, act) => items.map(([id, title]) => ui.chip(title, { active: sel.includes(id), attrs: `data-act="${act}" data-id="${id}"` })).join('');
    return `<div class="overlay" data-act="close-filters"></div>
      <div class="sheet filters" role="dialog" aria-label="${A.t('f.title')}">
        <div class="grab"></div>
        <div class="f-head"><span class="sheet-title">${A.t('f.title')}</span><button class="f-reset" data-act="f-reset">${A.t('f.reset')}</button></div>
        <div class="f-sec"><b>${A.t('f.country')}</b><div class="chips" data-f="countries">${chips(COUNTRY_CHIPS.map((x) => [x.id, x.title]), c.countries, 'f-country')}</div></div>
        <div class="f-sec"><b>${A.t('f.type')}</b><div class="chips" data-f="types">${chips(TYPES(), c.types, 'f-type')}</div></div>
        <div class="f-sec"><b>${A.t('f.price')}</b>
          <div class="f-price"><span class="muted" data-fcount></span><span data-fprice></span></div>
          <div class="range" data-frange><div class="track"></div><div class="fill"></div><div class="handle" data-h="0"></div><div class="handle" data-h="1"></div></div></div>
        <button class="f-row" data-act="soon"><span>${A.t('f.region')}<i>${A.t('any')}</i></span>${A.I.chevR('#746E65')}</button>
        <button class="f-row" data-act="soon"><span>${A.t('f.grape')}<i>${A.t('any')}</i></span>${A.I.chevR('#746E65')}</button>
        <div class="f-foot"><button class="btn btn-primary btn-block" data-act="f-apply">${A.t('f.apply')}</button></div>
      </div>`;
  }

  R.register('catalog', {
    backTo: 'home',
    guard() { return null; },
    render(ctx) {
      if (ctx.params.q !== undefined) S.catalog.q = ctx.params.q;
      const c = S.catalog;
      const n = filtered(c).length;
      return `${ui.toprow(A.t('title.catalog'), { right: { icon: A.I.sliders, cls: 'dark', attrs: `data-act="open-filters" aria-label="${A.t('f.title')}"` } })}
        <div class="cat-head">
          <label class="search ${c.q ? 'has-text' : ''}">${A.I.search}<input type="search" data-q placeholder="${A.t('cat.search')}" value="${ui.esc(c.q)}" autocomplete="off" aria-label="${A.t('cat.searchAria')}"><button class="clear" data-act="clear-q" aria-label="${A.t('clear')}">${A.I.close}</button></label>
          <div class="counter"><b data-count>${count(n)}</b><span>${A.t('cat.sort')} ${A.I.chevD}</span></div>
        </div>
        <div class="cat-scroll scroll" data-list>${listHtml(c)}</div>
        ${ctx.params.sheet === 'filters' ? filterSheet(c) : ''}`;
    },
    mount(el, ctx) {
      const c = S.catalog;
      const input = el.querySelector('[data-q]');
      const refresh = () => {
        const n = filtered(c).length;
        el.querySelector('[data-count]').textContent = count(n);
        el.querySelector('[data-list]').innerHTML = listHtml(c);
        el.querySelector('.search').classList.toggle('has-text', !!c.q);
      };
      el._refresh = refresh;
      input.addEventListener('input', () => { c.q = input.value; refresh(); });
      if (ctx.params.sheet === 'filters') this.bindFilters(el);
    },
    bindFilters(el) {
      const c = S.catalog;
      const sheet = el.querySelector('.sheet.filters');
      if (!sheet) return;
      const tmp = { q: c.q, countries: c.countries.slice(), types: c.types.slice(), price: c.price.slice() };
      el._tmp = tmp;
      const paintInfo = () => {
        const n = filtered(tmp).length;
        sheet.querySelector('[data-fcount]').textContent = count(n);
        sheet.querySelector('[data-fprice]').textContent = tmp.price[0] + ' – ' + tmp.price[1] + ' ₼';
      };
      sliderLinear(sheet.querySelector('[data-frange]'), () => tmp.price, (v) => { tmp.price = v; }, paintInfo, 5, 100);
      paintInfo();
      el._fInfo = paintInfo;
    },
    act: {
      'open-filters'(el) {
        if (el.querySelector('.sheet.filters')) return;
        el.insertAdjacentHTML('beforeend', filterSheet(S.catalog));
        R.screens.catalog.bindFilters(el);
      },
      'close-filters'(el) { ui.closeOverlay(el); },
      'f-country'(el, ctx, btn) { toggle(el._tmp.countries, btn); },
      'f-type'(el, ctx, btn) { toggle(el._tmp.types, btn); },
      'f-reset'(el) {
        const t = el._tmp; t.countries = []; t.types = []; t.price = [5, 100];
        el.querySelectorAll('.sheet.filters .chip').forEach((b) => b.classList.remove('active'));
        el._fInfo(); repaintRange(el);
      },
      'f-apply'(el) {
        const t = el._tmp; S.catalog.countries = t.countries; S.catalog.types = t.types; S.catalog.price = t.price;
        ui.closeOverlay(el, () => el._refresh());
      },
      soon() { ui.toast(A.t('f.soon')); },
      'clear-q'(el) { S.catalog.q = ''; el.querySelector('[data-q]').value = ''; el._refresh(); },
      'quick-q'(el, ctx, btn) { S.catalog.q = btn.dataset.q; el.querySelector('[data-q]').value = btn.dataset.q; el._refresh(); },
      'reset-all'(el) { S.catalog = Object.assign(S.catalog, { q: '', countries: [], types: [], price: [5, 100] }); el.querySelector('[data-q]').value = ''; el._refresh(); },
    },
  });

  function toggle(arr, btn) {
    const id = btn.dataset.id; const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1); else arr.push(id);
    btn.classList.toggle('active', i < 0);
    const el = btn.closest('.screen'); el._fInfo();
  }
  function repaintRange(el) {
    const root = el.querySelector('[data-frange]'); const t = el._tmp; const w = root.clientWidth; const pct = (v) => (v - 5) / 95;
    root.querySelectorAll('.handle').forEach((h, i) => { h.style.left = pct(t.price[i]) * w + 'px'; });
    const fill = root.querySelector('.fill'); fill.style.left = pct(t.price[0]) * w + 'px'; fill.style.width = (pct(t.price[1]) - pct(t.price[0])) * w + 'px';
  }
})(window.Azza = window.Azza || {});
