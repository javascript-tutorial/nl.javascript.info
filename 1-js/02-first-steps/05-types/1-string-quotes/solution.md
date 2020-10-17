Backticks verankeren de uitdrukking in `${...}` in de string.

```js run
let naam = "Ilya";

// de uitdrukking is een nummer 1
alert( `hallo ${1}` ); // hallo 1

// de uitdrukking is een tekenreeks "naam".
alert( `hallo ${"naam"}` ); // hallo naam

// de uitdrukking is een ingevulde variabele
alert( `hallo ${naam}` ); // hallo Ilya
```
