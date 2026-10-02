# Centro assistenza

Pagina di aiuto con micro video tutorial e domande frequenti, entrambe
ricercabili. I contenuti si ricavano dalle trascrizioni dei video.

Si apre con il server del progetto, perché le trascrizioni vengono caricate
con `fetch` (aprendo il file direttamente non funziona):

```
npm install   # la prima volta
npm start     # → http://localhost:3000/protos/video-tutorials/
```

Non usare `python3 -m http.server`: non supporta le richieste parziali
(Range), quindi i video in `videos/` si caricano ma non saltano al minuto.

## File

| File | Contenuto |
|---|---|
| `lista-video.txt` | Elenco di lavoro: numero, titolo originale, link. Le righe con `x` sono escluse. Non viene letto dalla pagina. |
| `trascrizioni/N.txt` | Trascrizione del video `N` (stesso numero di `lista-video.txt`). Una riga per segmento: `m:ss testo`. |
| `videos/N.mp4` | Video caricati come file (dal 6 al 12). Gli altri sono su CleanShot. |
| `data.js` | Solo dati: `videos` e `faqs`. |
| `render.js` | Funzioni pure: ricerca, parsing delle trascrizioni, stringhe HTML. Non tocca il DOM. |
| `main.js` | Unico file che scrive nel DOM: carica le trascrizioni, gestisce stato ed eventi. |
| `index.html` | Struttura delle tre colonne e stili locali della pagina. |

La suddivisione segue le regole del README di progetto: dati, render e DOM
in file separati.

## Dati

**Video** (`videos` in `data.js`)

```js
{
  id: '13',                         // numero in lista-video.txt
  title: 'Usare i filtri: …',       // titolo riscritto dalla trascrizione
  originalTitle: 'Come uso un filtro?',
  summary: 'Una riga sul contenuto.',
  url: 'https://link.mucca.design/FR1Gw2vN',  // oppure file: 'videos/6.mp4'
  transcript: 'trascrizioni/13.txt',
}
```

Un video ha `url` (link CleanShot) oppure `file` (mp4 in `videos/`).

- L'`id` resta il numero originale, quindi ci possono essere buchi (1–4, 13…).
  Nella lista si mostra invece la posizione (1, 2, 3…), calcolata in `main.js`.
- Le trascrizioni non sono copiate in `data.js`: si caricano all'avvio,
  così per aggiornarle basta modificare il txt.

**Domande frequenti** (`faqs` in `data.js`)

```js
{ question: '…', answer: '…', videoId: '2', time: '0:08' }
```

`videoId` + `time` indicano il punto del video in cui si trova la risposta.

## Come sono scritti i contenuti

- **Titoli**: descrivono cosa si impara, in forma di compito ("Rimuovere i
  filtri, uno alla volta o tutti insieme") invece di un argomento generico
  ("Come rimuovo un filtro?"). Sono basati su cosa dice davvero il video.
- **Domande**: sono le domande che un utente farebbe (2–6 per video). Ogni
  risposta è breve, usa solo quello che c'è nella trascrizione e indica il
  minuto del segmento in cui il video ne parla.
- **Ortografia**: le trascrizioni automatiche sbagliano alcuni nomi. Il nome
  corretto è **Mediaddress**: va corretta ogni altra grafia, anche nei txt,
  altrimenti la ricerca non li trova.

## Layout

Tre colonne a tutta altezza, ognuna scorre per conto suo:

1. **Micro video tutorials**: la lista dei video con il conteggio.
2. **Centrale**: casella di ricerca e player del video selezionato.
3. **Domande frequenti**: domande a fisarmonica (`<details>`), con il
   riferimento al video sotto ogni risposta.

Sotto i 1100px le domande vanno sotto le prime due colonne; sotto gli 800px
resta una colonna sola, con ricerca e player in cima.

## Ricerca

Una sola casella filtra sia i video sia le domande (conteggi separati).

- **Normalizzazione** (`normalize`): minuscolo e senza accenti, quindi
  "attivita" trova "attività". La lunghezza del testo resta identica, così le
  posizioni trovate servono anche per evidenziare il testo originale.
- **Più parole**: devono esserci tutte (AND).
- **Tolleranza sulle desinenze** (`parseQuery`): alle parole di almeno 5
  lettere si tolgono le vocali finali, così "rimuovo filtri" trova anche
  "rimuovere tutti i filtri".
- **Dove cerca**: per i video nel titolo e nella trascrizione intera; per le
  domande nella domanda e nella risposta.
- **Risultati video**: sotto il titolo compare un estratto della trascrizione.
  Viene preso dal segmento che contiene più parole cercate, con il minuto e le
  parole evidenziate. Senza ricerca compare il `summary`.
- **Risultati domande**: con una ricerca attiva le domande trovate sono già
  aperte.

## Player

I video in `videos/` si caricano direttamente nel `<video>` del browser.

Gli altri sono su CleanShot Cloud (dominio `link.mucca.design`). Il player
incorporato di CleanShot (`…/embed`) non permette di partire da un minuto
preciso, quindi la pagina usa il `<video>` del browser con il file mp4: è lo
stesso link con un `+` in fondo (`…/FR1Gw2vN+`), che reindirizza al file.

- Clic su un video della lista: il video si carica ma non parte.
- Clic sul riferimento sotto una risposta (`0:08 Titolo video`): si apre quel
  video e parte da quel minuto. Se il video è già aperto, salta solo al minuto.

Attenzione: il link con `+` non è documentato da CleanShot. Se smette di
funzionare, il player resta vuoto.

## Aggiungere un video

1. Aggiungere la riga con il link in `lista-video.txt`.
2. Salvare la trascrizione in `trascrizioni/N.txt` (formato `m:ss testo`).
   Se la trascrizione non ha i minuti (un paragrafo per riga), si possono
   ricavare con whisper: trascrivere l'audio del video con `whisper-cli`
   (modello in `~/Apps/Dettato/models/`), allineare l'inizio di ogni
   paragrafo al testo di whisper e anteporre il minuto trovato. Il testo
   della trascrizione resta quello originale. Così sono stati ricavati i
   minuti dei video 6–12.
3. Correggere le grafie sbagliate di Mediaddress.
4. In `data.js` aggiungere il video a `videos`, nell'ordine della lista, con
   titolo riscritto, `summary` e `url` oppure `file`.
5. Aggiungere a `faqs` le domande ricavate dalla trascrizione, ognuna con
   `videoId` e `time`.
