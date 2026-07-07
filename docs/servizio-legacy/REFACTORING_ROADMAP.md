# REFACTORING ROADMAP

## DECISIONI PRESE
1. voglio restare "zero build"
2. data set: riduciamolo a 2000 giornalisti e relative testate
  - lo farei con la procedura "a strati" per mantenere varietà nei dati e fare in modo che i filtri quando applicati filtrino i dati (dataset verosimile)
  - lo farei a valle, sui dati generati (sampling su dataset già esistente)
  - strategia “reversibile” consigliata:
    - aggiungo una pipeline che produce un dataset small (2k) e aggiorno l’app a usare quello di default
    - tengo per un po’ anche la possibilità di usare il dataset grande (opt-in) per confronto
  - una volta stabilizzato il prototipo:
    - tengo solo il dataset small “finale”
    - posso eliminare la procedura di generazione e i dati sorgente *solo se* non mi serve più rigenerare/variare dataset nel tempo
3. per ridurre le regressioni vogliamo districare il codice, creare confini, creare un flusso prevedibile: evento -> apply -> sync -> render. ma vogliamo farlo in modo incrementale, feature per feature. per ogni review di feature esistente, o creazione di new feature, farei:
  - creazione nuovo smoke check (test) relativo al *flusso* (non per ogni singola funzione)
  - estrazione di componenti UI/CSS riusabili (design system incrementale)
    - abbiamo già i tokens css, dobbiamo solo completare eventuali buchi e applicarli in modo sistematico
  - applicazione contratto (apply, sync, render) sulla feature toccata, senza riscrivere il resto
4. OK per Dev panel dentro l’app con pulsanti “Run smoke checks” che fanno assert semplici e stampano esito in console/UI
  - obiettivo: coprire i flussi critici, non “ogni funzione importante”
5. una volta dettagliata per filo e per segno la strategia operativa, partire da spedisci-lista, e solo dopo da filtra

## STATO IMPLEMENTAZIONE (reale, in repo)

### Implemented
#### Fase 0
- [normalizeId(x)](cci:1://file:///Users/luca/Sync/projects/m_proto/proto-servizio/proto/index.html:2654:6-2656:7) introdotta e usata nei punti critici (Set/Map/appState + id DOM) per evitare mismatch `number` vs `string`
- Dev panel minimo attivabile con `?dev=1` con smoke checks base (boot / filtra / spedisci-lista)

#### Fase 1
- dataset small di default: l’app prova `./generated/data.small.js`
- opt-in dataset grande per debug: `?big=1` -> [./generated/data.js](cci:7://file:///Users/luca/Sync/projects/m_proto/proto-servizio/proto/generated/data.js:0:0-0:0)
- fallback automatico: se `data.small.js` non definisce `window.__PROTO_DATA__`, carica [data.js](cci:7://file:///Users/luca/Sync/projects/m_proto/proto-servizio/proto/generated/data.js:0:0-0:0)
- generazione `generated/data.small.js` tramite script [proto-servizio/proto/scripts/build-generated-data-small.mjs](cci:7://file:///Users/luca/Sync/projects/m_proto/proto-servizio/proto/scripts/build-generated-data-small.mjs:0:0-0:0)
- coerenza subset: testate incluse solo se referenziate dagli `outletIds` dei giornalisti selezionati; ripulita `redazione.giornalisti` sul subset
- sanitizzazione mailing list persistite: ids filtrati sul dataset caricato per evitare riferimenti stale

### Not implemented (ancora da fare / parziale)
- [normalizeViewId(x)](cci:1://file:///Users/luca/Sync/projects/m_proto/proto-servizio/proto/index.html:2834:6-2841:7) (citata nelle invarianti) non è stata introdotta
- smoke checks: al momento sono “minimi”; non c’è ancora una suite 5-10 completa come descritta nella roadmap
- Fase 2 split in più file: non iniziata
- bug/UX aperti in TODO (es. loader hard refresh spedisci-lista, regressioni su liste->card, ecc.)

## OBIETTIVI (perché lo facciamo)
- ridurre regressioni quando aggiungiamo feature
- aumentare velocità di sviluppo (tu e io dobbiamo orientarci velocemente)
- ridurre tempo perso in iterazioni UI non necessarie (riuso di componenti/tokens)
- rendere il prototipo abbastanza fluido riducendo dati (senza ottimizzare tutto il codice)


## PRINCIPI / CONTRATTI
### Contratto evento -> apply -> sync -> render
- evento (handler): raccoglie input utente e chiama la pipeline
- applyX(...): aggiorna solo lo stato (e persistenza se serve). non tocca DOM
- syncXUI(...): piccoli aggiornamenti UI derivati dallo stato (toggle classi, textContent, aria-*)
- renderX(...): render “grande” (cards/list/grid), preferibilmente schedulato con scheduleRender()

Nota: non è necessario applicarlo ovunque subito. lo applichiamo solo alla feature su cui stiamo lavorando.

### Invarianti minime (da rendere “single source of truth”)
Obiettivo: ridurre bug silenziosi tipo Set.has che fallisce perché id è number vs string.
- normalizeId(x): tutti gli id usati in Set/Map/appState devono essere stringhe trim-mate
- normalizeViewId(x): id delle view sempre normalizzati e confrontati in modo uniforme
- stato spedizione:
  - selected list ids != active list ids (significati distinti)
  - selected journalist ids (manuali) != journalist ids derivati dalle liste (derivati)
- mailing list:
  - mailingList.journalistIds contiene solo id presenti in journalists (o vengono filtrati)

Quando applicare: la normalizzazione ID va introdotta presto, perché è trasversale e riduce regressioni “invisibili”.


## ORDINE OPERATIVO (incrementale, con criteri di stop)
### Fase 0: baseline (1 sessione)
- definire 5-10 smoke checks core (manuali + Dev panel)
- definire invarianti minime + funzioni di normalizzazione
Stop quando:
- abbiamo una checklist ripetibile e veloce per validare cambiamenti

### Fase 1: riduzione dataset a 2000 (priorità alta)
- aggiungere sampling stratificato a valle al build attuale
- garantire coerenza:
  - testate incluse solo se referenziate dai giornalisti selezionati
  - mailing list aggiornate/filtrate sul subset
- usare dataset small di default (con fallback dataset grande solo per debug)
Stop quando:
- filtri e spedizione funzionano con dataset small senza lag e senza warning critici

### Fase 2: split “zero-build” in più file (solo quando dataset è small)
- senza introdurre bundler
- obiettivo: migliorare navigazione, ownership e comunicazione
Struttura minima suggerita:
- app/index.html
- app/css/{tokens.css,style.css}
- app/js/storage.js
- app/js/state.js
- app/js/domain/{journalists.js,mailingLists.js}
- app/js/ui/{FilterableDropdown.js}
- app/js/views/{spedisci-lista.js,filtra.js}
- app/js/render/{renderCards.js}
- app/js/main.js
Stop quando:
- l’app gira identica ma la codebase è leggibile e “a cartelle”

### Fase 3: refactor per feature (partire da spedisci-lista)
Per ogni intervento su una feature:
1) aggiungere/aggiornare smoke check relativo al flusso
2) applicare contratto (evento -> apply -> sync -> render) nella parte toccata
3) estrarre UI/CSS componenti se vengono riusati
Stop quando:
- regressioni ridotte e onboarding sul codice più rapido


## DEV PANEL / SMOKE CHECKS (proposta minima)
- smoke: boot + load appState + view routing
- smoke: #spedisci-lista
  - selezione lista -> cards visibili
  - toggle chip -> cards disabled/enabled coerente
  - hard refresh -> loader sparisce e cards renderizzate
- smoke: filtri principali in #filtra (minimo 1-2)
- smoke: creazione/spostamento spedizione (se è flusso critico)


## DESIGN SYSTEM / CSS
- type.html come styleguide vivente:
  - typography (già)
  - tokens (colore, spacing, radius, z-index)
  - componenti minimi: button/link, chip, dropdown, input, card, panel
- ogni volta che introduci/modifichi un pattern riusabile, aggiornare type.html

