# Implementata bozza “Filtri intelligenti”

## OpenAI call + formato risposta
- Chiamata a `https://api.openai.com/v1/chat/completions` con `model: "gpt-4o-mini"`
- Prompt chiede **solo JSON** tipo:
  ```json
  {"subjects":["..."],"notes":""}
  ```
- Parsing robusto (se il modello aggiunge testo extra prova a estrarre il blocco `{...}`).

## Applicazione filtri suggeriti
Al click su **“applica filtri suggeriti”**:
- Se `sidebarMode === "giornalisti"` applica i `subjects` al dropdown **Servizio giornalistico** (`dropdown`)
- Se `sidebarMode === "testate"` applica i `subjects` al dropdown **Argomento testata** (`testataArgomentoDropdown`)
- Fa canonicalizzazione:
  - match case-insensitive sulle opzioni reali
  - usa anche sinonimi da `__subjectsIndex.synonymsByValue` se disponibili
  - fallback fuzzy leggero
