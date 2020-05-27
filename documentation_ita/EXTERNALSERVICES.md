# Servizi esterni
Per non appesantire l'esperienza dell'utente, si è deciso di non far inserire dati *"superflui"*, ma di ottenerli automaticamente tramite la open API: [TheAudioDB](https://theaudiodb.com/ "TheAudioDB").


## Utilizzo
Quando viene richiesta una canzone, vengono inviati tutti i dati presenti nel DB, con l'aggiunta di alcuni dati extra.
> Se disponibili, vengono agiunti i seguenti dati extra: Album, TrackNo, Genre e MusicVid.

Per richiedere i dati viene effettuata la seguente richiesta HTTP con il metodo GET:
```
theaudiodb.com/api/v1/json/{APIKEY}/searchtrack.php?s={Artist_Name}&t={Single_Name}
```
Se la risposta andrà a buon fine, verrà filtrato il risultato per ottenere solo i dati di interesse.


## Vantaggi
Grazie a questo servizio, l'utente non dovrà aggiungere più informazioni di quelle strettamente richieste, ma comunque potrà avere una panoramica più ampia sulla canzone.
Un secondo vantaggio riguarda la piattaforma, che avrà un DB più leggero, in quanto i dati extra non vengono salvati nel DB, ma vengono richiesti ed inviati all'utente solo quando viene richiesta una canzone.