# Hallo, wereld!

Dit deel van de tutorial gaat over de kern van JavaScript, de taal zelf.

Maar we hebben een werkomgeving nodig om onze scripts uit te voeren en aangezien dit boek online is, is de browser een goede keuze. We zullen de hoeveelheid browser-specifieke commando's (zoals `alert`) tot een minimum beperken zodat je er geen tijd aan besteedt als je van plan bent je te concentreren op een andere omgeving (zoals Node.js). We zullen ons concentreren op JavaScript in de browser in het [next part](/ui) van de tutorial.

Dus laten we eerst eens kijken hoe we een script aan een webpagina koppelen. Voor server-side omgevingen (zoals Node.js) kun je het script uitvoeren met een commando als `"node my.js"`.


## De "script" tag

<<<<<<< HEAD
JavaScript-programma's kunnen in elk deel van een HTML-document worden ingevoegd met behulp van de `<script>`-tag.
=======
JavaScript programs can be inserted almost anywhere into an HTML document using the `<script>` tag.
>>>>>>> a82915575863d33db6b892087975f84dea6cb425

Bijvoorbeeld:

```html run height=100
<!DOCTYPE HTML>
<html>

<body>

  <p>Voor het script...</p>

*!*
  <script>
    alert( 'Hallo, wereld!' );
  </script>
*/!*

  <p>...Na het script.</p>

</body>

</html>
```

```online
U kunt het voorbeeld uitvoeren door te klikken op de knop "Afspelen" in de rechterbovenhoek van het vak hierboven.
```

Het `<script>`-tag bevat JavaScript-code die automatisch wordt uitgevoerd wanneer de browser de tag verwerkt.


## Moderne opmaak

Het `<script>` tag heeft een aantal attributen die tegenwoordig zelden gebruikt worden, maar nog wel in oude code te vinden zijn:

Het `type`-attribuut: <code>&lt;script <u>type</u>=...&gt;</code>
: De oude HTML-standaard, HTML4, vereiste een script om een `type` te hebben. Meestal was het `type="tekst/javascript"`. Het is niet meer nodig. Ook de moderne HTML-standaard heeft de betekenis van dit attribuut totaal veranderd. Nu kan het gebruikt worden voor JavaScript-modules. Maar dat is een geavanceerd onderwerp, we zullen het in een ander deel van de tutorial over modules hebben.

Het `taal`-attribuut: <code>&lt;script <u>taal</u>=...&gt;</code>
: Dit attribuut was bedoeld om de taal van het script te laten zien. Dit attribuut heeft geen zin meer omdat JavaScript de standaard taal is. Het is niet nodig om het te gebruiken.

Commentaar voor en na scripts.
: In echt oude boeken en gidsen vind je misschien commentaar in `<script>`-tags, zoals deze:

    ```html no-beautify
    <script type="tekst/javascript"><! --
        ...
    //--></script>
    ```

    Deze truc wordt niet gebruikt in moderne JavaScript. Deze commentaren verbergen JavaScript-code voor oude browsers die niet wisten hoe ze de `<script>`-tag moesten verwerken. Aangezien browsers die in de afgelopen 15 jaar zijn uitgebracht dit probleem niet hebben, kan dit soort commentaar u helpen bij het identificeren van echt oude code.


## Externe scripts

Als we veel JavaScript-code hebben, kunnen we die in een apart bestand zetten.

Scriptbestanden worden aan HTML gekoppeld met het `src` attribuut:

```html
<script src="/pad/naar/script.js"></script>
```

<<<<<<< HEAD
Hier is `/pad/naar/script.js` een absoluut pad naar het script vanuit de site-root. Men kan ook een relatief pad van de huidige pagina opgeven. Bijvoorbeeld, `src="script.js "betekent een bestand `"script.js"` in de huidige map.
=======
Here, `/path/to/script.js` is an absolute path to the script from the site root. One can also provide a relative path from the current page. For instance, `src="script.js"`, just like `src="./script.js"`, would mean a file `"script.js"` in the current folder.
>>>>>>> a82915575863d33db6b892087975f84dea6cb425

We kunnen ook een volledige URL geven. Bijvoorbeeld:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
```

Om meerdere scripts te bevestigen, gebruik je meerdere tags:

```html
<script src="/js/script1.js"></script>
<script src="/js/script2.js"></script>
…
```

```slimme
In de regel worden alleen de eenvoudigste scripts in HTML gezet. Complexere scripts staan in aparte bestanden.

Het voordeel van een apart bestand is dat de browser het downloadt en opslaat in zijn [cache](https://en.wikipedia.org/wiki/Web_cache).

Andere pagina's die naar hetzelfde script verwijzen zullen het uit de cache halen in plaats van het te downloaden, zodat het bestand eigenlijk maar één keer wordt gedownload.

Dat vermindert het verkeer en maakt de pagina's sneller.
```

````warn header="Als `src` is ingesteld, wordt de inhoud van het script genegeerd."
Een enkele `<script>` tag kan niet zowel het `src` attribuut als de code bevatten.

Dit werkt niet:

```html
<script *! *src*/! *="file.js">
  waarschuwing(1); // de inhoud wordt genegeerd, omdat src is ingesteld
</script>
```

We moeten kiezen voor een externe `<script src="...">" of een gewone `<script>` met code.

Het bovenstaande voorbeeld kan worden opgesplitst in twee scripts om te werken:

```html
<script src="bestand.js"></script>
<script>
  waarschuwing(1);
</script>
```
````

## Samenvatting

- We kunnen een `<script>` tag gebruiken om JavaScript-code toe te voegen aan een pagina.
- De `type` en `taal` attributen zijn niet nodig.
- Een script in een extern bestand kan worden ingevoegd met `<script src="path/to/script.js"></script>`.


Er is nog veel meer te leren over browserscripts en hun interactie met de webpagina. Maar laten we niet vergeten dat dit deel van de tutorial gewijd is aan de JavaScript-taal, dus we moeten onszelf niet afleiden met browser-specifieke implementaties ervan. We zullen de browser gebruiken als een manier om JavaScript uit te voeren, wat erg handig is voor online lezen, maar slechts één van de vele.