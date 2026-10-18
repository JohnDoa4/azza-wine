/* Данные интерфейса: карточки колод, магазины, диапазоны бюджета. */
(function (A) {
  const img = (folder, key) => `assets/images/${folder}/${key}.png`;

  /* Флаг на карточке страны: картинка вписана в квадрат 50×50 (как в Figma), без обрезки. */

  const T = (k, v) => A.i18n.t(k, v);
  /** Элемент колоды: заголовок и подпись берутся из словаря при каждом чтении (смена языка без пересборки). */
  const mix = (base, extra) => Object.defineProperties(base, Object.getOwnPropertyDescriptors(extra || {}));
  const item = (prefix, id, extra) => mix({
    id,
    get title() { return T(prefix + '.' + id + '.t'); },
    get desc() { return T(prefix + '.' + id + '.d'); },
  }, extra);

  const occasions = ['none', 'dinner', 'date', 'party', 'holiday', 'gift', 'visit'].map((id) => item('occ', id, { img: img('occasions', id) }));
  const dishes = ['any', 'red_meat', 'poultry', 'fish', 'seafood', 'pasta', 'cheese', 'asian', 'veggies', 'snacks', 'dessert'].map((id) => item('dish', id, { img: img('dishes', id) }));
  const colors = ['any', 'red', 'white', 'rose', 'sparkling'].map((id) => item('col', id, { img: img('colors', id) }));
  const countries = ['all', 'italy', 'france', 'georgia', 'portugal', 'chile', 'spain', 'south_africa', 'moldova', 'argentina', 'ukraine']
    .map((id) => item('cty', id, { img: img('countries', id), flag: img('flags', id === 'all' ? 'compass' : id), flagUnder: id === 'italy' }));

  const home = [
    item('home', 'pick', { img: img('home', 'pick'), go: 'step-occasion', get cta() { return T('home.pick.cta'); } }),
    item('home', 'catalog', { img: img('home', 'catalog'), go: 'catalog', get cta() { return T('home.catalog.cta'); } }),
  ];

  /* Бюджет: 12 столбиков гистограммы, границы цен в ₼ и условная высота (из распределения цен книги). */
  const budget = {
    min: 5, max: 100,
    edges: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 85, 100],
    heights: [46, 55, 99, 96, 46, 25, 18, 28, 18, 15, 15, 12],
    quick: [['upto', 5, 15], ['range', 15, 25], ['range', 25, 40], ['plus', 40, 100]],
    quickLabel(kind, lo, hi) { return kind === 'upto' ? T('bq.upto', { n: hi }) : kind === 'plus' ? T('bq.plus', { n: lo }) : lo + '–' + hi + ' ₼'; },
  };

  /* Магазины — заглушки. ix/iy — центр красной метки AZZA на картинке map-sample.png (1024×1822). Адреса остаются на оригинальном языке. */
  const store = (o) => mix(o, {
    get hours() { return T('store.today', { o: o.opens, c: o.closes }); },
    get distance() { return T('unit.km', { n: A.i18n.num(o.km) }); },
  });
  const stores = [
    store({ id: 'nizami', name: 'AZZA — Nizami', address: 'ул. Низами, 81', opens: '09:00', closes: '23:00', open: true, km: 0.8, phone: '+994 12 000 00 01', ix: 265, iy: 1083 }),
    store({ id: 'portbaku', name: 'AZZA — Port Baku', address: 'пр. Нефтчиляр, 153', opens: '10:00', closes: '22:00', open: true, km: 1.9, phone: '+994 12 000 00 02', ix: 730, iy: 1000 }),
    store({ id: 'ganjlik', name: 'AZZA — Ganjlik', address: 'ул. Фатали Хан Хойского, 14', opens: '10:00', closes: '21:00', open: false, km: 3.4, phone: '+994 12 000 00 03', ix: 833, iy: 207 }),
  ];

  const apps = { get list() { return ['google', 'waze', 'yandex', 'apple'].map((k) => T('app.' + k)); } };
  const wizard = ['occasion', 'dish', 'color', 'country', 'budget'];
  const stepTitles = { get list() { return wizard.map((k) => T('step.' + k)); } };

  A.data = { occasions, dishes, colors, countries, home, budget, stores, apps, wizard, stepTitles };
})(window.Azza = window.Azza || {});
