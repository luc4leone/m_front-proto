Perché in lista appaiono certi risultati (strong match vs synonyms match)

Il dropdown decide cosa mostrare in due canali separati:

- [Matched list] = risultati “veri” del filtro (quelli che appaiono come risultati principali)
- [Suggestions] = suggerimenti “extra” (spesso correlati), mostrati sotto

Tutto parte da filterOptions(query) + renderList().

1) Strong match (match “forte”)
In filterOptions(query) per ogni opzione option:

js
const tokens = optionLower.split(/\s+/).filter(Boolean);
const strongMatch = tokens.some((t) => t.startsWith(q));

Quindi:

- matcha se almeno un token dell’opzione inizia con ciò che hai digitato.

Esempio concreto (query agri):

- "Agricoltura" → token agricoltura startsWith agri ✅
- "Agricoltura biologica" → token agricoltura startsWith agri ✅
- "Politica agraria" → token agraria startsWith agri ❌ (perché agra... non agri...)

Quando è strong match:

- l’opzione entra in includeSet
- entra in strongSet
- prende rank = 0

2) Synonyms match (match via sinonimi)
Sempre in filterOptions(query), ma solo se q.length >= 3:

scorre this.autocompleteTerms (che contiene i sinonimi “flattened” e lowercased) e se un sinonimo contiene una parola che inizia con q:

js
const words = term.split(/\s+/)
if (words.some((w) => w.startsWith(q))) {
  const mapped = this.keywordToFiltersMap[term] || [];
  for (const filter of mapped) includeSet.add(filter)
  rank.set(filter, 1) // se non c'era già
}

Questo è il punto chiave: il sinonimo non viene mostrato come opzione. Serve solo per includere la voce ufficiale (filter).

Esempio concreto:

- filtro: "Agricoltura biologica"
- sinonimo in subjects.json: "Agricoltura organica"

Se scrivi agri:

- term = "agricoltura organica" ha una parola che startsWith agri ✅
- keywordToFiltersMap["agricoltura organica"] = ["Agricoltura biologica"]
- quindi entra "Agricoltura biologica" in includeSet, con rank = 1 (se non era già rank 0)

3) Perché alcuni risultati finiscono in “suggestions” invece che nei match

In renderList():

- matched = filteredOptions, ordinati per matchRank (0 prima di 1) + comparator
- suggestions = costruite così:
  - se esiste un mapping keywordToFiltersMap[q] (query identica a un sinonimo “intero”), aggiunge quei filtri come suggestions se non sono già matched
  - aggiunge relatedMap[opt] per opt “strong match o selected” (nel tuo caso relatedMap spesso non è usato)

Quindi:

- Strong match e synonyms match entrano entrambe in matched (con rank diverso).
- Suggestions sono “extra” che non sono entrate in filteredOptions.

4) Come decide l’autocomplete hint (ghost text)
Qui è separato dalla lista: viene da getAutocompleteSuggestion(query).

Priorità:

- autocompleteMap[q] se esiste (regole hardcoded)
- altrimenti, se q.length >= 3, sceglie tra i term in autocompleteTerms quelli che:

- term.startsWith(q)
- e sono più lunghi di q

Tra questi candidati vince:

- term più corto
- a parità, ordine alfabetico

Quindi agri → "agricoltura organica" se è il completamento più corto tra quelli disponibili che iniziano con agri.

//
1) Perché trattare ogni value come sinonimo di sé stesso è positivo?
Per come è scritto il tuo FilterableDropdown, i sinonimi servono a popolare autocompleteTerms e keywordToFiltersMap (cioè: “se l’utente digita questo termine, suggerisci/includi quel filtro”).

Se tu aggiungi (anche solo logicamente) il “self-synonym”:

- filter = "Agricoltura"
- synonyms include "Agricoltura"

ottieni 2 vantaggi pratici:

- [Autocomplete hint sempre possibile]
getAutocompleteSuggestion() cerca candidati in autocompleteTerms. Se molti record non hanno sinonimi, quei record non possono mai diventare “best suggestion” per il ghost text. Con il self-synonym, qualsiasi voce può contribuire all’hint (quando la query è prefisso).
- [Coerenza tra hint e contenuto reale]
I sinonimi veri spesso sono “laterali” (es. “coltivazione” → “Agricoltura”). Se non includi anche il value, l’hint può venire da un sinonimo e non dalla label ufficiale, e a volte ti suggerisce completamenti meno “puliti” (perché dipende dai sinonimi disponibili). Avere anche il value rende il comportamento più stabile.

Nota: non cambia il matching “strong” (che già funziona sui token delle opzioni), ma migliora soprattutto ghost text e suggestions.

2) Cosa intendo per “aggiungere 1-2 varianti generate” e perché è utile?
Non intendo “sinonimi semantici” (tipo “terme” ↔ “spa”), ma varianti ortografiche/tecniche che gli utenti digitano spesso e che altrimenti non matcherebbero bene.

Esempi di varianti generate utili:

- [Slash e punteggiatura]
"Serie/film/TV" → varianti:
 - "serie film tv"
 - "serie film" (o "serie tv")

- [Parentesi e qualificatori]
"Periodici al Pubblico (Riviste)" → varianti:
 - "periodici al pubblico"
 - "riviste"

- [Accenti e normalizzazione]
"Tè/Caffè" → varianti:
 - "te caffe"
 - "caffe"

- [Simboli / apostrofi]
"Mercato d'arte" → varianti:
 - "mercato darte"
 - "mercato d arte"

Perché è utile:

- [recupero errori di digitazione “prevedibili”] senza inventare significati
- [aumenta recall] dell’autocomplete/hint con input “sporchi”
- [riduce dipendenza da dizionari semantici]: migliora UX anche se subjects.json ha pochi sinonimi