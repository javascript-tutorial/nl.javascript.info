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

For example, when division `/` is applied to non-numbers:
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

## Boolean Conversion

Boolean conversion is the simplest one.

It happens in logical operations (later we'll meet condition tests and other similar things) but can also be performed explicitly with a call to `Boolean(value)`.

The conversion rule:

- Values that are intuitively "empty", like `0`, an empty string, `null`, `undefined`, and `NaN`, become `false`.
- Other values become `true`.

For instance:

```js run
alert( Boolean(1) ); // true
alert( Boolean(0) ); // false

alert( Boolean("hello") ); // true
alert( Boolean("") ); // false
```

````warn header="Please note: the string with zero `\"0\"` is `true`"
Some languages (namely PHP) treat `"0"` as `false`. But in JavaScript, a non-empty string is always `true`.

```js run
alert( Boolean("0") ); // true
alert( Boolean(" ") ); // spaces, also true (any non-empty string is true)
```
````

## Summary

The three most widely used type conversions are to string, to number, and to boolean.

**`String Conversion`** -- Occurs when we output something. Can be performed with `String(value)`. The conversion to string is usually obvious for primitive values.

**`Numeric Conversion`** -- Occurs in math operations. Can be performed with `Number(value)`.

The conversion follows the rules:

| Value |  Becomes... |
|-------|-------------|
|`undefined`|`NaN`|
|`null`|`0`|
|<code>true&nbsp;/&nbsp;false</code> | `1 / 0` |
| `string` | The string is read "as is", whitespaces from both sides are ignored. An empty string becomes `0`. An error gives `NaN`. |

**`Boolean Conversion`** -- Occurs in logical operations. Can be performed with `Boolean(value)`.

Follows the rules:

| Value |  Becomes... |
|-------|-------------|
|`0`, `null`, `undefined`, `NaN`, `""` |`false`|
|any other value| `true` |


Most of these rules are easy to understand and memorize. The notable exceptions where people usually make mistakes are:

- `undefined` is `NaN` as a number, not `0`.
- `"0"` and space-only strings like `"   "` are true as a boolean.

Objects aren't covered here. We'll return to them later in the chapter <info:object-toprimitive> that is devoted exclusively to objects after we learn more basic things about JavaScript.
