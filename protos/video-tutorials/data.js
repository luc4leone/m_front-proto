// Elenco video tutorial (id = numero in lista-video.txt).
// title: titolo riscritto sulla base della trascrizione
// originalTitle: titolo di partenza (per confronto)
// summary: una riga che descrive il contenuto
// url: link CleanShot, oppure file: mp4 locale in videos/
// transcript: file in trascrizioni/, righe nel formato "m:ss testo"
export const videos = [
  {
    id: '1',
    title: 'Progetti: crearli, chiuderli, archiviarli e ripristinarli',
    originalTitle: "Che cos'è un progetto",
    summary: 'Un progetto raggruppa spedizioni e comunicati: come crearne uno e gestirne il ciclo di vita.',
    url: 'https://link.mucca.design/ppFJvpkC',
    transcript: 'trascrizioni/1.txt',
  },
  {
    id: '2',
    title: "Dashboard: limiti dell'abbonamento, attività dell'ufficio e progetti",
    originalTitle: 'La dashboard',
    summary: "Le quattro zone della dashboard: limiti, attività degli ultimi giorni, progetti e risorse globali.",
    url: 'https://link.mucca.design/gh4z8bsQ',
    transcript: 'trascrizioni/2.txt',
  },
  {
    id: '3',
    title: 'Cercare partendo dai giornalisti o dalle testate',
    originalTitle: 'Filtro per giornalisti o per testate?',
    summary: 'Ricerca per termine e filtri disponibili nei due tab, con i campi in cui viene cercato il termine.',
    url: 'https://link.mucca.design/m5hyZ6sK',
    transcript: 'trascrizioni/3.txt',
  },
  {
    id: '4',
    title: 'Scegliere le banche dati attive da «Configura»',
    originalTitle: 'Su quale Banca Dati sto lavorando',
    summary: 'Dove vedere e cambiare le banche dati su cui stai lavorando, dalla pagina Banca dati.',
    url: 'https://link.mucca.design/KCfjtVRQ',
    transcript: 'trascrizioni/4.txt',
  },
  {
    id: '6',
    title: 'Creare una mailing list: si salva una selezione, non i risultati dei filtri',
    originalTitle: 'Per creare una mailing list, devo salvare una selezione',
    summary: 'Come funziona la lista dei selezionati e perché «Salva lista» compare solo quando hai selezionato qualcuno.',
    file: 'videos/6.mp4',
    transcript: 'trascrizioni/6.txt',
  },
  {
    id: '8',
    title: 'Creare un comunicato: si salva tutto in automatico',
    originalTitle: "Non c'è bisogno di salvare un nuovo comunicato",
    summary: 'Nuovo comunicato dalla dashboard, editor e allegati, senza bisogno di salvare.',
    file: 'videos/8.mp4',
    transcript: 'trascrizioni/8.txt',
  },
  {
    id: '9',
    title: 'Iniziare una spedizione dalla dashboard o da una mailing list',
    originalTitle: 'Come creo una nuova spedizione?',
    summary: 'I due modi per creare una spedizione e cosa cambia nei destinatari.',
    file: 'videos/9.mp4',
    transcript: 'trascrizioni/9.txt',
  },
  {
    id: '10',
    title: 'Destinatari di una spedizione: mailing list e singoli giornalisti insieme',
    originalTitle: 'Compongo i destinatari di una spedizione',
    summary: 'Il primo step della spedizione: combinare più liste e giornalisti, senza doppioni.',
    file: 'videos/10.mp4',
    transcript: 'trascrizioni/10.txt',
  },
  {
    id: '11',
    title: 'Pulire i destinatari: email mancanti, troppi per redazione, duplicati',
    originalTitle: '"Pulizia" dei destinatari di una spedizione',
    summary: 'Gli step Email, Redazioni e Duplicati: le scorciatoie automatiche e le scelte manuali.',
    file: 'videos/11.mp4',
    transcript: 'trascrizioni/11.txt',
  },
  {
    id: '12',
    title: 'Contenuti della spedizione: media pitch, comunicato e oggetto',
    originalTitle: 'Contenuto di una spedizione: media pitch e comunicato',
    summary: "Come si compone la mail, come cambiare l'oggetto e personalizzare il media pitch per giornalista.",
    file: 'videos/12.mp4',
    transcript: 'trascrizioni/12.txt',
  },
  {
    id: '13',
    title: 'Usare i filtri: menu a tendina e ricerca rapida',
    originalTitle: 'Come uso un filtro?',
    summary: 'Due modi per applicare un filtro, con i suggerimenti di filtri correlati mentre scrivi.',
    url: 'https://link.mucca.design/FR1Gw2vN',
    transcript: 'trascrizioni/13.txt',
  },
  {
    id: '14',
    title: 'Rimuovere i filtri, uno alla volta o tutti insieme',
    originalTitle: 'Come rimuovo un filtro?',
    summary: 'I tre modi per togliere i filtri applicati nella pagina Banca dati.',
    url: 'https://link.mucca.design/LjrTWPvY',
    transcript: 'trascrizioni/14.txt',
  },
  {
    id: '15',
    title: 'Aggiungere un giornalista o una testata da «Configura»',
    originalTitle: 'Come aggiungo una scheda giornalista o testata?',
    summary: 'Dove si trova il comando per aggiungere una nuova scheda alla banca dati.',
    url: 'https://link.mucca.design/LlTQ9ZvG',
    transcript: 'trascrizioni/15.txt',
  },
  {
    id: '16',
    title: 'Schede personali: crearle, riconoscerle e completarle',
    originalTitle: 'Scheda personale',
    summary: 'Le schede che crei tu e vedi solo tu: come si creano e quali campi puoi compilare.',
    url: 'https://link.mucca.design/p8HjxrTb',
    transcript: 'trascrizioni/16.txt',
  },
  {
    id: '17',
    title: 'La scheda giornalista: contatti, redazioni, articoli e note',
    originalTitle: 'Scheda giornalista',
    summary: 'Cosa contiene una scheda giornalista e cosa puoi aggiungere o fare direttamente da lì.',
    url: 'https://link.mucca.design/lm4FvNcH',
    transcript: 'trascrizioni/17.txt',
  },
  {
    id: '18',
    title: 'Giornalisti «e relative testate»: perché i numeri non coincidono',
    originalTitle: 'E relative testate',
    summary: 'Cosa indica il numero di testate accanto a quello dei giornalisti e perché a volte è più alto.',
    url: 'https://link.mucca.design/4ZKdbhnK',
    transcript: 'trascrizioni/18.txt',
  },
];

// Domande frequenti ricavate dalle trascrizioni.
// videoId + time: punto del video in cui si trova la risposta.
export const faqs = [
  {
    question: "Cos'è un progetto?",
    answer: "Un insieme di spedizioni e comunicati. Serve a organizzare meglio il lavoro dell'ufficio stampa.",
    videoId: '1', time: '0:00',
  },
  {
    question: 'Come creo un nuovo progetto?',
    answer: 'Clicca il bottone per un nuovo progetto, dagli un nome e, se vuoi, associalo a un cliente (è opzionale). Con «Crea» il progetto risulta aperto.',
    videoId: '1', time: '0:17',
  },
  {
    question: 'Che differenza c\'è tra chiudere e archiviare un progetto?',
    answer: 'Un progetto chiuso resta tra i progetti chiusi e puoi riaprirlo. Uno archiviato finisce tra gli archiviati, dove puoi ripristinarlo o eliminarlo definitivamente.',
    videoId: '1', time: '0:32',
  },
  {
    question: 'Posso rinominare un progetto?',
    answer: 'Sì, tra le azioni del progetto, insieme a chiudi e archivia.',
    videoId: '1', time: '0:32',
  },
  {
    question: 'Posso recuperare un progetto archiviato?',
    answer: 'Sì: tra i progetti archiviati, nella tendina, puoi ripristinarlo. Torna tra i progetti chiusi e da lì lo riapri.',
    videoId: '1', time: '0:50',
  },
  {
    question: 'Cosa mostra la dashboard?',
    answer: "Tutta l'attività dell'ufficio stampa a colpo d'occhio: limiti dell'abbonamento, attività recente, progetti e risorse globali.",
    videoId: '2', time: '0:00',
  },
  {
    question: 'Come vedo quante esportazioni o spedizioni mi restano?',
    answer: "In cima alla dashboard, nei limiti dell'abbonamento: per ogni voce vedi quante ne hai usate e quante restano. Vale per esportazioni, spedizioni, mailing list, progetti e rassegne.",
    videoId: '2', time: '0:08',
  },
  {
    question: "Posso vedere l'attività di un singolo collega?",
    answer: "Sì: nell'attività dell'ufficio stampa il tab «Tutti» mostra l'insieme, gli altri tab l'attività di ciascun collega.",
    videoId: '2', time: '0:58',
  },
  {
    question: "Su quale periodo è calcolata l'attività dell'ufficio?",
    answer: 'Puoi scegliere tra ultimi 7 giorni, ultime due settimane e ultimo mese.',
    videoId: '2', time: '1:15',
  },
  {
    question: 'Le mailing list appartengono a un progetto?',
    answer: 'No: sono risorse globali, condivise da tutti i progetti. Nella stessa sezione trovi anche i «Da fare».',
    videoId: '2', time: '1:38',
  },
  {
    question: 'Conviene partire dai giornalisti o dalle testate?',
    answer: 'Partendo dai giornalisti hai la ricerca per termine, i filtri giornalista e i filtri testata. Partendo dalle testate hai la ricerca per termine e solo i filtri testata.',
    videoId: '3', time: '0:38',
  },
  {
    question: 'In quali campi viene cercato il termine?',
    answer: 'Per i giornalisti in nome, cognome, email e note della scheda. Per le testate in nome testata e note.',
    videoId: '3', time: '0:19',
  },
  {
    question: 'Perché alcuni risultati non sono evidenziati in giallo?',
    answer: 'Il giallo segna solo le corrispondenze esatte: cercando «Bruno» compare anche «Bruni», ma senza evidenziazione.',
    videoId: '3', time: '0:19',
  },
  {
    question: 'Se cambio tab la ricerca resta?',
    answer: 'No: passando da Giornalisti a Testate, o viceversa, la ricerca precedente viene annullata.',
    videoId: '3', time: '1:39',
  },
  {
    question: 'Come vedo su quali banche dati sto lavorando?',
    answer: 'Nella pagina Banca dati clicca il link «Configura»: vedi le banche dati attive e puoi selezionarle o deselezionarle.',
    videoId: '4', time: '0:00',
  },
  {
    question: "Cos'è la lista dei selezionati?",
    answer: 'Una lista temporanea dei giornalisti che selezioni. Puoi costruirla a più riprese, passando da giornalisti a testate e cambiando filtri: la selezione resta.',
    videoId: '6', time: '0:22',
  },
  {
    question: 'Come creo una mailing list?',
    answer: 'Seleziona i giornalisti, poi salva la selezione con «Salva lista» e dalle un nome. La trovi nella dashboard, tra le mailing list.',
    videoId: '6', time: '1:33',
  },
  {
    question: 'Perché dopo aver salvato una lista la selezione è vuota?',
    answer: 'Quando salvi la selezione in una lista, la selezione viene azzerata.',
    videoId: '6', time: '1:33',
  },
  {
    question: 'Perché non trovo «Salva lista» dopo aver filtrato i giornalisti?',
    answer: "I risultati dei filtri non sono una selezione. Seleziona i giornalisti, uno alla volta o tutti insieme, e poi salva la selezione.",
    videoId: '6', time: '2:03',
  },
  {
    question: 'Posso aggiungere giornalisti a una lista che esiste già?',
    answer: 'Sì: puoi aggiungere la selezione a una lista esistente, oppure a una spedizione.',
    videoId: '6', time: '3:00',
  },
  {
    question: 'Come creo un nuovo comunicato?',
    answer: "Dalla dashboard, con «Nuovo comunicato»: dai un nome, scrivi il testo nell'editor e aggiungi eventuali allegati.",
    videoId: '8', time: '0:00',
  },
  {
    question: 'Devo salvare quello che scrivo?',
    answer: 'No: in tutta la piattaforma le modifiche si salvano in automatico.',
    videoId: '8', time: '0:21',
  },
  {
    question: 'Come inizio una nuova spedizione?',
    answer: 'Dalla dashboard clicca «Spedizione», scegli il progetto e dai un nome: si apre la procedura guidata.',
    videoId: '9', time: '0:00',
  },
  {
    question: 'Una spedizione deve appartenere a un progetto?',
    answer: "Sì: quando il modulo progetti è attivo nell'abbonamento, ogni spedizione è collegata a un progetto.",
    videoId: '9', time: '0:00',
  },
  {
    question: 'Posso creare una spedizione partendo da una mailing list?',
    answer: 'Sì, dalla lista usa la scorciatoia «Aggiungi spedizione»: la lista viene già inserita tra i destinatari.',
    videoId: '9', time: '1:13',
  },
  {
    question: 'Posso inviare una spedizione a più mailing list?',
    answer: 'Sì: nel primo step puoi aggiungere più mailing list e anche singoli giornalisti.',
    videoId: '10', time: '0:29',
  },
  {
    question: 'Se un giornalista è in due liste, riceve due email?',
    answer: 'No: i giornalisti presenti in più liste vengono contati una volta sola tra i destinatari.',
    videoId: '10', time: '0:49',
  },
  {
    question: 'Posso aggiungere ai destinatari un giornalista che non è in nessuna lista?',
    answer: 'Sì, selezionandolo singolarmente nello step Destinatari.',
    videoId: '10', time: '1:19',
  },
  {
    question: 'Cosa faccio con i giornalisti senza email diretta?',
    answer: "Nello step Email puoi usare l'indirizzo di redazione per tutti, scegliere l'indirizzo giornalista per giornalista oppure rimuoverli dai destinatari.",
    videoId: '11', time: '0:26',
  },
  {
    question: 'Perché limitare a due giornalisti per redazione?',
    answer: 'È la pratica migliore per non essere percepiti come spam e ridurre il rischio di inviare contenuti non pertinenti. Lo step è opzionale.',
    videoId: '11', time: '2:18',
  },
  {
    question: 'Con quale criterio vengono ridotti i giornalisti per redazione?',
    answer: "L'algoritmo privilegia il ruolo scrivente, cerca di non ridurre la copertura delle testate e preferisce chi ha un'email diretta. Puoi anche scegliere tu chi tenere.",
    videoId: '11', time: '2:46',
  },
  {
    question: 'Cosa succede se due destinatari hanno la stessa email?',
    answer: "Nello step Duplicati scegli a chi inviare: puoi cambiare l'email o rimuovere i duplicati in un colpo solo.",
    videoId: '11', time: '3:36',
  },
  {
    question: 'Quali controlli fa la spedizione prima dei contenuti?',
    answer: 'Tre step di pulizia dei destinatari: Email, Redazioni e Duplicati.',
    videoId: '11', time: '4:18',
  },
  {
    question: 'Come è composta la mail di una spedizione?',
    answer: 'In alto il media pitch, sotto il comunicato.',
    videoId: '12', time: '0:00',
  },
  {
    question: "Cos'è il media pitch?",
    answer: 'Un testo introduttivo opzionale che precede il comunicato nella mail e serve a contestualizzarlo.',
    videoId: '12', time: '1:06',
  },
  {
    question: 'Posso usare un comunicato che ho già scritto?',
    answer: 'Sì, selezionalo nei contenuti oppure crealo da zero. Se lo modifichi si salva in automatico.',
    videoId: '12', time: '1:31',
  },
  {
    question: "Posso cambiare l'oggetto della mail?",
    answer: 'Sì: di default è il nome della spedizione, ma puoi modificarlo.',
    videoId: '12', time: '2:36',
  },
  {
    question: 'Posso inviare il comunicato dal mio account di posta?',
    answer: "Sì: in alternativa puoi scriverlo nel tuo account di posta e inviarlo all'indirizzo Mediaddress indicato nelle istruzioni.",
    videoId: '12', time: '2:59',
  },
  {
    question: 'Posso personalizzare il media pitch per un singolo giornalista?',
    answer: 'Sì, nello step successivo, che è opzionale: il testo personalizzato sostituisce quello comune solo per quel giornalista.',
    videoId: '12', time: '3:47',
  },
  {
    question: 'Come capisco se un media pitch è personalizzato?',
    answer: "L'icona del giornalista diventa blu.",
    videoId: '12', time: '4:28',
  },
  {
    question: 'Come applico un filtro?',
    answer: 'Apri il menu a tendina del filtro: le voci sono raggruppate per argomento e in ordine alfabetico. Clicca una voce per applicarla.',
    videoId: '13', time: '0:12',
  },
  {
    question: 'Come capisco se un filtro è applicato?',
    answer: 'A tendina chiusa il nome del filtro è in grassetto e un contatore indica quante voci hai selezionato.',
    videoId: '13', time: '0:39',
  },
  {
    question: 'Come trovo un filtro senza scorrere tutta la lista?',
    answer: "Scrivi nella casella sotto l'intestazione del menu: i suggerimenti compaiono subito e con Tab completi la parola.",
    videoId: '13', time: '0:50',
  },
  {
    question: 'Non trovo un filtro con il nome che ho in mente.',
    answer: 'Scrivilo comunque nella casella del menu: suggerisce anche filtri correlati, per esempio «manga» → Fumetti, «eco» → Ecologia salute ambientale.',
    videoId: '13', time: '1:29',
  },
  {
    question: 'Come rimuovo un filtro?',
    answer: 'Con il link «Rimuovi» del filtro applicato, oppure con il cestino accanto alla singola voce.',
    videoId: '14', time: '0:00',
  },
  {
    question: 'Posso rimuovere tutti i filtri insieme?',
    answer: 'Sì, con il comando che li rimuove tutti in un colpo: utile quando ne hai applicati molti.',
    videoId: '14', time: '0:22',
  },
  {
    question: 'Come aggiungo un giornalista o una testata?',
    answer: 'Nella pagina Banca dati clicca «Configura»: da lì puoi aggiungere una scheda giornalista o una scheda testata.',
    videoId: '15', time: '0:00',
  },
  {
    question: "Cos'è una scheda personale?",
    answer: 'Una scheda creata da te: la vedi solo tu e non è condivisa con gli altri utenti.',
    videoId: '16', time: '0:00',
  },
  {
    question: 'Come creo una scheda personale?',
    answer: 'Da «Configura» scegli «Crea giornalista» (o crea una testata), inserisci nome e cognome, poi «Verifica e salva».',
    videoId: '16', time: '0:17',
  },
  {
    question: 'Come riconosco una scheda personale?',
    answer: "Da un'icona dedicata, visibile sia nella scheda sia nelle card dei risultati.",
    videoId: '16', time: '0:17',
  },
  {
    question: 'Cosa posso compilare in una scheda personale?',
    answer: 'Note, servizi, telefono, email, indirizzo, social e redazioni: tutti i campi sono modificabili.',
    videoId: '16', time: '0:37',
  },
  {
    question: 'Posso aggiungere un giornalista a una mailing list o a una spedizione dalla sua scheda?',
    answer: 'Sì, direttamente dalla scheda giornalista nel pannello laterale.',
    videoId: '17', time: '0:00',
  },
  {
    question: 'Come so se i dati di una scheda sono aggiornati?',
    answer: "La scheda indica quando è stata aggiornata l'ultima volta dalla redazione di Mediaddress.",
    videoId: '17', time: '0:23',
  },
  {
    question: 'Posso aggiungere informazioni a una scheda che non ho creato io?',
    answer: 'Sì: una nota personale, un servizio, telefono, email, indirizzo, social e redazioni, in aggiunta ai dati già presenti.',
    videoId: '17', time: '0:23',
  },
  {
    question: 'Dove trovo gli articoli scritti da un giornalista?',
    answer: 'Nella scheda giornalista, dopo le redazioni: ogni articolo ha un link diretto alla pagina originale.',
    videoId: '17', time: '0:39',
  },
  {
    question: 'In quali mailing list e spedizioni è presente un giornalista?',
    answer: 'Lo vedi in fondo alla sua scheda, nelle sezioni Mailing list e Spedizioni.',
    videoId: '17', time: '1:09',
  },
  {
    question: 'La scheda è lunga: posso compattarla?',
    answer: 'Sì, tutte le sezioni della scheda si possono comprimere.',
    videoId: '17', time: '1:09',
  },
  {
    question: 'Cosa significa «e relative testate»?',
    answer: 'Sono le testate per cui scrivono i giornalisti che stai visualizzando, nelle banche dati attive e con i filtri applicati.',
    videoId: '18', time: '0:18',
  },
  {
    question: 'Perché a volte le testate sono più dei giornalisti?',
    answer: 'Un giornalista può scrivere per più testate, quindi con alcuni filtri le testate superano i giornalisti. È normale.',
    videoId: '18', time: '0:18',
  },
];
