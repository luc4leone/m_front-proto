# Sistema tipografico

Questo progetto nasce dall'unione di prototipi costruiti in momenti diversi
(`protos/dashboard/`, `protos/servizio/`, ...), ognuno con le proprie scelte
tipografiche. Questo documento fotografa lo stato attuale, elenca le
divergenze reali tra `protos/dashboard/index5-tabs-overflow.html` e
`protos/servizio/index.html`, e propone un sistema target verso cui
convergere quando si toccherà di nuovo quel codice.

## Fonte di verità condivisa: `css/tokens.css`

```
--font-family: "Inter", sans-serif;
--font-hand:   "Excalifont", sans-serif;   /* font a mano, uso decorativo */

--fs-12: 0.75rem   /* 12px — label, caption */
--fs-14: 0.875rem  /* 14px — testo secondario */
--fs-16: 1rem      /* 16px — testo corpo (base) */
--fs-18: 1.125rem  /* 18px — testo enfatizzato */
--fs-20: 1.25rem   /* 20px — titoletti */
--fs-22: 1.375rem  /* 22px */
--fs-24: 1.5rem    /* 24px — titolo sezione */
--fs-30: 1.875rem  /* 30px — titolo pagina */
--fs-36: 2.25rem   /* 36px — hero */

--fw-400 / 500 / 600 / 700 / 800

--line-height-12: 1.2  /* titoli */
--line-height-14: 1.4  /* sottotitoli, label */
--line-height-16: 1.6  /* testo corpo */
--line-height-18: 1.8  /* testo lungo, articoli */
```

Il `README.md` del repo è esplicito: i componenti devono usare solo queste
variabili, mai valori hardcoded. Questa è la scala che **dovrebbe** essere
l'unica in uso.

## Come i due prototipi la usano oggi

### `dashboard/index5-tabs-overflow.html` — canonico

Carica la catena completa: `reset.css` → `tokens.css` → `theme-default.css`
→ `components.css` → componenti condivisi in `components/*.css`.

- Legge i token grezzi direttamente: `var(--fs-12)`, `var(--fs-16)`, ecc.
- Base del corpo testo (impostata in `components.css`): **16px**
  (`body { font-size: var(--fs-16) }`).
- Titoli: h1 24px, h2 20px, h3 18px.
- 14px è usato come dimensione "secondaria" (meta, label).

### `servizio/index.html` — ramo divergente

Non carica `reset.css` né `theme-default.css`. Ha un proprio
`protos/servizio/tokens.css` che importa quello condiviso e aggiunge un
secondo livello di alias semantici (`--fs-md`, `--fs-base`, `--fs-sm`, ...)
mappati sugli stessi valori numerici. In teoria stessi numeri, in pratica
usati con un ruolo diverso:

- **Base invertita**: il testo "normale" nella maggior parte dei componenti
  gira su `--fs-md` / `--fs-base` = **14px** (~59 occorrenze in
  `style.css`), mentre 16px (`--fs-lg`/`--fs-xl`) compare solo ~9 volte,
  per enfasi puntuale. È l'opposto della dashboard, dove 16px è il corpo e
  14px è il testo secondario.
- **Bypass degli alias**: in alcuni punti si usano comunque i token grezzi
  (`var(--fs-14)`, `var(--fs-12)`) invece degli alias semantici, mischiando
  i due livelli senza un criterio chiaro.
- **Palette duplicata**: `style.css` ridefinisce da capo tutto il `:root`
  di colori invece di usare solo gli alias — non è un problema di
  tipografia in senso stretto, ma segnala che il file non si fida ancora
  del token condiviso come unica fonte.

## Tabella comparativa (ruolo → valore)

| Ruolo semantico       | Dashboard (canonico) | Servizio (oggi)      |
|------------------------|----------------------|-----------------------|
| Corpo testo di default | 16px (`--fs-16`)     | 14px (`--fs-md`)      |
| Testo secondario/meta  | 14px (`--fs-14`)     | 12px (`--fs-sm`)      |
| Titolo sezione         | 24px (h1)            | 18–20px (`--fs-2xl`/`--fs-3xl`) |
| Font-family             | Inter (via reset ereditato) | Inter (dichiarato esplicitamente su `body`) |
| line-height             | non esplicito su body (eredita da reset) | non esplicito su body |

## Bug trovati e stato

Durante l'estrazione sono emerse tre variabili rotte in
`protos/servizio/style.css`, tutte relative a dimensioni **fuori scala**
(13px e 15px non esistono nella scala condivisa 12/14/16/18...):

- `var(--fs-13)` (11 usi) e `var(--fs-15)` (3 usi) non erano definite da
  nessuna parte. Essendo `font-size` una proprietà ereditata, il browser
  ignorava silenziosamente la regola ed ereditava la dimensione del
  genitore invece di applicare 13px/15px.
  **Fix applicato**: `protos/servizio/tokens.css` ora definisce
  `--fs-13: 0.8125rem` e `--fs-15: 0.9375rem` come valori legacy fuori
  scala, con un commento che scoraggia il loro uso in nuovo codice.
- `--fs-5xl: var(--fs-28)` puntava a un token (`--fs-28`) inesistente nella
  scala condivisa (che salta da 24 a 30), ed era comunque un alias mai
  usato altrove nel file.
  **Fix applicato**: alias morto rimosso.
- `--fw-black: var(--fw-900)` stesso identico problema: `--fw-900` non
  esiste nella scala condivisa (che arriva a `--fw-800`), e l'alias non
  era mai usato altrove nel file.
  **Fix applicato**: alias morto rimosso.

## Proposta: sistema target unificato

Per far convergere i due prototipi sullo stesso sistema, senza dover
riscrivere tutto subito:

1. **Un'unica scala**: usare sempre i token grezzi di `css/tokens.css`
   (`--fs-12` ... `--fs-36`), non ricrearne di alias semantici locali per
   prototipo. Se servono nomi semantici (`--fs-body`, `--fs-caption`),
   definirli una sola volta in `theme-default.css`, condivisi da tutti i
   prototipi — non duplicati per cartella.
2. **Base a 16px ovunque**: allineare `servizio` alla dashboard, impostando
   `body { font-size: var(--fs-16) }` come base e usando 14px solo per
   contenuti secondari, coerentemente con `components.css`.
3. **Caricare la catena completa**: `servizio/index.html` dovrebbe
   includere `reset.css` e `theme-default.css` come fa la dashboard,
   invece di ridefinire localmente palette e regole di base — questo
   elimina anche il rischio di divergenze silenziose come quella già
   corretta nel token condiviso (`--white-alpha-12`).
4. **Migrazione graduale**: non è necessario un rewrite in un colpo solo.
   Si può migrare componente per componente in `servizio/style.css`,
   sostituendo `--fs-md`/`--fs-base`/... con i token diretti man mano che
   si tocca quel codice, finché gli alias locali non restano più usati e
   possono essere rimossi da `protos/servizio/tokens.css`.

Fino a quel momento, i due prototipi restano **visivamente diversi per
scelta pregressa, non per un sistema condiviso** — questo documento serve
a rendere esplicita quella differenza, non a nasconderla.
