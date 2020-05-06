# Een inleiding tot JavaScript

Laten we eens kijken wat er zo bijzonder is aan JavaScript, wat we ermee kunnen bereiken en welke andere technologieën er goed mee spelen.

## Wat is JavaScript?

*Javascript* is in eerste instantie gemaakt om "webpagina's levendig te maken".

De programma's in deze taal heten *scripts*. Ze kunnen direct in de HTML van een webpagina worden geschreven en automatisch worden uitgevoerd als de pagina wordt geladen.

Scripts worden geleverd en uitgevoerd als platte tekst. Ze hebben geen speciale voorbereiding of compilatie nodig om te draaien.

In dit aspect is JavaScript heel anders dan een andere taal die [Java](https://en.wikipedia.org/wiki/Java_(programming_language)) heet.

```smart header="Waarom heet het <u>Java</u>Script?".
Toen JavaScript werd gecreëerd, had het aanvankelijk een andere naam: "LiveScript". Maar Java was in die tijd erg populair, dus werd besloten dat het positioneren van een nieuwe taal als een "jongere broer" van Java zou helpen.

Maar naarmate het zich ontwikkelde, werd JavaScript een volledig onafhankelijke taal met een eigen specificatie genaamd [ECMAScript](http://en.wikipedia.org/wiki/ECMAScript), en nu heeft het geen enkele relatie meer met Java.
```

Tegenwoordig kan JavaScript niet alleen in de browser worden uitgevoerd, maar ook op de server, of eigenlijk op elk apparaat dat een speciaal programma heeft dat [de JavaScript-engine] heet (https://en.wikipedia.org/wiki/JavaScript_engine).

De browser heeft een embedded engine die soms een "JavaScript virtuele machine" wordt genoemd.

Verschillende engines hebben verschillende "codenamen". Bijvoorbeeld:

- V8](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) -- in Chrome en Opera.
- [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey) -- in Firefox.
- ...Er zijn andere codenamen zoals "Trident" en "Chakra" voor verschillende versies van IE, "ChakraCore" voor Microsoft Edge, "Nitro" en "SquirrelFish" voor Safari, enz.

De bovenstaande termen zijn goed om te onthouden, omdat ze worden gebruikt in artikelen voor ontwikkelaars op het internet. We zullen ze ook gebruiken. Als bijvoorbeeld "een functie X wordt ondersteund door V8", dan werkt het waarschijnlijk in Chrome en Opera.

```smart header="Hoe werken de engines?"

Motoren zijn ingewikkeld. Maar de basis is eenvoudig.

1. De engine (ingebed als het een browser is) leest ("parses") het script.
2. Vervolgens zet het het script om ("compileert") naar de machinetaal.
3. En dan draait de machinecode, vrij snel.

De engine past bij elke stap van het proces optimalisaties toe. Hij kijkt zelfs naar het gecompileerde script terwijl het draait, analyseert de gegevens die erdoorheen stromen en optimaliseert de machinecode verder op basis van die kennis.
```

## Wat kan in-browser JavaScript doen?

Modern JavaScript is een "veilige" programmeertaal. Het biedt geen low-level toegang tot het geheugen of de CPU, omdat het in eerste instantie is gemaakt voor browsers die het niet nodig hebben.

De mogelijkheden van JavaScript zijn sterk afhankelijk van de omgeving waarin het draait. Bijvoorbeeld, [Node.js](https://wikipedia.org/wiki/Node.js) ondersteunt functies die JavaScript toestaan om willekeurige bestanden te lezen/schrijven, netwerkverzoeken uit te voeren, enz.

In-browser JavaScript kan alles doen met betrekking tot webpagina manipulatie, interactie met de gebruiker en de webserver.

In-browser JavaScript kan dat bijvoorbeeld:

- Nieuwe HTML toe te voegen aan de pagina, de bestaande inhoud te wijzigen, stijlen aan te passen.
- Reageren op acties van de gebruiker, uitvoeren op muisklikken, aanwijsbewegingen, toetsaanslagen.
- Verzoeken via het netwerk naar externe servers sturen, bestanden downloaden en uploaden (zogenaamde [AJAX](https://en.wikipedia.org/wiki/Ajax_(programmering)) en [COMET](https://en.wikipedia.org/wiki/Comet_(programmering)) technologieën).
- Krijg en stel cookies, stel vragen aan de bezoeker, toon berichten.
- Onthoud de gegevens aan de klantzijde ("lokale opslag").

## Wat kan in-browser JavaScript niet doen?

De mogelijkheden van JavaScript in de browser zijn beperkt omwille van de veiligheid van de gebruiker. Het doel is om te voorkomen dat een kwaadaardige webpagina toegang krijgt tot privé-informatie of schade toebrengt aan de gegevens van de gebruiker.

Voorbeelden van dergelijke beperkingen zijn:

- JavaScript op een webpagina mag geen willekeurige bestanden op de harde schijf lezen/schrijven, kopiëren of programma's uitvoeren. Het heeft geen directe toegang tot OS-functies.

    Moderne browsers staan het toe om met bestanden te werken, maar de toegang is beperkt en wordt alleen verleend als de gebruiker bepaalde acties uitvoert, zoals het "droppen" van een bestand in een browservenster of het selecteren van het bestand via een `<input>` tag.

    Er zijn manieren om met de camera/microfoon en andere apparaten te communiceren, maar daarvoor is de uitdrukkelijke toestemming van de gebruiker nodig. Een JavaScript-pagina mag dus niet stiekem een webcamera inschakelen, de omgeving observeren en de informatie naar de [NSA](https://en.wikipedia.org/wiki/National_Security_Agency) sturen.
- Verschillende tabbladen/vensters kennen elkaar over het algemeen niet. Soms wel, bijvoorbeeld wanneer het ene venster JavaScript gebruikt om het andere te openen. Maar zelfs in dit geval kan het zijn dat JavaScript van de ene pagina de andere pagina niet opent als ze van verschillende sites komen (van een ander domein, protocol of poort).

    Dit wordt de "Same Origin Policy" genoemd. Om daar omheen te werken, moet *beide pagina's* akkoord gaan met gegevensuitwisseling en een speciale JavaScript-code bevatten die dit afhandelt. We zullen dat in de tutorial behandelen.

    Deze beperking is, nogmaals, voor de veiligheid van de gebruiker. Een pagina van `http://anysite.com` die een gebruiker heeft geopend moet niet in staat zijn om een ander browsertabblad met de URL `http://gmail.com` te openen en van daaruit informatie te stelen.
- JavaScript kan eenvoudig over het net communiceren met de server waar de huidige pagina vandaan komt. Maar de mogelijkheid om gegevens van andere sites/domeinen te ontvangen is kreupel. Hoewel het mogelijk is, vereist het expliciete toestemming (uitgedrukt in HTTP-headers) van de andere kant. Ook dat is een veiligheidsbeperking.

![](limitations.svg)

Dergelijke limieten bestaan niet als JavaScript buiten de browser om wordt gebruikt, bijvoorbeeld op een server. Moderne browsers staan ook plugin/uitbreidingen toe die om uitgebreide rechten kunnen vragen.

## Wat maakt JavaScript uniek?

Er zijn minstens *drie* leuke dingen aan JavaScript:

```vergelijken
+ Volledige integratie met HTML/CSS.
+ Eenvoudige dingen worden eenvoudig gedaan.
+ Ondersteuning door alle grote browsers en standaard ingeschakeld.
```
JavaScript is de enige browsertechnologie die deze drie dingen combineert.

Dat is wat JavaScript uniek maakt. Daarom is het de meest gebruikte tool voor het maken van browserinterfaces.

Maar JavaScript maakt het ook mogelijk om servers, mobiele applicaties, etc. te maken.

## Talen "over" JavaScript

De syntaxis van JavaScript past niet bij iedereen. Verschillende mensen willen verschillende functies.

Dat is te verwachten, want projecten en eisen zijn voor iedereen verschillend.

Zo is er onlangs een overvloed aan nieuwe talen verschenen, die *getranspilleerd* (geconverteerd) zijn naar JavaScript voordat ze in de browser draaien.

Moderne tools maken de transpilatie zeer snel en transparant, waardoor ontwikkelaars eigenlijk in een andere taal kunnen coderen en deze "onder de motorkap" automatisch kunnen converteren.

Voorbeelden van dergelijke talen:

- [CoffeeScript](http://coffeescript.org/) is een "syntactisch suiker" voor JavaScript. Het introduceert een kortere syntaxis, waardoor we duidelijkere en nauwkeurigere code kunnen schrijven. Gewoonlijk vindt Ruby het leuk.
- [TypeScript](http://www.typescriptlang.org/) is geconcentreerd op het toevoegen van "strikte gegevenstypering" om de ontwikkeling en ondersteuning van complexe systemen te vereenvoudigen. Het is ontwikkeld door Microsoft.
- [Flow](http://flow.org/) voegt ook datatypering toe, maar dan op een andere manier. Ontwikkeld door Facebook.
- Dart](https://www.dartlang.org/) is een standalone taal die een eigen engine heeft die draait in niet-browseromgevingen (zoals mobiele apps), maar ook kan worden getransponeerd naar JavaScript. Ontwikkeld door Google.

Er zijn er meer. Natuurlijk, zelfs als we een van de getransporteerde talen gebruiken, moeten we ook JavaScript kennen om echt te begrijpen wat we doen.

## Samenvatting

- JavaScript werd in eerste instantie gecreëerd als een browser-taal, maar wordt nu ook in veel andere omgevingen gebruikt.
- Vandaag de dag heeft JavaScript een unieke positie als de meest gebruikte browsertaal met volledige integratie met HTML/CSS.
- Er zijn veel talen die naar JavaScript worden "getransporteerd" en die bepaalde functies bieden. Het is aan te raden om ze te bekijken, in ieder geval kort, na het beheersen van JavaScript.
