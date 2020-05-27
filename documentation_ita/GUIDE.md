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