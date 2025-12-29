# Variabelen

Meestal moet een JavaScript-applicatie met informatie werken. Hier zijn twee voorbeelden:
1. Een online winkel -- de informatie kan bestaan uit goederen die worden verkocht en een winkelwagentje.
2. Een chatprogramma -- de informatie kan gebruikers, berichten en nog veel meer omvatten.

Variabelen worden gebruikt om deze informatie op te slaan.

## Een variabele

Een [Variabele](https://nl.wikipedia.org/wiki/Variabele_(informatica)) is een "genaamde opslagplaats" voor gegevens. We kunnen variabelen gebruiken om goodies, bezoekers en andere gegevens op te slaan.

Om een variabele in JavaScript aan te maken, gebruik je het `let` sleutelwoord.

De onderstaande verklaring maakt (met andere woorden: *declareert*) een variabele met de naam "bericht":

```js
let bericht;
```

Nu kunnen we er wat gegevens in zetten door gebruik te maken van de opdrachtbeheerder `=`:

```js
let bericht;

*!*
<<<<<<< HEAD
bericht = 'Hallo'; // sla de string op
=======
message = 'Hello'; // store the string 'Hello' in the variable named message
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
*/!*
```

De string wordt nu opgeslagen in het geheugengebied dat bij de variabele hoort. We kunnen het openen met behulp van de naam van de variabele:

```js draaien
let bericht;
bericht = 'Hallo!';

*!*
alert(bericht); // toont de variabele inhoud
*/!*
```

Om het kort te houden, kunnen we de variabele declaratie en toewijzing in één regel combineren:

```js lopen
let bericht = 'Hallo!'; // definieer de variabele en wijs de waarde toe

alert(bericht); // Hallo!
```

We kunnen ook meerdere variabelen in één regel declareren:

```js geen-bevoegdheid
let gebruiker = 'John', leeftijd = 25, bericht = 'Hallo';
```

Dat lijkt misschien korter, maar we raden het niet aan. Voor een betere leesbaarheid kunt u een enkele regel per variabele gebruiken.

De multilijnvariant is wat langer, maar makkelijker leesbaar:

```js
let gebruiker = 'John';
let leeftijd = 25 jaar;
let bericht = 'Hallo';
```

<<<<<<< HEAD
Sommige mensen definiëren ook meerdere variabelen in deze multiline-stijl:
```js geen-beschermdheid
let gebruiker = 'John',
  leeftijd = 25 jaar,
  bericht = 'Hallo';
=======
Some people also define multiple variables in this multiline style:

```js no-beautify
let user = 'John',
  age = 25,
  message = 'Hello';
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
```

...of zelfs in de "komma-eerste" stijl:

```js no-beautify
let gebruiker = 'John'
  leeftijd = 25 jaar
  ...bericht = 'Hallo';
```

Technisch gezien doen al deze varianten hetzelfde. Het is dus een kwestie van persoonlijke smaak en esthetiek.

````smart header="`var` in plaats van `let`".
In oudere scripts kunt u ook een ander sleutelwoord vinden: `var` in plaats van `let`:

```js
*! *Var*/! * bericht = 'Hallo';
```

<<<<<<< HEAD
Het `var` trefwoord is *allemaal* hetzelfde als `let`. Het verklaart ook een variabele, maar op een iets andere, "ouderwetse" manier.

Er zijn subtiele verschillen tussen `let` en `var`, maar die zijn voor ons nog niet van belang. We zullen ze in detail behandelen in het hoofdstuk <info:var>.
=======
The `var` keyword is *almost* the same as `let`. It also declares a variable but in a slightly different, "old-school" way.

There are subtle differences between `let` and `var`, but they do not matter to us yet. We'll cover them in detail in the chapter <info:var>.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
````

## Een levensechte analogie

We kunnen het concept van een "variabele" gemakkelijk begrijpen als we het ons voorstellen als een "doos" voor gegevens, met een unieke sticker erop.

<<<<<<< HEAD
De variabele `boodschap` kan bijvoorbeeld worden voorgesteld als een doos met het label `boodschap` met de waarde `Hallo!' erin:
=======
For instance, the variable `message` can be imagined as a box labelled `"message"` with the value `"Hello!"` in it:
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

![](variabele.svg)

We kunnen elke waarde in de doos stoppen.

<<<<<<< HEAD
We kunnen het ook zo vaak veranderen als we willen:
=======
We can also change it as many times as we want:

>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
```js run
let bericht;

bericht = 'Hallo!';

bericht = 'Wereld!'; // waarde veranderd

alert(bericht);
```

Wanneer de waarde wordt gewijzigd, worden de oude gegevens uit de variabele verwijderd:

![](variabele-verandering.svg)

We kunnen ook twee variabelen declareren en gegevens van de ene naar de andere kopiëren.

```js run
let hallo = 'Hallo wereld!';

let bericht;

*!*
// kopieer 'Hallo wereld' van hallo naar bericht
Bericht = hallo;
*/!*

// nu hebben twee variabelen dezelfde gegevens
alert(hallo); // Hallo wereld!
alert(message); // Hallo wereld!
```

````warn header="Twee keer aangeven veroorzaakt een fout".
Een variabele moet slechts één keer worden aangegeven.

Een herhaalde declaratie van dezelfde variabele is een fout:

```js run
let bericht = "Dit";

// herhaald 'laten' leidt tot een fout
let bericht = "Dat"; // SyntaxError: 'bericht' is al gedeclareerd
```
Dus, we moeten een keer een variabele aangeven en er dan naar verwijzen zonder `let`.
````

<<<<<<< HEAD
```smart header="Functionele talen"
Het is interessant om op te merken dat er [functionele](https://nl.wikipedia.org/wiki/Functioneel_programmeren) programmeertalen bestaan, zoals [Scala](http://www.scala-lang.org/) of [Erlang](http://www.erlang.org/) die het veranderen van variabele waarden verbieden.
=======
```smart header="Functional languages"
It's interesting to note that there exist so-called [pure functional](https://en.wikipedia.org/wiki/Purely_functional_programming) programming languages, such as [Haskell](https://en.wikipedia.org/wiki/Haskell), that forbid changing variable values.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

In dergelijke talen, als de waarde eenmaal is opgeslagen "in de box", is het er voor altijd. Als we iets anders moeten opslaan, dwingt de taal ons om een nieuwe box te maken (een nieuwe variabele te declareren). We kunnen de oude niet hergebruiken.

<<<<<<< HEAD
Hoewel het op het eerste gezicht misschien een beetje vreemd lijkt, zijn deze talen wel degelijk in staat tot een serieuze ontwikkeling. Meer nog, er zijn gebieden zoals parallelle berekeningen waar deze beperking bepaalde voordelen biedt. Het bestuderen van zo'n taal (zelfs als je niet van plan bent om hem binnenkort te gebruiken) is aan te raden om de geest te verbreden.
=======
Though it may seem a little odd at first sight, these languages are quite capable of serious development. More than that, there are areas like parallel computations where this limitation confers certain benefits.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
```

## Variabele naamgeving [#variabele naamgeving]

Er zijn twee beperkingen op variabele namen in JavaScript:

1. De naam mag alleen letters, cijfers of de symbolen `$` en `_` bevatten.
2. Het eerste teken mag geen cijfer zijn.

Voorbeelden van geldige namen:

```js
let userName;
let testen123;
```

Wanneer de naam meerdere woorden bevat, wordt [camelCase](https://nl.wikipedia.org/wiki/CamelCase) vaak gebruikt. Dat wil zeggen: woorden gaan de ene na de andere, elk woord behalve dat het eerst begint met een hoofdletter: `eenZeerLangeNaam`.

Wat interessant is -- het dollarteken `'$'` en het onderstrepingsteken `'_'` kunnen ook in namen worden gebruikt. Het zijn gewone symbolen, net als letters, zonder speciale betekenis.

Deze namen zijn geldig:

```js run untrusted
let $ = 1; // een variabele met de naam "$" aangeven
let _ = 2; // en nu een variabele met de naam "_"

alert($ + _); // 3
```

Voorbeelden van foutieve variabele namen:

```js no-beautify
let 1a; // kan niet beginnen met een cijfer

let mijn-naam; // koppeltekens '-' zijn niet toegestaan in de naam
```

```smart header="Case matters"
<<<<<<< HEAD
De variabelen `apple` en `AppLE` zijn twee verschillende variabelen.
```

````smart header="Niet-Latijnse letters zijn toegestaan, maar niet aanbevolen".
Het is mogelijk om elke taal te gebruiken, inclusief cyrillische letters of zelfs hiërogliefen, zoals deze:
=======
Variables named `apple` and `APPLE` are two different variables.
```

````smart header="Non-Latin letters are allowed, but not recommended"
It is possible to use any language, including Cyrillic letters, Chinese logograms and so on, like this:
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

```js
let имя = '...';
let 我 = "...";
```

<<<<<<< HEAD
Technisch gezien is er hier geen sprake van een fout. Dergelijke namen zijn toegestaan, maar er is een internationale conventie om Engels te gebruiken in variabele namen. Zelfs als we een klein script schrijven, kan het een lange levensduur hebben. Mensen uit andere landen moeten het misschien een tijdje lezen.
=======
Technically, there is no error here. Such names are allowed, but there is an international convention to use English in variable names. Even if we're writing a small script, it may have a long life ahead. People from other countries may need to read it sometime.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
````

````warn header="Gereserveerde namen".
Er is een [lijst van gereserveerde woorden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords), die niet als variabele namen kunnen worden gebruikt omdat ze door de taal zelf worden gebruikt.

Bijvoorbeeld: `let`, `class`, `return`, en `function` zijn gereserveerd.

De onderstaande code geeft een syntaxisfout:

```js run zonder no-beautify
let = 5; // kan geen naam geven aan een variabele "let", fout!
let return = 5; // kan het ook geen naam geven "return", fout!
```
````

````warn header="Een opdracht zonder `gebruikerstrict`".

Normaal gesproken moeten we een variabele definiëren voordat we deze kunnen gebruiken. Maar in de oude tijd was het technisch mogelijk om een variabele te creëren door een eenvoudige toewijzing van de waarde zonder gebruik te maken van `let`. Dit werkt nu nog steeds als we geen `gebruik strikt` in onze scripts zetten om de compatibiliteit met oude scripts te behouden.

```js run geen no-strict
// opmerking: gebruik geen "use strict" in dit voorbeeld

num = 5; // de variabele "num" wordt aangemaakt als deze niet bestond

alert(num); // 5
```

Dit is een slechte gewoonte en zou in strikte zin een fout veroorzaken:

```js
"gebruik strikt";

*!*
num = 5; // fout: num is niet gedefinieerd
*/!*
```
````

## Constanten

Om een constante (onveranderlijke) variabele aan te geven, gebruik je `const` in plaats van `let`:

```js
const myBirthday = '18.04.1982';
```

Variabelen die met `const` worden gedeclareerd, worden "constanten" genoemd. Ze kunnen niet opnieuw worden toegewezen. Een poging om dit te doen zou een fout veroorzaken:

```js run
const myBirthday = '18.04.1982';

myBirthday = '01.01.2001'; // fout, kan de constante niet opnieuw toewijzen!
```

<<<<<<< HEAD
Wanneer een programmeur er zeker van is dat een variabele nooit zal veranderen, kan hij deze met `const` aangeven om dat feit te garanderen en duidelijk aan iedereen te communiceren.

=======
When a programmer is sure that a variable will never change, they can declare it with `const` to guarantee and communicate that fact to everyone.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

#### Hoofdletterconstanten

<<<<<<< HEAD
Er is een wijdverbreide praktijk om constanten te gebruiken als aliassen voor moeilijk te onthouden waarden die voorafgaand aan de uitvoering bekend zijn.
=======
There is a widespread practice to use constants as aliases for difficult-to-remember values that are known before execution.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

Dergelijke constanten worden met hoofdletters en onderstrepingen benoemd.

Laten we bijvoorbeeld constanten maken voor kleuren in het zogenaamde "web" (hexadecimaal) formaat:

```js run
const COLOR_ROOD = "#F00";
const COLOR_GROEN = "#0F0";
const COLOR_BLAUW = "#00F";
const COLOR_ORANJE = "#FF7F00";

// ...als we een kleur moeten kiezen...
let kleur = COLOR_ORANJE;
alert(kleur); // #FF7F00
```

Voordelen:

- `COLOR_ORANJE` is veel gemakkelijker te onthouden dan ``FF7F00``.
- Het is veel gemakkelijker om `"#FF7F00"` verkeerd te typen dan `COLOR_ORANJE`.
- Bij het lezen van de code is `COLOR_ORANJE` veel zinvoller dan `#FF7F00`.

Wanneer moeten we hoofdletters gebruiken voor een constante en wanneer moeten we deze normaal noemen? Laten we dat duidelijk maken.

<<<<<<< HEAD
Een "constante" zijn betekent gewoon dat de waarde van een variabele nooit verandert. Maar er zijn constanten die voor de uitvoering bekend zijn (zoals een hexadecimale waarde voor rood) en er zijn constanten die *berekend* zijn in run-time, tijdens de uitvoering, maar niet veranderen na hun initiële opdracht.

Bijvoorbeeld:
=======
Being a "constant" just means that a variable's value never changes. But some constants are known before execution (like a hexadecimal value for red) and some constants are *calculated* in run-time, during the execution, but do not change after their initial assignment.

For instance:

>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
```js
const paginaLaadTijd = /* tijd die een webpagina nodig heeft om te laden */;
```

<<<<<<< HEAD
De waarde van `pageLoadTime` is niet bekend voordat de pagina wordt geladen, dus wordt deze normaal gesproken genoemd. Maar het is nog steeds een constante omdat het niet verandert na de opdracht.

Met andere woorden, hoofdnaamconstanten worden alleen gebruikt als aliassen voor "hard-coded" waarden.  
=======
The value of `pageLoadTime` is not known before the page load, so it's named normally. But it's still a constant because it doesn't change after the assignment.

In other words, capital-named constants are only used as aliases for "hard-coded" values.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

## Noem de dingen goed

Over variabelen gesproken, er is nog iets heel belangrijks.

Een naam van een variabele moet een schone, voor de hand liggende betekenis hebben, die de gegevens beschrijft die hij opslaat.

<<<<<<< HEAD
Het benoemen van variabelen is een van de belangrijkste en meest complexe vaardigheden in het programmeren. Een snelle blik op de namen van variabelen kan onthullen welke code door een beginner versus een ervaren ontwikkelaar is geschreven.

In een echt project wordt de meeste tijd besteed aan het aanpassen en uitbreiden van een bestaande codebasis in plaats van aan het schrijven van iets dat volledig losstaat van de rest. Als we na een tijdje teruggaan naar wat code, is het veel gemakkelijker om informatie te vinden die goed gelabeld is. Of, met andere woorden, wanneer de variabelen goede namen hebben.
=======
Variable naming is one of the most important and complex skills in programming. A glance at variable names can reveal which code was written by a beginner versus an experienced developer.

In a real project, most of the time is spent modifying and extending an existing code base rather than writing something completely separate from scratch. When we return to some code after doing something else for a while, it's much easier to find information that is well-labelled. Or, in other words, when the variables have good names.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

Besteed alstublieft tijd aan het bedenken van de juiste naam voor een variabele, voordat u deze afkondigt. Als u dat doet, betaalt u het geld terug.

Een aantal goede-tot-volgorde regels zijn dat wel:

<<<<<<< HEAD
- Gebruik menselijk leesbare namen zoals `gebruikersNaam` of `winkelKar`.
- Blijf uit de buurt van afkortingen of korte namen zoals `a`, `b`, `c`, tenzij je echt weet wat je doet.
- Maak namen maximaal beschrijvend en beknopt. Voorbeelden van slechte namen zijn `data` en `waarde`. Zulke namen zeggen niets. Het is alleen toegestaan om ze te gebruiken als de context van de code het uitzonderlijk duidelijk maakt naar welke gegevens of waarde de variabele verwijst.
- Maak afspraken over termen binnen je team en in je eigen hoofd. Als een bezoeker van een site een "gebruiker" wordt genoemd, dan moeten we gerelateerde variabelen `huidigeGebruiker` of `nieuweGebruiker` noemen in plaats van `huidigeBezoeker` of `nieuweManInDeStad`.
=======
- Use human-readable names like `userName` or `shoppingCart`.
- Stay away from abbreviations or short names like `a`, `b`, and `c`, unless you know what you're doing.
- Make names maximally descriptive and concise. Examples of bad names are `data` and `value`. Such names say nothing. It's only okay to use them if the context of the code makes it exceptionally obvious which data or value the variable is referencing.
- Agree on terms within your team and in your mind. If a site visitor is called a "user" then we should name related variables `currentUser` or `newUser` instead of `currentVisitor` or `newManInTown`.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3

Klinkt dat eenvoudig? Inderdaad, maar het creëren van beschrijvende en beknopte namen voor variabelen in de praktijk is dat niet. Ga ervoor.

```smart header="Hergebruiken of creëren?"
En de laatste noot. Er zijn enkele luie programmeurs die, in plaats van nieuwe variabelen te declareren, de neiging hebben om bestaande variabelen te hergebruiken.

Als gevolg daarvan zijn hun variabelen als dozen waarin mensen verschillende dingen gooien zonder hun stickers te veranderen. Wat zit er nu in die doos? Wie weet? We moeten dichterbij komen en het controleren.

Zulke programmeurs besparen een beetje op de declaratie van variabelen, maar verliezen tien keer meer op het debuggen.

Een extra variabele is goed, niet kwaadaardig.

Moderne JavaScript minifiers en browsers optimaliseren de code goed genoeg, zodat er geen prestatieproblemen ontstaan. Het gebruik van verschillende variabelen voor verschillende waarden kan de engine zelfs helpen om je code te optimaliseren.
```

## Samenvatting

We kunnen variabelen declareren om gegevens op te slaan door gebruik te maken van de `var`, `let` of `const` sleutelwoorden.

- `let` -- is een moderne variabele declaratie.
- `var` -- is een ouderwetse variabele declaratie. Normaal gesproken gebruiken we het helemaal niet, maar we behandelen subtiele verschillen met `let` in het hoofdstuk <info:var>, voor het geval je ze nodig hebt.
- `const` -- is als `let`, maar de waarde van de variabele kan niet worden veranderd.

Variabelen moeten worden benoemd op een manier die ons in staat stelt om gemakkelijk te begrijpen wat er in zit.