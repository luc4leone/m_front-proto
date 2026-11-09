# Presentazione commerciale di Mediaddress 7

Mediaddress 7 in vista esplosa (`index.html`), con il pitch di vendita come secondo livello di lettura (`presentazione.html`).

- Scorrendo, i pezzi escono dalla dashboard. ⌘ + scroll o pizzico: zoom. Premi e trascina: pan. Clic su un pezzo: lo inquadra. Esc: vista d'insieme.
- I bollini "Pitch N" aprono a destra la voce del pitch. In fondo alla voce, la domanda frequente si apre in un riquadro con il video al minuto giusto: domande e video si leggono da `../video-tutorials/` (`data.js`, `render.js`), non sono copiati.
- Testi e decisioni del pitch: `mediaddress/marketing/lancio-m7/` (fuori da questo repo).

## File

- `index.html`: l'esploso. Le posizioni dei pezzi sono negli attributi `data-*` dei pulsanti; le regole di interazione in testa a `exploded.js`.
- `presentazione.html`: il pitch come pagina. Ogni voce ha un id, a cui puntano i bollini (`data-pitch`).
- `exploded.js`, `pitch-panel.js`, `faq-modal.js`: esploso, pannello del pitch, riquadro della domanda frequente.
- `presentazione.css`: i componenti, nati in `mucca-website`. In testa, il blocco che traduce i loro nomi nei token di Mediaddress (`css/tokens.css`, `css/theme-default.css`).
- `assets/`: gli screenshot di staging, in WebP.

Fa eccezione alle regole del README di progetto (dati, render e DOM separati; nessun CSS nuovo): è un porting da un altro repo, tenuto com'è per non riscriverlo.
