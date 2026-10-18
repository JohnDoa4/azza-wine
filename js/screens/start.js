/* Заставка и главная. */
(function (A) {
  const R = A.router, ui = A.ui, D = A.data;
  const LANGS = [['Русский', 'RU'], ['Azərbaycan dili', 'AZ'], ['English', 'EN']];

  R.register('splash', {
    render() {
      return `<img class="bg-cellar" src="assets/bg/cellar.png" alt="">
        <div class="splash" data-go="home" role="button" tabindex="0" aria-label="${A.t('splash.aria')}">
          <img class="splash-logo" src="${A.I.logo}" alt="AZZA">
          <div class="splash-name">Wine AZZA</div>
          <div class="splash-tag">${A.t('tag')}</div>
        </div>`;
    },
    mount(el) {
      el._timer = setTimeout(() => { const cur = R.current(); if (cur && cur.name === 'splash') R.go('home', {}, { replace: true, dir: 'fade' }); }, 2400);
    },
  });

  function langSheet() {
    return `<div class="overlay" data-act="close-lang"></div>
      <div class="sheet" role="dialog" aria-label="${A.t('lang.title')}">
        <div class="grab"></div>
        <div class="sheet-title">${A.t('lang.title')}</div>
        <div class="sheet-sub">${A.t('lang.sub')}</div>
        ${LANGS.map(([name, code]) => `<button class="lang-row ${A.state.lang === code.toLowerCase() ? 'sel' : ''}" data-act="set-lang" data-code="${code.toLowerCase()}">
          <span><b>${name}</b><i>${code}</i></span>${A.state.lang === code.toLowerCase() ? A.I.check : ''}</button>`).join('')}
      </div>`;
  }

  R.register('home', {
    render(ctx) {
      const lang = A.state.lang.toUpperCase();
      return `<img class="bg-cellar" src="assets/bg/cellar.png" alt="">
        <div class="home-head">
          <div class="brand"><img src="${A.I.logo}" alt="" width="32" height="32"><span>Wine AZZA</span></div>
          <button class="lang-pill" data-act="open-lang" aria-label="${A.t('lang.aria', { code: lang })}"><span>${lang}</span></button>
        </div>
        <h1 class="home-title">${A.t('tag')}</h1>
        ${A.deck.html(D.home, 274.5, true)}
        ${A.deck.dots(D.home.length, 0, 711, 'wine')}
        <div class="footer"><button class="btn btn-primary" data-act="cta">${D.home[0].cta}</button></div>
        ${ctx.params.sheet === 'lang' ? langSheet() : ''}`;
    },
    mount(el, ctx) {
      let idx = 0;
      const cta = el.querySelector('[data-act=cta]');
      el._carousel = A.deck.attach(el, D.home, 0, {
        onChange: (i) => { idx = i; cta.textContent = D.home[i].cta; },
        onSelect: (i) => R.go(D.home[i].go),
      });
      cta.addEventListener('click', () => R.go(D.home[idx].go));
    },
    act: {
      'open-lang'(el) { el.insertAdjacentHTML('beforeend', langSheet()); },
      'close-lang'(el) { ui.closeOverlay(el); },
      'set-lang'(el, ctx, btn) {
        A.i18n.setLang(btn.dataset.code);
        ui.closeOverlay(el, () => R.rerender());
      },
    },
  });
})(window.Azza = window.Azza || {});
