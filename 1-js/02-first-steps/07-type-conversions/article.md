# Type Conversies

Gewoonlijk converteren operators en functies de aan hen gegeven waarden automatisch naar het juiste type.

`alert` converteert bijvoorbeeld elke waarde automatisch naar een tekenreeks om het tonen. Wiskundige bewerkingen converteren waarden naar getallen.

Er zijn ook gevallen waarin we moeten een waarde uitdrukkelijk converteren naar het verwachte type.

```smart header="Nog niet over objecten gesproken"
In dit hoofdstuk, we zullen niet bespreken objecten. Voor nu zullen we het alleen over primitieven hebben.

Later, nadat we hebben leren over objecten, zullen we in het hoofdstuk <info:object-toprimitive> zien hoe objecten passen.
```

## Tekenreeks Conversie

Tekenreeks conversie gebeurt wanneer we hebben de tekenreeksvorm van een waarde nodig.

`alert(value)` doet het bijvoorbeeld om de waarde te tonen.

We kunnen ook aan de `String(value)` (tekenreeks) functie roepen om een waarde naar een tekenreeks te converteren:

```js run
let value = true;
alert(typeof value); // boolean

*!*
value = String(value); // nu is value een tekenreeks "true"
alert(typeof value); // string
*/!*
```

Tekenreeks conversie is meestal duidelijk. Een `false` wordt `"false"`, `null` wordt `"null"`, ezv.

## Numerieke Conversie

Numerieke conversie gebeurt automatisch in wiskundige functie en uitdrukkingen.

Wanneer bijvoorbeeld verdeling `/` wordt toegepast op niet-getallen:

```js run
alert( "6" / "2" ); // 3, tekenreeksen worden geconverteerd naar getallen
```

We kunnen de `Number(value)` (nummer) functie gebruiken om een `value` uitdrukkelijk naar een getal converteren:

```js run
let str = "123";
alert(typeof str); // string

let num = Number(str); // wordt een getal 123

alert(typeof num); // number
```

Expliciete conversie is gewoonlijk vereist wanneer we een waarde uit een op tekenreeks gebaseerde bron zoals een tekstformulier lezen, maar wervachten dat er een getal wordt ingevoerd.

Als de tekenreeks geen geldig getal is, is het resultaat van een dergelijke conversie `NaN` (niet een getal). Bijvoorbeeld:

```js run
let age = Number("een willekeurig tekenreeks in plaats van een getal");

alert(age); // NaN, conversie mislukt
```

Numerieke conversie regels:

| Waarde | Wordt... |
| ------ | -------- |
| `undefined` | `NaN` |
| `null` | `0` |
| <code>true&nbsp;en&nbsp;false</code> | `1` and `0` |
| `string` | Witruimte vanaf het begin en het einde worden verwijderd. Als de resterende tekenreeks leeg is, is het resultaat `0`. En anders is het getal "gelezen" uit de tekenreeks. Een fout geeft `NaN`. |

Voorbeelden:

```js run
alert( Number("   123   ") ); // 123
alert( Number("123z") );      // NaN (fout bij het lezen van een getal op "z")
alert( Number(true) );        // 1
alert( Number(false) );       // 0
```

Houd er rekening mee dat `null` en `undefined` gedragen hier anders: `null` wordt nul terwijl `undefined` `NaN` wordt.

Meeste wiskundige operators uitvoeren ook een dergelijke conversie, dat zullen we zien in het volgende hoofdstuk.

## Booleaanse Conversie

Booleanse conversie is de gemakkelijkste.

Het gebeurt in logische bewerkingen (later zullen we conditietests en andere soortgelijke dingen ontmoeten), maar kan ook expliciet worden uitgevoerd met een oproep naar `Boolean(value)`.

De conversieregel:

- Waarden die intuïtief "leeg" zijn, zoals `0`, een lege tekenreeks, `null`, `undefined` en `NaN` worden `false`.
- Andere waarden worden `true`.

Voorbeelden:

```js run
alert( Boolean(1) ); // true
alert( Boolean(0) ); // false

alert( Boolean("hallo") ); // true
alert( Boolean("") ); // false
```

````warn header="Let op: de tekenreeks met nul `\"0\"` is `true`"
Sommige talen (namelijk PHP) behandelen `"0"` als `false`. Maar in JavaScript is een niet-lege tekenreeks altijd `true`.

```js run
alert( Boolean("0") ); // true
alert( Boolean(" ") ); // spaties, ook true (elke niet-lege tekenreeks is true)
```
````

## Overzicht

De drie meest gebruikte type conversies zijn naar tekenreeks, naar getaal en naar boolean.

**`Tekenreeks Conversie`** -- Gebeurt als we iets uitvoeren. Kan worden uitgevoerd met `String(value)` (tekenreeks). De conversie naar tekenreeks ligt meestal voor de hand voor primitieve waarden.

**`Numerieke Conversie`** -- Gebeurt in wiskundige bewerkingen. Kan worden uitgevored met `Number(value)` (getal).

De conversie volgt de regels:


| Waarde | Wordt... |
| ------ | -------- |
| `undefined` | `NaN` |
| `null` | `0` |
| <code>true&nbsp;/&nbsp;false</code> | `1 / 0` |
| `string` | De tekenreeks wordt gelezen zoals het is, witruimten aan beide zijden worden genegeerd. Een lege tekenreeks wordt `0`. Een fout geeft `NaN`. |

**`Booleaanse Conversie`** -- Gebeurt in logische bewerkingen. Kan worden uitgevoerd met `Boolean(value)`.

Volgt de regels:

| Waarde | Wordt... |
| ------ | -------- |
| `0`, `null`, `undefined`, `NaN`, `""` | `false` |
| elke andere waarde | `true` |


De meeste van deze regels zijn gemakkelijk te begrijpen en te onthouden. De opmerkelijke uitzonderingen waar mensen gewoonlijk fouten maken zijn:

- `undefined` is `NaN` als een getal, niet `0`.
- `"0"` en tekenreeksen met alleen spaties zoals `"   "` zijn waar als een boolean.

Objecten wordt hier niet behandeld. We komen er later op terug in het hoofdstuk <info:object-toprimitive> dat uitsluitend aan objecten gewijd is, nadat we meer basisdingen over JavaScript hebben geleerd.
