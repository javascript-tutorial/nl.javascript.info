# Datatypen

Een waarde in JavaScript is altijd van een bepaald type. Bijvoorbeeld een string of een nummer.

Er zijn acht basistypes in JavaScript. Hier behandelen we ze in het algemeen en in de volgende hoofdstukken bespreken we ze allemaal in detail.

We kunnen elk type in een variabele plaatsen. Een variabele kan bijvoorbeeld op een bepaald moment een string zijn en dan een nummer opslaan:

```js
// geen fout
let bericht = "hallo";
bericht = 123456;
```

Programmeertalen die dergelijke zaken toestaan, zoals JavaScript, worden "dynamisch getypeerd" genoemd, wat betekent dat er wel datatypen bestaan, maar dat er geen variabelen aan gebonden zijn.

## Aantal

```js
let n = 123;
n = 12.345;
```

Het *nummer* staat voor zowel een geheel getal als een getal met een zwevend punt.

Er zijn veel bewerkingen voor getallen, bijvoorbeeld vermenigvuldiging `*`, deling `/`, optelling `+`, aftrekking `-`, enzovoort.

Naast reguliere getallen zijn er zogenaamde "speciale numerieke waarden" die ook tot dit gegevenstype behoren: `Infinity`, `-Infinity` en `NaN`.

- De `Infinity` staat voor de wiskundige [Oneindigheid](https://nl.wikipedia.org/wiki/Oneindigheid) ∞. Het is een speciale waarde die groter is dan een willekeurig getal.

    We kunnen het krijgen als resultaat van deling door nul:

    ```js run
    alert( 1 / 0 ); // oneindig
    ```

    Of gewoon direct verwijzen naar het:

    ```js run
    alert( Oneindigheid ); // Oneindigheid
    ```
- NaN' staat voor een rekenfout. Het is bijvoorbeeld het resultaat van een onjuiste of een ongedefinieerde wiskundige bewerking:

    ```js run
    alert("geen nummer" / 2 ); // NaN, een dergelijke verdeling is foutief.
    ```

<<<<<<< HEAD
    NaN' is kleverig. Elke verdere operatie op `NaN` geeft `NaN` terug:

    ```js lopen
    waarschuwing ("geen nummer" / 2 + 5 ); // NaN
    ```

    Dus, als er ergens een `NaN` is in een wiskundige uitdrukking, dan verspreidt het zich naar het hele resultaat.
=======
    `NaN` is sticky. Any further mathematical operation on `NaN` returns `NaN`:

    ```js run
    alert( NaN + 1 ); // NaN
    alert( 3 * NaN ); // NaN
    alert( "not a number" / 2 - 1 ); // NaN
    ```

    So, if there's a `NaN` somewhere in a mathematical expression, it propagates to the whole result (there's only one exception to that: `NaN ** 0` is `1`).
>>>>>>> 71da17e5960f1c76aad0d04d21f10bc65318d3f6

```smart header="Wiskundige bewerkingen zijn veilig"
Rekenen is "veilig" in JavaScript. We kunnen alles doen: delen door nul, niet-numerieke reeksen behandelen als getallen, enz.

Het script zal nooit stoppen met een fatale fout ("dood"). In het slechtste geval krijgen we `NaN` als resultaat.
```

Speciale numerieke waarden behoren formeel tot het type "nummer". Natuurlijk zijn het geen getallen in de gewone zin van het woord.

We zien meer over het werken met getallen in het hoofdstuk <info:nummer>.

## BigInt [#bigint-type]

In JavaScript kan het type "getal" geen gehele waarden vertegenwoordigen die groter zijn dan <code>(2<sup>53</sup>-1)</code> (dat is `9007199254740991`), of minder dan <code>-(2<sup>53</sup>-1)</code> voor negatieven. Het is een technische beperking die wordt veroorzaakt door hun interne representatie.

Voor de meeste doeleinden is dat voldoende, maar soms hebben we echt grote getallen nodig, bijvoorbeeld voor cryptografie of microseconde-precisie tijdstempels.

Het `BigInt` type is recentelijk toegevoegd aan de taal om gehele getallen van willekeurige lengte weer te geven.

Een `BigInt` waarde wordt gecreëerd door `n` toe te voegen aan het einde van een geheel getal:

```js
// De "n" aan het einde betekent dat het een BigInt is...
const bigInt = 1234567890123456789012345678901234567890n;
```

Omdat `BigInt` nummers zelden nodig zijn, behandelen we ze hier niet, maar wijden ze een apart hoofdstuk <info:bigint>. Lees het als je zulke grote getallen nodig hebt.


```smart header="Compatibiliteitsproblemen"
Op dit moment wordt `BigInt` ondersteund in Firefox/Chrome/Edge/Safari, maar niet in IE.
```

U kunt [*MDN* BigInt compatibiliteitstabel](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) controleren om te weten welke versies van een browser worden ondersteund.

## String

Een string in JavaScript moet worden omgeven door aanhalingstekens.

```js
let str = "Hallo";
let str2 = 'Enkele aanhalingstekens zijn ook ok';
let zin = `kan nog een ${str}`;
```

In JavaScript zijn er 3 soorten aanhalingstekens.

1. Dubbele aanhalingstekens: "Hallo".
2. Enkele aanhalingstekens: Hallo.
3. Backticks: <code>&#96;Hallo&#96;</code>.

Dubbele en enkele aanhalingstekens zijn "eenvoudige" aanhalingstekens. Er is praktisch geen verschil tussen deze aanhalingstekens in JavaScript.

Backticks zijn "uitgebreide functionaliteit" aanhalingstekens. Ze laten ons toe om variabelen en uitdrukkingen in te bedden in een string door ze bijvoorbeeld in `${...}` te wikkelen:

```js run
let naam = "John";

// een variabele insluiten
alert( `Hello, *! *${naam}*/! *! ); // Hallo, John!

// embed een uitdrukking...
alert( `het resultaat is *! *${1 + 2}*/! *` ); // het resultaat is 3
```

De uitdrukking binnen `${...}` wordt geëvalueerd en het resultaat wordt een onderdeel van de string. We kunnen er alles in zetten: een variabele als `naam` of een rekenkundige uitdrukking als `1 + 2` of iets ingewikkelder.

Merk op dat dit alleen in backticks kan worden gedaan. Andere aanhalingstekens hebben deze inbedrijfnamefunctionaliteit niet!
```js run
alert( "het resultaat is ${1 + 2}" ); // het resultaat is ${1 + 2} (dubbele aanhalingstekens doen niets)
```

In het hoofdstuk <info:string> gaan we dieper in op de snaren.

```smart header="Er is geen *karakter* type."
In sommige talen is er een speciaal "karakter" type voor een enkel karakter. Bijvoorbeeld, in de C taal en in Java heet het "char".

In JavaScript bestaat een dergelijk type niet. Er is maar één type: `string`. Een string kan bestaan uit nul karakters (leeg zijn), één karakter of veel van deze karakters.
```

## Booleaans (logisch type)

Het booleaanse type heeft slechts twee waarden: `true`(waar) en `false`(vals).

Dit type wordt vaak gebruikt om ja/nee waarden op te slaan: `true` betekent "ja, correct", en `false` betekent "nee, onjuist".

Bijvoorbeeld:

```js
let nameFieldChecked = true; // ja, naamveld is aangevinkt
let ageFieldChecked = false; // nee, leeftijdsveld is niet aangevinkt
```

Booleaanse waarden zijn ook het resultaat van vergelijkingen:

```js run
let isGreater = 4 > 1;

alert( isGreater ); // waar (het vergelijkingsresultaat is "ja")
```

We gaan dieper in op de booleans in het hoofdstuk <info:logische-operatoren>.

## De "nul"-waarde

De speciale `null` waarde behoort niet tot een van de hierboven beschreven typen.

Het vormt een apart type dat alleen de `null` waarde bevat:

```js
let leeftijd = nul;
```

In JavaScript is `null` geen "verwijzing naar een niet-bestaand object" of een "null pointer" zoals in sommige andere talen.

Het is gewoon een speciale waarde die staat voor "niets", "leeg" of "waarde onbekend".

In bovenstaande code staat dat `leeftijd` onbekend is.

## De "ongedefinieerde" waarde

De speciale waarde `ongedefinieerd` staat ook los van elkaar. Het maakt een eigen type, net als `null`.

De betekenis van `ongedefinieerd` is "waarde wordt niet toegekend".

Als een variabele wordt gedeclareerd, maar niet toegewezen, dan is de waarde `ongedefinieerd`:

```js run
let leeftijd;

alert(leeftijd); // toont "undefined" (ongedefinieerd)
```

Technisch gezien is het mogelijk om `ongedefinieerd` expliciet toe te wijzen aan een variabele:

```js run
let leeftijd = 100;

// verander de waarde in ongedefinieerd
leeftijd = ongedefinieerd;

alert(leeftijd); // "ongedefinieerd".
```

...maar dat raden we niet aan. Normaal gesproken gebruikt men `null` om een "lege" of "onbekende" waarde toe te kennen aan een variabele, terwijl `ongedefinieerd` wordt gereserveerd als een standaard beginwaarde voor niet-toegewezen dingen.

## Objecten en symbolen

Het `object` type is speciaal.

Alle andere typen worden "primitief" genoemd omdat hun waarden slechts één ding kunnen bevatten (of het nu een tekenreeks is of een getal of wat dan ook). Objecten worden daarentegen gebruikt om gegevensverzamelingen en complexere entiteiten op te slaan.

Omdat ze zo belangrijk zijn, verdienen objecten een speciale behandeling. We zullen ze later in het hoofdstuk <info:object> behandelen, nadat we meer over primitieven hebben geleerd.

Het `symbool` wordt gebruikt om unieke identifiers voor objecten te maken. We moeten het hier vermelden voor de volledigheid, maar ook de details uitstellen tot we objecten kennen.

## Het type operator [#type-type van]

De `type` operator geeft het type van het argument terug. Het is nuttig wanneer we waarden van verschillende typen anders willen verwerken of gewoon een snelle controle willen doen.

<<<<<<< HEAD
Het ondersteunt twee vormen van syntaxis:

1. Als operator: `type van x`.
2. 2. Als functie: `typeof(x)`.

Met andere woorden, het werkt met haakjes of zonder. Het resultaat is hetzelfde.

De aanroep naar `typeof x` geeft een tekenreeks met de naam van het type:
=======
A call to `typeof x` returns a string with the type name:
>>>>>>> 71da17e5960f1c76aad0d04d21f10bc65318d3f6

```js
typeof undefined; // "ongedefinieerd"

typeof 0; // "aantal"

typeof 10n; // "bigint"

typeof true;// "boolean"

typeof "foo"; // "string"

typeof Symbol("id")// "symbool"

*!*
typeof Math // "object" (1)
*/!*

*!*
typeof null // "object" (2)
*/!*

*!*
typeof alert // "functie" (3)
*/!*
```

De laatste drie regels hebben wellicht extra uitleg nodig:

<<<<<<< HEAD
1. `Math` is een ingebouwd object dat wiskundige bewerkingen uitvoert. We leren het in het hoofdstuk <info:nummer>. Hier dient het alleen als voorbeeld van een object.
2. Het resultaat van `type nul` is `object`. Dat is een officieel erkende fout in `typeof` gedrag, afkomstig uit de begintijd van JavaScript en bewaard voor compatibiliteit. Zeker, `null` is geen object. Het is een speciale waarde met een eigen type.
3. Het resultaat van `typeof alert` is `functie`, omdat `alert` een functie is. We zullen functies bestuderen in de volgende hoofdstukken waar we ook zullen zien dat er geen speciaal "functie"-type is in JavaScript. Functies behoren tot het objecttype. Maar `typeof` behandelt ze anders, waardoor `functie` terugkomt. Dat komt ook uit de begintijd van JavaScript. Technisch gezien is dergelijk gedrag niet correct, maar kan het in de praktijk wel handig zijn.

## Samenvatting
=======
1. `Math` is a built-in object that provides mathematical operations. We will learn it in the chapter <info:number>. Here, it serves just as an example of an object.
2. The result of `typeof null` is `"object"`. That's an officially recognized error in `typeof`, coming from very early days of JavaScript and kept for compatibility. Definitely, `null` is not an object. It is a special value with a separate type of its own. The behavior of `typeof` is wrong here.
3. The result of `typeof alert` is `"function"`, because `alert` is a function. We'll study functions in the next chapters where we'll also see that there's no special "function" type in JavaScript. Functions belong to the object type. But `typeof` treats them differently, returning `"function"`. That also comes from the early days of JavaScript. Technically, such behavior isn't correct, but can be convenient in practice.

```smart header="The `typeof(x)` syntax"
You may also come across another syntax: `typeof(x)`. It's the same as `typeof x`.

To put it clear: `typeof` is an operator, not a function. The parentheses here aren't a part of `typeof`. It's the kind of parentheses used for mathematical grouping.

Usually, such parentheses contain a mathematical expression, such as `(2 + 2)`, but here they contain only one argument `(x)`. Syntactically, they allow to avoid a space between the `typeof` operator and its argument, and some people like it.

Some people prefer `typeof(x)`, although the `typeof x` syntax is much more common.
```

## Summary
>>>>>>> 71da17e5960f1c76aad0d04d21f10bc65318d3f6

Er zijn 8 basisgegevenstypes in JavaScript.

- `number` voor getallen van welke aard dan ook: geheel getal of drijvend punt, gehele getallen worden beperkt door <code>±(2<sup>53</sup>-1)</code>.
- De `bigint` is voor gehele getallen van willekeurige lengte.
- `string` voor strings. Een string kan nul of meer karakters hebben, er is geen apart type enkelvoudige karakters.
- `boolean` voor `true`/`false`.
- `null` voor onbekende waarden -- een op zichzelf staand type dat een enkele waarde `null` heeft.
- `undefined` voor niet-toegewezen waarden -- een op zichzelf staand type dat een enkele waarde `ongedefinieerd` heeft.
- `object` voor complexere gegevensstructuren.
- `symbol` voor unieke identifiers.

De `type van` operator geeft ons de mogelijkheid om te zien welk type in een variabele is opgeslagen.

<<<<<<< HEAD
- Twee vormen: `type van x` of `type van (x)`.
- Geeft als resultaat een string met de naam van het type, zoals `"string"`.
- Voor `null` geeft `"object"-- dit is een fout in de taal, het is eigenlijk geen object.
=======
- Usually used as `typeof x`, but `typeof(x)` is also possible.
- Returns a string with the name of the type, like `"string"`.
- For `null` returns `"object"` -- this is an error in the language, it's not actually an object.
>>>>>>> 71da17e5960f1c76aad0d04d21f10bc65318d3f6

In de volgende hoofdstukken zullen we ons concentreren op primitieve waarden en als we er eenmaal mee bekend zijn, gaan we over op objecten.