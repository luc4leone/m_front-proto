# steps

1. genera i dati (dataset small ~2000, default):
    - node proto-servizio/proto/scripts/build-generated-data.mjs
    - node proto-servizio/proto/scripts/build-generated-data-small.mjs

2. seleziona il file `proto-servizio/proto/index.html`

3. in Windsurf pigia nella bottom status bar il bottone "Go Live"

NB: di default l'app usa `./generated/data.small.js`.
per usare il dataset grande: aggiungi `?big=1` all'URL.
