# PROMPTIT

## Prompt 1 (TypeScript-runko + endpointit)
**Mitä pyysin:**
Tarvitsen TypeScriptillä (Node + Express) toimivan rungon kokoushuoneiden varaus-API:lle.
Palvelun tulee tarjota käyttäjille seuraavat toiminnot:
- Varauksen luonti: Varaa huone tietylle aikavälille.
- Varauksen peruutus: Poista varaus.
- Varausten katselu: Listaa kaikki tietyn huoneen varaukset.

Lisäksi haluan nämä säännöt:
- start < end
- varaus ei saa alkaa menneisyydessä
- samaan huoneeseen ei saa tulla päällekkäisiä varauksia
- kaikki saa olla in-memory eli tietokantaa ei tarvitse käyttää.

Tee projektiin kansiorakenneja toteuta endpointit.

**Mitä sain:**
- Perusrunko Expressille
- In-memory repository
- Service-kerros jossa validoinnit menneisyys, start < end ja päällekkäisyys
- Router jossa POST/GET/DELETE

**Miten hyödynsin sitä:**
Rakensin sen pohjalta nykyisen projektin rungon ja sain endpointit toimimaan.

## Prompt 2 (PowerShell testauskomennot)
**Mitä pyysin:**
Haluan ohjeet miten testaan API:a.

**Mitä sain:**
- PowerShell-esimerkit varauksen luontiin, listaukseen, päällekkäisyyden testaamiseen ja poistoon.
- Vinkit miksi `Invoke-RestMethod` heittää virheen 4xx/5xx vastauksista ja miten bodyn näkee silti.

**Miten hyödynsin sitä:**
Sain testattua kaikki endpointit käsin PowerShellillä.
Opin myös miksi 409/400 näkyy PowerShellissä “virheenä” vaikka se on odotettu vastaus.

## Prompt 3 (Refaktoroinnit ja parannukset)
**Mitä pyysin:**
Haluan listan parannuksista olemassa olevaan ohjelmaan.

**Mitä sain:**
- input-validointi
- selkeämmät virheilmoitukset
- estetään id-ylikirjoitus
- parempi id-generointi
- Konkreettiset koodimuutokset tiedostoihin (`validation.ts`, `reservationRepo.ts`, `reservationService.ts`, `app.ts`)

**Miten hyödynsin sitä:**
Tein muutokset yksi kerrallaan ja tein commitin jokaisen vaiheen jälkeen.

## Prompt 4 (Smoke test)
**Mitä pyysin:**
Haluan valmiin skriptin, jolla voin testata API:n perustoiminnallisuudet helposti ilman että kopioin pitkiä PowerShell-pätkiä README:stä. Lisäksi haluan npm-skriptin, jotta testin voi ajaa yhdellä komennolla.

**Mitä sain:**
- `scripts/smoke.ps1`, joka testaa:
  - varauksen luonti (POST)
  - listaus (GET)
  - päällekkäisyyden esto (POST -> odotettu 409)
  - poisto (DELETE)
  - toistuva poisto (DELETE -> odotettu 404)
- Ohje lisätä `npm run smoke` package.jsoniin.

**Miten hyödynsin sitä:**
Lisäsin smoke-testin projektiin ja voin ajaa sen yhdellä komennolla (`npm run smoke`) serverin ollessa käynnissä. Tämä nopeuttaa toiminnallisuuksien tarkistamista ja tekee testauksesta toistettavaa.

## Prompt 5 (Vitest + Supertest testit AAA-mallilla)
**Mitä pyysin:**
Haluan tehdä automaattiset testit TypeScript-projektiin käyttäen Vitestiä ja Supertestiä.
Testien pitää olla ajettavissa erillään toisistaan.

Haluan testata samat asiat mitkä käydään läpi smoke testeissä.

**Mitä sain:**
- Ohjeet asentaa riippuvuudet: vitest + supertest (+ @types/supertest)
- package.jsoniin testiskriptit: `npm test` ja `npm run test:run`
- Valmis API-integraatiotestitiedosto `test/reservations.api.test.ts`
- Ohje lisätä repositoryyn `clearAll()`-metodi (`store.clear()`), jotta in-memory data voidaan nollata `beforeEach`-hookissa ja testit pysyvät riippumattomina.

**Miten hyödynsin sitä:**
Lisäsin repositoryyn `clearAll()`-metodin ja käytin sitä testien `beforeEach`-kohdassa, jotta jokainen testi alkaa tyhjästä tilasta.
Lisäsin Vitest/Supertest -testit, jotka varmistavat API:n keskeiset toiminnallisuudet ja virhetilanteet (400/409/404) ilman manuaalista PowerShell-testailua.