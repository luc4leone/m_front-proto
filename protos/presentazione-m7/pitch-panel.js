/* Variante B: il testo del pitch si apre accanto al pezzo.

   Clic su un bollino "Pitch" dell'esploso: la camera inquadra il pezzo
   nella parte sinistra della finestra e a destra si apre .c-pitch-panel
   con la voce di presentazione.html. Esc, la × o lo scroll lo chiudono
   e la camera torna a usare tutta la finestra. Con il pannello aperto
   zoom e pan dell'esploso funzionano come sempre; un clic su un altro
   bollino cambia testo e pezzo. */

(function () {
  const root = document.querySelector('.c-exploded');
  const panel = document.querySelector('.c-pitch-panel');
  if (!root || !panel || !root.exploded) return;

  const body = panel.querySelector('.c-pitch-panel__body');
  const more = panel.querySelector('.c-pitch-panel__more a');
  const close = panel.querySelector('.c-pitch-panel__close');
  const source = panel.dataset.source; // presentazione.html

  let doc = null;
  let opener = null; // il bollino da cui si è aperto, per ridargli il focus

  async function load() {
    if (doc) return doc;
    const html = await fetch(source).then((r) => r.text());
    doc = new DOMParser().parseFromString(html, 'text/html');
    return doc;
  }

  async function open({ piece, pitch }, trigger) {
    const d = await load();
    const item = d.getElementById(pitch);
    if (!item) return;
    const part = item.closest('.c-pitch__part');
    body.replaceChildren();
    if (part && part !== item) {
      const kicker = document.createElement('p');
      kicker.className = 'c-pitch__kicker';
      kicker.textContent = part.querySelector('h2').textContent;
      body.appendChild(kicker);
    }
    body.appendChild(document.importNode(item, true));
    more.href = `${source}#${pitch}`;

    opener = trigger || opener;
    panel.hidden = false;
    panel.scrollTop = 0;
    root.exploded.setActive(piece);
    root.exploded.frame(piece);
    root.exploded.setInset(panel.offsetWidth);
    const heading = body.querySelector('h2, h3');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }

  function shut() {
    if (panel.hidden) return;
    panel.hidden = true;
    root.exploded.setActive(null);
    root.exploded.setInset(0);
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  }

  root.addEventListener('exploded:pitch', (e) => open(e.detail, document.activeElement));
  root.addEventListener('exploded:auto', shut);
  close.addEventListener('click', shut);

  // Esc chiude il pannello prima che l'esploso torni alla vista d'insieme.
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || panel.hidden || document.querySelector('dialog[open]')) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    shut();
  }, true);

  addEventListener('resize', () => {
    if (!panel.hidden) root.exploded.setInset(panel.offsetWidth);
  });
})();
