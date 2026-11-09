/* La domanda frequente con il suo video, in un riquadro al centro.

   I link alle domande frequenti del pitch puntano al centro assistenza
   (…/video-tutorials/index.html#faq-…). Con questo script il clic non
   porta fuori: apre .c-faq-modal con domanda, risposta e video, già al
   minuto in cui il video risponde. Il link vero resta, per chi apre in
   un'altra scheda e come uscita: «Apri nel centro assistenza».

   Domande e video non sono copiati qui: si caricano dal centro
   assistenza (data.js e render.js, nella cartella accanto),
   così restano scritti in un posto solo. */

(function () {
  // Il centro assistenza sta nello stesso sito, accanto a questa cartella.
  const HELP = new URL('../video-tutorials/', location.href).href;
  const modal = document.querySelector('.c-faq-modal');
  if (!modal) return;

  const question = modal.querySelector('.c-faq-modal__question');
  const answer = modal.querySelector('.c-faq-modal__answer');
  const video = modal.querySelector('.c-faq-modal__video');
  const caption = modal.querySelector('.c-faq-modal__caption');
  const out = modal.querySelector('.c-faq-modal__out');

  let help = null;

  function load() {
    help = help || Promise.all([import(`${HELP}data.js`), import(`${HELP}render.js`)])
      .then(([data, render]) => {
        const videos = Object.fromEntries(data.videos.map((v) => [v.id, v]));
        const faqs = Object.fromEntries(data.faqs.map((f) => [render.faqId(f.question), f]));
        return { videos, faqs, render };
      });
    return help;
  }

  async function open(id, href) {
    const { videos, faqs, render } = await load();
    const faq = faqs[id];
    if (!faq) return false;
    const clip = videos[faq.videoId];

    question.textContent = faq.question;
    answer.textContent = faq.answer;
    caption.textContent = `${clip.title} · dal minuto ${faq.time}`;
    out.href = href;

    const start = render.toSeconds(faq.time);
    video.src = new URL(render.toVideoSrc(clip), HELP).href;
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = start;
      video.play().catch(() => {}); // senza audio permesso, resta in pausa al minuto giusto
    }, { once: true });

    document.documentElement.style.overflow = 'hidden'; // sotto, lo scroll è l'esplosione
    modal.showModal();
    return true;
  }

  modal.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.documentElement.style.overflow = '';
  });

  // Clic fuori dal riquadro: chiude.
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href]');
    if (!link || modal.contains(link) || !link.href.startsWith(HELP) || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const id = decodeURIComponent(new URL(link.href).hash.slice(1));
    if (!id.startsWith('faq-')) return;
    e.preventDefault();
    const ok = await open(id, link.href).catch(() => false);
    if (!ok) location.href = link.href; // se il centro assistenza non risponde, ci si va
  });

  load(); // in anticipo: il primo clic non aspetta la rete
})();
