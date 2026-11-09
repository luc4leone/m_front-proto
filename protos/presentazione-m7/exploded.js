/* .c-exploded — vista esplosa guidata dallo scroll.

   Ogni pezzo ha nel markup:
     data-to       posizione finale (angolo in alto a sinistra), in px
                   della scena
     data-parent   id del pezzo da cui esce (manca solo nel principale)
     data-origin   il punto d'origine, in px del pezzo genitore
     data-match    il punto del pezzo che all'inizio sta sull'origine
     data-attach   il punto del pezzo dove arriva la linea di richiamo
     data-step     l'ordine di uscita (0, 1, 2…)

   Regole di interazione (decise con Luca il 9 novembre 2026):

   1. Lo scroll esplode (giù) e richiude (su). Non fa zoom né pan.
   2. ⌘/Ctrl + scroll, o il pizzico sul trackpad, è lo zoom, ovunque,
      attorno al puntatore. Da MAX_ZOOM (gli screenshot sono a 1x) giù
      fino alla vista d'insieme.
   3. Premi e trascina è il pan, su sfondo e pezzi, attraverso i pezzi.
      Si ferma poco oltre il bordo dei pezzi visibili. Sotto DRAG px di
      movimento è un clic.
   4. Dal primo zoom o pan la camera è dell'utente: resta dov'è.
   5. Lo scroll, Esc, il tasto 0 e «Vista d'insieme» la riportano in
      automatico: la camera inquadra tutti i pezzi usciti.
   6. Clic su un pezzo: la camera lo adatta alla finestra (mai sopra la
      scala 1). Da lì zoom e pan sono liberi. Clic sul pezzo già
      inquadrato o sullo sfondo: niente.
   7. Tastiera: + − zoom, frecce pan (solo con la camera dell'utente),
      0 ed Esc vista d'insieme.
   8. Cursore: lente sui pezzi, manina aperta sullo sfondo quando c'è
      da spostarsi, chiusa mentre si trascina.
   9. La barra __zoom appare con la camera dell'utente:
      − valore + Adatta pezzo | Vista d'insieme. */

(function () {
  const root = document.querySelector('.c-exploded');
  if (!root) return;

  const PAD = 48; // margine fra la scena e il bordo della finestra
  const DOT = 3; // raggio del punto d'origine, in px dello schermo
  const MAX_ZOOM = 1.5; // oltre, gli screenshot a 1x si sgranano
  const STEP = 1.25; // fattore di un clic su + o −
  const WHEEL = 0.01; // sensibilità di ⌘ + scroll e del pizzico
  const ARROW = 80; // px dello schermo per un tasto freccia
  const DRAG = 4; // px oltre i quali un clic diventa trascinamento
  const SVG = 'http://www.w3.org/2000/svg';

  const stage = root.querySelector('.c-exploded__stage');
  const scene = root.querySelector('.c-exploded__scene');
  const svg = root.querySelector('.c-exploded__lines');
  const hint = root.querySelector('.c-exploded__hint');
  const wide = matchMedia('(min-width: 768px)');
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  const pt = (s) => {
    if (!s) return null;
    const [x, y] = s.split(' ').map(Number);
    return { x, y };
  };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const svgEl = (name) => svg.appendChild(document.createElementNS(SVG, name));

  const pieces = [...root.querySelectorAll('.c-exploded__piece')].map((el) => {
    const img = el.querySelector('img');
    return {
      el,
      w: +img.getAttribute('width'),
      h: +img.getAttribute('height'),
      to: pt(el.dataset.to),
      origin: pt(el.dataset.origin),
      match: pt(el.dataset.match),
      attach: pt(el.dataset.attach),
      parentId: el.dataset.parent,
      step: +el.dataset.step || 0,
      pitch: el.dataset.pitch || null, // id della voce del pitch
      pitchLabel: el.dataset.pitchLabel || '',
    };
  });

  const byId = new Map(pieces.map((p) => [p.el.id, p]));
  const depth = (p) => (p.parent ? depth(p.parent) + 1 : 0);
  pieces.forEach((p) => (p.parent = byId.get(p.parentId) || null));
  pieces.sort((a, b) => depth(a) - depth(b)); // i genitori prima dei figli

  const lastStep = Math.max(...pieces.map((p) => p.step));
  // ritardo fra un pezzo e il successivo: 0,08, ma con molti pezzi si
  // stringe perché ognuno abbia almeno il 40% dello scroll per uscire
  const STAGGER = Math.min(0.08, 0.6 / Math.max(1, lastStep));
  const span = 1 - lastStep * STAGGER;

  pieces.forEach((p) => {
    p.el.style.width = p.w + 'px';
    p.el.style.height = p.h + 'px';
    p.el.style.zIndex = 10 - depth(p); // chi esce sta sotto chi lo contiene
    p.rect = svgEl('rect');
    p.rect.setAttribute('width', p.w);
    p.rect.setAttribute('height', p.h);
    if (p.parent) {
      p.line = svgEl('line');
      p.dot = svgEl('circle');
    }
  });

  /* Bollini del pitch: un pulsante nella scena, sull'angolo in alto a
     destra del pezzo, a misura costante qualunque sia lo zoom. Il clic
     non lo gestisce l'esploso: manda l'evento «exploded:pitch» con il
     pezzo e la voce, e ci pensa la pagina. */
  pieces.forEach((p) => {
    if (!p.pitch) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'c-exploded__pitch';
    b.textContent = p.pitchLabel ? `Pitch ${p.pitchLabel}` : 'Pitch';
    b.setAttribute('aria-label', `Leggi il pitch: ${p.el.querySelector('img').alt.split(':')[0]}`);
    b.addEventListener('click', () => {
      if (dragged) return;
      root.dispatchEvent(new CustomEvent('exploded:pitch', { detail: { piece: p.el.id, pitch: p.pitch } }));
    });
    scene.appendChild(b);
    p.badge = b;
  });

  /* La barra dello zoom (regola 9). */
  const bar = document.createElement('div');
  bar.className = 'c-exploded__zoom';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Zoom');
  bar.hidden = true;
  bar.innerHTML = `
    <button type="button" class="c-exploded__zoom-btn" data-zoom="out" aria-label="Riduci">−</button>
    <output class="c-exploded__zoom-value" aria-live="polite"></output>
    <button type="button" class="c-exploded__zoom-btn" data-zoom="in" aria-label="Ingrandisci">+</button>
    <button type="button" class="c-exploded__zoom-text" data-zoom="fit">Adatta pezzo</button>
    <span class="c-exploded__zoom-sep" aria-hidden="true"></span>
    <button type="button" class="c-exploded__zoom-text" data-zoom="auto">Vista d'insieme</button>`;
  stage.appendChild(bar);
  const btnOut = bar.querySelector('[data-zoom="out"]');
  const btnIn = bar.querySelector('[data-zoom="in"]');
  const btnFit = bar.querySelector('[data-zoom="fit"]');
  const value = bar.querySelector('output');

  let focused = null; // l'ultimo pezzo inquadrato con un clic
  let view = null; // camera dell'utente { s, cx, cy }, null = automatica
  let cam = null; // la camera disegnata, che insegue la meta
  let frame = 0;
  let snap = false; // il prossimo frame va alla meta senza inseguirla
  let inset = 0; // px a destra coperti da un pannello: la camera li evita
  const vw = () => innerWidth - inset; // larghezza utile della finestra

  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? clamp(scrollY / max) : 1;
  }

  function layout(t) {
    pieces.forEach((p) => {
      if (!p.parent) {
        p.x = p.to.x;
        p.y = p.to.y;
        p.o = 1;
        return;
      }
      const k = ease(clamp((t - p.step * STAGGER) / span));
      p.ox = p.parent.x + p.origin.x;
      p.oy = p.parent.y + p.origin.y;
      p.x = lerp(p.ox - p.match.x, p.to.x, k);
      p.y = lerp(p.oy - p.match.y, p.to.y, k);
      p.o = clamp(k * 4);
    });
  }

  /* Il riquadro dei pezzi visibili, in px della scena. */
  function bounds() {
    const shown = pieces.filter((p) => p.o > 0);
    const x = Math.min(...shown.map((p) => p.x));
    const y = Math.min(...shown.map((p) => p.y));
    return {
      x,
      y,
      w: Math.max(...shown.map((p) => p.x + p.w)) - x,
      h: Math.max(...shown.map((p) => p.y + p.h)) - y,
    };
  }

  /* La scala che fa stare un riquadro nella finestra, mai sopra 1. */
  const fitScale = (b) => Math.min(1, (vw() - 2 * PAD) / b.w, (innerHeight - 2 * PAD) / b.h);

  const minScale = () => fitScale(bounds());
  const maxScale = () => Math.max(minScale(), MAX_ZOOM);

  /* Tiene la camera dentro la scena: lungo un asse, se la scena ci sta,
     sta al centro; se no, il centro resta fra i due bordi (più PAD). */
  function clampView(v) {
    const b = bounds();
    const s = clamp(v.s, minScale(), maxScale());
    const hw = (vw() / 2 - PAD) / s;
    const hh = (innerHeight / 2 - PAD) / s;
    const cx = b.w / 2 <= hw ? b.x + b.w / 2 : clamp(v.cx, b.x + hw, b.x + b.w - hw);
    const cy = b.h / 2 <= hh ? b.y + b.h / 2 : clamp(v.cy, b.y + hh, b.y + b.h - hh);
    return { s, cx, cy };
  }

  function target() {
    if (view) {
      view = clampView(view);
      return { s: view.s, x: vw() / 2 - view.cx * view.s, y: innerHeight / 2 - view.cy * view.s };
    }
    const b = bounds();
    const s = fitScale(b);
    return {
      s,
      x: vw() / 2 - (b.x + b.w / 2) * s,
      y: innerHeight / 2 - (b.y + b.h / 2) * s,
    };
  }

  /* C'è da spostarsi se la scena, a questa scala, esce dalla finestra. */
  function pannable() {
    if (!view) return false;
    const b = bounds();
    return b.w * view.s > vw() - 2 * PAD + 1 || b.h * view.s > innerHeight - 2 * PAD + 1;
  }

  function updateBar() {
    bar.hidden = !view;
    root.classList.toggle('is-pannable', pannable());
    if (!view) return;
    value.textContent = Math.round(view.s * 100) + '%';
    btnOut.disabled = view.s <= minScale() + 0.001;
    btnIn.disabled = view.s >= maxScale() - 0.001;
    btnFit.hidden = !focused;
  }

  function draw() {
    pieces.forEach((p) => {
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      p.el.style.opacity = p.o;
      p.el.inert = p.o === 0;
      p.rect.setAttribute('x', p.x);
      p.rect.setAttribute('y', p.y);
      p.rect.style.opacity = p.o;
      if (!p.line) return;
      p.line.setAttribute('x1', p.ox);
      p.line.setAttribute('y1', p.oy);
      p.line.setAttribute('x2', p.x + p.attach.x);
      p.line.setAttribute('y2', p.y + p.attach.y);
      p.line.style.opacity = p.o;
      p.dot.setAttribute('cx', p.ox);
      p.dot.setAttribute('cy', p.oy);
      p.dot.setAttribute('r', DOT / cam.s);
      p.dot.style.opacity = p.o;
    });
    pieces.forEach((p) => {
      if (!p.badge) return;
      p.badge.style.transform = `translate(${p.x + p.w}px, ${p.y}px) scale(${1 / cam.s}) translate(-100%, calc(-100% - 6px))`;
      p.badge.style.opacity = p.o;
      p.badge.inert = p.o === 0;
    });
    scene.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`;
    scene.style.setProperty('--c-exploded-scale', cam.s);
  }

  function tick() {
    frame = 0;
    const t = progress();
    layout(t);
    const goal = target();
    const k = still.matches || !cam || snap ? 1 : 0.18;
    snap = false;
    cam = cam || goal;
    cam = { s: lerp(cam.s, goal.s, k), x: lerp(cam.x, goal.x, k), y: lerp(cam.y, goal.y, k) };
    draw();
    updateBar();
    hint.style.opacity = 1 - clamp(t * 10);
    const moving = Math.abs(cam.s - goal.s) > 0.0005 || Math.abs(cam.x - goal.x) > 0.5 || Math.abs(cam.y - goal.y) > 0.5;
    if (moving) schedule();
  }

  function schedule() {
    if (!frame && wide.matches) frame = requestAnimationFrame(tick);
  }

  function setFocused(p) {
    if (focused) {
      focused.el.classList.remove('is-focused');
      focused.el.setAttribute('aria-pressed', 'false');
    }
    focused = p;
    if (p) {
      p.el.classList.add('is-focused');
      p.el.setAttribute('aria-pressed', 'true');
    }
  }

  /* Regola 4: la camera passa all'utente partendo da quella a schermo. */
  function takeCamera() {
    if (view || !cam) return;
    view = { s: cam.s, cx: (vw() / 2 - cam.x) / cam.s, cy: (innerHeight / 2 - cam.y) / cam.s };
  }

  /* Regola 5. */
  function autoCamera() {
    if (!view && !focused) return;
    view = null;
    setFocused(null);
    schedule();
    root.dispatchEvent(new CustomEvent('exploded:auto'));
  }

  /* Regola 6. */
  function frameOn(p) {
    setFocused(p);
    view = { s: fitScale(p), cx: p.x + p.w / 2, cy: p.y + p.h / 2 };
    schedule();
  }

  /* Ingrandisce di `f` tenendo fermo il punto dello schermo (px, py). */
  function zoomAt(f, px = vw() / 2, py = innerHeight / 2, instant = false) {
    takeCamera();
    if (!view) return;
    const s = clamp(view.s * f, minScale(), maxScale());
    const sx = view.cx + (px - vw() / 2) / view.s;
    const sy = view.cy + (py - innerHeight / 2) / view.s;
    view = clampView({ s, cx: sx - (px - vw() / 2) / s, cy: sy - (py - innerHeight / 2) / s });
    snap = instant;
    schedule();
  }

  /* Sposta di (dx, dy) px dello schermo. */
  function panBy(dx, dy, instant = false) {
    takeCamera();
    if (!view) return;
    view = clampView({ s: view.s, cx: view.cx + dx / view.s, cy: view.cy + dy / view.s });
    snap = instant;
    schedule();
  }

  let drag = null; // { x, y, moved }
  let dragged = false;

  pieces.forEach((p) => {
    p.el.setAttribute('aria-pressed', 'false');
    p.el.addEventListener('click', () => {
      if (dragged) return; // fine di un trascinamento, non un clic
      if (focused === p) return;
      frameOn(p);
    });
  });

  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const what = b.dataset.zoom;
    if (what === 'in') zoomAt(STEP);
    else if (what === 'out') zoomAt(1 / STEP);
    else if (what === 'fit' && focused) frameOn(focused);
    else if (what === 'auto') autoCamera();
  });

  /* Regola 3: premi e trascina. */
  stage.addEventListener('pointerdown', (e) => {
    dragged = false;
    if (e.button !== 0 || bar.contains(e.target)) return;
    drag = { x: e.clientX, y: e.clientY, moved: false };
  });

  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG) return;
    if (!drag.moved) {
      drag.moved = true;
      root.classList.add('is-dragging');
    }
    drag.x = e.clientX;
    drag.y = e.clientY;
    panBy(-dx, -dy, true);
  });

  addEventListener('pointerup', () => {
    if (!drag) return;
    dragged = drag.moved;
    drag = null;
    root.classList.remove('is-dragging');
  });

  /* Regola 2: ⌘/Ctrl + scroll e pizzico (che il browser manda come
     rotella con ctrlKey). Lo scroll semplice resta alla pagina. */
  stage.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // righe → px
    zoomAt(Math.exp(-clamp(dy, -50, 50) * WHEEL), e.clientX, e.clientY, true);
  }, { passive: false });

  /* Regola 7. */
  document.addEventListener('keydown', (e) => {
    if (!wide.matches || e.metaKey || e.ctrlKey || e.altKey) return;
    if (root.classList.contains('is-reading')) return; // la pagina sopra ha la tastiera
    if (document.querySelector('dialog[open]')) return; // e anche un riquadro modale
    if (e.target instanceof Element && e.target.closest('input, textarea, select')) return;
    const keys = {
      '+': () => zoomAt(STEP),
      '=': () => zoomAt(STEP),
      '-': () => zoomAt(1 / STEP),
      '0': autoCamera,
      Escape: autoCamera,
    };
    const arrows = {
      ArrowLeft: [-ARROW, 0],
      ArrowRight: [ARROW, 0],
      ArrowUp: [0, -ARROW],
      ArrowDown: [0, ARROW],
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    } else if (arrows[e.key] && view) {
      // con la camera automatica le frecce scorrono la pagina (regola 1)
      e.preventDefault();
      panBy(...arrows[e.key]);
    }
  });

  /* Regole 1 e 5: lo scroll esplode e riporta la camera in automatico. */
  addEventListener('scroll', () => {
    autoCamera();
    schedule();
  }, { passive: true });

  addEventListener('resize', schedule);
  wide.addEventListener('change', schedule);

  /* Quel poco che la pagina può chiedere all'esploso. */
  root.exploded = {
    frame(id) {
      const p = byId.get(id);
      if (p) frameOn(p);
    },
    auto: autoCamera,
    setInset(px) {
      inset = px;
      root.style.setProperty('--c-exploded-inset', px + 'px');
      if (focused) frameOn(focused);
      else schedule();
    },
    setActive(id) {
      pieces.forEach((p) => p.badge && p.badge.classList.toggle('is-active', p.el.id === id));
    },
  };

  schedule();
})();
