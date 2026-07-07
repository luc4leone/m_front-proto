# Template repo per costruire prototipi

Costruito per seguire un certo workflow che qui non esplicito.

I test non sono attivi by default, perché la maggior parte delle volte posso procedere senza.

Nel caso invece in cui voglia attivarli, devo:

`npm install` 

che installa `playwright` come dev dependency e gli script di test.

Qui sotto metto le RULES del progetto (che in locale vanno nel file corretto a seconda che io usi Cursor o Windsurf).

## Stack
- HTML + CSS + vanilla JS. Nessun framework, nessun build tool.
- I file JS si caricano con `type="module"` nell'HTML.

## Separazione dati / presentazione
I dati e la loro visualizzazione vivono in file separati.
Questo permette di modificare l'uno senza toccare l'altro.
- `js/data.js` contiene solo dati (oggetti, array, stringhe, configurazioni).
  Non scrivere mai HTML o logica DOM in data.js.
- `js/render.js` contiene solo funzioni che ricevono dati e restituiscono
  stringhe HTML. Non accede al DOM direttamente.
- `js/main.js` è l'unico file che scrive nel DOM e aggiunge event listener.

## Componenti interattivi
I componenti con comportamento JS proprio (dropdown, modal, accordion…)
vivono in `components/` come moduli con due funzioni esportate:
- `render(config)` — riceve dati, restituisce stringa HTML, nessun side effect.
- `init(element)` — riceve elemento DOM già montato, attacca event listener.
Non usare mai `init()` prima che `render()` abbia scritto l'HTML nel DOM.

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
- Non scrivere testo visibile direttamente nell'HTML statico se proviene da dati.
  Usare le funzioni render.
- Non creare nuovi file CSS oltre a quelli esistenti in `css/`.
  Gli stili dei componenti semplici vanno in `components.css`.
- Non usare `innerHTML` in `render.js` — solo restituire stringhe.
  È `main.js` che assegna `innerHTML`.
- Non chiamare `init()` di un componente interattivo prima di averlo
  renderizzato nel DOM con la relativa funzione `render()`.
