# Ontwikkelaarsconsole

De code is gevoelig voor fouten. Je zult waarschijnlijk fouten maken... Oh, waar heb ik het over? Je gaat *absoluut* fouten maken, tenminste als je een mens bent, niet een [robot](https://en.wikipedia.org/wiki/Bender_(Futurama)).

Maar in de browser zien gebruikers standaard geen fouten. Dus, als er iets fout gaat in het script, zien we niet wat er kapot is en kunnen we het niet repareren.

Om fouten te zien en veel andere nuttige informatie over scripts te krijgen, zijn er "ontwikkelaarshulpmiddelen" in de browsers ingebouwd.

De meeste ontwikkelaars leunen voor de ontwikkeling naar Chrome of Firefox omdat die browsers de beste ontwikkelaarshulpmiddelen hebben. Andere browsers bieden ook ontwikkelaarshulpmiddelen aan, soms met speciale functies, maar spelen meestal een "inhaalslag" naar Chrome of Firefox. De meeste ontwikkelaars hebben dus een "favoriete" browser en schakelen over naar anderen als een probleem browser-specifiek is.

Ontwikkelaarshulpmiddelen zijn krachtig; ze hebben veel mogelijkheden. Om te beginnen leren we hoe ze te openen, naar fouten te kijken en JavaScript-opdrachten uit te voeren.

## Google Chrome

Open de pagina [bug.html](bug.html).

Er staat een fout in de JavaScript-code op. Het is verborgen voor de ogen van een gewone bezoeker, dus laten we de ontwikkelaarstools openen om het te zien.

Druk op `toets:F12` of, als je op de Mac zit, op `toets:Cmd+Opt+J`.

De ontwikkelaarshulpmiddelen worden standaard geopend op het tabblad Console.

Het lijkt er een beetje op:

![chrome](chrome.png)

Het exacte uiterlijk van de ontwikkeltools is afhankelijk van uw versie van Chrome. Het verandert van tijd tot tijd, maar het zou vergelijkbaar moeten zijn.

- Hier zien we de roodgekleurde foutmelding. In dit geval bevat het script een onbekend "lalala"-commando.
- Aan de rechterkant staat een klikbare link naar de bron `bug.html:12` met het regelnummer waar de fout is opgetreden.

Onder de foutmelding staat een blauw `>`-symbool. Het markeert een "commandoregel" waar we JavaScript commando's kunnen typen. Druk op de `toets:Enter` om ze uit te voeren.

Nu kunnen we fouten zien, en dat is genoeg om te beginnen. We komen later terug op de ontwikkelaarstools en gaan dieper in op het debuggen in het hoofdstuk <info:debugging-chroom>.

```smart header="Multi-line input"
Meestal, wanneer we een regel code in de console zetten, en dan op de `toets:Enter` drukken, wordt deze uitgevoerd.

Om meerdere regels in te voegen, druk op de `toets:Shift+Enter`. Op deze manier kan men lange fragmenten van JavaScript-code invoeren.
```

## Firefox, Edge, en anderen

De meeste andere browsers gebruiken `sleutel:F12` om ontwikkeltools te openen.

De look & feel van deze tools lijkt er sterk op. Als je eenmaal weet hoe je een van deze tools moet gebruiken (je kunt beginnen met Chrome), kun je gemakkelijk overschakelen naar een andere.

## Safari

Safari (Mac-browser, niet ondersteund door Windows/Linux) is hier een beetje speciaal. We moeten eerst het "Developmentmenu" inschakelen.

Open Preferences en ga naar het "Advanced" deelvenster. Er staat een selectievakje onderaan:

![safari](safari.png)

Nu kan de `toets:Cmd+Opt+C` de console schakelen. Merk ook op dat het nieuwe top menu item genaamd "Develop" is verschenen. Het heeft vele commando's en opties.

## Samenvatting

- Ontwikkelaarstools stellen ons in staat om fouten te zien, commando's uit te voeren, variabelen te onderzoeken en nog veel meer.
- Ze kunnen worden geopend met `key:F12` voor de meeste browsers op Windows. Chrome voor Mac heeft `key:Cmd+Opt+J` nodig, Safari: `key:Cmd+Opt+C` (moet eerst worden ingeschakeld).

Nu hebben we de omgeving klaar. In de volgende sectie gaan we naar JavaScript.

*** Vertaald met www.DeepL.com/Translator (gratis versie)
 ***

