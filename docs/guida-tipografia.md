# Guida al sistema tipografico

Riferimento completo dei token tipografici condivisi (`css/tokens.css` +
`css/theme-default.css`) e di come vengono combinati oggi nei ruoli reali
dell'interfaccia (titoli, corpo testo, label, badge...).

Per la discrepanza tra prototipi (`dashboard` vs `servizio`) e la proposta
di convergenza, vedi [`tipografia.md`](./tipografia.md) — questo documento
invece descrive **il sistema canonico così com'è definito**, a beneficio
di chi scrive nuovo codice.

Una versione visiva e live di questa guida, che carica i CSS reali del
progetto e mostra ogni token renderizzato, è in
[`guida-tipografia.html`](./guida-tipografia.html).

## Font family

| Token | Valore | Uso |
|---|---|---|
| `--font-family` | `"Inter", sans-serif` | Font di default per tutta l'interfaccia. Caricato via Google Fonts in `css/tokens.css`. |
| `--font-hand` | `"Excalifont", sans-serif` | Font "a mano", decorativo. Usato solo in pagine showcase/demo (`index.html`, `components/button.html`, `components/button2.html`, `protos/nuova-notazione/`) — non fa parte della UI applicativa. |

`--font` (definito in `theme-default.css` come alias di `--font-family`) è
quello effettivamente usato da `body` in `components.css`. Usa sempre
`var(--font)` nei componenti, non `var(--font-family)` direttamente.

## Scala dimensioni (font-size)

Scala modulare, rapporto ~1.125–1.25. Base = 16px (default browser).

| Token | rem | px | Ruolo |
|---|---|---|---|
| `--fs-12` | 0.75rem | 12px | label, caption |
| `--fs-14` | 0.875rem | 14px | testo secondario |
| `--fs-16` | 1rem | 16px | **testo corpo (base)** |
| `--fs-18` | 1.125rem | 18px | testo enfatizzato |
| `--fs-20` | 1.25rem | 20px | titoletti |
| `--fs-22` | 1.375rem | 22px | (poco usato) |
| `--fs-24` | 1.5rem | 24px | titolo sezione |
| `--fs-30` | 1.875rem | 30px | titolo pagina |
| `--fs-36` | 2.25rem | 36px | hero |

## Pesi (font-weight)

| Token | Valore | Ruolo tipico |
|---|---|---|
| `--fw-400` | 400 | testo corpo, valori di default |
| `--fw-500` | 500 | enfasi leggera (es. `.meta__label` con modificatore) |
| `--fw-600` | 600 | titoli h1–h6, valori (`.meta__value`), badge |
| `--fw-700` | 700 | enfasi forte |
| `--fw-800` | 800 | label maiuscole/eyebrow (`.titolo`) |

## Altezze di riga (line-height)

Valori senza unità — si moltiplicano per il font-size locale.

| Token | Valore | Ruolo |
|---|---|---|
| `--line-height-12` | 1.2 | titoli, label compatte |
| `--line-height-14` | 1.4 | sottotitoli, label |
| `--line-height-16` | 1.6 | testo corpo (default su `body`) |
| `--line-height-18` | 1.8 | testo lungo, articoli |

## Larghezza massima paragrafo

Per la leggibilità ottimale (60–75 caratteri per riga). `components.css`
applica `--paragraph-65` a tutti i `<p>` di default.

| Token | Valore |
|---|---|
| `--paragraph-40` | 40ch |
| `--paragraph-65` | 65ch |
| `--paragraph-80` | 80ch |

## Colori del testo

Definiti in `theme-default.css`, tutti e quattro effettivamente usati nei
componenti (non sono alias morti).

| Token | Valore | Ruolo | Esempi d'uso reali |
|---|---|---|---|
| `--color-text` | `var(--grey-900)` | testo di default | `body`, `h1–h6`, `.badge`, `.meta__value` |
| `--color-text-strong` | `var(--grey-950)` | testo con più contrasto/enfasi | `.split-button`, `.activity-indicator`, `.limit-indicator` |
| `--color-text-muted` | `var(--grey-650)` | testo secondario, label, meta | `.titolo`, `.meta__label`, `.tabs` (stato inattivo), `.table` header |
| `--color-text-inverse` | `var(--white)` | testo su sfondo scuro/colorato | `.button` (variante primaria), `.button2` |

## Letter-spacing (convenzione osservata, non tokenizzata)

Non esiste ancora un token per il letter-spacing: i valori sono scritti a
mano componente per componente, ma seguono un pattern coerente — più il
testo è piccolo/maiuscolo, più lo spaziato aumenta:

| Valore | Dove |
|---|---|
| `0.01em` | badge, chip, badge-with-led |
| `0.02em` | blink-loader |
| `0.03em` | `.titolo` (eyebrow maiuscolo), tabs |
| `0.04em` | table header |
| `0.05em` | activity-indicator |

Se si tokenizzerà in futuro, questa è la scala di partenza da formalizzare
(es. `--ls-tight: 0.01em` ... `--ls-wide: 0.05em`).

## Stili compositi — ruoli reali nell'interfaccia

Questi sono i punti in cui i token si combinano per formare un ruolo
tipografico riconoscibile. Sono la cosa da copiare quando si costruisce un
nuovo componente, invece di scegliere dimensioni/pesi a caso.

### Titoli semantici — `.titolo` (`components/titolo.css`)

Sistema di titoli esplicito, indipendente dal tag HTML usato (si applica
a h1–h4 o a qualunque elemento):

```css
.titolo {
  font-weight: var(--fw-800);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: var(--line-height-12);
}
```

| Classe modificatore | font-size | Ruolo |
|---|---|---|
| `.titolo--pagina` | `--fs-24` (24px) | titolo di pagina |
| `.titolo--sezione` | `--fs-20` (20px) | titolo di sezione |
| `.titolo--sotto-sezione` | `--fs-16` (16px) | sotto-sezione |
| `.titolo--sotto-sotto-sezione` | `--fs-14` (14px) | livello più annidato |

### Heading HTML nativi — `h1`/`h2`/`h3` (`css/components.css`)

Stile di default per i tag heading "nudi" (senza classe `.titolo`):

```css
h1, h2, h3, h4, h5, h6 {
  line-height: var(--line-height-12);
  font-weight: var(--fw-600);
  color: var(--color-text);
}
h1 { font-size: var(--fs-24); }
h2 { font-size: var(--fs-20); }
h3 { font-size: var(--fs-18); }
```

Nota: stesso font-size di `.titolo--pagina`/`--sezione` ma peso (600 vs
800), colore (`--color-text` vs `--color-text-muted`) e casing diversi —
sono due sistemi di titolo paralleli, non equivalenti. Scegliere `.titolo`
per eyebrow/label di sezione in maiuscolo, gli `h*` nudi per titoli
"normali" con lettering standard.

### Corpo testo — `body` (`css/components.css`)

```css
body {
  font-family: var(--font);
  font-size: var(--fs-16);
  line-height: var(--line-height-16);
  color: var(--color-text);
}
```

### Coppia label/valore — `.meta__label` / `.meta__value` (`components/meta-item.css`)

```css
.meta__label {
  color: var(--color-text-muted);
  font-size: var(--fs-16);
  font-weight: var(--fw-400);
}
.meta__value {
  color: var(--color-text);
  font-size: var(--fs-16);
  font-weight: var(--fw-600);
}
```

Stesso font-size per label e valore: la differenza è solo peso e colore —
pattern da riusare per qualunque coppia etichetta/dato.

### Badge — `components/badge.css`

```css
.badge {
  font-size: var(--fs-12);
  font-weight: var(--fw-600);
  line-height: var(--line-height-12);
  color: var(--color-text);
  letter-spacing: 0.01em;
}
```

## Regole pratiche per chi scrive nuovo codice

1. **Mai valori hardcoded**: sempre `var(--fs-*)`, `var(--fw-*)`,
   `var(--line-height-*)`, `var(--color-text*)` — mai `font-size: 14px`
   o `color: #666`.
2. **Scegli il ruolo, non il numero**: parti da "questo è un titolo di
   sezione" o "questo è un'etichetta secondaria", poi cerca lo stile
   composito corrispondente in questo documento — non scegliere una
   dimensione a sensazione.
3. **`.titolo` vs `h1`/`h2`/`h3` nudi**: sono due sistemi diversi (vedi
   sopra). Non mischiarli nello stesso contesto senza motivo.
4. **Se serve una dimensione fuori scala** (è già successo in
   `protos/servizio/style.css` con 13px/15px): è quasi sempre un segnale
   che si può usare il token più vicino della scala invece di introdurne
   uno nuovo.
