/* Локализация: RU / AZ / EN. Словари лежат в js/lang/*.js, ключи плоские. Значение — строка с {подстановками} или функция (vars) => строка. */
(function (A) {
  const dicts = (A.dict = A.dict || {});
  const LANGS = ['ru', 'az', 'en'];
  const KEY = 'azza.lang';
  let lang = 'ru';
  try { const s = localStorage.getItem(KEY); if (LANGS.includes(s)) lang = s; } catch (e) { /* приватный режим */ }
  try { document.documentElement.lang = lang; } catch (e) { /* noop */ }

  function t(key, vars) {
    let s = (dicts[lang] || {})[key];
    if (s === undefined) s = (dicts.ru || {})[key];
    if (s === undefined) return key;
    if (typeof s === 'function') return s(vars || {});
    return s.replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] !== undefined ? vars[k] : m));
  }

  function setLang(l) {
    if (!LANGS.includes(l)) return;
    lang = l;
    if (A.state) A.state.lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) { /* noop */ }
    try { document.documentElement.lang = l; } catch (e) { /* noop */ }
  }

  /** Число с десятичным знаком по правилам языка: 0,8 (ru, az) или 0.8 (en). */
  const num = (n) => (lang === 'en' ? String(n) : String(n).replace('.', ','));

  /* ----- вина: страна, регион, цвет, сладость берутся из ключей, исходные русские строки только для поиска ----- */
  const REGION_KEY = { 'Мендоса': 'mendoza', 'Лангедок': 'languedoc', 'Абруцо': 'abruzzo', 'Абруццо': 'abruzzo', 'Тоскана': 'tuscany', 'Венето': 'veneto', 'Кахетия': 'kakheti' };
  const regionPart = (w) => { const p = (w.region || '').split(', ')[1]; return p ? t('region.' + (REGION_KEY[p] || p)) : ''; };
  const countryName = (w) => t('country.' + w.countryKey);
  const colorName = (c) => t('color.' + c);
  const wineRegionLine = (w) => [countryName(w), regionPart(w)].filter(Boolean).join(', ');
  /** Все варианты названий на всех языках — чтобы поиск находил вино независимо от языка интерфейса. */
  function searchWords(w) {
    const out = [];
    LANGS.forEach((l) => {
      const d = dicts[l] || {};
      out.push(d['country.' + w.countryKey], d['color.' + w.color]);
      const p = (w.region || '').split(', ')[1];
      if (p) out.push(d['region.' + (REGION_KEY[p] || p)]);
    });
    return out.filter(Boolean).join(' ');
  }

  A.i18n = { t, setLang, num, LANGS, get lang() { return lang; }, countryName, regionPart, wineRegionLine, colorName, searchWords };
  A.t = t;
})(window.Azza = window.Azza || {});
