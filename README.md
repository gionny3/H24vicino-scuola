# H24vicino-scuola
H24 è un progetto scolastico che ho fatto per l'esame di maturità. Il sito usa la geolocalizzazione dell'utente per inviargli le macchinette a lui più vicine. Prevede anche la creazione di un utente per diventare collaboratori, la creazione dell'utenza deve essere validata dal superUser, una volta convalidata l'utente può inserire un distributore

# Configurazione
## dipendenze
npm: 10.7.0
node: 20.14.0
MySQL: 8.4.0

## installazione
1. clonare il repository con ```git clone```
2. installare le dipendenze con ```npm install```
3. avere un certificato digitale o usare il software openssl per crearne uno
4. avere un account stripe e usare le proprie key
5. sostituire le variabili ambientali con dei valori ammissibili

## avvio del server
1. configurare il server appropiatamente
2. avviare il server con ```npm start```
