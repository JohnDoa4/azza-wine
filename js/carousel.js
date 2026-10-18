/* Карусель карточек: центральная ровно, соседние под углом ±15° (слева -15° в CSS = +15° в Figma). */
(function (A) {
  const ANGLE = 15;
  const rad = (ANGLE * Math.PI) / 180;
  const PITCH = 300; // расстояние между карточками при перетаскивании

  /**
   * root   — .deck с карточками .deck-card
   * opts   — { active, onChange(i), onSelect(i) }
   */
  function create(root, opts) {
    opts = opts || {};
    const cards = Array.from(root.querySelectorAll('.deck-card'));
    const n = cards.length;
    let active = Math.max(0, Math.min(n - 1, opts.active || 0));
    let shift = 0;
    let W = root.clientWidth || 375;

    const tall = root.classList.contains('tall');   // карточки 300×350: центр соседней смещён на ±249,6 по горизонтали и +33 по вертикали (Figma 6495:4852, 6537:4944)
    const pitch = tall ? 249.6 : PITCH;

    const anchors = () => {
      const cl = (W - 300) / 2;
      if (tall) {
        return {
          tx: [cl - 499, cl - 249.6, cl, cl + 249.6, cl + 499],
          ty: [66, 33, 0, 33, 66],
          rot: [-ANGLE, -ANGLE, 0, ANGLE, ANGLE],
          op: [0, 1, 1, 1, 0],
        };
      }
      return {
        tx: [cl - 600, cl - 300 * Math.cos(rad), cl, cl + 300, cl + 600],
        ty: [120, 300 * Math.sin(rad), 0, 0, 40],
        rot: [-ANGLE, -ANGLE, 0, ANGLE, ANGLE],
        op: [0, 1, 1, 1, 0],
      };
    };
    const lerp = (arr, p) => {
      const x = Math.max(-2, Math.min(2, p)) + 2;
      const i = Math.min(3, Math.floor(x));
      return arr[i] + (arr[i + 1] - arr[i]) * (x - i);
    };

    function layout() {
      const a = anchors();
      cards.forEach((c, i) => {
        const p = i - (active + shift);
        const op = lerp(a.op, p);
        c.style.transform = `translate(${lerp(a.tx, p).toFixed(2)}px, ${lerp(a.ty, p).toFixed(2)}px) rotate(${lerp(a.rot, p).toFixed(3)}deg)`;
        c.style.opacity = op.toFixed(3);
        c.style.zIndex = String(Math.round(20 - Math.abs(p) * 6));
        c.style.pointerEvents = op < 0.2 ? 'none' : '';
        c.style.visibility = op < 0.02 ? 'hidden' : 'visible';
        c.classList.toggle('is-center', Math.abs(p) < 0.5);
        c.setAttribute('aria-hidden', op < 0.2 ? 'true' : 'false');
      });
    }

    function setActive(i, animate) {
      i = Math.max(0, Math.min(n - 1, i));
      const changed = i !== active;
      if (animate !== false) root.classList.add('anim');
      active = i; shift = 0;
      layout();
      if (animate !== false) setTimeout(() => root.classList.remove('anim'), 430);
      if (changed && opts.onChange) opts.onChange(active);
    }

    // жесты
    let down = null;
    root.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      down = { x: e.clientX, t: performance.now(), lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, target: e.target.closest('.deck-card') };
      root.classList.remove('anim');
      try { root.setPointerCapture(e.pointerId); } catch (_) { /* синтетические события */ }
    });
    root.addEventListener('pointermove', (e) => {
      if (!down) return;
      const scale = A.scale || 1;
      const dx = (e.clientX - down.x) / scale;
      if (Math.abs(dx) > 6) down.moved = true;
      const now = performance.now();
      if (now - down.lastT > 16) { down.v = (e.clientX - down.lastX) / scale / (now - down.lastT); down.lastX = e.clientX; down.lastT = now; }
      if (down.moved) {
        shift = Math.max(-0.35 - active, Math.min(n - 1 + 0.35 - active, -dx / pitch));
        layout();
      }
    });
    const end = (e) => {
      if (!down) return;
      const d = down; down = null;
      if (!d.moved) {
        shift = 0;
        const card = d.target;
        if (card) {
          const i = cards.indexOf(card);
          if (i === active) { opts.onSelect && opts.onSelect(active); } else { setActive(i); }
        }
        return;
      }
      // одно движение — одна карточка; длинное перетаскивание может пролистать несколько
      let target = active;
      if (Math.abs(shift) > 1.3) target = active + Math.round(shift);
      else if (Math.abs(shift) > 0.18 || Math.abs(d.v) > 0.4) target = active + (Math.abs(shift) > 0.18 ? Math.sign(shift) : -Math.sign(d.v));
      setActive(target);
    };
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(active - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setActive(active + 1); }
      if (e.key === 'Enter') { opts.onSelect && opts.onSelect(active); }
    });
    root.setAttribute('tabindex', '0');
    root.setAttribute('role', 'listbox');

    if (window.ResizeObserver) new ResizeObserver(() => { W = root.clientWidth || 375; layout(); }).observe(root);
    layout();
    return { setActive, get active() { return active; }, layout, count: n };
  }

  A.carousel = { create, ANGLE };
})(window.Azza = window.Azza || {});
