# Guida all'utilizzo


## Installazione
Per l'installazione è richiesto [NodeJS](https://nodejs.org/ "NodeJS"), scaricabile dal sito ufficiale, o dai reposotiry della propria distribuzione Linux.
Accedere alla directory principale del progetto ed eseguire:
```bash
npm install
```
> Verrà così creato l'albero delle dipendenze dei moduli necessari per l'esecuzione.


## Avvio servizio
Prima di tutto consultare la pagina dedicata al [Deploy](./DEPLOY.md "Deploy"), per aggiungere correttamente le variabili d'ambiente necessarie per l'esecuzione e il buon funzionamento del server web.

Per avviare il programma correttamente è consigliato inserire le variabili d'ambiente nel file *.env* ed utilizzare lo script:
```bash
node_modules/.bin/nodenv api.js
```
> Così facendo il programma potrà caricare le variabili contenute nel file *.env*, per una piu semplice gestione e manutenzione.

Si possono anche caricare le variabili d'ambiente da bash ed eseguire semplicemente:
```bash
node api.js
```

## Utilizzo client

### Gestione account
Tramite il client web è possibile registrarsi e cancellare il proprio account, tramite i collegamenti presenti nella barra di navigazione.

### Gestione canzoni
Avendo un account registrato è possibile aggiungere, modificare ed eliminare canzoni.
- Per aggiungere una nuova canzone, asare il collegamento nella barra di navigazione, compilare la form con i dati, ed inserire le credenziali d'accesso.
- Per modificare una canzone, cercare ed aprire la canzone, premere sul pulsante modifica, modificare le form ed inserire le credenziali di accesso.
- Per eliminare una canzone cercare ed aprire la canzone, premere sul pulsante elimina ed inserire le credenziali di accesso.

### Ricerca canzone
Le ricerce sono possibili tramide le 2 form di ricerca presenti nella home page.
Le due form permettono una ricerca per titolo o per autore.
