libs:
  - 'https://cdn.jsdelivr.net/npm/idb@3.0.2/build/idb.min.js'

---

# IndexedDB

IndexedDB is een database ingebouwd in een browser, met veel meer mogelijkheden dan `localStorage`

- Stores almost any kind of values by keys, multiple key types.
- Supports transactions for reliability.
- Supports key range queries, indexes.
- Kan een groter volumes data opslaan dan `localStorage`.

Deze mogelijkheden zijn normaal gesproken excessief voor traditionele client-server apps. IndexedDB is bedoeld voor offline apps, om gecombineerd te worden met met ServiceWorkers en andere technologiën.

De standaard interface van IndexedDB, omschreven in de specificatie <https://www.w3.org/TR/IndexedDB>, is gebaseerd op events.

We kunnen ook `async/await` gebruiken door deze events om te zetten naar promises, zoals bij <https://github.com/jakearchibald/idb>. Dat is best gemakkelijk, maar is niet perfect, het kan niet de events in alle gevallen vervangen. Daarom beginnen we met events, en dan, nadat we IndexedDB begrijpen gebruiken we een library met promises. 

## Verbinding maken met de database

Om te werken met IndexedDB, moeten we eerst verbinding maken met een database met `open`.

De syntax:

```js
let openRequest = indexedDB.open(name, version);
```

- `name` -- een string, de database naam.
- `version` -- een positieve integer als versienummer, standaard `1` (onderstaand toegelicht).

We kunnen meerdere databases met verschillende namen hebben, maar ze bestaan allemaal in de huidige origine (domein/protocol/port); Verschillende websites hebben geen toegang tot elkanders databases.

De functie geeft een `openRequest` object, we kunnen naar de events in dit object luisteren:
- `success`: de database is gereed, er is een "database object" in `openRequest.result`, die we kunnen gebruiken voor verdere functie invocaties.
- `error`: openen van de database is gefaald.
- `upgradeneeded`: de database is gereed, maar de versie is verouderd ( zie onderstaand )

**IndexedDB heeft een ingebouwd mechanisme van "schema versies", in tegenstelling tot een server-side databases**

In tegenstelling met server-side databases, is IndexedDB client-side, de data wordt opgeslagen in de browser, dus wij, programmeurs, hebben niet altijd toegang tot de database. Dus, wanneer we een nieuwe versie van een app publiceren, en de gebruikers bezoeken onze website, moeten we mogelijk de database updaten.

Als de lokale database versie lager is dan die aangegeven in `open`, dan wordt een speciaal event, `upgradeended` geactiveerd, en kunnen we versies vergelijken en data-structuren updaten waar nodig.

Het `upgradeneeded` event wordt ook geactiveerd als er nog geen database bestaat ( technisch gesproken is de versie `0`), opdat we het een en ander kunnen initialiseren.

Laten we zeggen dat we de eerste versie van onze app publiceren.

Nu kunnen we de de database met versie `1` openen en initialisatie uitvoeren in `upgradeended`:

```js
let openRequest = indexedDB.open("store", *!*1*/!*);

openRequest.onupgradeneeded = function() {
  // activeert als de client geen database had
  // ...voer de initialisatie uit...
};

openRequest.onerror = function() {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function() {
  let db = openRequest.result;
  // werk verder met de database gebruik makend van het db object
};
```

Later publiceren we de tweede versie.

We kunnen de `open` methode gebruiken met versie `2` en de upgrade als volgt uitvoeren:

```js
let openRequest = indexedDB.open("store", *!*2*/!*);

openRequest.onupgradeneeded = function(event) {
  // de huidige database verzie is 2 of lager ( of bestaat niet )
  let db = openRequest.result;
  switch(event.oldVersion) { // huidige database versie
    case 0:
      // versie 0 betekent dat de client geen database heeft
      // voer database initialisatie uit
    case 1:
      // de client had versie 1
      // update
  }
};
```

Let op: De huidige versie is `2`, de `onupgradeneeded` heeft code voor de upgrade vanaf versie `0`, voor gebruikers die de eerste keer de website bezoeken en nog geen database hebben, maar ook voor versie `1`.

En dan, alleen als `onupgradeneeded` zonder foutmeldingen voltooid is, wordt `openRequest.onsuccess`  geactiveerd en is de database succesvol geopend.

Om een database te verwijderen:

```js
let deleteRequest = indexedDB.deleteDatabase(name)
// deleteRequest.onsuccess/onerror geeft het resultaat weer
```

```warn header="We kunnen geen oude versie van de database openen"
Als de huidige database een hogere versie heeft in de `open` method, e.g. de bestaande databaseversie is `3`, en we proberen `open(...2)`, dan resulteerd dat in een foutmelding; `openRequest.onerror` activeert.

Dat is vreemd, maar zulke dingen kunnen gebeuren wanneer een bezoeker oude javascript code laadt, bijvoorbeeld uit een proxy cache. Dan is de code oud, maar de database nieuw.

Om zulke foutmeldingen te voorkomen, zullen we `db.version` moeten controleren en voorstellen de pagina te herladen. Gebruik de gepaste HTTP caching headers om te voorkomen dat oude code geladen wordt, updat je nooit een dergelijk probleem hebt.
```

### Gelijktijdig update probleem

Nu we het toch hebben over versies, laten we een klein gerelateerd probleem behandelen.

Stel je voor:
1. Een bezoeker opent onze site in een browser tab met database versie `1`.
2. Vervolgens voeren we een update uit, dus onze code is nieuwer.
3. En dan opent de bezoeker onze site in een andere tab.

Dus nu is er een tab open met een verbing met databaseversie `1`, terwijl de tweede tab een update probeert uit te voeren in haar `upgradeended` handler.

Het probleem is dat een database gedeeld wordt tussen twee tabs, aangezien de database afkomstig is van dezelfde site / origin. En deze database kan niet tegelijkertijd versie `1` en `2` zijn. Om eenupdate uit te voeren naar versie twee moeten alle verbindingen met de database gesloten zijn, inclusief die in de eerste tab.

Om dit te af te handelen, activeert een `versionchange` event in het "verlopen" database-object. We zouden op dit event moeten reageren en de databaseverbinding sluiten ( en waarschijnlijk de bezoeker voorstellen de pagina te herladen, om de nieuwe code in te laden ).

Als we niet luisteren naar een `versionchange` event en de verbinding verbreken, dan wordt de tweede, nieuwe verbinding, niet gemaakt. Het `openRequest` object activeert een `blocked` event in plaats van `success`. Dus de tweede tab werkt dan niet.

Hier is code om een geljktijdige upgrade uit te voeren.

Onderstaande code installeert de `onversionchange` afhandeling nadat de database geopend is, welke de oude verbinding verbreekt.

```js
let openRequest = indexedDB.open("store", 2);

openRequest.onupgradeneeded = ...;
openRequest.onerror = ...;

openRequest.onsuccess = function() {
  let db = openRequest.result;

  *!*
  db.onversionchange = function() {
    db.close();
    alert("Database is outdated, please reload the page.")
  };
  */!*

  // ...de database is gereed, gebruik het...
};

*!*
openRequest.onblocked = function() {
  // dit event zal niet activeren als we onversionchange correct afhandelen

  // Dit betekent dat er een andere verbinding met de database is
  // en niet was gesloten nadat db.onversionchange voor hen activeerde
};
*/!*
```

Hier doen we twee dingen:

1. Voeg een implementatie van het `db.onversionchange` event toe na het successvol openen, om op de hoogte te zijn van een gelijktijdige updatepoging.
2. Voeg een implementatie van het `openRequest.onblocked` event toe om het scenario waar de oude verbinding niet verbroken was af te handelen. Dit event activeert niet als we de verbinding verbreken in `db.onversionchange`.

Er zijn andere varianten. We kunnen bijvoorbeeld de tijd nemen om dingen netjes af te handelen in het `db.onversionchange` event en de bezoeker te vragen data op te slaan voordat de verbinding wordt verbroken. De nieuwe verbinding met de update zal direct geblokkeerd worden nadat `db.onversionchange` is voltooid zonder af te sluiten en we kunnen de bezoeker vragen de andere tabs te sluiten voor de update. 

Dergelijke update conflicten gebeuren zelden, maar we zouden ze op zijn minst af kunnen handelen, bijvoorbeeld in het `onblocked` event, opdat onze code de bezoeker niet verrast door de database stilletjes te laten falen.

## Object opslag

Om iets op te slaan in indexedDB, hebben we een *object store* (object opslag) nodig.

Een object store is een kernconcept in IndexedDB. Het is hetzelfde principe als een tabel of collectie in andere databases. Hier wordt data opgeslagen. Een database kan meerdere stores hebben: één voor gebruikers, één voor goederen, etc.

Ondanks de benaming "object store", kunnen andere primitieve waarden ook opgeslagen worden.

**We kunnen bijna elke waarde opslaan, inclusief complexe objecten**

IndexedDB gebruikt het [standard serialization algorithm](https://www.w3.org/TR/html53/infrastructure.html#section-structuredserializeforstorage) om een object te dupliceren en op te slaan. Het lijkt op `JSON.stringify`, maar met meer mogelijkheden, in staat om veel meer datatypes op te slaan.

Een voorbeeld van objecten die niet opgeslagen kunnen worden: Een object met circulaire verwijzigingen. Dergelijke objecten zijn niet te serialiseren. `JSON.stringify` kan dergelijke objecten ook niet opslaan.

**Er moet een unieke `key` zijn voor elke waarde in de opslag**  

Een key moet een van de volgende types hebben: nummer, datum, string binary of array, Het is een unieke indentificatie: met de key kunnen we specifieke waardes zoeken/verwijderen/updaten.

![](indexeddb-structure.svg)


Zoals we snel zullen zien, we kunnen een key toevoegen als we een waarde aan de opslag toevoegen, net zoals `localStorage`. Maar wanneer we objecten opslaan is indexedDB in staat een property als key op te slaan, dat is veel gemakkelijker. Of we kunnen automatisch keys genereren. 

Maar we moeten eerst een object opslag maken.


De syntax om object opslag te maken:
```js
db.createObjectStore(name[, keyOptions]);
```

Let op: Deze operatie is synchroon, dus `await` is niet nodig.

- `name` is de naam van de opslag, bijvoorbeeld `"books"` voor boeken,
- `keyOptions` is een optioneel object met één van twee properties:
  - `keyPath` -- een pad naar een object property, welke IndexedDB zal gebruiken als key, bijvoorbeeld `id`.
  - `autoIncrement` -- indien `true`, zal de key voor een niew opgeslagen object automatisch worden gegenereerd, als een oneindig toenemend nummer.

Als we geen `keyOptions` voorzien, dan moeten we de key later expliciet definiëren, wanneer we een object opslaan.

Bijvoorbeeld, deze object opslag gebruikt een `id` property als key:
```js
db.createObjectStore('books', {keyPath: 'id'});
```

**Een object opslag kan alleen gemaakt/aangepast worden terwijl de databaseversie wordt geupdate, tijdens het `upgradeneeded` event**

Dat is een technische limitatie. Buiten het `upgradeneeded` event om zijn we in staat om data toe te voegen/verwijderen/updaten, maar de object opslag zelf kan alleen gemaakt/verwijderd/aangepast worden tijdens een versie-update. 

Om een database versie upgrade uit te voeren zijn er hoofdzakelijk twee benaderingen:
1. We kunnen upgrade functies per versie implementeren: van 1 naar 2, van 2 naar 3, va 3 naar 4, etc.. Tijdens het `upgradeneeded` event kunnen we versies vergelijken ( e.g. oud 2, nu 4 ) en upgrades per versie in stappen uitvoeren, voor elke tussenliggende versie ( 2 naar 3 en dan 3 naar 4 ).
2. Of we kunnen de database inspecteren: verkrijg een lijst van van bestaande object opslag als `db.objectStoreNames`. Dat object is een [DOMStringList](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#domstringlist) met een `contains(name)` methode om te bevestigen of een opslag bestaat. En dan kunnen we updates uitvoeren, afhankelijk van wat bestaat en wat niet bestaat. 

Voor kleine databases kan de tweede variant simpeler zijn.

Hier is een demo van de tweede benadering:

```js
let openRequest = indexedDB.open("db", 2);

// creëer/update de database zonder versie checks
openRequest.onupgradeneeded = function() {
  let db = openRequest.result;
  if (!db.objectStoreNames.contains('books')) { // if er geen "books" in de opslag zijn
    db.createObjectStore('books', {keyPath: 'id'}); // voeg 'books' toe
  }
};
```


Om een object opslag te verwijderen:

```js
db.deleteObjectStore('books')
```

## Transacties

De term "transactie" is algemeen, gebruikt in veel soorten databases.

Een transactie is een groep operaties, die allemaal successvol zijn of falen.

Bijvoorbeeld, als een persoon iets koopt moeten we:
1. Geld op hun account in mindering brengen
2. Het product toevoegen aan hun voorraad

Het zal vrij slecht zijn als we de eerste operatie voltooien, en er daarna iets fout gaat. Beide horen te slagen ( aankoop compleet, goed! ) of beide falen ( de persoon houdt op het minst zijn geld, dus kan het nogmaals proberen ).

Transacties geven deze garantie.

**Alle data operaties moeten in een transactie gemaakt worden in IndexedDB**

Om een transactie te starten:

```js run
db.transaction(store[, type]);
```

- `store` is de naam van een opslagruimte, waar de transactie toegang tot zal krijgen, e.g. "books". Dit argument kan ook een array van diverse opslagruimtes zijn om toegang te krijgen tot meerdere opslagruimtes.
- `type` – een transactie type, mogelijke waardes zijn:
  - `readonly` -- kan alleen data uitlezen, de standaard.
  - `readwrite` -- kan alleen de data uitlezen en naar de opslagruimte schrijven, maar opslagruimte kan niet worden gecreëerd/verwijderd/aangepast.

Er is ook een `versionchange` transactie type: deze transacties kunnen alles, maar we kunnen ze niet handmatig aanmaken. IndexedDB maakt automatisch een `versionchange` transactie aan wanneer de database wordt geopend, voor het `updateneeded` event. Dat is waarom er maar één plaats is waar we de structuur van de databse kunnen veranderen en opslagruimte voor objects kan worden gecreëerd/verwijderd.

```smart header="Waarom zijn er verschillende type transacties?"
Prestatie is de reden waarom transacties `readonly` of `readwrite` genaamd moet worden.

Vele `readonly` transacties zijn in staat tegelijkertijd toegang te verkrijgen tot dezelfde opslagruimte, maar `readwrite` transacties kunnen dit niet. Een `readwrite` transactie "bevriest" de opslagruimte voor nieuwe opslag. De volgende transactie moet wachten tot de voorgaande transactie voltooid is, voordat deze toegang krijgt tot dezelfde opslagruimte.
```

Nadat een transactie is gecreëerd, kunnen we items in de opslagruimte opslaan, als volgt:

```js
let transaction = db.transaction("books", "readwrite"); // (1)

// open een opslagruimte om er operaties op uit te voeren
*!*
let books = transaction.objectStore("books"); // (2)
*/!*

let book = {
  id: 'js',
  price: 10,
  created: new Date()
};

*!*
let request = books.add(book); // (3)
*/!*

request.onsuccess = function() { // (4)
  console.log("book aan de opslagruimte toegevoegd", request.result);
};

request.onerror = function() {
  console.log("Error", request.error);
};
```

Er zijn vier stappen:

1. Creëer een transactie, benoem alle opslagruimtes, die zullen worden gebruikt, zie `(1)`.
2. Verkrijg een opslagruimte met `transaction.objectStore(name)`, zie `(2)`.
3. Voer de operaties op de opslagruimte `books.add(book)`, zie `(3)`.
4. ...Verwerk de success/error events `(4)`, vervolgens kunnen we andere verzoeken maken indien nodig, etc.

Opslagruimtes ondersteunen twee methodes om een waarde op te slaan.

- **put(value, [key])**
    Voeg de `value` aan de opslagruimte toe. De `key` moet alleen worden voorzien als de opslagruimte zonder `keyPath` of `autoIncrement` voorheen gedefiniëerd was. Als er al een waarde bestaat met dezelfde key, dan wordt deze vervangen.

- **add(value, [key])**
    Hetzelfde als `put`, maar als er al een waarde met dezelfde key is, dan faalt het verzoek, en wordt een foutmelding met de naam `"ConstraintError"` gegenereerd.

Net zoals bij het openen van databases, kunnen we een verzoek versturen: `books.add(book)`, en vervolgens wachten op `success/error` events.

- De `request.result` voor `add` is de key voor het nieuwe object.
- De foutmelding is te vinden in de response van `request.error` ( als die er zijn )

## Transactie's autocommit

In the example above we started the transaction and made `add` request. But as we stated previously, a transaction may have multiple associated requests, that must either all success or all fail. How do we mark the transaction as finished, no more requests to come?
In het bovenstaande voorbeeld zijn we een transactie begonnen en maakte een `add` verzoek. Maar zoals we eerder zeiden, een trnsactie kan meerdere geassocieerde verzoeken bevatten, die allemaal successvol zijn of allemaal falen. Hoe markeren we een transactie als voltooid na het laatste verzoek.

Het korte antwoord is: dat doen we niet.

In de volgende versie 3.0 van de specificatie, zal er waarschijnlijk een handmatige manier zijn om transacties te voltooien, maar nu in versie 2.0 is dat niet het geval.

**Als alle transacties zijn beëindigd, en de [microtasks queue](info:microtask-queue) leeg is, worden deze automatisch voltooid.**

Normaal gesproken, nemen we aan dat een transactie voltooit, zodra alle requests compleet zijn en de huidige code eindigt.

Dus, in het bovenstaande voorbeeld is er geen speciale code nodig om de transactie te voltooien.

Het auto-commit principe van transacties heeft een belangrijk neveneffect. We kunnen geen asynchrome operaties, zoals `fetch` en `setTimeout` uitvoeren in het midden van een transactie. IndexedDB zal de transactie niet open laten totdat deze zijn voltooid.

In the code below `request2` in line `(*)` fails, because the transaction is already committed, can't make any request in it:
In de onderstaande code `request2` op de met `(*)` gemarkeerde regel genereert een foutmelding, omdat de transactie al voltooid is.

```js
let request1 = books.add(book);

request1.onsuccess = function() {
  fetch('/').then(response => {
*!*
    let request2 = books.add(anotherBook); // (*)
*/!*
    request2.onerror = function() {
      console.log(request2.error.name); // TransactionInactiveError
    };
  });
};
```

De oorzaak is `fetch`, wat een asynchrome operatie is, een macro-operatie. Transacties zijn voltooid, voordat de browser macro-operaties uitvoert. 

De auteurs van IndexedDB specificatie geloven dat transacties kort horen te zijn. Hoofdzakelijk voor prestatie redenen.

Noemenswardig is dat `readwrite` transacties de opslagruimtes blokkeert voor updates. Dus als één deel van een applicate een `readwrite` transactie begint op een `books` opslagruimte, dan moet een ander deel dat hetzelfde wil doen wachten; De nieuwe transactie 'lags' totdat de eerste transactie voltooid is. Als transacties een lange tijd duren, kan dit leiden tot rare vertragingen ( en moeilijk op te lossen bugs ).

Dus, wat doen we dan?

In the example above we could make a new `db.transaction` right before the new request `(*)`.
In het bovenstaande voorbeeld zouden we een nieuwe `db.transaction` kunnen maken net voor de nieuwe request `(*)`.

Maar ,als we alle operaties tezamen willen houden, is het beter om de IndexedDB transacties te scheiden van de "andere" asynchrome operaties.

Voer eerst de `fetch` uit, en creëer vervolgens een transactie en maak alle database verzoeken. Dan werkt het.

Om het moment van het successvol voltooien te detecteren, kunnen we luisteren naar het `transaction.oncomplete` event.

```js
let transaction = db.transaction("books", "readwrite");

// ...voer operaties uit...

transaction.oncomplete = function() {
  console.log("Transactie is voltooid");
};
```

Alleen `complete` garandeert dat een transactie geheel wordt opgeslagen. Individuele veroeken kunnen slagen, maar de laatste update operatie kan foutgaan ( e.g. I/O foutmelding of iets dergelijks )

Om handmatig een transactie te beëindigen, gebruik `abort()`:

```js
transaction.abort();
```

Dat annuleert alle modificaties gemaakt door de requests in de transactie en activeert het `transaction.abort` event.


## Error afhandeling

Scrijf verzoeken kunnen falen.

Dat is te verwachten, niet alleen door mogelijke fouten in onze code, maar ook voor redenen, die niet aan de transactie zelf gerelateerd zijn. Bijvoorbeeld, het opslagmaximum kan overschreden zijn. Dus we moeten deze situaties afhandelen.

**Een falend verzoek beëindigt de transactie, en maakt al de veranderingen ongedaan.**

In sommige situatieskan het gewenst zijn een falend verzoek te behandelen zonder gemaakte veranderingen door te voeren en verder te gaan met de transactie. Dat is mogelijk. In het `request.onerror` event is in staat de transactie niet te beëindigen door `event.preventDefault` te gebruiken.  

In the example below a new book is added with the same key (`id`) as the existing one. The `store.add` method generates a `"ConstraintError"` in that case. We handle it without canceling the transaction:
In het onderstaande voorbeeld wordt een nieuw boek toegevoegd een identieke key (`id`) als een al bestaande. In dat geval genereert de `store.add` methode een `"ConstrantError"`. We verwerken deze zonder de transactie te beëindigen.

```js
let transaction = db.transaction("books", "readwrite");

let book = { id: 'js', price: 10 };

let request = transaction.objectStore("books").add(book);

request.onerror = function(event) {
  // ConstraintError komt voor als er al een object met een identiek id bestaat
  if (request.error.name == "ConstraintError") {
    console.log("Boek met dit id bestaat al"); // verwerk de foutmelding
    event.preventDefault(); // stop de transactie
    // gebruik een ander id voor het boek
  } else {
    // onverwachte foutmelding, die we niet afhandelen
    // de transactie beëindigt
  }
};

transaction.onabort = function() {
  console.log("Error", transaction.error);
};
```

### Event delegatie

Hebben we een onerror/onsuccess event nodig voor elk verzoek? Niet altijd. We kunnen gebruik maken van event delegatie.

**IndexedDB events 'bubble': `request` -> `transaction` -> `database`**

Alle events zijn DOM events, met 'capturing' and 'bubbling', maar gebruikelijk wordt alleen de 'bubbling' stage gebruikt.

Dus we kunnen alle foutmeldingen afhandelen met behulp van het `db.onerror` event, om een melding te maken of andere doeleinden.

```js
db.onerror = function(event) {
  let request = event.target; // het verzoek dat een foutmelding veroorzaakte

  console.log("Error", request.error);
};
```

...Maar wat als een foutmelding volledig verwerkt wordt? In dat geval willen we geen melding maken.

We can stop the bubbling and hence `db.onerror` by using `event.stopPropagation()` in `request.onerror`.
We kunnen 'bubbling' en dus `de.onerror` stoppen met `event.stopPropagation()` in `request.onerror`.

```js
request.onerror = function(event) {
  if (request.error.name == "ConstraintError") {
    console.log("Boek met dit id bestaat al"); // behandel de fout
    event.preventDefault(); // stop de transactie niet
    event.stopPropagation(); // 'bubble' de transactie niet verder
  } else {
    // doe niks
    // transactie wordt beëindigd
    // we kunnen de foutmelding afhandelen 
  }
};
```

## Zoeken op keys

Er zijn twee zoektypes in een opslagruimte:
1. Op basis van een key of key range. Dat wil zeggen: Bij `book.id` in onze "books" opslagruimte.
2. Op basis van een ander veld in een object, e.g. `book.price`

Laten we eerst de keys en key ranges behandelen `(1)`.

Methodes, welke betrekking hebben op zoek functionaliteit gebruiken exaxte keys of zogenaamde "range queries" -- [IDBKeyRange](https://www.w3.org/TR/IndexedDB/#keyrange) objecten die een "key range" specificeren.

Ranges worden gemaakt met de volgende code:

- `IDBKeyRange.lowerBound(lower, [open])` betekent: `≥lower` (of `>lower` als `open` true is)
- `IDBKeyRange.upperBound(upper, [open])` betekent: `≤upper` (of `<upper` als `open` true is)
- `IDBKeyRange.bound(lower, upper, [lowerOpen], [upperOpen])` betekent: tussen `lower` en `upper`. Als de open flag true is, dan is de corresponderende key niet inbegrepen in de range.
- `IDBKeyRange.only(key)` -- een range dat bestaat uit één `key`, wordt nauwelijks gebruikt.

Alle zoekmethodes accepteren een `query` argument, welke een exacte key of een key range kan zijn:

- `store.get(query)` -- zoek naar de eerst waarde op basis van key of range.
- `store.getAll([query], [count])` -- zoek naar alle waardes, gelimiteerd door `count` als gegeven.
- `store.getKey(query)` -- zoek naar de eerste key in de query, meestal een range.
- `store.getAllKeys([query], [count])` -- zoek naar alle keys in een query, meestal een range, met een maximum aantal van `count` als gegeven.
- `store.count([query])` -- krijg het aantal sleutels in een quesry, meestal een range

Bijvoorbeeld, we hebben veel boeken in onze opslagruimte. Denk eraan dat het `id` veld de key is, dus al deze methodes kunnen zoeken op `id`. 

Zoek voorbeelden:

```js
// verkrijg een boek
books.get('js')

// verkrijg boeken waar 'css' <= id <= 'html'
books.getAll(IDBKeyRange.bound('css', 'html'))

// verkrijg boeken met een id < 'html'
books.getAll(IDBKeyRange.upperBound('html', true))

// verkrijg alle boeken
books.getAll()

// verkrijg alle keys id > 'js'
books.getAllKeys(IDBKeyRange.lowerBound('js', true))
```

```smart header="De opslagruimte is altijd gesorteerd"
Object store sorts values by key internally.
Een opslagruimte sorteerd waardes intern op basis van de keys.

Dus verzoeken welke in meerdere waarder resulteren, geeft deze resultaten altijd gesorteerd op basis van de key.
```


## Op basis van willekeurig veld zoeken met een index

Om andere velden in een object te zoeken, hebben we een extra datasctructuur nodig genaamd "index".

An index is an "add-on" to the store that tracks a given object field. For each value of that field, it stores a list of keys for objects that have that value. There will be a more detailed picture below.
Een index is een "add-on" voor de opslagruimte, die een gegeven veld van een object traceert. Voor elke waarde van dat veld slaat het een lijst van keys voor objecten, die deze waarde hebben. Er is onderstaand een gedetailleerder plaatje.

De syntax:

```js
objectStore.createIndex(name, keyPath, [options]);
```

- **`name`** -- index naam,
- **`keyPath`** -- pad naar een object veld welke je wilt dat de index traceert ( we gaan zoeken op basis van dat veld ),
- **`option`** -- een optioneel object met de properties:
  - **`unique`** -- als true, dan mag er maar één object in de opslagruimte met de gegeven waarde zijn in de `keyPath`. De index zal een foutmelding garanderen wanneer we de waarde proberen te dupliceren.
  - **`multiEntry`** -- alleen in gebruik als de waarde van `keyPath` een array is. In dat geval behandelt de index de gehele array als key. Maar wanneer `multiEntry` true is, dan houdt de index een lijst van opslagruimte objecten voor elke waarde in die array. Dus de waardes in de array worden index keys. 

In ons voorbeeld slaan we boeken op met `id` als key.

Laten we zeggen dat we op `price` willen zoeken.

First, we need to create an index. It must be done in `upgradeneeded`, just like an object store:
Eerst moeten we een index aanmaken. Dit moet gedaan worden in `upgradeended`, net zoals de object opslagruimte.

```js
openRequest.onupgradeneeded = function() {
  // we moeten hier een index maken, in de versionchange transactie
  let books = db.createObjectStore('books', {keyPath: 'id'});
*!*
  let index = inventory.createIndex('price_idx', 'price');
*/!*
};
```

- De index zal het `price` veld traceren.
- De `price` is niet uniek, er kunnen meerde boeken met dezelfde prijs zijn, daarom maken we geen gebruik van de `unique` optie.
- De `price` is geen array, dus `multiEntry` is niet van toepassing.

Imagine that our `inventory` has 4 books. Here's the picture that shows exactly what the `index` is:
Stel je voor dat onze `inventory` 4 boeken heeft. Hier is een afbeelding, welke exact laat zien wat de `index` is.

![](indexeddb-index.svg)

Zoals gezegd, de index voor elke waarde van `price` (tweede argument) houdt een lijst van keys bij, die deze `price` hebben.

De index houdt zichzelf automatisch up-to-date, hier hoeven we ons geen zorgen over te maken.

Nu, wanneer we een bepaalde prijs willen vinden, gebruiken we simpelweg dezelfde methodes als bij de index.

```js
let transaction = db.transaction("books"); // readonly
let books = transaction.objectStore("books");
let priceIndex = books.index("price_idx");

*!*
let request = priceIndex.getAll(10);
*/!*

request.onsuccess = function() {
  if (request.result !== undefined) {
    console.log("Books", request.result); // array of books with price=10
  } else {
    console.log("No such books");
  }
};
```

We can also use `IDBKeyRange` to create ranges and looks for cheap/expensive books:
We kunnen ook gebruik maken van `IDBKeyRange` om een reange te maken en voor dure/goedkope boeken zoeken.

```js
// verkrijg boeken waar price <= 5
let request = priceIndex.getAll(IDBKeyRange.upperBound(5));
```

Indexes are internally sorted by the tracked object field, `price` in our case. So when we do the search, the results are also sorted by `price`.
Indexes worden intern gesorteerd op het bijgehouden object veld, in ons geval `price`. Dus wanneer we zoeken, worden de resultaten op `price` gesorteerd.

## Deleting from store

The `delete` method looks up values to delete by a query, the call format is similar to `getAll`:

- **`delete(query)`** -- delete matching values by query.

For instance:
```js
// delete the book with id='js'
books.delete('js');
```

If we'd like to delete books based on a price or another object field, then we should first find the key in the index, and then call `delete`:

```js
// find the key where price = 5
let request = priceIndex.getKey(5);

request.onsuccess = function() {
  let id = request.result;
  let deleteRequest = books.delete(id);
};
```

To delete everything:
```js
books.clear(); // clear the storage.
```

## Cursors

Methods like `getAll/getAllKeys` return an array of keys/values.

But an object storage can be huge, bigger than the available memory. Then `getAll` will fail to get all records as an array.

What to do?

Cursors provide the means to work around that.

**A *cursor* is a special object that traverses the object storage, given a query, and returns one key/value at a time, thus saving memory.**

As an object store is sorted internally by key, a cursor walks the store in key order (ascending by default).

The syntax:
```js
// like getAll, but with a cursor:
let request = store.openCursor(query, [direction]);

// to get keys, not values (like getAllKeys): store.openKeyCursor
```

- **`query`** is a key or a key range, same as for `getAll`.
- **`direction`** is an optional argument, which order to use:
  - `"next"` -- the default, the cursor walks up from the record with the lowest key.
  - `"prev"` -- the reverse order: down from the record with the biggest key.
  - `"nextunique"`, `"prevunique"` -- same as above, but skip records with the same key (only for cursors over indexes, e.g. for multiple books with price=5 only the first one will be returned).

**The main difference of the cursor is that `request.onsuccess` triggers multiple times: once for each result.**

Here's an example of how to use a cursor:

```js
let transaction = db.transaction("books");
let books = transaction.objectStore("books");

let request = books.openCursor();

// called for each book found by the cursor
request.onsuccess = function() {
  let cursor = request.result;
  if (cursor) {
    let key = cursor.key; // book key (id field)
    let value = cursor.value; // book object
    console.log(key, value);
    cursor.continue();
  } else {
    console.log("No more books");
  }
};
```

The main cursor methods are:

- `advance(count)` -- advance the cursor `count` times, skipping values.
- `continue([key])` -- advance the cursor to the next value in range matching (or immediately after `key` if given).

Whether there are more values matching the cursor or not -- `onsuccess` gets called, and then in `result` we can get the cursor pointing to the next record, or `undefined`.

In the example above the cursor was made for the object store.

But we also can make a cursor over an index. As we remember, indexes allow to search by an object field. Cursors over indexes to precisely the same as over object stores -- they save memory by returning one value at a time.

For cursors over indexes, `cursor.key` is the index key (e.g. price), and we should use `cursor.primaryKey` property for the object key:

```js
let request = priceIdx.openCursor(IDBKeyRange.upperBound(5));

// called for each record
request.onsuccess = function() {
  let cursor = request.result;
  if (cursor) {
    let key = cursor.primaryKey; // next object store key (id field)
    let value = cursor.value; // next object store object (book object)
    let key = cursor.key; // next index key (price)
    console.log(key, value);
    cursor.continue();
  } else {
    console.log("No more books");
  }
};
```

## Promise wrapper

Adding `onsuccess/onerror` to every request is quite a cumbersome task. Sometimes we can make our life easier by using event delegation, e.g. set handlers on the whole transactions, but `async/await` is much more convenient.

Let's use a thin promise wrapper <https://github.com/jakearchibald/idb> further in this chapter. It creates a global `idb` object with [promisified](info:promisify) IndexedDB methods.

Then, instead of `onsuccess/onerror` we can write like this:

```js
let db = await idb.openDb('store', 1, db => {
  if (db.oldVersion == 0) {
    // perform the initialization
    db.createObjectStore('books', {keyPath: 'id'});
  }
});

let transaction = db.transaction('books', 'readwrite');
let books = transaction.objectStore('books');

try {
  await books.add(...);
  await books.add(...);

  await transaction.complete;

  console.log('jsbook saved');
} catch(err) {
  console.log('error', err.message);
}

```

So we have all the sweet "plain async code" and "try..catch" stuff.

### Error handling

If we don't catch an error, then it falls through, till the closest outer `try..catch`.

An uncaught error becomes an "unhandled promise rejection" event on `window` object.

We can handle such errors like this:

```js
window.addEventListener('unhandledrejection', event => {
  let request = event.target; // IndexedDB native request object
  let error = event.reason; //  Unhandled error object, same as request.error
  ...report about the error...
});
```

### "Inactive transaction" pitfall


As we already know, a transaction auto-commits as soon as the browser is done with the current code and microtasks. So if we put a *macrotask* like `fetch` in the middle of a transaction, then the transaction won't wait for it to finish. It just auto-commits. So the next request in it would fail.


For a promise wrapper and `async/await` the situation is the same.

Here's an example of `fetch` in the middle of the transaction:

```js
let transaction = db.transaction("inventory", "readwrite");
let inventory = transaction.objectStore("inventory");

await inventory.add({ id: 'js', price: 10, created: new Date() });

await fetch(...); // (*)

await inventory.add({ id: 'js', price: 10, created: new Date() }); // Error
```

The next `inventory.add` after `fetch` `(*)` fails with an "inactive transaction" error, because the transaction is already committed and closed at that time.

The workaround is same as when working with native IndexedDB: either make a new transaction or just split things apart.
1. Prepare the data and fetch all that's needed first.
2. Then save in the database.

### Getting native objects

Internally, the wrapper performs a native IndexedDB request, adding `onerror/onsuccess` to it, and returns a promise that rejects/resolves with the result.

That works fine most of the time. The examples are at the lib page <https://github.com/jakearchibald/idb>.

In few rare cases, when we need the original `request` object, we can access it as `promise.request` property of the promise:

```js
let promise = books.add(book); // get a promise (don't await for its result)

let request = promise.request; // native request object
let transaction = request.transaction; // native transaction object

// ...do some native IndexedDB voodoo...

let result = await promise; // if still needed
```

## Summary

IndexedDB can be thought of as a "localStorage on steroids". It's a simple key-value database, powerful enough for offline apps, yet simple to use.

The best manual is the specification, [the current one](https://w3c.github.io/IndexedDB) is 2.0, but few methods from [3.0](https://w3c.github.io/IndexedDB/) (it's not much different) are partially supported.

The basic usage can be described with a few phrases:

1. Get a promise wrapper like [idb](https://github.com/jakearchibald/idb).
2. Open a database: `idb.openDb(name, version, onupgradeneeded)`
    - Create object storages and indexes in `onupgradeneeded` handler or perform version update if needed.
3. For requests:
    - Create transaction `db.transaction('books')` (readwrite if needed).
    - Get the object store `transaction.objectStore('books')`.
4. Then, to search by a key, call methods on the object store directly.
    - To search by an object field, create an index.
5. If the data does not fit in memory, use a cursor.

Here's a small demo app:

[codetabs src="books" current="index.html"]
