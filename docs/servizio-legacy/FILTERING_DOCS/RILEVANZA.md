Perché “LA STAMPA” viene prima di “SPECCHIO (LA STAMPA)”
È voluto in base all’algoritmo di “rilevanza” che abbiamo appena introdotto.

Nello sort per effectiveSortMode === "relevance" lo score fa (per ogni termine q):

+3 se match in nome e in note
+2 se match solo in nome
+1 se match solo in note
+1 extra se match in nome e nome.startsWith(q)
Quindi, con query "la stampa" (considerata come un solo termine, non spezzata):

"LA STAMPA"
name.includes("la stampa") = true
name.startsWith("la stampa") = true -> bonus +1
se anche le note contengono "la stampa": +3 +1 = 4
se le note non lo contengono: +2 +1 = 3
"SPECCHIO (LA STAMPA)"
name.includes("la stampa") = true
name.startsWith("la stampa") = false (perché inizia con "specchio")
se note contengono "la stampa": +3 = 3
se no: +2 = 2
Quindi LA STAMPA può battere SPECCHIO (LA STAMPA) anche se quest’ultima matcha nome+note, semplicemente perché LA STAMPA prende il bonus startsWith.