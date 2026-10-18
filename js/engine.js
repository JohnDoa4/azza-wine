/* Рекомендательный движок (детерминированные правила из книги Food Pairing & Recommendation Engine). */
(function (A) {
  const G = A.generated;
  const M = G.matrices;
  const wines = G.wines;

  // карточка блюда в интерфейсе -> подробные позиции матрицы (лист 03_Food_UI; свинина в «Красное мясо» не входит)
  const DISH_MAP = {
    red_meat: ['Стейк / говядина', 'Баранина / дичь', 'BBQ / копчёное мясо'],
    poultry: ['Курица / индейка', 'Утка / гусь'],
    fish: ['Белая нежирная рыба', 'Лосось / тунец / жирная рыба'],
    seafood: ['Устрицы', 'Креветки / краб / омар / моллюски', 'Суши / севиче'],
    pasta: ['Томатная паста / пицца', 'Сливочная паста / ризотто'],
    cheese: ['Твёрдый выдержанный сыр', 'Мягкий / сливочный сыр', 'Голубой сыр'],
    asian: ['Острая азиатская кухня', 'Неострая азиатская кухня'],
    veggies: ['Грибы / грибное ризотто', 'Салаты / зелёные овощи', 'Овощи на гриле'],
    snacks: ['Мясная нарезка / charcuterie', 'Фуа-гра / паштет'],
    dessert: ['Фруктовый десерт', 'Шоколадный десерт'],
    any: ['Аперитив / без еды'],
  };
  const OCC_MAP = { dinner: 'Ужин', date: 'Свидание', party: 'Вечеринка', holiday: 'Праздник', gift: 'Подарок', visit: 'В гости', none: 'Для себя' };
  const DISH_SHORT = {
    'Стейк / говядина': 'steak', 'Баранина / дичь': 'lamb', 'Свинина': 'pork', 'BBQ / копчёное мясо': 'bbq',
    'Курица / индейка': 'chicken', 'Утка / гусь': 'duck', 'Белая нежирная рыба': 'whitefish', 'Лосось / тунец / жирная рыба': 'salmon',
    'Устрицы': 'oysters', 'Креветки / краб / омар / моллюски': 'shrimp', 'Суши / севиче': 'sushi', 'Томатная паста / пицца': 'tomatopasta',
    'Сливочная паста / ризотто': 'creampasta', 'Грибы / грибное ризотто': 'mushrooms', 'Твёрдый выдержанный сыр': 'hardcheese',
    'Мягкий / сливочный сыр': 'softcheese', 'Голубой сыр': 'bluecheese', 'Мясная нарезка / charcuterie': 'charcuterie',
    'Салаты / зелёные овощи': 'salads', 'Овощи на гриле': 'grilledveg', 'Острая азиатская кухня': 'spicyasian',
    'Неострая азиатская кухня': 'asian', 'Фруктовый десерт': 'fruitdessert', 'Шоколадный десерт': 'chocdessert',
    'Фуа-гра / паштет': 'foiegras', 'Аперитив / без еды': 'aperitif',
  };
  const STYLE_SHORT = {
    'Красное насыщенное мягкое': 'soft', 'Красное гастрономичное высококислотное': 'gastro',
    'Красное структурное танинное': 'structured', 'Красное лёгкое/среднее': 'light', 'Красное полусладкое/сладкое': 'semisweet',
    'Белое свежее высококислотное': 'fresh', 'Белое текстурное сухое': 'textured', 'Белое ароматное': 'aromatic',
    'Белое полусладкое/сладкое': 'semisweet', 'Rosé сухое': 'dry', 'Rosé полусладкое/сладкое': 'semisweet',
    'Игристое сухое Brut/Extra Dry': 'brut', 'Игристое rosé Brut/Sec': 'brutsec', 'Игристое полусладкое/сладкое': 'semisweet',
    'Креплёное сухое (Fino/Manzanilla)': 'fortdry', 'Креплёное сладкое': 'fortsweet',
  };
  const COLOR_OF_STYLE = (s) => (s.startsWith('Красное') ? 'red' : s.startsWith('Белое') ? 'white' : s.startsWith('Rosé') ? 'rose' : s.startsWith('Игристое') ? 'sparkling' : 'fortified');

  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const foodScore = (style, dish) => mean((DISH_MAP[dish] || DISH_MAP.any).map((d) => (M.food[style] || {})[d] || 0));
  const occScore = (style, occ) => ((M.occasion[style] || {})[OCC_MAP[occ] || 'Для себя'] ?? 3);

  function score(w, sel) {
    const food = foodScore(w.style, sel.dish || 'any');
    const occ = occScore(w.style, sel.occasion || 'none');
    return { food, occ, total: 100 * (0.65 * food / 5 + 0.20 * occ / 5 + 0.15 * w.popularity / 100) };
  }

  function eligible(w, sel, ignoreCountry) {
    if (w.stock <= 0) return false;
    if (sel.budget && (w.price < sel.budget[0] || w.price > sel.budget[1])) return false;
    if (sel.color && sel.color !== 'any' && w.color !== sel.color) return false;
    if (!ignoreCountry && sel.country && sel.country !== 'all' && w.countryKey !== sel.country) return false;
    return true;
  }

  const byScore = (a, b) => b.total - a.total || (a.wine.id < b.wine.id ? -1 : 1);

  /** Результат подбора: основные вина + (если меньше 3) вина из других стран отдельным блоком. */
  function recommend(sel, limit) {
    limit = limit || 5;
    const rate = (ignore) => wines.filter((w) => eligible(w, sel, ignore)).map((w) => ({ wine: w, ...score(w, sel) })).sort(byScore);
    const primary = rate(false);
    let others = [];
    if (primary.length < 3 && sel.country && sel.country !== 'all') {
      const ids = new Set(primary.map((p) => p.wine.id));
      others = rate(true).filter((p) => !ids.has(p.wine.id));
    }
    const main = primary.slice(0, limit);
    main.forEach((p, i) => { p.badge = i === 0 && p.food >= 4 ? 'best' : i === 1 && p.food >= 4 ? 'great' : i <= 2 && p.food >= 3 ? 'good' : null; });
    const rest = others.slice(0, Math.max(0, limit - main.length));
    rest.forEach((p, i) => { p.badge = p.food >= 4 ? (i === 0 ? 'great' : 'good') : p.food >= 3 ? 'good' : null; });
    return { primary: main, others: rest, found: primary.length };
  }

  /** Подсказки на шаге «Вино»: максимум совместимости по профилям каждого цвета (методика листа 05 в книге не раскрыта). */
  function colorHints(dish) {
    const out = {};
    ['red', 'white', 'rose', 'sparkling'].forEach((c) => {
      const vals = Object.keys(M.food).filter((s) => COLOR_OF_STYLE(s) === c).map((s) => foodScore(s, dish || 'any'));
      out[c] = vals.length ? Math.max(...vals) : 0;
    });
    const best = Math.max(...Object.values(out));
    const hints = {};
    if (Object.values(out).filter((v) => v === best).length > 2) return hints; // слишком много равных лидеров — без подсказок
    const ranked = Object.entries(out).sort((a, b) => b[1] - a[1]);
    ranked.forEach(([c, v], i) => {
      if (i > 1) return; // подсказки только на 1–2 карточках
      if (v >= 4) hints[c] = v === best ? 'best' : 'great';
      else if (v >= 3 && i === 0) hints[c] = 'good';
    });
    return hints;
  }

  function topPairings(w, n) {
    const row = M.food[w.style] || {};
    return Object.keys(row).sort((a, b) => row[b] - row[a]).slice(0, n || 3).map((d) => (DISH_SHORT[d] ? A.t('pair.' + DISH_SHORT[d]) : d));
  }

  const styleShort = (w) => (STYLE_SHORT[w.style] ? A.t('style.' + STYLE_SHORT[w.style]) : '');

  /** Поиск и фильтры каталога. */
  function catalog(q, f) {
    f = f || {};
    const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е');
    const TR = { мерло: 'merlot', каберне: 'cabernet', совиньон: 'sauvignon', шардоне: 'chardonnay', саперави: 'saperavi', просекко: 'prosecco',
      пино: 'pinot', мальбек: 'malbec', малбек: 'malbec', сира: 'syrah', шираз: 'syrah', гренаш: 'grenache', санджовезе: 'sangiovese',
      монтепульчано: 'montepulciano', кьянти: 'chianti', брют: 'brut', розе: 'rose', вионье: 'viognier', ризлинг: 'riesling' };
    const terms = norm(q).split(/\s+/).filter(Boolean).map((t) => TR[t] || t);
    return wines.filter((w) => {
      if (f.countries && f.countries.length && !f.countries.includes(w.countryKey)) return false;
      if (f.types && f.types.length && !f.types.includes(w.color)) return false;
      if (f.price && (w.price < f.price[0] || w.price > f.price[1])) return false;
      if (!terms.length) return true;
      const hay = norm([w.name, w.producer, w.country, w.region, w.grape, A.i18n.searchWords(w)].join(' '));
      return terms.every((t) => hay.includes(t));
    }).sort((a, b) => b.popularity - a.popularity);
  }

  A.engine = { wines, DISH_MAP, OCC_MAP, foodScore, occScore, score, eligible, recommend, colorHints, topPairings, styleShort, catalog, byId: (id) => wines.find((w) => w.id === id) };
})(window.Azza = window.Azza || {});
