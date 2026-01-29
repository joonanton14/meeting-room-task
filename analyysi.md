# ANALYYSI

## Yleiskuva
Toteutin yksinkertaisen kokoushuoneiden varaus-API:n (Node.js + Express + TypeScript) tehtävänannon vaatimuksilla:
- Varauksen luonti (POST)
- Varausten listaus huoneelle (GET)
- Varauksen peruutus id:llä (DELETE)
Business rules:
- Ei päällekkäisiä varauksia samassa huoneessa
- Ei varausta menneisyyteen
- start < end

Toteutus on kerrosmallinen: routes → services → repositories → domain.

## Miten hyödynsin tekoälyä
Käytin tekoälyä:
- projektirungon ja kansiorakenteen luomiseen
- endpointtien ja business-sääntöjen toteutusidean hahmotteluun
- myöhempiin refaktorointeihin ja pieniin laatuparannuksiin
- ajettavan smoke testin tekemiseen, jotta toiminnallisuudet voi todentaa helposti.
- Vitest testien tekemiseen.

Promptit on dokumentoitu tiedostossa `PROMPTIT.md`.

## Mitä tekoäly teki hyvin
- Antoi nopeasti toimivan perusrungon: Express-app, reitit ja selkeä kerrosjako.
- Auttoi toteuttamaan business rules -logiikan service-kerrokseen.
- Ehdotti yhtenäisen virhemallin (ApiError + error middleware), mikä parantaa API:n käytettävyyttä ja debuggausta.
- Tarjosi konkreettiset PowerShell-testikomennot, joilla pystyin todentamaan nopeasti endpointit.

## Mitä piti tarkentaa
- Osa ehdotuksista oli aluksi “yleisiä”, ja jouduin tarkentamaan toteutuksen yksityiskohtia itse (esim. virheilmoitusten sisältö, inputin tyhjien arvojen käsittely).
- PowerShellin `Invoke-RestMethod` heittää poikkeuksen 4xx/5xx vastauksista, jolloin “odotettu” 409 Conflict näkyy terminaalissa virheenä. Ratkaisu oli ymmärtää, että API toimii oikein ja tarvittaessa käyttää `Invoke-WebRequest` tai try/catch.
- Pelkät kopioitavat pitkät testipätkät olivat kömpelöitä → parempi ratkaisu oli tehdä ajettava smoke-skripti.
- Halusin testata APIa ilman että tarvitsee käynnistää serveriprosessia joten pyysin Vitest + Supertest testit.

## Mitä paransin itse ja miksi
Alla tärkeimmät parannukset, joita tein rungon jälkeen.

### 1) Input-validointi ja siistiminen
- Lisäsin tarkistukset tyhjille arvoille (`roomId`, `start`, `end`) ja yhtenäistin virheilmoituksia.
- Siistin `title`-kentän: trim ja tyhjä → jätetään pois.
**Hyöty:** API käyttäytyy ennustettavammin ja virheviestit ovat johdonmukaisia.

### 2) Päällekkäisyyslogiikan selkeys
- Päällekkäisyyssäännöksi valitsin mallin `[start, end)`, eli jos yksi varaus päättyy tasan kun toinen alkaa, se ei ole päällekkäinen.
**Hyöty:** selkeä ja yleinen tulkinta ajanjaksojen päällekkäisyydestä.

### 3) Repository-kerroksen suojaus
- Lisäsin guardin, joka estää vahingossa varauksen ylikirjoituksen samalla id:llä.
**Hyöty:** mahdolliset id-kollisiot tai bugit nousevat esiin heti.

### 4) Toistettava testaus: smoke ja Vitest
- Tein `scripts/smoke.ps1` + `npm run smoke`, joka testaa create/list/overlap(409)/delete/second delete(404).
- Lisäsin Vitest + Supertest -testit, joilla samat asiat voidaan todentaa ilman että käynnistän `npm run dev`.
**Hyöty:** toiminnallisuudet voi todentaa toistettavasti yhdellä komennolla.

## Tehdyt oletukset
Koska tehtävänanto ei määritellyt kaikkea, tein seuraavat oletukset:
- Huoneet tunnistetaan `roomId`:llä eikä erillistä huonerekisteriä ole.
- Käyttäjähallintaa/autentikointia ei ole määritelty, joten API on anonyymi.
- Aikaleimat annetaan ISO-8601 muodossa (esimerkeissä UTC `Z`).
- Tallennus on in-memory, joten data katoaa palvelimen restartissa.

## Yhteenveto
Tekoäly nopeutti merkittävästi rungon ja perustoiminnallisuuksien toteutusta, mutta lopputuloksen laatu syntyi siitä, että kävin läpi reunatapaukset, paransin validointia, selkeytin virheitä ja tein toistettavan testauspolun. Näin projekti on sekä toimiva että arvioitavissa helposti.