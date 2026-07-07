---
trigger: always_on
---

# Regole progetto

## Stack
- HTML + CSS + vanilla JS. Nessun framework, nessun build tool.
- I file JS si caricano con `type="module"` nell'HTML.

## Separazione dati / presentazione
Questo repo contiene più prototipi, ciascuno isolato nella propria cartella.

L’obiettivo della separazione dati / presentazione è rendere semplice cambiare contenuti e UI senza mescolare dati, rendering e comportamento. La separazione è consigliata quando il prototipo è data‑driven, ma non è obbligatoria per prototipi completamente statici.

### Struttura per prototipo (consigliata)
Ogni prototipo vive in `protos/<nome-prototipo>/` e può contenere:
- `index.html` shell della pagina (markup base, link CSS, mount point)
- `js/data.js` contiene solo dati (oggetti, array, stringhe, configurazioni). Non scrivere mai HTML o logica DOM in data.js.
- `js/render.js` contiene solo funzioni pure che ricevono dati e restituiscono stringhe HTML. Non accede al DOM direttamente.
- `js/main.js` è l'unico file che scrive nel DOM e aggiunge event listener.

Se un prototipo non è data‑driven può omettere `data.js` e/o `render.js` e avere solo `index.html` + `main.js` (o anche nessun JS).

### Regole di caricamento script
I file JS dei prototipi si caricano con `type="module"` nell’HTML.

## Componenti condivisi
I componenti riusabili vivono in `components/`. Ogni componente usato dentro altri componenti
espone una funzione `render(config)` nel proprio file `.js`:
- `render(config)` — riceve dati, restituisce stringa HTML, nessun side effect.

I componenti interattivi espongono anche:
- `init(element)` — riceve elemento DOM già montato, attacca event listener.

Non chiamare mai `init()` prima che `render()` abbia scritto l'HTML nel DOM.
Non copiare il markup di un componente dentro un altro: usare sempre la sua `render()`.

## CSS
I componenti usano solo variabili CSS — mai valori hardcoded.
- Scale neutre (spazi, font-size): variabili da `tokens.css`
- Scelte estetiche (colori, font, radius): variabili da `theme-default.css`
- Non usare `!important`.
- Classi BEM: `.block__element--modifier`.
- Non aggiungere `margin-*` alle classi dei componenti
  (es. `.form__reassurance`, `.form__title`). La spaziatura tra elementi
  è responsabilità del contenitore. Usa `gap` su flex o grid container.

## Naming
- File: kebab-case (`newsletter-form.js`, non `newsletterForm.js`).
- Classi CSS: kebab-case (`.form-input`, `.submit-btn`).
- Variabili JS: camelCase (`formConfig`, `renderInput`).
- Funzioni: prefisso `render` per render, `init` per behavior (`renderForm`, `initDropdown`).

## Cosa non fare
- Non scrivere testo visibile direttamente nell'HTML statico se proviene da dati. Usare le funzioni render.
- Ogni componente ha il proprio file CSS in [components/](cci:9://file:///Users/luca/Sync/_projects/m_protos_new_wf/components:0:0-0:0) (struttura flat, es. [components/action-link.css](cci:7://file:///Users/luca/Sync/_projects/m_protos_new_wf/components/action-link.css:0:0-0:0)). Quel file è la source of truth per gli stili del componente.
- [css/components.css](cci:7://file:///Users/luca/Sync/_projects/m_protos_new_wf/css/components.css:0:0-0:0) è riservato a body, tipografia e layout globali — non agli stili dei singoli componenti.
- Non creare nuovi file CSS in `css/` oltre a quelli esistenti.
- [components/showcase.css](cci:7://file:///Users/luca/Sync/_projects/m_protos_new_wf/components/showcase.css:0:0-0:0) contiene gli stili condivisi delle pagine showcase (font, tipografia del chrome, layout `.showcase`). Ogni showcase di componente lo linka. Gli stili di showcase non devono cascadare nelle componenti: la tipografia va scoped sotto `.showcase`, il `.showcase__display` resetta a `var(--font)`.
- Non usare `innerHTML` in `render.js` — solo restituire stringhe.
  È `main.js` che assegna `innerHTML`.
- Non chiamare `init()` di un componente interattivo prima di averlo
  renderizzato nel DOM con la relativa funzione `render()`.
