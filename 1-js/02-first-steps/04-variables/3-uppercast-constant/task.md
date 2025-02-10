# Uppercase constante?

Bestudeer de volgende code:

```js
const verjaardag = '18.04.1982';

const leeftijd = eenCode(verjaardag);
```

<<<<<<< HEAD
Hier hebben we een constante `verjaardag` datum en de `leeftijd` wordt berekend vanaf `verjaardag` met behulp van een of andere code (het is niet voorzien voor kortstondigheid, en omdat details hier niet van belang zijn).
=======
Here we have a constant `birthday` for the date, and also the `age` constant.

The `age` is calculated from `birthday` using `someCode()`, which means a function call that we didn't explain yet (we will soon!), but the details don't matter here, the point is that `age` is calculated somehow based on the `birthday`.
>>>>>>> 6236eb8c3cdde729dab761a1d0967a88a1a6197e

Zou het juist zijn om hoofdletters te gebruiken voor `verjaardag`? Voor `leeftijd`? Of zelfs voor beide?

```js
<<<<<<< HEAD
const VERJAARDAG = '18.04.1982'; // uppercase maken?

const LEEFTIJD = eenCode(BIRTHDAY); // hoofdletters maken?
```
=======
const BIRTHDAY = '18.04.1982'; // make birthday uppercase?

const AGE = someCode(BIRTHDAY); // make age uppercase?
```
>>>>>>> 6236eb8c3cdde729dab761a1d0967a88a1a6197e
