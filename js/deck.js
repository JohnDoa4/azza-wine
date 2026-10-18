/* Разметка карусели карточек и индикатор. Карточка 300×310 как в Figma: картинка 300×300 со смещением 20 px, заголовок и подпись — в автолейауте. */
(function (A) {
  const esc = (s) => A.ui.esc(s);

  function flag(item) {
    if (!item.flag || !item.flagBox) return '';
    const [x, y, w, h] = item.flagBox;
    return `<div class="dc-flag-box">${item.flagUnder ? '<i class="dc-flag-under"></i>' : ''}<img class="dc-flag" src="${item.flag}" alt="" draggable="false" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;
  }

  function card(item, i) {
    return `<div class="deck-card" data-i="${i}" data-id="${item.id}">
      <img class="dc-img" src="${item.img}" alt="" draggable="false">
      ${flag(item)}
      <div class="dc-head ${item.flag ? 'narrow' : ''}"><div class="dc-title">${esc(item.title)}</div><div class="dc-desc">${esc(item.desc)}</div></div>
    </div>`;
  }

  /** top — отступ колоды сверху. */
  function html(items, top) {
    return `<div class="deck" data-deck style="top:${top}px">${items.map((it, i) => card(it, i)).join('')}</div>`;
  }

  function dots(n, active, top, cls) {
    return `<div class="deck-meta ${cls || ''}" data-dots style="top:${top}px">${Array.from({ length: n }, (_, i) => `<i class="${i === active ? 'on' : ''}"></i>`).join('')}</div>`;
  }

  function updateDots(el, active) {
    el.querySelectorAll('[data-dots] i').forEach((d, i) => d.classList.toggle('on', i === active));
  }

  /** Подключает карусель к экрану. */
  function attach(el, items, active, handlers) {
    const root = el.querySelector('[data-deck]');
    return A.carousel.create(root, {
      active,
      onChange: (i) => { updateDots(el, i); handlers.onChange && handlers.onChange(i, items[i]); },
      onSelect: (i) => handlers.onSelect && handlers.onSelect(i, items[i]),
    });
  }

  A.deck = { html, dots, attach, updateDots };
})(window.Azza = window.Azza || {});
