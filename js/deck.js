/* Разметка карусели карточек и индикатор. Карточка 300×310 как в Figma: картинка 300×300 со смещением 20 px, заголовок и подпись — в автолейауте. */
(function (A) {
  const esc = (s) => A.ui.esc(s);

  function flag(item) {
    if (!item.flag) return '';
    return `<div class="dc-flag-box">${item.flagUnder ? '<i class="dc-flag-under"></i>' : ''}<img class="dc-flag" src="${item.flag}" alt="" draggable="false"></div>`;
  }

  function card(item, i) {
    return `<div class="deck-card" data-i="${i}" data-id="${item.id}">
      <img class="dc-img" src="${item.img}" alt="" draggable="false">
      ${flag(item)}
      <div class="dc-head ${item.flag ? 'narrow' : ''}"><div class="dc-title">${esc(item.title)}</div><div class="dc-desc">${esc(item.desc)}</div></div>
    </div>`;
  }

  /**
   * Обычная колода: top — отступ сверху в px.
   * tall (карточки 300×350): top — начало свободной области под заголовком; колода центрируется по вертикали
   * между этой областью и точками внизу, а при высоте 812 стоит там же, где в Figma (верх центральной карточки 290,5).
   */
  function html(items, top, tall) {
    if (tall) {
      const off = top + (812 - top - 101 - 350) / 2 - 290.5;   // поправка «не идеальный центр»: боковые карточки свисают вниз
      return `<div class="deck tall" data-deck style="--s:${top}px;--o:${off}px">${items.map((it, i) => card(it, i)).join('')}</div>`;
    }
    return `<div class="deck" data-deck style="top:${top}px">${items.map((it, i) => card(it, i)).join('')}</div>`;
  }

  function dots(n, active, top, cls) {
    return `<div class="deck-meta ${cls || ''}" data-dots style="bottom:${812 - 5 - top}px">${Array.from({ length: n }, (_, i) => `<i class="${i === active ? 'on' : ''}"></i>`).join('')}</div>`;
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
