# Uppercase constante?

Bestudeer de volgende code:

```js
const verjaardag = '18.04.1982';

const leeftijd = eenCode(verjaardag);
```

Hier hebben we een constante `verjaardag` datum en de `leeftijd` wordt berekend vanaf `verjaardag` met behulp van een of andere code (het is niet voorzien voor kortstondigheid, en omdat details hier niet van belang zijn).

Zou het juist zijn om hoofdletters te gebruiken voor `verjaardag`? Voor `leeftijd`? Of zelfs voor beide?

```js
const VERJAARDAG = '18.04.1982'; // uppercase maken?

const LEEFTIJD = eenCode(BIRTHDAY); // hoofdletters maken?
```