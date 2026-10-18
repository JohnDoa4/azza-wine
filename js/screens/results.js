/* Результаты подбора. */
(function (A) {
  const R = A.router, ui = A.ui, S = A.state;

  function defaults() {
    // если пользователь не проходил подбор (прямой переход) — берём сценарий из книги
    if (!S.dish) S.dish = 'red_meat';
    if (!S.occasion) S.occasion = 'dinner';
    if (!S.color) S.color = 'red';
    if (!S.country) S.country = 'italy';
  }

  function emptyState() {
    return `${ui.toprow(A.t('title.recs'), { right: ui.homeRight() })}
      <div class="summary"><span>${ui.esc(A.summaryText())}</span></div>
      <div class="state-center">
        <div class="state-icon">${A.I.search}</div>
        <h2>${A.t('empty.title')}</h2>
        <p>${A.t('empty.text')}</p>
        <div class="row">${ui.chip(A.t('empty.budget'), { white: true, attrs: 'data-act="relax-budget"' })}${ui.chip(A.t('empty.country'), { white: true, attrs: 'data-act="relax-country"' })}</div>
      </div>
      ${ui.footer(ui.btn(A.t('btn.catalog'), 'secondary', 'data-go="catalog"') + ui.btn(A.t('btn.edit'), 'primary', 'data-go="step-occasion"'), true)}`;
  }

  R.register('results', {
    backTo: 'step-budget',
    render() {
      defaults();
      const res = A.engine.recommend(S);
      if (!res.primary.length && !res.others.length) return emptyState();
      const rows = res.primary.map((p) => ui.wineRow(p.wine, p.badge, `data-b="${p.badge || ''}"`)).join('');
      const note = res.others.length
        ? `<div class="wine-note"><b>${A.t('note.title')}</b><p>${ui.esc(A.t('note.text', { country: (A.data.countries.find((c) => c.id === S.country) || {}).title || '', n: res.found }))}</p></div>` +
          res.others.map((p) => ui.wineRow(p.wine, p.badge, `data-b="${p.badge || ''}"`)).join('')
        : '';
      return `${ui.toprow(A.t('title.recs'), { right: ui.homeRight() })}
        <div class="summary"><span>${ui.esc(A.summaryText())}</span></div>
        <div class="list-scroll scroll"><div class="wine-list">${rows}${note}</div></div>
        ${ui.footer(ui.btn(A.t('btn.editsearch'), 'secondary', 'data-go="step-occasion"') + ui.btn(A.t('btn.buy'), 'primary', 'data-go="stores"'), true)}`;
    },
    act: {
      home() { R.go('home', {}, { reset: true, dir: 'back' }); },
      'relax-budget'(el) { S.budget = [Math.min(S.budget[0], 5), Math.max(S.budget[1], 60)]; R.go('results', {}, { replace: true, dir: 'fade' }); },
      'relax-country'(el) { S.country = 'all'; R.go('results', {}, { replace: true, dir: 'fade' }); },
    },
  });
})(window.Azza = window.Azza || {});
