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

## Transactions' autocommit

In the example above we started the transaction and made `add` request. But as we stated previously, a transaction may have multiple associated requests, that must either all success or all fail. How do we mark the transaction as finished, no more requests to come?

The short answer is: we don't.

In the next version 3.0 of the specification, there will probably be a manual way to finish the transaction, but right now in 2.0 there isn't.

**When all transaction requests are finished, and the [microtasks queue](info:microtask-queue) is empty, it is committed automatically.**

Usually, we can assume that a transaction commits when all its requests are complete, and the current code finishes.

So, in the example above no special call is needed to finish the transaction.

Transactions auto-commit principle has an important side effect. We can't insert an async operation like `fetch`, `setTimeout` in the middle of transaction. IndexedDB will not keep the transaction waiting till these are done.

In the code below `request2` in line `(*)` fails, because the transaction is already committed, can't make any request in it:

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

That's because `fetch` is an asynchronous operation, a macrotask. Transactions are closed before the browser starts doing macrotasks.

Authors of IndexedDB spec believe that transactions should be short-lived. Mostly for performance reasons.

Notably, `readwrite` transactions "lock" the stores for writing. So if one part of application initiated `readwrite` on `books` object store, then another part that wants to do the same has to wait: the new transaction "hangs" till the first one is done. That can lead to strange delays if transactions take a long time.

So, what to do?

In the example above we could make a new `db.transaction` right before the new request `(*)`.

But it will be even better, if we'd like to keep the operations together, in one transaction, to split apart IndexedDB transactions and "other" async stuff.

First, make `fetch`, prepare the data if needed, afterwards create a transaction and perform all the database requests, it'll work then.

To detect the moment of successful completion, we can listen to `transaction.oncomplete` event:

```js
let transaction = db.transaction("books", "readwrite");

// ...perform operations...

transaction.oncomplete = function() {
  console.log("Transaction is complete");
};
```

Only `complete` guarantees that the transaction is saved as a whole. Individual requests may succeed, but the final write operation may go wrong (e.g. I/O error or something).

To manually abort the transaction, call:

```js
transaction.abort();
```

That cancels all modification made by the requests in it and triggers `transaction.onabort` event.


## Error handling

Write requests may fail.

That's to be expected, not only because of possible errors at our side, but also for reasons not related to the transaction itself. For instance, the storage quota may be exceeded. So we must be ready to handle such case.

**A failed request automatically aborts the transaction, canceling all its changes.**

In some situations, we may want to handle the failure (e.g. try another request), without canceling existing changes, and continue the transaction. That's possible. The `request.onerror` handler is able to prevent the transaction abort by calling `event.preventDefault()`.

In the example below a new book is added with the same key (`id`) as the existing one. The `store.add` method generates a `"ConstraintError"` in that case. We handle it without canceling the transaction:

```js
let transaction = db.transaction("books", "readwrite");

let book = { id: 'js', price: 10 };

let request = transaction.objectStore("books").add(book);

request.onerror = function(event) {
  // ConstraintError occurs when an object with the same id already exists
  if (request.error.name == "ConstraintError") {
    console.log("Book with such id already exists"); // handle the error
    event.preventDefault(); // don't abort the transaction
    // use another key for the book?
  } else {
    // unexpected error, can't handle it
    // the transaction will abort
  }
};

transaction.onabort = function() {
  console.log("Error", transaction.error);
};
```

### Event delegation

Do we need onerror/onsuccess for every request? Not every time. We can use event delegation instead.

**IndexedDB events bubble: `request` -> `transaction` -> `database`.**

All events are DOM events, with capturing and bubbling, but usually only bubbling stage is used.

So we can catch all errors using `db.onerror` handler, for reporting or other purposes:

```js
db.onerror = function(event) {
  let request = event.target; // the request that caused the error

  console.log("Error", request.error);
};
```

...But what if an error is fully handled? We don't want to report it in that case.

We can stop the bubbling and hence `db.onerror` by using `event.stopPropagation()` in `request.onerror`.

```js
request.onerror = function(event) {
  if (request.error.name == "ConstraintError") {
    console.log("Book with such id already exists"); // handle the error
    event.preventDefault(); // don't abort the transaction
    event.stopPropagation(); // don't bubble error up, "chew" it
  } else {
    // do nothing
    // transaction will be aborted
    // we can take care of error in transaction.onabort
  }
};
```

## Searching by keys

There are two main types of search in an object store:
1. By a key or a key range. That is: by `book.id` in our "books" storage.
2. By another object field, e.g. `book.price`.

First let's deal with the keys and key ranges `(1)`.

Methods that involve searching support either exact keys or so-called "range queries" -- [IDBKeyRange](https://www.w3.org/TR/IndexedDB/#keyrange) objects that specify a "key range".

Ranges are created using following calls:

- `IDBKeyRange.lowerBound(lower, [open])` means: `≥lower` (or `>lower` if `open` is true)
- `IDBKeyRange.upperBound(upper, [open])` means: `≤upper` (or `<upper` if `open` is true)
- `IDBKeyRange.bound(lower, upper, [lowerOpen], [upperOpen])` means: between `lower` and `upper`. If the open flags is true, the corresponding key is not included in the range.
- `IDBKeyRange.only(key)` -- a range that consists of only one `key`, rarely used.

All searching methods accept a `query` argument that can be either an exact key or a key range:

- `store.get(query)` -- search for the first value by a key or a range.
- `store.getAll([query], [count])` -- search for all values, limit by `count` if given.
- `store.getKey(query)` -- search for the first key that satisfies the query, usually a range.
- `store.getAllKeys([query], [count])` -- search for all keys that satisfy the query, usually a range, up to `count` if given.
- `store.count([query])` -- get the total count of keys that satisfy the query, usually a range.

For instance, we have a lot of books in our store. Remember, the `id` field is the key, so all these methods can search by `id`.

Request examples:

```js
// get one book
books.get('js')

// get books with 'css' <= id <= 'html'
books.getAll(IDBKeyRange.bound('css', 'html'))

// get books with id < 'html'
books.getAll(IDBKeyRange.upperBound('html', true))

// get all books
books.getAll()

// get all keys: id > 'js'
books.getAllKeys(IDBKeyRange.lowerBound('js', true))
```

```smart header="Object store is always sorted"
Object store sorts values by key internally.

So requests that return many values always return them in sorted by key order.
```


## Searching by any field with an index

To search by other object fields, we need to create an additional data structure named "index".

An index is an "add-on" to the store that tracks a given object field. For each value of that field, it stores a list of keys for objects that have that value. There will be a more detailed picture below.

The syntax:

```js
objectStore.createIndex(name, keyPath, [options]);
```

- **`name`** -- index name,
- **`keyPath`** -- path to the object field that the index should track (we're going to search by that field),
- **`option`** -- an optional object with properties:
  - **`unique`** -- if true, then there may be only one object in the store with the given value at the `keyPath`. The index will enforce that by generating an error if we try to add a duplicate.
  - **`multiEntry`** -- only used if the value on `keyPath` is an array. In that case, by default, the index will treat the whole array as the key. But if `multiEntry` is true, then the index will keep a list of store objects for each value in that array. So array members become index keys.

In our example, we store books keyed by `id`.

Let's say we want to search by `price`.

First, we need to create an index. It must be done in `upgradeneeded`, just like an object store:

```js
openRequest.onupgradeneeded = function() {
  // we must create the index here, in versionchange transaction
  let books = db.createObjectStore('books', {keyPath: 'id'});
*!*
  let index = inventory.createIndex('price_idx', 'price');
*/!*
};
```

- The index will track `price` field.
- The price is not unique, there may be multiple books with the same price, so we don't set `unique` option.
- The price is not an array, so `multiEntry` flag is not applicable.

Imagine that our `inventory` has 4 books. Here's the picture that shows exactly what the `index` is:

![](indexeddb-index.svg)

As said, the index for each value of `price` (second argument) keeps the list of keys that have that price.

The index keeps itself up to date automatically, we don't have to care about it.

Now, when we want to search for a given price, we simply apply the same search methods to the index:

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

```js
// find books where price <= 5
let request = priceIndex.getAll(IDBKeyRange.upperBound(5));
```

Indexes are internally sorted by the tracked object field, `price` in our case. So when we do the search, the results are also sorted by `price`.

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
