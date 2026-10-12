/* Deck: visore di slide-immagine con zoom (css/components/deck.css).

   Una slide per passo, come valuepaths.com. Comandi: frecce a schermo,
   ← → e barra spaziatrice, cursore da trascinare, `?slide=N` nell'URL.

   Zoom, ricostruito dal loro custom.slideshow.js (port di jQuery.zoom):
   - mouse: tieni premuto sulla slide, muovi per spostare la lente, rilascia;
   - touch: un tap breve apre lo zoom e lo lascia aperto, il dito lo sposta,
     il tap successivo lo chiude; una pressione lunga lo tiene aperto solo
     finché il dito resta giù.
   L'ingrandimento è ZOOM volte la slide a schermo, ma mai oltre la
   risoluzione vera dell'immagine: oltre, si vedrebbero i pixel.

   Progressive enhancement: senza questo script le immagini restano tutte
   in colonna. */

const ZOOM = 2.5;
const TAP_MS = 250;

document.querySelectorAll('[data-deck]').forEach((deck) => {
  const stage = deck.querySelector('.c-deck__stage');
  const slides = [...deck.querySelectorAll('.c-deck__slide')];
  const captions = [...deck.querySelectorAll('.c-deck__caption')];
  if (!stage || !slides.length) return;

  const prev = deck.querySelector('[data-deck-prev]');
  const next = deck.querySelector('[data-deck-next]');
  const range = deck.querySelector('.c-deck__range');
  const count = deck.querySelector('.c-deck__count');

  const fromUrl = Number(new URLSearchParams(location.search).get('slide'));
  let index = fromUrl >= 1 && fromUrl <= slides.length ? fromUrl - 1 : 0;

  range.min = 1;
  range.max = slides.length;

  function preload(i) {
    const img = slides[i] && slides[i].querySelector('img');
    if (img) new Image().src = img.currentSrc || img.src;
  }

  function render() {
    zoomOut();
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    captions.forEach((caption, i) => caption.classList.toggle('is-active', i === index));
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    range.value = index + 1;
    // La parte piena della traccia (Chrome/Safari): vedi deck.css.
    const pct = slides.length > 1 ? (index / (slides.length - 1)) * 100 : 100;
    range.style.setProperty('--deck-progress', pct + '%');
    count.textContent = index + 1 + ' / ' + slides.length;
    preload(index + 1);
    preload(index - 1);

    const url = new URL(location.href);
    url.searchParams.set('slide', index + 1);
    history.replaceState(null, '', url);
  }

  function goTo(i) {
    if (i < 0 || i >= slides.length || i === index) return;
    index = i;
    render();
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  range.addEventListener('input', () => goTo(Number(range.value) - 1));

  document.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight' || event.key === ' ') {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === 'Escape') {
      zoomOut();
    }
  });

  /* ---------- zoom ---------- */

  let lens = null;   // l'<img> ingrandita, mentre esiste
  let rect = null;   // misure della scena, prese all'apertura
  let ratio = null;  // di quanto sborda la lente per ogni pixel di scena

  function zoomIn(x, y) {
    if (lens) return;
    const base = slides[index].querySelector('img');
    if (!base || !base.complete || !base.naturalWidth) return;

    rect = stage.getBoundingClientRect();
    const w = Math.min(base.naturalWidth, rect.width * ZOOM);
    const h = w * (base.naturalHeight / base.naturalWidth);
    if (w <= rect.width * 1.2) return; // non vale la pena: già quasi a grandezza vera

    lens = document.createElement('img');
    lens.className = 'c-deck__zoom';
    lens.src = base.currentSrc || base.src;
    lens.alt = '';
    lens.style.width = w + 'px';
    lens.style.height = h + 'px';
    ratio = { x: (w - rect.width) / rect.width, y: (h - rect.height) / rect.height };

    stage.appendChild(lens);
    stage.classList.add('is-zoomed');
    zoomMove(x, y);
  }

  function zoomMove(x, y) {
    if (!lens) return;
    const px = Math.max(0, Math.min(x - rect.left, rect.width));
    const py = Math.max(0, Math.min(y - rect.top, rect.height));
    lens.style.left = px * -ratio.x + 'px';
    lens.style.top = py * -ratio.y + 'px';
  }

  function zoomOut() {
    if (!lens) return;
    lens.remove();
    lens = rect = ratio = null;
    latched = false;
    stage.classList.remove('is-zoomed');
  }

  // Mouse: tieni premuto.
  let lastTouch = 0; // per ignorare i mousedown che il browser simula dopo un tocco
  stage.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || Date.now() - lastTouch < 800) return;
    event.preventDefault();
    zoomIn(event.clientX, event.clientY);
  });
  document.addEventListener('mousemove', (event) => zoomMove(event.clientX, event.clientY));
  document.addEventListener('mouseup', () => {
    if (Date.now() - lastTouch >= 800) zoomOut();
  });

  // Touch: il tap decide.
  let touchDown = 0;
  let latched = false;   // zoom tenuto aperto da un tap
  let closing = false;   // il tocco in corso chiuderà lo zoom, se resta un tap

  stage.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    lastTouch = Date.now();
    touchDown = lastTouch;
    const t = event.touches[0];
    if (lens && latched) {
      closing = true;
      zoomMove(t.clientX, t.clientY);
      return;
    }
    zoomIn(t.clientX, t.clientY);
  }, { passive: true });

  stage.addEventListener('touchmove', (event) => {
    if (!lens) return;
    event.preventDefault();
    closing = false;
    const t = event.touches[0];
    zoomMove(t.clientX, t.clientY);
  }, { passive: false });

  stage.addEventListener('touchend', () => {
    lastTouch = Date.now();
    if (!lens) return;
    if (closing) {
      closing = false;
      zoomOut();
    } else if (Date.now() - touchDown < TAP_MS) {
      latched = true;
    } else if (!latched) {
      zoomOut();
    }
  });

  window.addEventListener('resize', zoomOut);

  deck.classList.add('is-js');
  render();
});
