## Pro/contro UX: 2 campi “contestuali” vs 1 campo “globale” (match su tutto)

### Soluzione attuale (2 campi, dipendenti dalla modalità)
**Pro**
- **Chiarezza del modello mentale**: se sei in modalità *giornalisti*, “Giornalista, Note” significa “sto cercando *un giornalista*”; se sei in *testate*, “Testata, Note” significa “sto cercando *una testata*”.
- **Risultati più prevedibili**: il perimetro del match è coerente con ciò che stai guardando (card giornalista vs card testata).
- **Meno ambiguità**: se cerchi `@` o un dominio email, in modalità testate oggi non ti “inquina” l’elenco testate con match indiretti.
- **Ranking più semplice da capire**: la rilevanza, quando c’è, è legata a *quell’oggetto* (giornalista o testata), non a un mix.

**Contro**
- **Discontinuità**: cambi modalità e cambia cosa significa lo stesso gesto (“scrivo e filtro”), e devi re-imparare “dove cerca”.
- **Costo di esplorazione**: l’utente che “non sa” se l’informazione è in note giornalista o note testata deve provare in due contesti.
- **Senso di “ricerca limitata”**: alcuni utenti si aspettano un search box unico tipo “omnibox”.

---

### Ipotesi: 1 solo campo globale (match su nome+email+note giornalista + nome+note testata) + sort per rilevanza
**Pro**
- **Semplicità d’ingresso**: un solo punto dove scrivere, sempre uguale.
- **Migliore per ricerche “non so dove sia”**: se cerchi una parola chiave che potrebbe essere in note testata o note giornalista, la trovi senza cambiare contesto.
- **Percezione “motore di ricerca”**: aumenta la sensazione di potenza (“cerca ovunque”).

**Contro (grossi, lato UX)**
- **Ambiguità sui risultati**: se stai guardando *giornalisti* ma il match forte è su *testata.note*, cosa deve succedere?
  - Mostri giornalisti “perché appartengono a testate che matchano”? (come oggi in modalità testate→giornalisti)
  - Oppure cambi automaticamente tab?
  - In tutti i casi, l’utente può percepire che “sta filtrando giornalisti ma il filtro non riguarda i giornalisti”.
- **Rilevanza più difficile da “fidarsi”**: ranking su campi eterogenei porta casi tipo:
  - un giornalista sale in alto perché la sua testata ha un match in note, anche se il giornalista non contiene quel testo.
  - l’utente vede una card senza highlight “ovvio” e pensa che sia un bug.
- **Debug mentale più costoso**: quando un risultato appare/non appare, capirne il motivo richiede sapere *quale campo tra 5* ha matchato.
- **Highlight più complesso**: dovresti evidenziare (o spiegare) *dove* è avvenuto il match, altrimenti sembra arbitrario.
- **Rumore**: soprattutto con termini comuni (es. “stampa”, “registro”, “direttore”), rischi di avere molte corrispondenze “laterali” che degradano la qualità percepita.

---

## In sintesi
- **Due campi contestuali**: più prevedibile, meno “magico”, migliore quando l’utente sta lavorando per selezione/filtri.
- **Un campo globale**: più potente e immediato, ma aumenta ambiguità e casi “perché vedo questo risultato?”.
