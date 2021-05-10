
# Software Guidebook

Aangezien het lezen van de code van de LaterLezer niet het hele verhaal verteld en de redenatie achter het design van LaterLezen niet in code te beschrijven is, is ervoor gekozen om een software guidebook te schrijven. Dit maakt het gemakkelijk voor de programmeurs die verder willen bouwen op de bestaande applicatie. In dit software guidebook staat dan ook beschreven hoe de LaterLezer applicatie in elkaar steekt. 

## Table of Contents
  * [Context](#context)
  * [Functioneel Overzicht](#functioneel-overzicht)
  * [Kwaliteitsattributen](#kwaliteitsattributen)
  * [Beperkingen](#beperkingen)
  * [Principes](#principes)
  * [Software-architectuur](#software-architectuur)
    + [API component view](#api-component-view)
    + [Extension view](#extension-view)
    + [Database view](#database-view)
    + [Web app component](#web-app-component)
    + [Web app user flow](#web-app-user-flow)
      - [Homepagina](#homepagina)
      - [Registratie](#registratie)
      - [Artikel opslaan](#artikel-opslaan)
      - [Dashboard](#dashboard)
      - [Artikel lezen en thema veranderen](#artikel-lezen-en-thema-veranderen)
      - [Artikel meta data bewerken](#artikel-meta-data-bewerken)
      - [Overzicht artikel zoeken](#overzicht-artikel-zoeken)
      - [Zoeken op tags](#zoeken-op-tags)
      - [Zoeken op verschillende meta data](#zoeken-op-verschillende-meta-data)
    + [LaterLezer app Deployment](#laterLezer-app-deployment)
  * [Code](#code)
    + [Webapplicatie](#webapplicatie)
      - [Navigatie binnen de applicatie](#navigatie-binnen-de-applicatie)
      - [Opslaan van data](#opslaan-van-data)
      - [Renderen van HTML](#renderen-van-html)
      - [Registratie](#registratie)
      - [Nested Tags](#nested-tags)
    + [Extensie](#extensie)
      - [Werking extensie](#werking-extensie)
      - [Server communicatie](#server-communicatie)
      - [Persistent login](#persistent-login)
  * [Infrastructuur-architectuur](#infrastructuur-architectuur)
  * [Deployment](#deployment)
      - [Back-end dependencies](#back-end-dependencies)
      - [Front-end dependencies](#front-end-dependencies)
      - [Extensie dependencies](#extensie-dependencies)
  * [Werking en ondersteuning](#werking-en-ondersteuning)
    + [Front-end webapplicatie](#front-end-webapplicatie)
    + [Back-end server](#back-end-server)
    + [Extensie](#extensie-1)


## Context

De opdrachtgever is als onderzoeker bij ons langsgekomen met de vraag of wij een reader-app voor hem willen ontwikkelen. De bestaande reader-apps voldoen niet aan de eisen die hij stelt. Hij denkt dat het waard is om een nieuwe reader-app te laten maken die wel aan zijn eisen voldoen. De eisen zijn beschreven in het hoofdstuk Functioneel Overzicht. Deze reader-app is bedoeld om hem en andere onderzoekers te ondersteunen met het opslaan van wetenschappelijke artikelen zodat zij deze later kunnen lezen.

Met deze reader-app hoopt de opdrachtgever dat deze app wel aan zijn eisen voldoet, en dat andere onderzoekers naar deze reader-app overstappen. Dit betekent dat de Laterlezer een concurrent wordt voor de andere reader-apps, zoals Instapaper, Raindrop, Pocket.io, etc. De opdrachtgever heeft als doel om een reader-app te ontwikkelen die meer gebruikersvriendelijk is voor lezers die frequent (wetenschappelijke) artikelen opslaan.

## Functioneel Overzicht

De Laterlezer app bestaat uit een mobiele webapplicatie waarin de gebruiker zijn artikelen op kan slaan en kan lezen. Daarnaast heeft de Laterlezer app ook een extensie, waarmee gebruikers artikelen snel op kan slaan terwijl deze gebruiker op een andere website aan het surfen is. Dit kan zonder gebruik te maken van de Laterlezer website en je gemakkelijk en spontaan een artikel kan opslaan.

De Laterlezer app slaat artikelen op die van andere websites zijn gehaald. Elk artikel heeft een URL waarvan de artikel vandaan komt, en optioneel een aantal tags om het artikel snel terug te vinden m.b.v. het filtersysteem voor tags. Bij het lezen van een artikel kan de gebruiker een aantal functies gebruiken om het lezen makkelijker te maken, bijvoorbeeld het groter maken van tekst, of het veranderen van de achtergrond kleur. Om een artikel bij een gebruiker op te slaan, moet deze natuurlijk ook kunnen registreren en inloggen. Na het inloggen heeft de gebruiker de optie om een artikel op te slaan en te koppelen aan zijn account.  

Zonder deze basisfunctionaliteit kan de applicatie niet werken. Het is van belang dat deze functies als eerst zijn uitgevoerd voordat we verder kunnen met de extra functies. De opdrachtgever heeft graag dat wij een aantal extra functionaliteiten implementeren zodat de app daadwerkelijk zijn eigen functies heeft. Deze functionaliteiten zijn als volgt:

- Pay-walls omzeilen
- Van hiërarchische tags gebruik maken
- Opslaan van PDF's
- Metadata ophalen
- Importeer data van andere reader-apps
- Ondersteuning grotere teksten

Voor meer verduidelijking over deze functionaliteiten wordt het Plan van Aanpak geraadpleegd. Welke functionaliteiten wij implementeren, hangt af van wat de opdrachtgever wilt en hoeveel tijd wij ervoor nodig hebben om dat te realiseren. 

Met deze extra functionaliteiten hopen wij onze doelgroep, de onderzoekers, tevreden zijn met onze reader-app, en hierdoor artikelen makkelijker kunnen opslaan en lezen vergeleken met de andere reader-apps.

## Kwaliteitsattributen
Natuurlijk zijn er tijdens de ontwikkeling van een app ook niet functionele eisen, deze worden ook wel de kwaliteitsattributen genoemd. Om te zorgen dat onze reader-app in de toekomst nog steeds onderhoudbaar blijft, moet de app voldoen aan een aantal kwaliteitsattributen. Deze attributen zijn als volgt:

- Prestatie: om de app te laten draaien moeten de servers van de app voortdurend online zijn. Hierdoor kunnen gebruikers altijd nieuwe artikelen opslaan en hun eigen artikelen ophalen. 

- Beveiliging: natuurlijk moeten de gegevens van de gebruiker beveiligd zijn opgeslagen in de database van de app. Daarom versleutelen we gegevens zoals de wachtwoorden, als er toch ooit iemand onbevoegd toegang krijgt tot de database, kunnen ze niet bij de daadwerkelijke wachtwoorden van onze gebruikers komen.

  Daarnaast willen wij ten alle koste inbraken zoals SQL Injectie voorkomen, dit doen we door middel van meerdere RegEx controles uitvoeren voordat de invoer verstuurd naar de server. Behalve de Front-end bevat de Back-end ook een aantal controles.

- Compatibiliteit: de LaterLezer app heeft uiteindelijk ook een web-extensie. 

- Gebruikersvriendelijkheid: om alle gebruikers tevreden te houden moet de app gebruikersvriendelijk zijn. Dit doen met een menu waarin je jouw voorkeur kan aangeven tijdens het lezen van een artikel. Denk hierbij aan de achtergrond kleur, het lettertype en lettergrootte. Daarnaast zullen de gebruikers een mogelijkheid hebben om een van de vaste thema's te kiezen die LaterLezen aanbied.
- Efficiëntie: natuurlijk wilt een gebruiker niet teveel tijd en moeite insteken tijdens het toevoegen van een artikel. Daarom houdt LaterLezen het erg compact en makkelijk. De gebruiker hoeft eenvoudig een URL van het artikel in te voeren en eventueel een of meerdere tags.

Aan de hand van deze kwaliteitsattributen hoopt de opdrachtgever een reader-app te kunnen ontwikkelen die uitstraalt vergeleken met de andere reader-apps

## Beperkingen

Tijdens het ontwikkelen van de app zijn er een aantal beperkingen, deze beperkingen worden hieronder genoemd:

- Het team heeft 3 sprints om aan Laterlezer te werken. (1 sprint is 2 weken)
- Het team bestaat uit 5 man.
- Ieder teamlid werkt tijdens het project ook aan zijn leerdoelen.
- Het team ontwikkelt de app d.m.v. Node, Express, MongoDB/Mongoose en React omdat het team daarmee de meeste kennis heeft.
- Het team maakt gebruik van onbekende technieken, zoals ontwikkeling van extensies 
- De server stuurt en ontvangt berichten van de client in de vorm van JSON

Een beperkingen hoeft niet altijd meteen negatief te zijn, kijk hierbij naar de grootte van ons team, met een klein groepje van 5 is het makkelijker om samen te werken en het overzicht van het gehele team te behouden. Ook is het hierdoor simpeler om gebruik te maken van elkaars sterke punten.


## Principes
Tijdens het bouwen van de LaterLezer app hebben we zoveel mogelijk gebruik gemaakt van het principe: "Don't Repeat Yourself" (DRY). We hebben in het project dubbele functionaliteit zoveel mogelijk proberen te voorkomen en gereduceerd door duidelijke functies op te stellen. Bij functionaliteit dat herhaaldelijke code bevat hebben we zoveel mogelijk proberen te reduceren door o.a. functies te schrijven die kortere notaties mogelijk maken. 

## Software-architectuur
Door het lezen van dit hoofdstuk krijg je een beter beeld van hoe de structuur van de software eruit ziet. Deze schetsen zijn gebaseerd op het C4 model.

1. The big picture (system context)

    Dit is het beginpunt van onze applicatie, hierbij wordt de interactie tussen de gebruiker en de reader-app weergeven.

    

    ![system_context_diagram.png](system_context_diagram.png)

    

2. Container view

    Dit is een verdiepende schets van wat er nou precies afspeelt wanneer de gebruiker een actie uitvoert.

    

    ![c4-modellen-Container.png](c4-modellen-Container.png)

    

3. Component views

    Hierna kunnen we vergroten tot de component view per container. Deze worden opgedeeld in de API component, app component en extension component.

    ### API component view
    ![API_component.png](API_component.png)

    De API zorgt voor de communicatie tussen de gebruiker en de database. Zodra de API een request ontvangt van de gebruiker, kijkt de API naar de relevante route die de request afhandelt. Dit hangt af van wat welke route de gebruiker aanroept en de type request die de gebruiker meegeeft. Op dit moment ondersteunt de API alleen GET, POST, PUT en DELETE requests naar de routes die behoren tot users en artikelen. De API zorgt ervoor dat de gebruiker waarvan de API call afkomstig is eerst geverifieerd wordt. Pas wanneer gebleken is dat dit een geldige gebruiker is, laat de API informatie los. De informatie die de API terug geeft, is alleen informatie van de gebruiker waarvan de call afkomstig is. Er is geen manier vor gebruikers om een API call te doen naar informatie van een andere gebruiker zonder ingelogd te zijn op het account van desbetreffende gebruiker.

    Een gebruiker bestaat uit de volgende velden:
    ```
    - email. Het mailadres van de gebruiker om elk gebruiker te identificeren
    - firstname. De voornaam van de gebruiker
    - lastname. De achternaam van de gebruiker
    - password. De wachtwoord die de gebruiker heeft ingesteld, gehashed met bCrypt. Dit is de sleutel van een account van elk gebruiker
    - createdAt. De datum waarin de gebruiker is aangemaakt
    - articles. Alle artikelen die door de gebruiker is opgeslagen
    - tags. Alle hoofd en sub tags die de gebruiker opslaat bij zijn artikelen
    - preferences. De thema die de gebruiker heeft geselecteerd om de artikel te lezen.
    ```

    Een artikel bestaat uit de volgende velden:
    ```
    - url. De link van een artikel waar de gebruiker het artikel vandaan heeft gehaald
    - title. De titel van een artikel
    - excerpt. Een korte beschrijving van een artikel
    - lead_image_url. De thumbnail die de artikel heeft gebruikt
    - content. De hele tekst van de artikel
    - author. De auteur die het artikel heeft geschreven
    - domain. De website waar de artikel vandaan komt
    - date_published. De datum wanneer het artikel is gepubliceerd
    - word_count. Het aantal woorden in de artikel. Telt de hele content mee.
    - tags. De gebruiker kan tags toewijzen aan een artikel om het artikel makkelijker terug te vinden. Ondersteunt hierarchisch structuur met parent tags en children tags.
     - tagids. Met tag ids zijn parent en sub tags uit elkaar te houden, dus als er 2 sub tags in verschillende parent tags zijn  die dezelfde naam hebben, dan zorgt de id ervoor dat beide subtags alsnog uniek zijn.
    - createdAt. De tijdstip waneer de auteur een artikel heeft opgeslagen
    ```

    

    ### Extension view
    ![extension_component_c4.png](extension_component_c4.png)

    De webextensie is het meest simpele component van dit project. Op het moment dat je de laterlezer extensie opent, komt er een login scherm tevoorschijn. Hierop is het de bedoeling dat de gebruiker inlogt, om de functionaliteit om een artikel op te slaan te gebruiken. Het login scherm laat ook foutmeldingen zien van een foute inlogpoging.

    Als de gebruiker succesvol is ingelogd komt het article component naar voren. Hierin kan de gebruiker een url invoeren van een artikel die hij/zij wilt opslaan. Daarnaast is er de mogelijkheid om eventueel de titel van het artikel te bepalen. Als deze niet wordt ingevuld, pakken we de titel die de article/mercury-parsers ons geeft. Ook is het mogelijk om tags toe te voegen aan de artikel.

    Om gebruik te maken van de database vanuit de applicatie, moet er gecommuniceerd worden met de API. De api is een programmeer interface waar je verzoeken aan kan maken. Bij de extensie zijn dit er echter maar 2. Het eerste verzoek is om de gebruiker in te loggen. Het login en de article component maken gebruik van een serverCommunication helper bestand. Hierin staan alle verzoeken die je kan doen aan de API vanuit de webextensie. Als het verzoek aan de API wordt gedaan om in te loggen, communiceert de API met de database. In de database wordt gecontroleerd of er een gebruiker bestaat met de credentials die megegeven staan. Als dit wel of niet zo is geeft de database dit terug aan de api, en de api terug aan het login component.

    Voor het opslaan van een artikel maken we ook gebruik van het serverCommunication helper bestand. Hierin staat de route die nodig is om een verzoek te doen aan de API om een artikel toe te voegen aan de database. Dit verzoek gaat aan de hand van de velden die meegegeven zijn wel of niet goed. Als deze wel goed gaat dan wordt de artikel in de database opgeslagen. Zo niet, dan krijgt de user een notificatie dat er wat mis ging.

    ### Database view
    ![database.png](database.png)

    ### Web app component
    ![c4-modellen-Web_App-component.png](c4-modellen-Web_App-component.png)

    De App bevat bijna alle componenten in de webapplicatie. De app laadt componenten in op basis van waar de gebruiker zich plaatsvindt in de website. Alle componenten die requests naar de API uitvoert, maakt gebruik van Servercommunication, een aparte bestand in de webapplicatie die niet afhankelijk is van App. Servercommunication bevat alle fetch requests die de componenten nodig hebben om met de API te communiceren. Een component haalt de data via de API als volgt op: Eerst roept de component een functie binnen Servercommunication aan om een fetch request te sturen. De request hangt uiteraard af vanuit welk component, en kan bestaan uit een GET, POST, PUT of een DELETE request. Na het aanroepen van deze functie, communiceert de webapplicatie met de API om de request af te handelen. Zodra de API de request heeft afgehandeld, stuurt de API een bericht terug naar de functie binnen Servercommunication waar de request vandaan komt. De component die de fetch functie aanroept, handelt het bericht van de API af. Wat er na het ontvangen van dat bericht gebeurt, hangt af van hoe dat in een component geimplementeerd is.

    ### Web app - user flow
    ![c4-modellen-Web_App-user_flow.png](c4-modellen-Web_App-user_flow.png)

    #### **Homepagina**
    De gebruiker komt voor het eerst op de homepagina van de website. De gebruiker kan ervoor kiezen om te registreren, waarin hij in de registratiepagina komt, of om in te loggen. De gebruiker komt dan op de pagina waarin hij kan inloggen. 

    #### **Registratie**
    De gebruiker zal als eerst registreren op de website, omdat de gebruiker geen account heeft. Nadat de gebruiker de registratieformulier heeft ingevuld, stuurt het registersysteem een functie aan van servercommunication. Servercommunication voert dan de functie aan die het registersysteem aanroept, en doet een fetch request naar de API toe. Voor het registersysteem is het een POST request naar de user route in de API. De API handelt het verzoek in de relevante route af. Eerst controleert de API of de email formaat correct is en of de wachtwoord lang genoeg is. Daarna voegt de API na het hashen van de wachtwoord de gebruiker in de database toe. De API stuurt een bericht terug naar de web applicatie. Het registersysteem vangt dit keer het bericht op, en verstuurt de gebruiker naar de dashboard.

    #### **Artikel opslaan**    
    Als de gebruiker een artikel wilt opslaan kan er naar de Save Web Article component genavigeerd worden, op deze pagina kan de gebruiker een eenvoudig een artikel toevoegen doormiddel van een kloppende URL te geven (deze wordt op de Front-end gecontroleerd door ReGex), een eventuele titel en de hiermee desbetreffende tags. Deze tags worden op een hiërarchische structuur opgeslagen. Dit houdt in dat er meerdere tags met sub-tags opgeslagen kunnen worden. Wanneer de gebruiker op de 'Save Article' knop klikt wordt de ingevulde data doorgegeven naar de Servercommunication, deze maakt dan een POST request naar de API. Onze API zorgt er dan voor dat het artikel correct in de Article database terechtkomt met de juiste URL, eventuele titel, tags, inhoud van de pagina, auteur, en andere kleine handigheden. Deze data wordt opgeleverd door onze twee gebruikte npm packages, article-parser & mercury-parser. Eerst maakte wij alleen gebruik van article-parser, maar later zijn wij tot de conclusie gekomen dat mercury=parser meer betrouwbaarder is. Echter maken wij nog wel gebruik van de article-parser om de description van een artikel te pakken, deze parser doet het ophalen van beschrijvingen soepeler, doordat het (meestal) echt alleen de belangrijke punten ophaald. Behalve bij de Article database wordt er ook bij de User database opgeslagen welke artikelen bij de gebruiker hoort en ook wordt er toegevoegd welke tags de gebruiker heeft gebruikt. Nadat het artikel succesvol is opgeslagen krijg de gebruiker een kleine 'toast' melding te zien en kan de gebruiker nu zijn artikel terug vinden op het Dashboard.

    #### **Dashboard**
    Nu kan de gebruiker kiezen om terug te gaan naar de dashboard, om een artikel te zoeken, of om nog een artikel op te slaan door het hierboven beschreven proces opnieuw te herhalen. Als de gebruiker de opgeslagen artikel wilt lezen, navigeert de gebruiker terug naar de dashboard. De dashboard laat nu de opgeslagen artikel zien. De gebruiker kan de artikel lezen door op de titel, afbeelding of de "Read article" knop aan te klikken. 
    
    #### **Artikel lezen en thema veranderen**
    De gebruiker komt nu bij de Display article component. Daarin kan de gebruiker de gekozen artikel doorlezen. Als eerst roept display article de functie via servercommunication aan om de huidige geselecteerde thema op te halen. Bij een nieuw gebruiker is de thema altijd 'White'. De display article component zet na het ophalen van de kleur de thema in. De gebruiker kan in de component een nieuw thema selecteren. Als een gebruiker een thema selecteert, dan kan de gebruiker de geselecteerde thema bekijken. De gebruiker kan ervoor kiezen om de thema op te slaan, een ander thema te selecteren, of het kiezen van een thema te annuleren. Bij het selecteren van een thema doet de display article component nog geen verzoek naar de API. Op het moment dat de gebruiker niet zijn thema wilt wijzigen door op annuleren te klikken, of buiten de themaopties menu te klikken, doet de display article component nog een request naar de API om de huidige opgeslagen kleur op te halen, en deze opnieuw in te stellen aan de component. Als de gebruiker een nieuw thema selecteert en opslaat door op opslaan te klikken, dan roept de display article component een functie in servercommunication aan, die vervolgens de fetch request naar de API doet om de nieuwe kleur te zetten. Zodra de API een bericht terug stuurt naar de display article component, stelt dit component het nieuwe thema in, zodat de gebruiker een nieuwe thema krijgt om de artikel te lezen.

    Naast het instellen van de thema kan de gebruiker ook naar de pagina van de originele artikel navigeren waar de gebruiker de artikel vandaan heeft gehaald. Er is op dat moment naast de vorige knop in de browser of het handmatig invoeren van de website URL geen manier om terug te gaan naar de display artikel component.

   #### **Artikel meta data bewerken**
   Bij het component: Display article kan de gebruiker de meta data van een artikel bewerken. Op deze manier kan een gebruiker een artikel lezen en meta data velden aanpassen. Onderaan de pagina staat een button met een pen icoontje. Op het moment dat er op die button geklikt wordt, staat het artikel in "bewerk modus". Het artikel kan in deze modus nog steeds gelezen worden, maar de meta data bovenaan de pagina zijn dan input velden geworden. In het geval dat de bewerk modus actief is, verschijnen er twee buttons onderaan de pagina, namelijk: Opslaan en Annuleren. In de bewerk modus kunnen de volgende velden aangepast worden: Titel, Auteur, Bron en Descriptie. Verder kan er in de bewerk modus de huidige tags aangepast worden. Er kunnen extra tags toegevoegd worden aan het artikel en tags verwijderd worden. Aanpassingen kunnen ongedaan gemaakt worden in het geval deze nog niet opgeslagen zijn. Aanpassingen kunnen ook opgeslagen worden door op de button onderaan de pagina te klikken. De volgende velden kunnen leeg gelaten worden bij het bewerken: Auteur, Bron, Descriptie en Tags. De titel van een artikel kan niet leeg gelaten worden, en zal een foutmelding geven aan de gebruiker in het geval dit toch gebeurt. 

    #### **Overzicht artikel zoeken**
   De gebruiker kan na het lezen van de artikel ervoor kiezen om terug naar de dashboard te gaan, een nieuw artikel op te slaan, of het zoeken van opgeslagen artikelen. Als de gebruiker zijn artikelen wilt zoeken, navigeert de gebruiker naar het Search article component. In het Search article component heeft de gebruiker de optie om opgeslagen artikelen op tags te zoeken. Daarnaast heeft de gebruiker de optie om op verschillende meta data te zoeken namelijk: titel, auteur,descriptie,bron en content. 
   
    #### **Zoeken op tags**
   Wanneer de gebruiker artikelen wilt filteren op basis van tags, kan hij naar de Search Article component gaan. Hierbij worden alle gebruikte tags van de user op een hiërarchische structuur opgehaald en weergeven. De gebruiker kan eerst een hoofd-tag selecteren, daarna worden de sub-tags van deze aangeklikte hoofd-tag weergeven. Hieruit kan de gebruiker weer een keuze maken. Wanneer de gebruiker zijn gewenste tags heeft geselecteerd kan diegene op de 'Search' knop klikken en wordt er een functie aangeroepen naar de Servercommunication die de geselecteerde tags mee krijgt en omzet in een String Array. Met de meegegeven tags wordt er een fetch request gemaakt en geeft de API alle artikelen terug die aan de geselecteerde tags voldoen. Deze artikelen worden dan overzichtelijk in een lijst weergeven op de pagina. Wanneer de gebruiker niet tevreden is met de geselecteerde tags kan er op de 'Clear tags' knop worden geklikt, deze verwijderd alle geselecteerde tags uit de states.

   
   #### **Zoeken op verschillende meta data**
   Als de gebruiker ervoor kiest om een artikel te zoeken op basis van: auteursnaam,titel,descriptie of bron, dan haalt het search article component alle artikelen op die voldoen aan de ingegeven zoekterm. Er is ook een optie om te zoeken op basis van content door te klikken op de checkbox: "Enable search by content". Als dit aangevinkt wordt is het mogelijk om te zoeken op teksten uit het artikel. De API ondersteunt ook de mogelijkheid om op een gedeelte van de auteursnaam,titel,descriptie, bron te zoeken. Na het invullen van de gewenste zoekterm, zoekt de API op artikelen die voldoen aan de gegeven zoekterm. De search article component roept de functie in Servercommunication aan, die vervolgens een fetch request naar de API doet om de juiste artikelen op te halen. Na het verzoek van de search article component, krijgt dit component de relevante artikelen terug van de API. De resultaten worden overzichtelijk getoond in een lijstweergave met kaarten.

    ### LaterLezer app Deployment
    ![c4-modellen-Deployment.png](c4-modellen-Deployment.png)

    De webapplicatie en de API worden op dit moment op de servers gedraaid van de huidige ontwikkelaars van Laterlezer. Door de webapplicatie aan te zetten krijgt de gebruiker toegang op de website van Laterlezer. De webapplicatie hoeft niet aan te staan om gebruik te maken van de Laterlezer extensie. De gebruiker kan via de website requests naar de API te sturen via de website, bijvoorbeeld door in te loggen, een nieuw account te registreren, artikelen op te halen, artikelen op te zoeken etc. De extensie kan alleen een API call doen om in te loggen, of om een artikel op te slaan. Afhankelijk van de type request stuurt de API een mongoose query naar de database toe. De database zit niet in de lokale omgeving van de ontwikkelaars. Het is een cloud database van mongoDB die in Noord Virginia in de Verenigde Staten plaatsvindt. De database voert de query uit, en stuurt de resultaat daarvan weer terug naar de API. De API stuurt vervolgens de resultaat of een bericht naar de App of naar de extensie toe. Wat de App en de extensie met dat bericht doet, is terug te vinden in de hoofdstukken [Web app component](#Web-app-component) en [Extension view](#Extension-view)


## Code
### Webapplicatie
#### Navigatie binnen de applicatie

Al onze functionaliteit hebben wij opgedeeld in meerdere functionele componenten. 
We maken in de applicatie gebruik van `React Router` en `Link` om de navigeren tussen de verschillende componenten.

Verder maken we bij een aantal componenten gebruik van `useHistory`. Een voorbeeld hiervan is bij het component: "Register". Hierbij wordt er gebruik gemaakt van `useHistory`  om te verwijzen naar het "Dasboard" component als er succesvol een account is aangemaakt. 

#### Opslaan van data

Wij maken niet gebruik van Redux. Daarom geven wij de state door aan elk component de huidige state door. 
Data dat tijdelijk opgeslagen moet worden, wordt opgeslagen door middel van `React Hooks` en `useState`. Een voorbeeld hiervan is op de displayArticle pagina. Hierbij wordt d.m.v. `useState`  opgeslagen of het artikel in de aanpas modus staat of niet.
Alle data dat opgeslagen moet worden naar de server verloopt via het bestand: 'serverCommunication.js'. Hierin staan alle functies die gebruikt kunnen worden in andere componenten om specifieke data op te slaan.

#### Renderen van HTML

Alle componenten behalve "App.jsx" in de webapplicatie zijn 'functional components'. Bij veel componenten wordt er gebruik gemaakt van `useEffect`. Hiermee kan informatie gerenderd worden op het moment dat de pagina geopend wordt. Een voorbeeld hiervan is op het Dashboard. Als een gebruiker ingelogd is, wordt er d.m.v. `useEffect` alle opgeslagen artikelen van een gebruiker ingeladen, nadat het verzoek naar de server is afgerond.

Verder wordt er bij een aantal componenten gebruik gemaakt van 'Conditional Rendering'. Dit wordt o.a. gebruikt bij het component: 'App'. Door het gebruik van 'Conditional Rendering' wordt er voor gezorgd dat componenten waar ingelogd voor moet zijn niet getoond worden als de gebruiker nog niet ingelogd is. Dit wordt ook gebruikt bij de 'displayArticle' pagina. Daarbij wordt 'Conditional Rendering' gebruikt om het artikel dat gelezen wordt om te zetten naar een bewerk pagina. Bepaalde data wordt daarbij omgezet naar input velden.

#### Registratie

Bij het component: "Register" zijn er een aantal velden die gecontroleerd worden of deze valide zijn. Bij het wachtwoord wordt er gecontroleerd of het minimaal zeven karakters bevat. Dit wordt gedaan door een if-statement. Verder wordt er gecontroleerd of er een geldig mailadres is ingevoerd aan de hand van het verzoek dat binnen komt van de server.

#### Nested Tags

In de webapplicatie worden nested tags op meerdere plekken gebruikt. Nested tags worden namelijk getoond bij de opgeslagen artikelen, maar ook bij de gebruiker zelf. Tijdens het opslaan van een artikel is er de mogelijkheid om tags toe te voegen met oneindige sub-tags. Deze ingevulgde tags worden in een array van Strings met meerdere `[String]` meegegeven. 

Dit is een voorbeeld van hoe deze Nested Tags meegestuurd worden naar de serverCommunication, en daarna naar de betreffende Back-End route:

```js
import { saveArticle } from "../serverCommunication"; //importeer de API functie

let tags = [										  //de [String] met [String] van tags
    ['TagA', 'SubTagA', 'SubSubTagA'], 
    ['TagB', 'SubTagB', 'SubSubTagB'], 
    ['TagC', 'SubTagC', 'SubSubTagC']
]

function handleSaveArticle(tags) {		  			  //handler die saveArticle zal runnen
	saveArticle(tags)
}
```

Vanuit het `user.js` bestand wordt dit allemaal geregeld in de `handleUserNestedTags` functie . Deze functie bevat een recursieve functie die de sub-tags aan de hoofd-tag plakt en daarna deze functie opnieuw uitvoert totdat er geen sub-tags meer zijn om toe te voegen. In het geval dat er wel nog toe te voegen sub-tags zijn, zullen deze als parameter weer meegegeven worden aan de functie. Vandaar dat deze functie `recursive` is oftewel, een zelf herhalende functie. Alle toegevoegde tags noemen wij een `node`, deze nodes bevatten de `tagName`, `parent`, `index`, `_id` en`subTags`. 

Hier een kleine beschrijving van de node elementen:

- tagName: Dit is de naam van de tag.
- parent: Dit is de naam van de parent tag, hierdoor weet de `node` waarin de `tree` hij zich bevindt. Wanneer een tag een hoofd-tag is bevat het de parent: '/'.
- index: Dit is een int waarde die de index van de `node` bepaald.
- _id: Dit is een unieke en automatische gegenereerde `String` , deze komt in de front-end van pas om de juiste tag te pakken.
- subTags: Dit is een array van Strings met alle sub-tags die ook dezelfde elementen bevatten als de hoofd-tag.

Naast dat de Nested Tags in de `saveArticle.js` component voorkomen, komen ze ook terug in de `searchArticle.js` component. Hier kan de gebruiker zoeken op gebruikte tags van de gebruiker. Deze tags worden eerst opgehaald doormiddel van een `useEffect`, daarin zullen de opgehaalde tags gezet worden in een `useState` om uiteindelijk in gemapped te worden met checkboxes. 

Omdat wij niet meteen alle tags willen zien, maar het daadwerkelijk via lagen willen aantonen, hebben wij een `printTree` functie geschreven. Deze functie neemt als parameter de hele boom op en de huidige `treeNode` (de tag waarop geklikt wordt), en returned de `subTags` van de betreffende `treeNode`. 

### Extensie

#### Werking extensie

De extensie draait op poort: 3001, voor het geval er twee end to end tests tegelijkertijd gedraaid moeten worden. De extensie werkt met React.
Bij het maken van de extensie was het o.a. nodig om een: manifest.json bestand aan te maken. Hierin wordt o.a. beschreven wat de naam en beschrijving is van de extensie. Verder wordt hierin gedefinieerd welke pagina geopend wordt als de extensie aangeklikt wordt.

#### Server communicatie

Alle communicatie met de server wordt regeld door het bestand: 'serverCommunication.js'. Hierin staan functies die aangeroepen kunnen worden door andere componenten. Er is voor gezorgd dat routes met vergelijkbare functies in de webapplicatie hergebruikt worden in de extensie.

#### Persistent login

In het manifest wordt er ook gebruik gemaakt van “permissions”. Hierdoor was het mogelijk dat de gebruiker ingelogd blijft in de extensie, zelfs nadat de extensie wordt afgesloten of weg geklikt. We hebben hiervoor de volgende code regel toegepast: `http://*/*` 
Hiermee kunnen aanvragen aangeroepen worden die pas ontdekt worden als de extensie al draait. Verder wordt er net zoals in de webapplicatie gebruik gemaakt van sessions en cookies om de gebruiker te identificeren. 


## Infrastructuur-architectuur
Op dit moment draait het Laterlezer project alleen in de lokale pc van de teamleden. Laterlezer gebruikt op dit moment de [online Mongo database](https://www.mongodb.com/) om alle gegevens op te slaan. Zo werken alle teamleden met hetzelfde gegevens. Dit helpt voornamelijk met debuggen. Na het overdragen van Laterlezer kan de opdrachtgever ervoor kiezen om de Mongo database te draaien op een lokale server.

Elk gebruiker kan met elk apparaat verbinding met de Laterlezer API maken zolang er internet verbinding beschikbaar is die het verzenden en ontvangen van JSON berichten ondersteund. Alle requests van de gebruikers gaan via HTTP requests naar de API. De API handelt alle data die bij de gebruiker hoort zolang de gebruiker erom vraagt.

![infrastructure-diagram.png](infrastructure-diagram.png)

## Deployment
Om LaterLezen te kunnen draaien in een testomgeving zijn er een aantal dingen nodig. Zo moet er een database draaien op Atlas Mongo. Hier kan je een gratis test database online laten draaien. Verder moet de frontend op port 3000 gedraaid worden en de backend op port 4000. De extensie moet gebuild worden en vervolgens in de development extensies van chrome geladen worden.

#### Back-end dependencies

Voor de back-end zijn er een aantal dependencies nodig om de applicatie succesvol te kunnen draaien en testen uit te voeren.

[Verwijzing back-end dependencies](https://github.com/HANICA-DWA/sep2020-project-pardellos/blob/main/LaterLezen/Back-end/package.json)

#### Front-end dependencies

Voor de front-end zijn er een aantal dependencies nodig om de applicatie succesvol te kunnen draaien en testen uit te voeren.

[Verwijzing front-end dependencies](https://github.com/HANICA-DWA/sep2020-project-pardellos/blob/main/LaterLezen/Front-end/package.json)

#### Extensie dependencies

Voor de extensie zijn er een aantal dependencies nodig om de applicatie succesvol te kunnen draaien en testen uit te voeren.

[Extensie dependencies](https://github.com/HANICA-DWA/sep2020-project-pardellos/blob/main/LaterLezen/laterlezer-extension/package.json)


## Werking en ondersteuning
Om alle onderdelen van Laterlezer te installeren, heeft Laterlezer de volgende vereisten:
- Git, om het project binnen te halen
- Node of Yarn, om alle onderdelen van de applicatie te installeren. In dit onderdeel beschrijven we alleen de npm versie.

Om dit project op te halen, navigeer naar de map waarin het project wordt opgeslagen.

Open vervolgens de terminal en voer uit:
```git
git clone https://github.com/HANICA-DWA/sep2020-project-pardellos.git
```

Zodra het project is opgehaald, is het mogelijk om de onderdelen van Laterlezer te installeren.

### Front-end webapplicatie
Vereisten:
- React

Navigeer naar
```
sep2020-project-pardellos \ LaterLezen \ Front-end
```

Open de terminal en voer de installatie uit door het volgende in te voeren:
```node
npm install
```
Voer na de installatie het volgende uit:
```node
npm start
```

De webapplicatie draait nu en de gebruiker kan op de website door naar http://localhost:3000/ te gaan. De webapplicatie kan data opvragen van de server zolang de server draait. Na elke wijziging ververst de webapplicatie zichzelf, waardoor alle wijzigingen meteen zichtbaar zijn.

### Back-end server

Vereisten:
- Express
- MongoDB 

Navigeer naar
```
sep2020-project-pardellos \ LaterLezen \ Back-end
```

Open de terminal en voer de installatie uit door het volgende in te voeren:
```node
npm install
```

Voer na de installatie het volgende uit:
```node
npm run dev
```

De server staat nu aan. De server draait op poort 4000. De server accepteert requests van de webapplicatie zolang de server de request ondersteund, en de verbinding naar de mongo database correct is meegegeven. Stel de database connectie in de MONGO_URI in binnen het config.env bestand, te vinden in:
```
Back-end \ config \ config.env
```

Na elke wijziging ververst de server zichzelf, waardoor alle wijzigingen meteen zichtbaar zijn. 


### Extensie

Vereisten:
- React
- Google chrome

Navigeer naar
```
sep2020-project-pardellos \ LaterLezen \ laterlezer-extension
```

Open de terminal en voer de installatie uit door het volgende in te voeren:
```node
npm install
```

Voer na de installatie het volgende uit:
```node
npm run build
```

Na het uitvoeren van dit commando komt de map build in het project.
Open nu de chrome browser en navigeer naar de extensies menu
![chrome-extension-install-1.png](chrome-extension-install-1.png)
Zet ontwikkelaarsmodus aan
![chrome-extension-install-2.png](chrome-extension-install-2.png)
Klik op uitgepakte extensie laden
![chrome-extension-install-3.png](chrome-extension-install-3.png)

Navigeer naar de map waarin de extensie is geinstalleerd, Selecteer de build map en klik op open
![chrome-extension-install-4.png](chrome-extension-install-4.png)

De extensie is nu toegevoegd aan de browser. De extensie kan nu artikelen van externe websites toevoegen. Om een artikel toe te voegen via de extensie, moet de gebruiker een bestaande Laterlezer account hebben. Dit is aan te maken via de website van Laterlezer.

Het is ook mogelijk om de extensie apart op te starten met:
```node
npm start
```

Dit kan handig zijn als een ontwikkelaar wijzigingen wilt aanbrengen aan de extensie zonder elke keer de extensie opnieuw op te bouwen. Het is uiteraard niet mogelijk om extensie specifieke code te testen op deze manier, zoals het ophalen van de huidige URL in een bepaalde tabblad.
