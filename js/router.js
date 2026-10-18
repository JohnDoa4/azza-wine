/* Состояние приложения и навигация между экранами. */
(function (A) {
  const state = {
    occasion: null, dish: null, color: null, country: null, budget: [10, 40],
    lang: (A.i18n && A.i18n.lang) || 'ru',
    geo: 'unknown',     // unknown | granted | denied
    net: 'online',      // online | offline
    mapOk: true,        // false — «Карта не загрузилась»
    catalog: { q: '', countries: [], types: [], price: [5, 100] },
    from: null,         // откуда открыта карточка вина (results | catalog)
  };
  const screens = {};
  const stack = [];
  let host = null;
  let busy = false;

  const register = (name, def) => { screens[name] = def; };
  const current = () => stack[stack.length - 1];

  function qs(params) {
    const e = Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '');
    return e.length ? '?' + e.map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&') : '';
  }
  function syncHash(entry) {
    try { history.replaceState(null, '', '#/' + entry.name + qs(entry.params)); } catch (e) { /* file:// в некоторых браузерах */ }
  }
  function parseHash() {
    const m = (location.hash || '').replace(/^#\/?/, '');
    if (!m) return null;
    const [name, q] = m.split('?');
    const params = {};
    (q || '').split('&').filter(Boolean).forEach((kv) => { const [k, v] = kv.split('='); params[k] = decodeURIComponent(v || ''); });
    return screens[name] ? { name, params } : null;
  }

  function build(entry) {
    const def = screens[entry.name];
    if (!def) throw new Error('Нет экрана: ' + entry.name);
    const el = document.createElement('div');
    el.className = 'screen';
    el.dataset.screen = entry.name;
    const ctx = { params: entry.params || {}, state, el, go, back, A };
    el.innerHTML = def.render(ctx);
    el._ctx = ctx;
    return { el, def, ctx };
  }

  function mount(built) {
    if (built.def.mount) built.def.mount(built.el, built.ctx);
  }


  /** Появление контента: элементы по очереди сверху вниз (прозрачность + лёгкий сдвиг по вертикали). */
  function reveal(el, base) {
    const SKIP = '.bg-cellar,.overlay,.sheet,.modal,.toast,.map-wrap,.map-you,.map-pin';
    const GROUP = '.list-scroll,.cat-scroll,.stores-scroll,.state-center,.budget,.wine-list,.stores-list,.cat-head,.detail,.d-left,.d-photo,.splash';
    const out = [];
    (function collect(node, depth) {
      Array.from(node.children).forEach((c) => {
        if (c.matches(SKIP)) return;
        if (depth < 4 && c.matches(GROUP)) collect(c, depth + 1); else out.push(c);
      });
    })(el, 0);
    const host = el.getBoundingClientRect();
    const scale = A.scale || 1;
    const items = out.map((n, i) => ({ n, i, top: (n.getBoundingClientRect().top - host.top) / scale }))
      .sort((a, b) => (a.top - b.top) || (a.i - b.i));
    items.forEach((it, k) => {
      const d = base + Math.min(k, 14) * 55;
      it.n.style.setProperty('--d', d + 'ms');
      it.n.classList.add('rise');
      const done = () => { it.n.classList.remove('rise'); it.n.style.removeProperty('--d'); };
      it.n.addEventListener('animationend', (e) => { if (e.target === it.n) done(); }, { once: false });
      setTimeout(done, d + 900);
    });
  }

  function show(entry, dir) {
    const next = build(entry);
    const prev = host.querySelector('.screen:not(.leaving)');
    host.appendChild(next.el);
    mount(next);
    reveal(next.el, dir === 'none' ? 40 : dir === 'fade' ? 80 : 160);
    A.setStatusTone && A.setStatusTone(entry.name);
    if (prev && dir !== 'none') {
      busy = true;
      prev.classList.add('leaving');
      const cls = dir === 'back' ? ['leave-back', 'enter-back'] : dir === 'fade' ? ['', 'enter-fade'] : ['leave-fwd', 'enter-fwd'];
      if (cls[0]) prev.classList.add(cls[0]);
      next.el.classList.add(cls[1]);
      setTimeout(() => { prev.remove(); next.el.classList.remove(cls[1]); busy = false; }, dir === 'fade' ? 300 : 390);
    } else if (prev) {
      prev.remove();
    }
    syncHash(entry);
    A.dev && A.dev.refresh && A.dev.refresh();
  }

  function go(name, params, opts) {
    if (busy) return;
    opts = opts || {};
    const def0 = screens[name];
    if (def0 && def0.needsNet && state.net === 'offline') { params = { from: name }; name = 'offline'; }
    const entry = { name, params: params || {} };
    if (opts.reset) stack.length = 0;
    if (opts.replace) stack.pop();
    stack.push(entry);
    show(entry, opts.dir || (opts.reset ? 'fade' : 'fwd'));
  }

  /** Перерисовать текущий экран на месте (смена языка). */
  function rerender() {
    const cur = current();
    if (!cur) return;
    if (cur.params && cur.params.sheet) cur.params = Object.assign({}, cur.params, { sheet: undefined });
    show(cur, 'none');
  }

  function back() {
    if (busy) return;
    if (stack.length > 1) {
      stack.pop();
      show(current(), 'back');
      return;
    }
    const cur = current();
    const def = cur && screens[cur.name];
    const fallback = (def && def.backTo) || 'home';
    stack.length = 0;
    const entry = { name: fallback, params: {} };
    stack.push(entry);
    show(entry, 'back');
  }

  function init(hostEl) {
    host = hostEl;
    host.addEventListener('click', (e) => {
      const goEl = e.target.closest('[data-go]');
      if (goEl && host.contains(goEl)) {
        const p = Object.assign({}, goEl.dataset);
        const name = p.go; delete p.go;
        const def = screens[name];
        if (def && def.guard) { const redirect = def.guard(p, state); if (redirect) { go(redirect.name, redirect.params); return; } }
        go(name, p);
        return;
      }
      if (e.target.closest('[data-back]')) { back(); return; }
      const act = e.target.closest('[data-act]');
      if (act) {
        const scr = act.closest('.screen');
        const def = screens[scr.dataset.screen];
        if (def && def.act && def.act[act.dataset.act]) def.act[act.dataset.act](scr, scr._ctx, act, e);
      }
    });
    host.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button]')) { e.preventDefault(); e.target.click(); }
    });
    const start = parseHash();
    if (start) { stack.push(start); show(start, 'none'); } else { const s = { name: 'splash', params: {} }; stack.push(s); show(s, 'none'); }
  }

  A.state = state;
  A.reveal = reveal;
  A.router = { register, go, back, rerender, init, current, stack, screens };
})(window.Azza = window.Azza || {});
