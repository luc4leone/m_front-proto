# In che campi cerca match il testo utente

## Modalità Giornalisti (matchesJournalist)
Per ogni termine (splittato in activeTextTerms), la condizione è che tutti i termini matchino (every), e ciascun termine matcha se è contenuto in almeno uno di questi campi (case-insensitive):

- Nome completo giornalista: fullName = "${j.nome} ${j.cognome}"
- Note del giornalista: noteCombined = combineNotes(normalizeNotes(j.note))

//
Ho esteso l’ordinamento dei giornalisti con:

auto effectiveSortMode = "relevance" quando textActive e non hai fatto override manuale
comparatore relevance nel sort dei giornalisti con scoring simile alle testate:
- peso maggiore su match nel nome
- poi email
- poi note
- bonus se il nome startsWith(q)

Possibile rendere il ranking più “pulito” (es. dare bonus startsWith anche su cognome separatamente, o dare peso diverso a email/note).


## Modalità Testate (matchesTestata)
In testate mode il testo matcha (sempre every sui termini) su:

- Nome testata: t.nome
- Note testata: combineNotes(normalizeNotes(t.note))

