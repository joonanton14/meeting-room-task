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
Testasin käsin PowerShellillä: varauksen luonti, listaus, päällekkäisyyden esto ja poisto id:llä.