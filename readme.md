# Meeting Room Booking API

Yksinkertainen backend-API kokoushuoneiden varaamiseen. Toteutettu TypeScriptillä (Node.js + Express) ja käyttää in-memory tallennusta. Ei sisällä käyttöliittymää – vain REST API.

Tech stack: Node.js, TypeScript, Express, in-memory storage (ei tietokantaa).

Asennus ja käynnistys:
npm install
npm run dev

API käynnistyy osoitteeseen: http://localhost:3000

Sen jälkeen voidaan testata kokoushuoneen varaustoiminnot.

npm run smoke

Ajaa testin missä käydään läpi varauksen luonti, päällekkäisyys, poisto sekä poiston varmistus.

Business rules:
- Varaus ei saa alkaa menneisyydessä
- Aloitusajan täytyy olla ennen lopetusaikaa
- Varaukset eivät saa mennä päällekkäin samassa huoneessa
- Päällekkäisyydestä palautetaan 409 Conflict

Huomio: Tallennus on in-memory, joten kaikki varaukset katoavat kun palvelin käynnistetään uudelleen.
