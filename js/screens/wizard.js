/* Подбор вина: пять шагов + загрузка результатов. */
(function (A) {
  const R = A.router, ui = A.ui, D = A.data, S = A.state;

  const STEPS = [
    { key: 'occasion', route: 'step-occasion', get q() { return A.t('q.occasion'); }, items: D.occasions },
    { key: 'dish', route: 'step-dish', get q() { return A.t('q.dish'); }, items: D.dishes },
    { key: 'color', route: 'step-color', get q() { return A.t('q.color'); }, items: D.colors },
    { key: 'country', route: 'step-country', get q() { return A.t('q.country'); }, items: D.countries },
    { key: 'budget', route: 'step-budget', get q() { return A.t('q.budget'); }, items: null },
  ];

  const budgetText = (b) => (b[1] >= D.budget.max && b[0] > D.budget.min ? A.t('budget.from', { n: b[0] }) : b[0] + '–' + b[1] + ' ₼');
  A.budgetText = budgetText;

  /** Строка выбора: «Ужин · Красное мясо · Красное · Италия · 10–40 ₼». */
  A.summaryText = function () {
    const pick = (list, id, fallback) => { const it = list.find((x) => x.id === id); return it ? it.title.split(' / ')[0] : fallback; };
    const dish = S.dish === 'any' ? A.t('sum.nofood') : pick(D.dishes, S.dish, A.t('sum.anydish'));
    const color = S.color === 'any' ? A.t('sum.anycolor') : pick(D.colors, S.color, A.t('sum.anycolor'));
    return [pick(D.occasions, S.occasion, A.t('sum.noocc')), dish, color, pick(D.countries, S.country, A.t('sum.allcountries')), budgetText(S.budget)].join(' · ');
  };

  function tabs(cur) {
    return `<div class="steps" role="tablist">${STEPS.map((s, i) => {
      const cls = i < cur ? 'done' : i === cur ? 'current' : '';
      return `<button class="step-tab ${cls}" role="tab" ${i === cur ? 'aria-selected="true"' : ''} ${i > cur ? 'disabled' : ''} data-act="tab" data-i="${i}">${D.stepTitles.list[i]}</button>`;
    }).join('')}</div>`;
  }

  function frame(cur, body, label) {
    return `<img class="bg-cellar" src="assets/bg/cellar.png" alt="">
      ${ui.toprow(A.t('title.sommelier'), { tight: true })}
      ${tabs(cur)}
      <div class="question"><h1>${STEPS[cur].q}</h1></div>
      ${body}
      ${ui.footer(`<button class="btn btn-primary" data-act="next">${label || A.t('continue')}</button>`)}`;
  }

  const common = {
    act: {
      tab(el, ctx, btn) { const i = +btn.dataset.i; R.go(STEPS[i].route, {}, { replace: true, dir: 'back' }); },
      next(el, ctx) {
        const cur = STEPS.findIndex((s) => s.route === el.dataset.screen);
        R.go(STEPS[cur + 1].route);
      },
    },
  };

  STEPS.forEach((step, cur) => {
    if (!step.items) return;
    R.register(step.route, Object.assign({}, common, {
      backTo: cur === 0 ? 'home' : STEPS[cur - 1].route,
      render() {
                const idx = Math.max(0, step.items.findIndex((x) => x.id === S[step.key]));
        return frame(cur, A.deck.html(step.items, 310) + A.deck.dots(step.items.length, idx, 711, ''));
      },
      mount(el) {
        const idx = Math.max(0, step.items.findIndex((x) => x.id === S[step.key]));
        if (S[step.key] == null) S[step.key] = step.items[idx].id;
        el._carousel = A.deck.attach(el, step.items, idx, {
          onChange: (i, item) => { S[step.key] = item.id; },
          onSelect: (i, item) => { S[step.key] = item.id; R.go(STEPS[cur + 1].route); },
        });
      },
    }));
  });

  /* ----- Бюджет ----- */
  const E = D.budget.edges;
  const posToPrice = (p) => { p = Math.max(0, Math.min(12, p)); const i = Math.min(11, Math.floor(p)); return Math.round(E[i] + (E[i + 1] - E[i]) * (p - i)); };
  const priceToPos = (v) => { for (let i = 0; i < 12; i++) if (v <= E[i + 1]) return i + (v - E[i]) / (E[i + 1] - E[i]); return 12; };

  function histHtml(b) {
    return D.budget.heights.map((h, i) => `<i class="${E[i + 1] > b[0] && E[i] < b[1] ? 'on' : ''}" style="height:${h}px"></i>`).join('');
  }
  function quickHtml(b) {
    return D.budget.quick.map(([kind, lo, hi]) => ui.chip(D.budget.quickLabel(kind, lo, hi), { white: true, active: b[0] === lo && b[1] === hi, attrs: `data-act="quick" data-lo="${lo}" data-hi="${hi}"` })).join('');
  }

  R.register('step-budget', Object.assign({}, common, {
    backTo: 'step-country',
    render() {
      const b = S.budget;
      const body = `<div class="budget" data-budget>
          <div class="b-label">${A.t('budget.label')}</div>
          <div class="b-value" data-value>${budgetText(b)}</div>
          <div class="b-hist" data-hist>${histHtml(b)}</div>
          <div class="range" data-range><div class="track"></div><div class="fill" data-fill></div><div class="handle" data-h="0" role="slider" aria-label="${A.t('budget.min')}"></div><div class="handle" data-h="1" role="slider" aria-label="${A.t('budget.max')}"></div></div>
          <div class="b-labels"><span>${D.budget.min} ₼</span><span>${D.budget.max} ₼</span></div>
          <div class="b-note">${A.t('budget.note')}</div>
          <div class="chips b-quick" data-quick>${quickHtml(b)}</div>
        </div>`;
      return frame(4, body, A.t('btn.recs'));
    },
    mount(el) {
      const range = el.querySelector('[data-range]');
      const handles = range.querySelectorAll('.handle');
      const fill = el.querySelector('[data-fill]');
      const value = el.querySelector('[data-value]');
      const hist = el.querySelector('[data-hist]');
      const quick = el.querySelector('[data-quick]');
      let active = null;
      function paint() {
        const w = range.clientWidth;
        const p = [priceToPos(S.budget[0]) / 12, priceToPos(S.budget[1]) / 12];
        handles.forEach((h, i) => { h.style.left = (p[i] * w).toFixed(1) + 'px'; });
        fill.style.left = (p[0] * w) + 'px'; fill.style.width = ((p[1] - p[0]) * w) + 'px';
        value.textContent = budgetText(S.budget);
        hist.innerHTML = histHtml(S.budget);
        quick.innerHTML = quickHtml(S.budget);
      }
      function move(clientX) {
        const r = range.getBoundingClientRect();
        const scale = A.scale || 1;
        const pos = Math.max(0, Math.min(12, ((clientX - r.left) / scale / (r.width / scale)) * 12));
        const price = posToPrice(pos);
        if (active === 0) S.budget[0] = Math.min(price, S.budget[1] - 5);
        else S.budget[1] = Math.max(price, S.budget[0] + 5);
        paint();
      }
      range.addEventListener('pointerdown', (e) => {
        const r = range.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width * 12;
        const d0 = Math.abs(x - priceToPos(S.budget[0])), d1 = Math.abs(x - priceToPos(S.budget[1]));
        active = d0 <= d1 ? 0 : 1;
        try { range.setPointerCapture(e.pointerId); } catch (_) { /* синтетические события */ }
        move(e.clientX);
      });
      range.addEventListener('pointermove', (e) => { if (active !== null && e.buttons) move(e.clientX); });
      const stop = () => { active = null; };
      range.addEventListener('pointerup', stop); range.addEventListener('pointercancel', stop);
      handles.forEach((h, i) => h.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        if (i === 0) S.budget[0] = Math.max(D.budget.min, Math.min(S.budget[1] - 5, S.budget[0] + step));
        else S.budget[1] = Math.min(D.budget.max, Math.max(S.budget[0] + 5, S.budget[1] + step));
        paint();
      }));
      el._paint = paint;
      requestAnimationFrame(paint);
    },
    act: Object.assign({}, common.act, {
      quick(el, ctx, btn) { S.budget = [+btn.dataset.lo, +btn.dataset.hi]; el._paint(); },
      next() { R.go('loading'); },
    }),
  }));

  /* ----- Загрузка результатов ----- */
  R.register('loading', {
    backTo: 'step-budget', needsNet: true,
    render() {
      return `${ui.toprow(A.t('title.recs'))}
        <div class="summary"><span>${ui.esc(A.summaryText())}</span></div>
        <div class="state-center" role="status" aria-live="polite">
          <div class="loader"><div class="plate"></div>
            <img class="l3" src="assets/images/loader/loader_03.png" alt=""><img class="l2" src="assets/images/loader/loader_02.png" alt=""><img class="l1" src="assets/images/loader/loader_01.png" alt="">
          </div><span class="sr-only">${A.t('loading.sr')}</span></div>`;
    },
    mount() {
      setTimeout(() => { const c = R.current(); if (c && c.name === 'loading') R.go('results', {}, { replace: true, dir: 'fade' }); }, 2300);
    },
  });
})(window.Azza = window.Azza || {});
