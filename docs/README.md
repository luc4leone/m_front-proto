# Design History

Snapshot navigabili dei prototipi, generati da tag git.

---

## Come funziona

Ogni prototipo rilevante viene "congelato" in un tag git con prefisso `proto/`.
Lo script `snapshot.js` legge tutti i tag, crea una copia autocontenuta di ciascuno
e genera un indice HTML navigabile.

```
docs/
  design-history.html        ← indice con tutti i prototipi (generato)
  snapshots/
    newsletter-v1/           ← copia autocontenuta del prototipo (generata)
      index.html
      ui-library.html
      css/
      js/
      components/
```

---

## Workflow

### 1. Tagga il commit che vuoi conservare

```bash
git tag -a proto/nome-v1 -m "Breve descrizione del prototipo"
```

Usa tag annotati (`-a`) così il messaggio diventa il titolo nella design history.

Il nome dopo `proto/` diventa lo slug della cartella snapshot:
`proto/newsletter-v1` → `docs/snapshots/newsletter-v1/`

### 2. Genera gli snapshot

```bash
npm run snapshot
```

Lo script:
- legge tutti i tag `proto/*` ordinati per data
- per ciascun tag crea un checkout isolato (git worktree in /tmp)
- copia i file necessari in `docs/snapshots/{nome}/`
- genera `docs/design-history.html` con le card di tutti i prototipi

### 3. Apri in locale

```bash
npm run history
```

Apri nel browser: [http://localhost:4000/design-history.html](http://localhost:4000/design-history.html)

> **Perché non aprire il file direttamente?**
> Con il protocollo `file://` i path relativi tra pagine non si risolvono:
> `design-history.html` funzionerebbe, ma cliccando su un prototipo il browser
> non riuscirebbe a caricare `css/reset.css` e gli altri asset.
> Il server locale risolve questo problema.

### 4. Pubblica (opzionale)

Committa la cartella `docs/` e pubblicala su GitHub Pages o Netlify.
Gli snapshot sono autocontenuti — nessuna dipendenza esterna.

```bash
git add docs/
git commit -m "snapshot: aggiungi proto/nome-v1"
```

---

## Comandi di riferimento

| Comando | Cosa fa |
|---|---|
| `git tag -a proto/nome -m "..."` | Crea un tag per il prototipo corrente |
| `npm run snapshot` | Genera/aggiorna tutti gli snapshot e l'indice |
| `npm run history` | Serve `docs/` su localhost:4000 |
| `git tag --list "proto/*"` | Lista tutti i tag prototipo |
| `git tag -d proto/nome` | Elimina un tag locale |
