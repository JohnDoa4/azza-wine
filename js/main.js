/* Запуск: строка состояния, масштаб рамки телефона, панель разработчика. */
(function (A) {
  const R = A.router, S = A.state;

  /* ----- строка состояния ----- */
  document.getElementById('statusbar').innerHTML = `<span>9:41</span><span class="sb-r">
    <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#171512"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#171512"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#171512"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#171512"/></svg>
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><path d="M8.5 11.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z" fill="#171512"/><path d="M5.3 7.6a4.6 4.6 0 0 1 6.4 0M2.6 4.9a8.4 8.4 0 0 1 11.8 0M.3 2.5a11.6 11.6 0 0 1 16.4 0" stroke="#171512" stroke-width="1.5" stroke-linecap="round"/></svg>
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#171512" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="#171512"/><path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" fill="#171512" opacity=".5"/></svg></span>`;

  /* ----- масштаб рамки телефона под высоту окна ----- */
  const wrap = document.getElementById('phoneWrap');
  function fit() {
    if (window.innerWidth <= 520) { wrap.style.margin = ''; A.scale = 1; return; }
    const panel = document.getElementById('devpanel');
    const panelW = panel && getComputedStyle(panel).display !== 'none' ? panel.offsetWidth + 28 : 0;
    const s = Math.min(1, (window.innerHeight - 56) / 812, (window.innerWidth - panelW - 56) / 375);
    A.scale = s;
    wrap.style.transform = `scale(${s})`;
    wrap.style.margin = `${-(812 * (1 - s)) / 2}px ${-(375 * (1 - s)) / 2}px`;
  }
  window.addEventListener('resize', fit);

  /* ----- панель разработчика: переход на любой экран и переключатели состояний ----- */
  const ITEMS = [
    ['Старт', [
      ['Заставка', 'splash'], ['Главная', 'home'], ['Главная · выбор языка', 'home', { sheet: 'lang' }],
    ]],
    ['Подбор вина', [
      ['Шаг 1 · Повод', 'step-occasion'], ['Шаг 2 · Блюдо', 'step-dish'], ['Шаг 3 · Вино (цвет)', 'step-color', {}, { dish: 'red_meat' }],
      ['Шаг 4 · Страна', 'step-country'], ['Шаг 5 · Бюджет', 'step-budget'],
    ]],
    ['Результаты', [
      ['Загрузка', 'loading', {}, scenario()], ['Список', 'results', {}, scenario()],
      ['Мало вариантов', 'results', {}, Object.assign(scenario(), { country: 'georgia' })],
      ['Ничего не нашлось', 'results', {}, Object.assign(scenario(), { color: 'sparkling', budget: [5, 10], country: 'all' })],
    ]],
    ['Карточка вина', [
      ['Профиль и сочетания', 'wine', { id: 'ponte-merlot', b: 'best' }], ['Крупное фото', 'wine-photo', { id: 'ponte-merlot' }],
      ['Нет в наличии', 'wine', { id: 'carpineto-dogajolo', oos: '1', b: 'best' }],
    ]],
    ['Каталог', [
      ['Список', 'catalog', { q: '' }, { catalog: { q: '', countries: [], types: [], price: [5, 100] } }],
      ['Фильтры', 'catalog', { sheet: 'filters', q: '' }, { catalog: { q: '', countries: ['italy'], types: ['red'], price: [10, 40] } }],
      ['Поиск без результатов', 'catalog', { q: 'Мальбек' }, { catalog: { q: 'Мальбек', countries: [], types: [], price: [5, 100] } }],
    ]],
    ['Где купить', [
      ['Список магазинов', 'stores', { prompt: '0' }, { geo: 'granted' }], ['Список без геолокации', 'stores', { prompt: '0' }, { geo: 'denied' }],
      ['Запрос геолокации', 'stores', {}, { geo: 'unknown' }],
      ['Карта · магазин открыт', 'map', { store: 'nizami' }, { mapOk: true, geo: 'granted' }], ['Карта · магазин закрыт', 'map', { store: 'ganjlik' }, { mapOk: true, geo: 'granted' }],
      ['Выбор навигатора', 'map', { store: 'nizami', sheet: 'nav' }, { mapOk: true, geo: 'granted' }],
      ['Карта не загрузилась', 'map', {}, { mapOk: false }],
    ]],
    ['Системные', [['Нет соединения', 'offline']]],
  ];
  function scenario() { return { occasion: 'dinner', dish: 'red_meat', color: 'red', country: 'italy', budget: [10, 40] }; }

  const SEGS = [
    ['geo', 'Геолокация', [['unknown', 'спросить'], ['granted', 'разрешена'], ['denied', 'отключена']]],
    ['net', 'Сеть', [['online', 'онлайн'], ['offline', 'оффлайн']]],
    ['mapOk', 'Карта', [[true, 'работает'], [false, 'не грузится']]],
  ];

  function panelHtml() {
    const cur = R.current() || {};
    return `<h2>Wine AZZA · v1</h2>
      ${ITEMS.map(([g, items]) => `<h3>${g}</h3>${items.map(([label, route, params], i) => {
        const on = cur.name === route && (!params || Object.keys(params).every((k) => String((cur.params || {})[k] || '') === String(params[k])) );
        return `<button class="dev-link ${on ? 'on' : ''}" data-dev="${g}|${i}">${label}</button>`;
      }).join('')}`).join('')}
      <h3>Состояния</h3>
      ${SEGS.map(([key, title, opts]) => `<div style="margin:6px 0 2px;color:#9a9388">${title}</div><div class="seg">${opts.map(([v, l]) => `<button class="${S[key] === v ? 'on' : ''}" data-seg="${key}" data-val="${v}">${l}</button>`).join('')}</div>`).join('')}
      <div class="hint">Карточки вин: 10 позиций из книги. Подбор считается по настоящей формуле; ссылка на экран сохраняется в адресной строке.</div>`;
  }
  const panel = document.getElementById('devpanel');
  function refresh() { panel.innerHTML = panelHtml(); }
  A.dev = { refresh };
  panel.addEventListener('click', (e) => {
    const link = e.target.closest('[data-dev]');
    if (link) {
      const [g, i] = link.dataset.dev.split('|');
      const [, items] = ITEMS.find((x) => x[0] === g);
      const [, route, params, patch] = items[+i];
      if (patch) Object.assign(S, JSON.parse(JSON.stringify(patch)));
      R.go(route, params || {}, { reset: true, dir: 'fade' });
      return;
    }
    const seg = e.target.closest('[data-seg]');
    if (seg) {
      const v = seg.dataset.val;
      S[seg.dataset.seg] = v === 'true' ? true : v === 'false' ? false : v;
      refresh();
    }
  });
  document.getElementById('devToggle').addEventListener('click', () => document.body.classList.toggle('dev-open'));

  /* ----- старт ----- */
  fit();
  R.init(document.getElementById('screens'));
  refresh();
})(window.Azza = window.Azza || {});
