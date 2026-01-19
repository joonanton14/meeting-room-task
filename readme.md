# Meeting Room Booking API

Yksinkertainen backend-API kokoushuoneiden varaamiseen. Toteutettu TypeScriptillä (Node.js + Express) ja käyttää in-memory tallennusta. Ei sisällä käyttöliittymää – vain REST API.

Tech stack: Node.js, TypeScript, Express, in-memory storage (ei tietokantaa).

Asennus ja käynnistys:
npm install
npm run dev

API käynnistyy osoitteeseen: http://localhost:3000

1) Luo varaus (POST /reservations):

$body = @{
  roomId = "A"
  start  = "2030-01-01T10:00:00.000Z"
  end    = "2030-01-01T11:00:00.000Z"
  title  = "Testi"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:3000/reservations `
  -ContentType "application/json" `
  -Body $body

2) Listaa huoneen varaukset (GET /rooms/:roomId/reservations):

Invoke-RestMethod -Uri http://localhost:3000/rooms/A/reservations

3) Testaa päällekkäisyys (tämän pitäisi epäonnistua, 409 Conflict):

$body2 = @{
  roomId = "A"
  start  = "2030-01-01T10:30:00.000Z"
  end    = "2030-01-01T11:30:00.000Z"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:3000/reservations `
  -ContentType "application/json" `
  -Body $body2

4) Poista varaus id:llä (DELETE /reservations/:id):

$rows = Invoke-RestMethod -Uri http://localhost:3000/rooms/A/reservations
$rows
$id = $rows[0].id
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/reservations/$id"

5) Varmista että varaus on poistettu:

Invoke-RestMethod -Uri http://localhost:3000/rooms/A/reservations

Business rules:
- Varaus ei saa alkaa menneisyydessä
- Aloitusajan täytyy olla ennen lopetusaikaa
- Varaukset eivät saa mennä päällekkäin samassa huoneessa
- Päällekkäisyydestä palautetaan 409 Conflict

Huomio: Tallennus on in-memory, joten kaikki varaukset katoavat kun palvelin käynnistetään uudelleen.
