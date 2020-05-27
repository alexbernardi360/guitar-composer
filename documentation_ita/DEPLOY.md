# Deploy del server
Per mettere online la piataforma è stato utilizzato il servizio di *continous delivery* messo a disposizione gratuitamente da [Heroku](http://heroku.com "Heroku").
Viene collegata alla propria app di Heroku un repository pubblico, l'app online viene automaticamente aggiornata ogni qualvolta venga effettuata una modifica sul *branch* `master` del repository collegato.

## Variabili d'ambiente
Per far funzionare il server bisogna settare delle variabili d'ambiente, usate per nascondere alcune informazioni.
L'utilizzo di variabili d'ambiente permette di non mostrare nel codice sorgente le proprie informazioni private.

| Variabile | Valore | Descrizione |
| ------------ | ------------ | ------------ |
| `DATABASE_URL` | `<URL string>` | Indirizzo per la connessione al proprio DataBase PostgreSQL |
| `APIKEY` | ` <string>` | APIKEY utilizzata per usufruire dei servizi di [TheAudioDB](http://theaudiodb.com "TheAudioDB") |

>NOTA: 
>> - Nel caso si voglia eseguire un deploy su Heroku basterà aggiungere le variabili d'ambiente nelle impostazioni della propria app.
>> - In altri casi è possibile comunque implementare il file `.env` nella directory principale inserendo al suo interno le variabili. Eseguire poi il programma con lo script: `node_modules/.bin/nodenv api.js`, presente nelle dipendenze descritte su [package.json](../package.json "package.json").