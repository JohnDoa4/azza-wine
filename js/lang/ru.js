/* Русский — основной язык, ключи совпадают с остальными словарями. */
(function (A) {
  const plural = (n, one, few, many) => (n % 100 >= 11 && n % 100 <= 14 ? many : n % 10 === 1 ? one : n % 10 >= 2 && n % 10 <= 4 ? few : many);
  (A.dict = A.dict || {}).ru = {
    // общие
    'home': 'На главную', 'back': 'Назад', 'clear': 'Очистить', 'continue': 'Продолжить', 'any': 'Любой',
    'title.sommelier': 'Personal sommelier', 'title.recs': 'Рекомендации сомелье', 'title.wine': 'Wine Card', 'title.buy': 'Где купить', 'title.catalog': 'Каталог вин',
    'badge.best': 'Рекомендует сомелье', 'badge.great': 'Отличный выбор', 'badge.good': 'Хороший выбор',
    'color.red': 'Красное', 'color.white': 'Белое', 'color.rose': 'Розовое', 'color.sparkling': 'Игристое',
    'sweet.dry': 'Сухое',

    // заставка и главная
    'splash.aria': 'Открыть приложение', 'tag': 'Ваш личный сомелье',
    'lang.title': 'Язык приложения', 'lang.sub': 'Названия вин и адреса магазинов остаются на оригинальном языке.', 'lang.aria': 'Язык: {code}',
    'home.pick.t': 'Подобрать вино', 'home.pick.d': 'Пять шагов до напитка', 'home.pick.cta': 'Подобрать вино',
    'home.catalog.t': 'Каталог вин', 'home.catalog.d': 'Весь ассортимент AZZA', 'home.catalog.cta': 'Открыть каталог',

    // шаги подбора
    'step.occasion': 'Повод', 'step.dish': 'Блюдо', 'step.color': 'Вино', 'step.country': 'Страна', 'step.budget': 'Бюджет',
    'q.occasion': 'Для какого события выбираете?', 'q.dish': 'Что будет на столе?', 'q.color': 'Какой стиль вина предпочитаете?', 'q.country': 'Есть предпочтение по стране?', 'q.budget': 'Какой бюджет комфортен?',
    'occ.none.t': 'Без повода', 'occ.none.d': 'Бокал для себя',
    'occ.dinner.t': 'Ужин', 'occ.dinner.d': 'Спокойный вечер за столом',
    'occ.date.t': 'Свидание', 'occ.date.d': 'Романтичный вечер',
    'occ.party.t': 'Вечеринка', 'occ.party.d': 'Легко и весело',
    'occ.holiday.t': 'Праздник', 'occ.holiday.d': 'Игристое к торжеству',
    'occ.gift.t': 'Подарок', 'occ.gift.d': 'Достойная бутылка',
    'occ.visit.t': 'В гости', 'occ.visit.d': 'Универсальный выбор',
    'dish.any.t': 'Не важно / Без еды', 'dish.any.d': 'Просто бокал вина',
    'dish.red_meat.t': 'Красное мясо', 'dish.red_meat.d': 'Стейк, баранина, гриль',
    'dish.poultry.t': 'Птица', 'dish.poultry.d': 'Курица, утка, индейка',
    'dish.fish.t': 'Рыба', 'dish.fish.d': 'Белая и жирная рыба',
    'dish.seafood.t': 'Морепродукты', 'dish.seafood.d': 'Устрицы, креветки, суши',
    'dish.pasta.t': 'Паста / пицца', 'dish.pasta.d': 'Томатные и сливочные соусы',
    'dish.cheese.t': 'Сыр', 'dish.cheese.d': 'От мягких до выдержанных',
    'dish.asian.t': 'Азиатская кухня', 'dish.asian.d': 'Острое и пряное',
    'dish.veggies.t': 'Овощи / салаты', 'dish.veggies.d': 'Лёгкие и свежие блюда',
    'dish.snacks.t': 'Закуски', 'dish.snacks.d': 'Тапас, нарезки, брускетты',
    'dish.dessert.t': 'Десерт', 'dish.dessert.d': 'Фрукты, торты, шоколад',
    'col.any.t': 'Не важно', 'col.any.d': 'Решит сомелье',
    'col.red.t': 'Красное', 'col.red.d': 'Насыщенное и бархатистое',
    'col.white.t': 'Белое', 'col.white.d': 'Свежее и лёгкое',
    'col.rose.t': 'Розовое', 'col.rose.d': 'Лёгкое и летнее',
    'col.sparkling.t': 'Игристое', 'col.sparkling.d': 'Для тостов и праздника',
    'cty.all.t': 'Все страны', 'cty.all.d': 'Открыты к новым вкусам',
    'cty.italy.t': 'Италия', 'cty.italy.d': 'Тоскана и Пьемонт',
    'cty.france.t': 'Франция', 'cty.france.d': 'Классические регионы',
    'cty.georgia.t': 'Грузия', 'cty.georgia.d': 'Древние традиции',
    'cty.portugal.t': 'Португалия', 'cty.portugal.d': 'Виноградники Дору',
    'cty.chile.t': 'Чили', 'cty.chile.d': 'В долинах у Анд',
    'cty.spain.t': 'Испания', 'cty.spain.d': 'Риоха и Рибера',
    'cty.south_africa.t': 'Южная Африка', 'cty.south_africa.d': 'Вина Капского региона',
    'cty.moldova.t': 'Молдова', 'cty.moldova.d': 'Винные традиции',
    'cty.argentina.t': 'Аргентина', 'cty.argentina.d': 'Мальбек из Мендосы',
    'cty.ukraine.t': 'Украина', 'cty.ukraine.d': 'Вина Причерноморья',
    'country.italy': 'Италия', 'country.france': 'Франция', 'country.georgia': 'Грузия', 'country.portugal': 'Португалия', 'country.chile': 'Чили', 'country.spain': 'Испания',
    'country.south_africa': 'Южная Африка', 'country.moldova': 'Молдова', 'country.argentina': 'Аргентина', 'country.ukraine': 'Украина',
    'region.mendoza': 'Мендоса', 'region.languedoc': 'Лангедок', 'region.abruzzo': 'Абруцо', 'region.tuscany': 'Тоскана', 'region.veneto': 'Венето', 'region.kakheti': 'Кахетия',

    // бюджет
    'budget.label': 'Цена за бутылку', 'budget.note': 'Мы подсветили ассортимент, где больше всего вин', 'budget.min': 'Минимальная цена', 'budget.max': 'Максимальная цена',
    'budget.from': 'от {n} ₼', 'bq.upto': 'до {n} ₼', 'bq.plus': '{n}+ ₼', 'btn.recs': 'Смотреть рекомендации',
    'sum.nofood': 'Без еды', 'sum.anydish': 'Любое блюдо', 'sum.anycolor': 'Любой цвет', 'sum.noocc': 'Без повода', 'sum.allcountries': 'Все страны',
    'loading.sr': 'Подбираем вино…',

    // результаты
    'empty.title': 'Ничего не нашлось',
    'empty.text': 'Под такие условия в ассортименте AZZA сейчас нет вина в наличии. Измените бюджет или страну — сомелье подберёт другое.',
    'empty.budget': 'Бюджет до 60 ₼', 'empty.country': 'Любая страна', 'btn.catalog': 'Открыть каталог', 'btn.edit': 'Изменить ответы', 'btn.editsearch': 'Изменить поиск',
    'note.title': 'Вино из других стран',
    'note.text': (v) => `По вашему запросу «${v.country}» найдено всего ${v.n} ${plural(v.n, 'позиция', 'позиции', 'позиций')}. Но можете посмотреть вина из других стран.`,

    // карточка вина
    'btn.list': 'Список вин', 'btn.similar': 'Похожие', 'btn.buy': 'Где купить', 'share': 'Поделиться', 'share.done': 'Ссылка на вино скопирована',
    'oos': 'нет в наличии', 'profile': 'Профиль вина', 'pairings': 'Сочетания с едой',
    'meter.body': 'Тело', 'meter.acidity': 'Кислотность', 'meter.tannin': 'Танины', 'meter.aromatic': 'Ароматность',
    'style.soft': 'Мягкое, насыщенное', 'style.gastro': 'Гастрономичное', 'style.structured': 'Структурное', 'style.light': 'Лёгкое', 'style.semisweet': 'Полусладкое',
    'style.fresh': 'Свежее', 'style.textured': 'Текстурное, сухое', 'style.aromatic': 'Ароматное', 'style.dry': 'Сухое', 'style.brut': 'Сухое, Brut', 'style.brutsec': 'Brut / Sec',
    'style.fortdry': 'Креплёное, сухое', 'style.fortsweet': 'Креплёное, сладкое',
    'pair.steak': 'Стейк', 'pair.lamb': 'Баранина', 'pair.pork': 'Свинина', 'pair.bbq': 'Мясо на гриле', 'pair.chicken': 'Курица', 'pair.duck': 'Утка', 'pair.whitefish': 'Белая рыба',
    'pair.salmon': 'Лосось', 'pair.oysters': 'Устрицы', 'pair.shrimp': 'Креветки', 'pair.sushi': 'Суши', 'pair.tomatopasta': 'Томатная паста', 'pair.creampasta': 'Сливочная паста',
    'pair.mushrooms': 'Грибы', 'pair.hardcheese': 'Твёрдый сыр', 'pair.softcheese': 'Мягкий сыр', 'pair.bluecheese': 'Голубой сыр', 'pair.charcuterie': 'Мясная нарезка',
    'pair.salads': 'Салаты', 'pair.grilledveg': 'Овощи на гриле', 'pair.spicyasian': 'Острая азиатская кухня', 'pair.asian': 'Азиатская кухня', 'pair.fruitdessert': 'Фруктовый десерт',
    'pair.chocdessert': 'Шоколадный десерт', 'pair.foiegras': 'Фуа-гра', 'pair.aperitif': 'Аперитив',

    // каталог
    'cat.search': 'Название, страна или сорт', 'cat.searchAria': 'Поиск по каталогу', 'cat.sort': 'Сначала популярные',
    'cat.count': (v) => `${v.n} ${plural(v.n, 'вино', 'вина', 'вин')}`,
    'cat.empty.t': 'Ничего не найдено', 'cat.empty.d': 'Проверьте написание или попробуйте популярные запросы. Поиск работает по названию, стране, региону и сорту.',
    'cat.q1': 'Мерло', 'cat.q2': 'Саперави', 'cat.q3': 'Брют', 'cat.q4': 'Шардоне', 'cat.resetAll': 'Сбросить поиск и фильтры',
    'f.title': 'Фильтры', 'f.reset': 'Сбросить', 'f.country': 'Страна', 'f.type': 'Тип вина', 'f.price': 'Цена за бутылку', 'f.region': 'Регион', 'f.grape': 'Сорт винограда', 'f.apply': 'Применить',
    'f.soon': 'Этот фильтр появится позже',

    // где купить
    'stores.notice.t': 'Геолокация отключена', 'stores.notice.d': 'Расстояние не показываем. Магазины идут по алфавиту.', 'stores.notice.a': 'Включить в настройках',
    'geo.title': 'Показать ближайшие магазины?', 'geo.text': 'Разрешите доступ к геолокации, чтобы мы показали расстояние до магазинов AZZA. Положение не сохраняется.', 'geo.aria': 'Геолокация', 'geo.no': 'Нет', 'geo.yes': 'Да',
    'geo.settings': 'Откройте настройки телефона → Wine AZZA → Геолокация', 'geo.need': 'Разрешите геолокацию, чтобы увидеть ближайшие магазины',
    'chip.all': 'Все', 'chip.open': 'Открыты сейчас', 'chip.near': 'Рядом со мной',
    'store.open': 'Открыто', 'store.closed': 'Закрыто', 'store.today': 'Сегодня: {o}–{c}', 'store.link': 'Посмотреть на карте', 'unit.km': '{n} км',
    'map.alt': 'Карта магазинов', 'map.you': 'Вы здесь', 'map.locate': 'Моё местоположение', 'map.route': 'Построить маршрут',
    'map.fail.t': 'Карта не загрузилась', 'map.fail.d': 'Проверьте интернет и повторите. Список магазинов доступен на предыдущем экране.', 'map.loading': 'Загружаем карту…',
    'nav.sub': (v) => `${v.name}, ${v.addr}. Выберите приложение для навигации.`, 'nav.opening': 'Открываем {app}…', 'geo.off': 'Геолокация отключена',
    'app.google': 'Google Карты', 'app.waze': 'Waze', 'app.yandex': 'Яндекс Карты', 'app.apple': 'Apple Карты',
    'off.title': 'Нет соединения', 'off.text': 'Проверьте интернет и повторите. Сохранённый каталог доступен без сети, но цены и наличие могли измениться.', 'off.pill': 'Данные от 14.10.2026, 09:30',
    'off.checking': 'Проверяем соединение…', 'btn.return': 'Вернуться', 'btn.retry': 'Повторить',
  };
})(window.Azza = window.Azza || {});
