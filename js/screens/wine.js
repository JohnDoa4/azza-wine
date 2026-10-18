/* Карточка вина: описание слева, бутылка справа. Свайпом бутылка плавно выезжает в центр, описание и фон уезжают влево. */
(function (A) {
  const R = A.router, ui = A.ui;

  // сдвиги из Figma: бутылка 276 → 104 (−172), описание −259…−260, фон 166 → −112 (−278)
  const SHIFT = { photo: 172, left: 260, bg: 278 };

  const meter = (label, n) => `<div class="meter"><span>${label}</span><div class="bars">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div></div>`;
  
  function wineOf(params) { return A.engine.byId(params.id) || A.engine.byId('ponte-merlot'); }

  function render(ctx) {
    const w = wineOf(ctx.params);
    const oos = ctx.params.oos === '1' || w.stock <= 0;
    const pairs = A.engine.topPairings(w, 3).join(', ');
    const chips = [w.grape, A.i18n.colorName(w.color), A.engine.styleShort(w), w.sweetness === 'Сухое' ? A.t('sweet.dry') : ''].filter(Boolean);
    const bottle = oos
      ? A.I.bottle.replace('width="60" height="150"', 'width="100%" height="100%"')
      : `<img src="${w.photo}" alt="${ui.esc(w.name)}" draggable="false" onerror="this.style.display='none'">`;
    return `<img class="bg-cellar right" data-bg src="assets/bg/cellar.png" alt="">
      ${ui.toprow(A.t('title.wine'), { right: { icon: A.I.share, cls: 'dark', attrs: `data-act="share" aria-label="${A.t('share')}"` } })}
      <div class="detail" data-detail>
        <div class="d-left" data-left>
          ${ctx.params.b ? ui.badge(ctx.params.b) : ''}
          <h1 class="d-name">${ui.esc(w.name)}</h1>
          <div class="d-prod"><span>${ui.esc(w.producer)}</span><span>${ui.esc(A.i18n.wineRegionLine(w))}</span></div>
          ${oos ? `<div class="d-price oos">${A.t('oos')}</div>` : `<div class="d-price">${ui.fmtPriceDot(w.price)}</div>`}
          <div class="chips d-chips">${chips.map((c) => ui.chip(c)).join('')}</div>
          <div class="d-sec"><b>${A.t('profile')}</b><div class="d-meters">${meter(A.t('meter.body'), w.body)}${meter(A.t('meter.acidity'), w.acidity)}${meter(A.t('meter.tannin'), w.tannin)}${meter(A.t('meter.aromatic'), w.aromatic)}</div></div>
          <div class="d-sec"><b>${A.t('pairings')}</b><p>${ui.esc(pairs)}</p></div>
          <div class="d-gap"></div>
        </div>
        <div class="d-photo ${oos ? 'none' : ''}" data-photo><div class="bottle" role="img" aria-label="${ui.esc(w.name)}">${bottle}</div></div>
      </div>
      ${A.deck.dots(2, 0, 711, 'ink')}
      ${ui.footer(ui.btn(A.t('btn.list'), 'secondary', 'data-back') + (oos ? ui.btn(A.t('btn.similar'), 'primary', 'data-go="results"') : ui.btn(A.t('btn.buy'), 'primary', 'data-go="stores"')), true)}`;
  }

  function mount(el, ctx) {
    const detail = el.querySelector('[data-detail]');
    const left = el.querySelector('[data-left]');
    const photo = el.querySelector('[data-photo]');
    const bg = el.querySelector('[data-bg]');
    let p = ctx.params.photo === '1' ? 1 : 0;   // 0 — описание, 1 — бутылка по центру

    function paint(settle) {
      detail.classList.toggle('settle', !!settle);
      bg.classList.toggle('settle', !!settle);
      left.style.transform = `translate3d(${(-p * SHIFT.left).toFixed(2)}px,0,0)`;
      photo.style.transform = `translate3d(${(-p * SHIFT.photo).toFixed(2)}px,0,0)`;
      bg.style.transform = `translate3d(${(-p * SHIFT.bg).toFixed(2)}px,0,0)`;
      left.style.opacity = '';
      el.querySelectorAll('[data-dots] i').forEach((d, i) => d.classList.toggle('on', i === (p > 0.5 ? 1 : 0)));
    }
    paint(false);
    el._setPhoto = (v) => { p = v; paint(true); };

    let d = null;
    detail.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      d = { x: e.clientX, p0: p, t: performance.now(), lx: e.clientX, lt: performance.now(), v: 0, moved: false };
      try { detail.setPointerCapture(e.pointerId); } catch (_) { /* синтетические события */ }
      detail.classList.remove('settle'); bg.classList.remove('settle');
    });
    detail.addEventListener('pointermove', (e) => {
      if (!d) return;
      const scale = A.scale || 1;
      const dx = (e.clientX - d.x) / scale;
      if (Math.abs(dx) > 5) d.moved = true;
      const now = performance.now();
      if (now - d.lt > 16) { d.v = (e.clientX - d.lx) / scale / (now - d.lt); d.lx = e.clientX; d.lt = now; }
      if (d.moved) { p = Math.max(0, Math.min(1, d.p0 - dx / SHIFT.photo)); paint(false); }
    });
    const end = () => {
      if (!d) return;
      const s = d; d = null;
      if (!s.moved) { p = p < 0.5 ? 1 : 0; paint(true); return; } // тап по бутылке/описанию — переключить
      const proj = p - (s.v * 220) / SHIFT.photo;
      p = proj > 0.5 ? 1 : 0;
      paint(true);
    };
    detail.addEventListener('pointerup', end);
    detail.addEventListener('pointercancel', end);
    detail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { p = 1; paint(true); }
      if (e.key === 'ArrowRight') { p = 0; paint(true); }
    });
    detail.setAttribute('tabindex', '0');
  }

  const def = { backTo: 'results', render, mount, act: { share() { ui.toast(A.t('share.done')); } } };
  R.register('wine', def);
  // «Крупное фото» — то же самое состояние с бутылкой по центру
  R.register('wine-photo', Object.assign({}, def, { render(ctx) { ctx.params.photo = '1'; return render(ctx); } }));
})(window.Azza = window.Azza || {});
