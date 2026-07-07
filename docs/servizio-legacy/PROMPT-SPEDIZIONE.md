# Nuove funzionalità view "spedizione"

vorrei creare una "top steps bar" che mostri il progresso nella compilazione dei dati necessari per procedere a spedire la mail. 
- step 1: aggiungi destinatari; 
- step 2: aggiungi comunicato; 
- step 3: aggiungi mittente; 
- step 4: ottimizza oggetto; 
- step 5: ottimizza destinatari; 
- step 6: spedisci. 
i primi 3 step sono obbligatori, il 4 e il 5 opzionali ma raccomandati. 

- è una checklist progressiva + stato del sistema, non c'è una sequenza obbligatoria
- nello screenshot che ti ho allegato vedi uno sketch di questa checklist che ho pensato di posizionare sopra a main-header
- quando hai compilato una sezione, lo step corrispondente in top steps bar cambia stato, mostrando allo user che è stato completato. nello screenshot il cerchio numerato diventa verde e viene aggiunta una v verde
- le sezioni della view corrispondenti agli step vengono "marcate" aggiungendo il cerchio numerato (nel secondo screenshot vedi le sezioni corrispondenti agli step 4 e 5: i cerchi sono colorati di giallo / warning, per il momento mockappiamo senza logica; nel terzo screenshot allegato vedi le sezioni della sidebar-filters-scroll "marcate" con i cerchi corrispondenti agli step da 1 a 4)

sintesi todos:
1. aggiungere "top steps bar"
2. marcare le sezioni della view con un badge corrispondete allo step
3. per ora non aggiungere una logica in cui lo stato della ui cambia se lo user completa uno step

sei in grado di mantenere una coerenza estetica con l'attuale UI nell'aggiungere questi elementi? tutto ciò che ho detto e mostrato con gli sketch non è obbligatorio lato grafica, puoi proporre idee e soluzioni su parte estetica. l unica cosa obbligatoria è mantenere coerenza estetica / stilistica. la logica di cambio stato la affontiamo dopo a meno che tu non mi dice che è meglio affrontarla subito per questioni di ottimizzazione della scrittura del codice