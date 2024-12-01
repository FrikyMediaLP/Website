import { Component, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PROJECT, ProjectComponent } from 'src/app/components/project/project.component';
import { LangService } from 'src/app/services/lang.service';

interface LANGOPTIONS {
  [key: string]: string
}

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
    standalone: false
})
export class ProjectsComponent {
  @ViewChild('header') header: ElementRef;
  @ViewChild('imageEnlargeWrapper') imageEnlargerWrapper: ElementRef;

  projects: Array<PROJECT> = [
    { name: { '*': 'Website' }, hash: 'website', status: 100, start: 'Feb 2023', end: 'ETA JUL 2023', active: true, details: [
      { title: { 'de': 'Überblick',  'en': 'Overview' }, p: [
        { 
          'de': 'Meine Website ist das erste Angular und Typescript Projekt, das ich auf die Beine gestellt habe. Primär richtet sich hier alles an Leute, die mich noch nicht kennen und bietet daher einige Möglichkeiten mich weiter kennenzulernen.',
          'en': 'My Website is the first Project that uses Angular and Typescript. My Website is primarily directed to new people who dont know me yet - with plenty of oportunities to get to know me further.'
        }
      ]},
      { title: { 'de': 'Technik',  'en': 'Technical Details' }, p: [
        { 
          'de': 'Framework: Angular (mein erstes Angular / Typescript Projekt).',
          'en': 'Framework: Angular (my first Angular / Typescript project).'
        },
        { 
          'de': 'Hosting: gemieteter Linux Server von DigitalOcean mit NGINX als reverse Proxy.',
          'en': 'Hosting: rented Linux Server on DigitalOcean with NGINX as a reverse Proxy.'
        },
        { 
          'de': 'Database: Mein eigenes Datenbank-Management-System "FrikyDB" ebenfalls local auf dem DigitalOcean Server gehostet.',
          'en': 'Database: My own custom Datenbank-Management-System "FrikyDB" also locally hosted on the DigitalOcean Server.'
        },
        { 
          'de': 'Authentication Service: Nutzt die Twitch API / OAuth2 Flow mit JWT / JWK Token verification.',
          'en': 'Authentication Service: Using the Twitch API / OAuth2 Flow with JWT / JWK Token verification.'
        }
      ]},
      { title: { '*': 'GitHub Repositories / Download Code' }, p: [
        {
          '*': '<a href="https://github.com/FrikyMediaLP/Website">GitHub Repository</a>'
        }
      ] }
    ] },
    { name: { '*': 'FrikyBot'}, hash: 'frikybot', status: 80, start: '2019', end: 'TBD', active: true, details: [
      { title: { 'de': 'Überblick',  'en': 'Overview' }, image: 'right', image_url: './../../assets/projects/frikybot/Logo01_3.webp', image_width: '10rem', image_alt: { '*': 'FrikyBot Logo' }, p: [
        { 
          'de': 'FrikyBot ist ein Twitch Chat Bot und Webinterface, das Streamer Tools, Chat Commands, Alerts und vieles mehr bereitstellt. Verbundend mit der Twitch Helix API, WebHooks und IRC erlaubt es volle (oder limitierte) automatisierung von Twitch Features, wie Titel, Nachrichten oder Reaktionen auf Abonnements.', 
          'en': 'FrikyBot is a Twitch Chat Bot and Webinterace managing Broadcaster Features, providing Chat Commands, Alert Overlays and much much more. Connecting to the Twitch Helix API, WebHooks and IRC allows full (or partial) automation over Twitch Services, like chaning titles, posting messages or reacting to subscriptions.'
        },
        { 
          'de': 'Ein mächtiges Webinterface, das ohne Framework gebaut wurde, ermööglicht Multi-User-Authorization, Einrichten optionaler Feature Packages und große Anpassbarkeit für jeden Nutzer.', 
          'en': 'A powerfull Webinterface, built without any framework, allows multi user authorization levels, setup of optional feature packages and customization as much as possible.'
        },
        { 
          'de': 'Hier gehts zum <a href="https://frikybot.de/" target="_blank">FrikyBot WebInterface</a>.', 
          'en': 'Check out the FrikyBot WebInterface <a href="https://frikybot.de/" target="_blank">here</a>.'
        }
      ] },
      { title: { '*': 'Webserver' }, image: 'left', image_url: './../../assets/projects/frikybot/index.PNG', image_alt: { '*': 'FrikyBot Homepage' }, p: [
        { 
          'de': 'Das FrikyBot Webinterface basiert auf einem Node.js x Express.js Websocket - ohne weitere Frontend Framworks oder Precompiler. Authentication / Authorization wurden komplett neu gebaut - oder nutzen den Twitch Login flow.', 
          'en': 'The FrikyBot Webinterface is hosted on Node.js with the Express.js Websocket - using no further Frontend Frameworks or Precompilers. Authentication / Authorization Services are custom built - or use the Twitch Login flow.'
        },
        { 
          'de': 'TCP Verbindungen erlauben echtzeit Datentransfer zwischen dem Webuser und dem Backend. Aktuell wird dies nur für Chat Event-Updates genutzt, aber in der Zukunft will ich irgendwann das aktuell File Hosting ersetzen und darüber einen Server-Side-Rendererlaufen lassen - der Workflow der aktuellen Webseiten ist bereits darauf ausgelegt.', 
          'en': 'TCP connections allow realtime datatransfer between the WebUser and the Backend. Currently only used for Event-Updates, but someday I want to tranform the current static File Hosting into a Server-Side-Renderer - the current worksflows to create a WebPage are already setup for this.'
        },
        { 
          'de': 'API und File Hosting sind dynamisch, ändern sich basierend auf Authorization und Backend Zuständen. Obendrauf nutzt FrikyBot ein dynamisches Feature Package System - all das macht die FrikyBot API äußerst flexibale und Anpassungsfähig.', 
          'en': 'API and File Hosting are dynamic, change based on authorization and Backend State. On top, FrikyBot used dynamicly addable Feature Packages - all of this makes the FrikyBot API very fluid and customizable.'
        }
      ] },
      { title: { 'de': 'Module', 'en': 'Modules' }, image: 'right', image_url: './../../assets/projects/frikybot/Setup.PNG', image_alt: { '*': 'FrikyBot Setup Page' }, p: [
        { 
          'de': 'Grundlegende Funktionen wie der Webserver, die Twitch IRC oder der IRC sind in Module gebunden. Diese Module sind für alle zusätzlichen Feature Packete verfügbar. Module agieren hier als eine Art Interface zum im Hintergrund laufenden Backend und liefern Methoden mit dessen Service zu interagieren.', 
          'en': 'Core Functionality like the Webserver, the Twitch API or IRC are placed into Modules. These Modules are available to all Feature Packages added later. Modules act like Interfaces hiding most of the backend stuff and just presenting how to use the Service.'
        },
        { 
          'de': 'Module können auch eigene Authentication Methoden, APIs oder Files bereitstellen. Nur das WebApp Modul ist zwingend benötigt - jedes ander Module kann einfach hinzugefügt oder weggelassen werden, das das Featureset des Bots erweiter / limitiert.', 
          'en': 'Modules can also provide their own Authentication Features, create custom APIs and FileRoutes. Only the WebApp Module is truly requiered - any other Module can just be added or removed, limiting or expanding the Bots Featureset.'
        }
      ] },
      { title: { 'de': 'Packete', 'en': 'Packages' }, images: [ { url: './../../assets/projects/frikybot/Alerts1.PNG', alt: { '*': 'FrikyBot Alerts' } }, { url: './../../assets/projects/frikybot/Alerts2.PNG', alt: { '*': 'FrikyBot Alerts' } }, { url: './../../assets/projects/frikybot/Commands.PNG', alt: { '*': 'FrikyBot Commands' } }, { url: './../../assets/projects/frikybot/changelog1.PNG', alt: { '*': 'FrikyBot Changelog' } }, { url: './../../assets/projects/frikybot/Stats4.PNG', alt: { '*': 'FrikyBot Stats' } }, { url: './../../assets/projects/frikybot/Stats5.PNG', alt: { '*': 'FrikyBot Stats' } }, { url: './../../assets/projects/frikybot/Stats7.PNG', alt: { '*': 'FrikyBot Stats' } }, { url: './../../assets/projects/frikybot/Stats.PNG', alt: { '*': 'FrikyBot Stats' } }, { url: './../../assets/projects/frikybot/Stats8.PNG', alt: { '*': 'FrikyBot Stats' } } ], p: [
        { 
          'de': 'Feature Packete nutzen Daten und Services von Modulen, um eigene Tools und Erlebnisse zu bauen. Wie Module arbeiten Packete primär unabhänig voneinander - ABER Packete können auch Funktinen für andere Packete bereitstellen oder Anfordern. So stellt bswp. das "Commands" Packet einen Service bereit, der es anderen Packeten erlaubt Commands zu erstellen und mithilfe deren Daten / Services automatisch Nachrichten zu senden - KEIN "regulärer" Bot hat sowas!', 
          'en': 'Feature Packages use data / services from Core Modules to create their own Tools and Experiences. Like Modules, Packages are very independend and controll mainly their own state - BUT can communicate with other Packages to share data and services. For example, the "Commands" Package provides ways for other Packages to trigger / post Commands with their data or services - NO "regular" Bot has this!'
        },
        { 
          'de': 'Funktionen wie "Alerts", "Commands" oder "Chat Moderation" werden häufig von Chats genutzt - aber nie auf einer gemeinsamen Plattform. Nimmt man dazu noch Stream Stats oder Chat Games wird die Menge deer benötigten Tools immer größer mitdem Streamer arbeiten müssen - all diese Funktionen gibt es jetzt gemeinsam bei FrikyBot nativ durch das Package System.', 
          'en': 'Features like "Alerts", "Commands" or "ChatModeration" are ususally common among Streamers - but still never exist on just one single plattform. Adding Stats to your Stream or Chat Games even increasing the amount of seperate tools the streamer has to deal with - all of these are available in FrikyBot nativly using the Package-System.'
        },
        { 
          'de': 'Streamer, die Ankündigungen machen oder für mich als Entwickler, der Updates, Dokumentationen und Changelogs teilen muss, nutzen eigene Plattformen / Tools um ihre individuellen Nachrichten zu verbreiten. FrikyBot Packete können hier ebenfalls helfen! Da FrikyBot selbst ein großes Javascript Framework ist, kann man auch Packete erstellen, die nicht zwingend etwas mit Modulen zu tun haben und nur eigene Daten hosten. So nutze ich bswp. ein News / Changelog Packet, um Updates dieses Projekts to verkünden.', 
          'en': 'Broadcasters having to make Announcements or me as a Developer having to host and share News, Documentation and Changelogs is a lot of work. Packages are not simply Streaming focused! At the end, FrikyBot itself is a big Javascript Framework allowing ANY Feature Package to be added und used. I currently have a "News x Changelogs" Package running on my Instance to share how the Bot is evolving - soon also a Forum Package, or a Feedback Package, and so on and so on.'
        }
      ] },
      { title: { 'de': 'Besonderheiten / Probleme / Herrausforderungen', 'en': 'Special Challenges / Problems' }, image: 'left', image_url: './../../assets/projects/frikybot/changelog2.PNG', image_alt: { '*': 'FrikyBot Changelog' }, p: [
        { 
          'de': 'Ein großes Projekt ohne ein Framework oder Preprozessor zu bauen ist ... aufwendig, aber nicht unmöglich! I habe viel gelernt, vor allem über Frameworks und warum ich wahrscheinlich eins nutzen hätte sollen :D', 
          'en': 'Building a big Project without any Frameworks or Typescript is ... difficult, but not impossible. I learned a lot, also about Frameworks and why i might should have used one :D'
        },
        { 
          'de': 'Der Skill, den ich am meisten während der Entwicklung des FrikyBots verbessert habe, ist: rapid prototyping. ',
          'en': 'The skill i improved the most during development of FrikyBot is: rapid prototyping. Testing things, improving them, seeing whats not working and redoing things over and over again, helped me focus on whats important and NEEDs to work.'
        },
        { 
          'de': 'Ein weiteres Problem mit dem ich Kämpfen lernen musste: Andere User! Ich habe bisher nie etwas gebaut, das primär von Leuten genutzt werden wollte, die nicht daran gearbeitet haben. Setup und Anpassungen so Nutzerfreundlich wie möglich zu machen, macht diese Funktionen deutlich komplexer. Meine Uni-Kurse über Mensch-Maschine-Interaktionen und Kognitive-Systeme haben hier sehr geholfen :D', 
          'en': 'Another Problem i have to deal with: USERS. I never built things primarly used by someone not familiar with the problem. Making Setup and Customizations userfriendly makes them way more difficult to design. My courses at university about Human-Machine-Interfaces and Kognitive Systems helped a lot ;)'
        }
      ] },
      { title: { 'de': 'Technische Details', 'en': 'Technical Details' }, image: 'right', image_url: './../../assets/projects/frikybot/Logs.PNG', image_alt: { '*': 'FrikyBot Logs' }, p: [
        { '*': 'Backend Runtime Enviroument: Node.js' },
        { '*': 'NPM Modules: express - body-parser - jsonwebtoken - jwks-rsa - bcrypt - node-fetch - ws - colors' },
        { '*': 'Frontend Framework: None' },
        { '*': 'Javascript Precompiler: None' },
        { '*': 'CSS Precompiler: None' },
        { 
          'de': 'Code: > 50.000 Zeilen (nur javascript code, kein html oder css)', 
          'en': 'Code: > 50.000 lines (only javascript code, no html or css)'
         }
      ] },
      { title: { '*': 'Status' }, p: [
        { 
          'de': 'Der aktuelle Fokus der Entwicklung, stand des Schreibens dieser Zusammenfassung, ist die "Stats", "ChatModeration" und "CustomChat" Packete "featurecomplete" zu bekommen. Danach stehen erstmal Pollish, Dokumentation und Guides an. Alles danach ist erstmal optional und noch nicht ganz konkret.', 
          'en': 'Current focus, as of writing this summary, is getting the "Stats", "ChatModeration" and "CustomChat" Packages featurecomplete. From there pollish, documentation and guides become the main focus. Anything after will be optional and is still not solid.'
        },
        { 
          'de': 'Dinge, die ich "irgendwann" gerne noch hinzufügen wollen würde: Multi Channel Support und ein Package Verteilungs / Browse System. Diese Dinge werden noch eiiiinige Zeit brauchen und sind nicht zwingend nötig - aber trotzdem cool ;)', 
          'en': 'Things i would like to do, if i get to it: Multi Channel support and Package Destribution and Browse System. Those are probably never gonna happen, but i would like to make them real :D'
        }
      ] },
      { title: { '*': 'GitHub Repositories / Download Code' }, p: [
        {
          '*': 'Primary FrikyBot Plattform: <a href="https://github.com/FrikyMediaLP/FrikyBot">GitHub Repository</a>'
        },
        {
          '*': 'Other Packages: <a href="https://github.com/FrikyMediaLP">GitHub Profile</a>'
        }
      ] }
    ] },
    { name: { '*': 'Smart Home Prototype'}, hash: 'smarthome', status: 100, start: 'Jan 2018', end: 'Jul 2018',
      details: [
        { title: { 'de': 'Überblick', 'en': 'Overview' }, p: [{
          'de': 'Als P5 Abschluss-Projekt meines Abiturs habe ich ein Smart Home System auf Arduino Basis gebaut. Dieses beinhaltete verschiedene Module (bswp. Temperaturmesser, RFID-/Touchscreen-Eingabemodule, LED-Strip Controller, usw.) sowie einen Hub-Server, der alle Module miteinander verbindet. Alle Elemente waren über dazu mit einem Ethernet-/WLAN-Anschluss ausgestattet und kommunizierten untereinander mit dem TCP Protokoll.',
          'en': 'For my final practical exam of my A Levels I built a Smart Home System based on Arduino Microprozessors. I desingned different Modules (like Temperaturesensors, RFID-Readers, Touchsreens, LED-Strip Controllers, etc.) aswell as a Hub-Server, which controlled and linked everything together. All Elements used an Ethernet-Port / WiFi-Antenna to communicate with the TCP Protocoll with other Elements.'
        }] },
        { title: { '*': 'Hub / Server' }, image: 'left', image_url: './../../assets/projects/smart-home/ESHS.png', image_alt: { '*': 'SmartHome Server' }, p: [
          { 
            'de': 'Der Hub / Server diente der Vernetzung und Datenverteilung der Smart Home Module. Dazu meldete sich jedes Modus zuerst beim Server, kam dort eine ID zugewiesen und konnte dann Informationen über andere Module abfragen.',
            'en': 'The Hub / Server was used to connect and distribute data between Smart Home Modules. On Startup every Module requested an ID from the Server and Configuration Data on how it should communicate with other Modules.'
          },
          { 
            'de': 'Konfigurationsdaten wurden dabei auf einer SD-Karte auf dem Server gespeichert.',
            'en': 'Configuration Data was saved on an external SD-Card.'
          }
        ] },
        { title: { 'de': 'Modul: RFID x Touchscreen', 'en': 'Module: RFID x Touchscreen' }, image: 'right', image_url: './../../assets/projects/smart-home/Bett.png', image_width: '10rem', image_alt: { '*': 'SmartHome Module' }, p: [
          {
            'de': 'Das TFT Touchscreen Modul diente als eins der Haupt-Eingabe-Module und konnte mit zugut wie allen anderen Modulen kommunizieren. So ließen sich Temperaturen für Lüfter einstellen, RGB-Farben für LED Lampen einrichten oder Text in LCD-/7Segement-Anzeigen darstellen lassen. Zusätzlich nutzte es auch direkte TCP Verbindungen ohne Hop über den Server, um Reaktionszeiten zu reduzieren.',
            'en': 'The TFT Touchscreen Module was one of the main input devices and was able to use any function of pretty much any other Modules. Setting Temperatures, Fan speeds, RGB colors of an LED Lamp or display Text on LCDs / 7 Seg. Displays. Futhermore, this Module was able to communicate directly to other Modules without a hop to the Server to reduce latency.'
          },
          {
            'de': 'Auf RFID Karten konnten Routinen eingespeichert werden, die automatisch beim einlesen ausgeführt wurden. So konnte bswp. beim Betreten eines Raumes das Licht auf die persönlich gewünschte eingestellt werden und ein Willkommensgruß auf dem LCD angezeigt werden.',
            'en': 'Automatic Routines could be saved on RFID Cards. E.g. once scanned, these routines would automatically turn on the light to the correct brightness, increase the temperature or display a welcome message with my name.'
          }
        ] },
        { title: { 'de': 'Modul: 7 Segment Anzeige', 'en': 'Module: 7 Segment Display' }, image: 'left', image_url: './../../assets/projects/smart-home/7-Seg.png', image_alt: { '*': 'SmartHome Module' }, p: [
          {
            'de': 'Die 8 x 7 Segment Anzeige wurde primär genutzt um RFID-Daten, Uhrzeiten oder Timer anzuzeigen. Dazu konnte jedes Zahl einzeln angesteuert werden, die Helligkeit reguliert werden und ein Cursor-Blinken eingeschaltet werden.',
            'en': 'The 8 x 7 Segment Display was primarly used to display RFID-Data, the current time or coundowns. Every digit on the display could be individually controlled and regulated. A cursor blink could also be enabled.'
          }
        ] },
        { title: { 'de': 'Modul: LCD-Steuerung', 'en': 'Module: LCD Controller' }, image: 'right', image_url: './../../assets/projects/smart-home/LCD.png', image_alt: { '*': 'SmartHome Module' }, p: [
          {
            'de': 'Neben dem TFT LCD Modul wurde auch ein 16x2 LCD Modul genutzt. Dieses konnte ebenfalls Textnachrichten und kleine Animationen ausgeben. 3 Eingabeknopfe könnten ebenfalls als Cursor-Steuerung oder um Funktionen auf anderen Modulen auszulösen genutzt ',
            'en': 'Next to the TFT LCD Module another 16x2 LCD Modul was used. This LCD was also able to display text messages and small animations. 3 Buttons could also be used to controll a cursor or trigger functions on other Modules.'
          }
        ] },
        { title: { 'de': 'Modul: RGB LED Licht', 'en': 'Module: RGB LED Light' }, image: 'left', image_url: './../../assets/projects/smart-home/RGB.png', image_alt: { '*': 'SmartHome Module' }, p: [
          {
            'de': 'Das RGB LED Modul steuerte einen 12V RGB LED Strip mithilfe von 3 NPN-Transistoren. Dank der Digital-Analog Wandler Auflösung von 8 Bit konnten über 16 Millionen verschiedene Farben angezeigt werden. Zusätzlich ließen sich Farbverläufe und pulsierende Farben einstellen.',
            'en': 'The RGB LED Module controlled a 12V RGB LED Strip using 3 NPN-Transistors. The Digital-Analog-Converter had an 8 bit resolution and therefore allowed over 16 million different colors. Colorgradients and pulsing effects could also be enabled and customized.'
          }
        ] },
        { title: { 'de': 'Andere Modul Ideen', 'en': 'Other Module Ideas' }, image: 'right', image_url: './../../assets/projects/smart-home/Allgemein.png', image_alt: { '*': 'SmartHome Module' }, p: [
          {
            'de': 'Neben den oberen Haupt-Modulen wurden auch mehrere Prototypen geplant. Darunter einen Ultraschall-Entfernungsmesser, um bswp. zu erkenne ob eine Tür geöffnet ist oder ein Motor Modul, das Lüfter/Ventile zur Klimatisierung steuern sollte.',
            'en': 'Along the other Modules listed above, I planned many others. E.g. an ultrasonic distance sensor Module, able to detect openned doors or a motor Module to controll fans or valves.'
          },
          {
            'de': 'Ein allgemeines GPIO (General Purpose Input Output) Modul wurde auch konzipiert. Dieses Modul sollte IO-Schnittstellen in Form von bswp. Relays zur Verfügung stellen, um noch mehr Dinge steuern zu könne. So wurden u.a. Knöpfe einer 2.5GHz Fernbedieung durch die Relays überbrückt und so über das Smart Home steuerbar gemacht.',
            'en': 'A GPIO (General Purpose Input Output) Module was also conceptualized. This Module should serve IO-Ports to controll devices directly - for example, i used this to bridge contacts on me TV remote making it now controllable from the Smart Home System.'
          }
        ] },
        { title: { '*': 'Webinterface' }, images: [ { url: './../../assets/projects/smart-home/Web1.PNG', alt: { '*': 'SmartHome WebInterface' } }, { url: './../../assets/projects/smart-home/Web2.PNG', alt: { '*': 'SmartHome WebInterface' } }, { url: './../../assets/projects/smart-home/Web3.PNG', alt: { '*': 'SmartHome WebInterface' } }, { url: './../../assets/projects/smart-home/Web4.PNG', alt: { '*': 'SmartHome WebInterface' } }, { url: './../../assets/projects/smart-home/Web5.PNG', alt: { '*': 'SmartHome WebInterface' } }, { url: './../../assets/projects/smart-home/Web6.PNG', alt: { '*': 'SmartHome WebInterface' } } ],
          p: [
            { 
              'de': 'Über das Webinterface ließen sich einige Funktionen der Module simuliert und somit ausgeführt werden. Dadurch konnte bswp. ein Tablet mit dem Webinterface an der Wand befestigt werden und ein Teil des SmartHomes werden.',
              'en': 'On the Webinterface any function of the any Module could be triggered. This made ANY web browser a Smart Home Module - for example, mounting a tablet on the wall with the Webinterface open, was able to controll the entire Smart Home.'
            },
            {
              'de': 'Zusätzlich diente das Webinterface auch als Debug / Setup Tool. So konnten IP Adressen geändert, RFID Logs durchgeschaut oder Einstellungen von Modulen wie bswp. die Helligkeit von Anzeigen geändert werden.',
              'en': 'The Webinterface was also used for debugging and setup. IP adresses could be changed, RFID Logs viewed or custom settings of Modules customized.'
            }
          ] 
        },
        { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, p: [
          { 
            'de': 'Sprache: Arduinos eigene Version of C / C++.',
            'en': 'Language: Arduino custom version of C / C++.'
          },
          {
            'de': 'Für dieses Projekt wurden folgende Übertragungs-Protokolle verwendet: I²C, SPI, HTTP, Serial, 1-Wire',
            'en': 'This Project used the following Communication-Protocolls: I²C, SPI, HTTP, Serial, 1-Wire'
          },
          {
            'de': 'Dieses Projekt hatte, außgenommen der Website, über 7.281 Zeilen Code und nutzte über ein dutzend Arduinos.',
            'en': 'This Projects Code, excluding the Website, had over 7.281 lines of Code and used over a dozen Arduinos.'
          },
          {
            'de': 'Primäre IDE: Arduino IDE.',
            'en': 'Primary IDE: Arduino IDE.'
          },
          {
            'de': 'Genutzte Bibliotheken: <a href="https://github.com/ntruchsess/arduino_uip">UIPEthernet</a>, <a href="https://github.com/miguelbalboa/rfid">MFRC522</a>, <a href="https://github.com/adafruit/Adafruit_TouchScreen">TouchScreen</a>, <a href="https://github.com/adafruit/Adafruit-GFX-Library">Adafruit_GFX</a>, <a href="https://github.com/prenticedavid/MCUFRIEND_kbv">MCUFRIEND_kbv</a>, <a href="https://github.com/wayoda/LedControl">LedControl</a>, <a href="https://github.com/Chris--A/Keypad">KeyPad</a>, <a href="https://github.com/JRodrigoTech/Ultrasonic-HC-SR04">Ultrasonic</a>, <a href="https://github.com/marcmerlin/NewLiquidCrystal">NewLyquidCrystal</a> und ein paar Eigenerstellte',
            'en': 'Used Libraries: <a href="https://github.com/ntruchsess/arduino_uip">UIPEthernet</a>, <a href="https://github.com/miguelbalboa/rfid">MFRC522</a>, <a href="https://github.com/adafruit/Adafruit_TouchScreen">TouchScreen</a>, <a href="https://github.com/adafruit/Adafruit-GFX-Library">Adafruit_GFX</a>, <a href="https://github.com/prenticedavid/MCUFRIEND_kbv">MCUFRIEND_kbv</a>, <a href="https://github.com/wayoda/LedControl">LedControl</a>, <a href="https://github.com/Chris--A/Keypad">KeyPad</a>, <a href="https://github.com/JRodrigoTech/Ultrasonic-HC-SR04">Ultrasonic</a>, <a href="https://github.com/marcmerlin/NewLiquidCrystal">NewLyquidCrystal</a> and some of my own.'
          }
        ] },
        { title: { 'de': 'Besonderheiten / Probleme / Herrausforderungen', 'en': 'Special Challenges / Problems' }, p: [
          {
            'de': 'Auf limitierter Hardware zu programmieren stellte mir einige Herrausforderungen! Einige Module nutzen große externe Bibliotheken um bspw. Motoren zu steuern, LCD Bilder anzuzeigen oder RFID Karten zu lesen. Diese Bibliotheken, und der Code diese zu nutzen, bringt den limitieren Programm-Speicher der Arduinos an seine Grenzen. Mehrmals musste umgeschrieben, verkleinert und optimiert werden, damit der Code auf den Speicher geschrieben werden konnte. Ich habe sogar eigene Versionen mancher Bibliotheken geschrieben, um deren Umfang zu reduzieren und auf meinen Nutzen anzupassen.',
            'en': 'Working on limited Hardware put me on many challenges. Some Modules use big extern Libraries to controll Motors or LCDs. These Libraries filled the limited Program-Memory rather quick and many parts of my code had to be rewritten or cut. I also made my own version of some libraries with a smaler scope to reduce their size.'
          },
          {
            'de': 'Leistung ist ebenfalls ein Faktor - so dauern bspw. Pixel-by-Pixel draw-Operationen eines Touchscreens recht lange. Dadurch lassen sich zwar ungewollt coole Animationen bauen, aber leider blockieren sie auch den Lese/Schreibprozess des RFID-/Ethernetanschlusses.',
            'en': 'Performance is also another Factor - Pixel-by-Pixel draw operations take a while on this low hardware. This causes cool animations, but are not desirable and block the main Read/Write Loop of the other IO.'
          },
          {
            'de': 'Leider hatte ich nie die Zeit einen "Power over Ethernet" Switch zu basteln und dadurch mussten alle Module immer ihre eigene Stromversorgung bereitstellen ... der Kabelsalat war REAL!!',
            'en': 'Sadly, I never got to build a "Power over Ethernet" Switch to power and connect Modules with just one cable. Currently every Module needed 2, one for power and one for data ... it was a MESS!!'
          }
        ] },
        { title: { '*': 'Download Code' }, p: [
          {
            '*': 'Servers: <a href="./../../assets/projects/smart-home/server/EthSmartHomeServer.ino">Server</a> - <a href="./../../assets/projects/smart-home/server/LCD_Steuerung.ino">LCD Module</a> - <a href="./../../assets/projects/smart-home/server/LichtSteuerung.ino">Relay Module</a> - <a href="./../../assets/projects/smart-home/server/RGB_Steuerung.ino">RGB Module</a> - <a href="./../../assets/projects/smart-home/server/Seven_Seg_Steuerung.ino">7 Segment Module</a>'
          },
          {
            '*': 'Clients: <a href="./../../assets/projects/smart-home/clients/Bett_Steuerung.ino">RFID x TFT Module</a> - <a href="./../../assets/projects/smart-home/server/PC_Steuerung.ino">Keypad Module</a> - <a href="./../../assets/projects/smart-home/server/Tuer_Steuerung_Yun_V5_1.ino">Webinterface Module</a>'
          }
        ] }
      ]
    },
    { name: { '*': 'Hitman Game'}, hash: 'hitman', status: 80, start: 'Sep 2016', end: 'Jul 2017', details: [
      { title: { 'de': 'Überblick', 'en': 'Overview' }, image: 'right', image_url: './../../assets/projects/hitman/menu.PNG', image_alt: { '*': 'Hitman Menu' }, p: [
        { 
          'de': 'Auch dieses Projekt war ein Schulprojekt, das ich 2017 in meinem vorletzten Abiturjahr erstellt habe. Dieses sollte ein 2D Hitman like Spiel werden. Obendrauf sollte es noch so modfreundlich, anpassbar und erweiterbar wie möglich sein.',
          'en': 'This project too was a school project in my second to last year of my A Levels. This one was a 2D Hitman like Game, but extended with as much modfriendly components, customization and expandability as possible.'
        }
      ] },
      { title: { '*': 'Gameplay' }, images: [ 
        { url: './../../assets/projects/hitman/ingame0.PNG', alt: { '*': 'Hitman Gameplay' } },
        { url: './../../assets/projects/hitman/ingame5.PNG', alt: { '*': 'Hitman Gameplay' } },
        { url: './../../assets/projects/hitman/ingame2.PNG', alt: { '*': 'Hitman Gameplay' } },
        { url: './../../assets/projects/hitman/ingame3.PNG', alt: { '*': 'Hitman Gameplay' } },
        { url: './../../assets/projects/hitman/ingame1.PNG', alt: { '*': 'Hitman Gameplay' } },
        { url: './../../assets/projects/hitman/ingame4.PNG', alt: { '*': 'Hitman Gameplay' } },
        { url: './../../assets/projects/hitman/EG.png', alt: { '*': 'Hitman Gameplay' } }
      ], p: [
        { 
          'de': 'Die Hitman Spielereihe besiert auf dem Attentäter Agent 47, der unbemerkt Ziele eliminieren oder Objekte extrahieren soll.' ,
          'en': 'The Hitman Gameseries is based on Agent 47, a Hitman that is supposed to eliminate targets or extract mission objects.' 
        },
        { 
          'de': 'Der reiz der Hitmanspiele liegt daran unzählige Möglichkeiten zu haben, die Missionsziele zu erledigen. Es stehen, wie zu erwarten, eine reihe an offensiven und defensiven Schusswaffen zur Verfügung - aber auch Gift, Köder, Sprengfallen und viele VIELES mehr. Meine Version setzt dabei primär auf die Gadgets statt Schusswaffen und besitzt somit primär Nahkampf Waffen.',
          'en': 'The thrill of the Hitman games rests upon the uncounable possibilities to complete your mission goals. Guns are, as expected, part of this - but also Gadgets like Poisons, Ropes, Lure-Items, bombs and many MANY more. My Version primarily uses close combat Gadgets like poison syringes and a piano string.'
        },
        { 
          'de': 'Hauptziel ist ebenfalls ein leises und unbemerktes Vorgehen. Dazu bieten Hitman Spiele zahlreiche Verstecke für Körper, Waffen und einen selbst sollte man entdeckt werden. Ebenfalls lassen sich Kleidungen des Personals anziehen, mitdessen man nun neue Areale unentdeckt erreichen kann. Mein Spiel nutzt diese gleiche System mit verschiedenen Rollen, Zugangsleveln, Anziehbarer Kleidung, Verstecke für Spieler, Leichen und Gegenstände, sowie ein "Erwischt" System, dass die Mission beendet.',
          'en': 'Another big foundation of the Hitman games is a silent and undetected strategy. Hitman Games provide a bunch of hiding pots for bodies, weapons and yourself if you find yourself caught in a corner. You can also put on clothes to disguise yourself as staff members to reach new areas undetected. My Game uses this exact system with different Roles, Accesslevels, wearable clothes, hiding spots for the player, bodies and weapons, aswell as a "caught" System, that ends a mission.'
        },
        { 
          'de': 'Unterschiedliche Karten haben unterschiedliche Missionen, Themen und Ausrüstungen. Geplant waren mehre spielbare Karten in meiner Version, allerdings ist das zeitlich nichts geworden. Alle Subsysteme der Maps, wie Kollisionen, Missionen usw., sind aber bereits ausgelegt dynamisch mit er Map zu wechseln.',
          'en': 'Different Maps have differenct Missions, Themes and Gadgets. Multiple Maps were planned in my Version, but could not be realisied due to the deadline. But all Subsystems of Maps, like Collisions, Missions, etc., are already dynamically changing with the map.'
        }
      ] },
      { title: { '*': 'Special Features' }, images: [ 
        { url: './../../assets/projects/hitman/optionen1.PNG', alt: { '*': 'Hitman Options Menu' } },
        { url: './../../assets/projects/hitman/saves.PNG', alt: { '*': 'Hitman Saves Menu' } },
        { url: './../../assets/projects/hitman/Farbian.PNG', alt: { '*': 'Hitman Character Editor' } },
        { url: './../../assets/projects/hitman/Jürgen.PNG', alt: { '*': 'Hitman Character Editor' } }
      ], p: [
        { 
          'de': 'Ein essentielles Feature, das ich unbedingt haben wollte, ist sogut wie alles Modfreundlich / Erweiterbar zu machen. So können zusätzliche Karten, Rollen, Kleidungen und Waffen einfach dem jeweiligen Ordner hinzugefügt werden und das Spiel lädt diese automatisch, prüft sie auf Kompatibilität und stellt sie dann zu Verfügung.',
          'en': 'A essential Feature was building everything modfriendly and expandable. That way additional Maps, Roles, Clothes and Weapons can be placed into the respective folders and will be automatically loaded, checked for compatibility and then put into the game.'
        },
        { 
          'de': 'Hitman macht vor allem durch den hohen Wiederspielwert spaß. Deshalb sind Speicherstände enorm wichtig! Zwischendruch abzuspeichern und verschiedene Dinge zu testen macht enorm viel Spaß',
          'en': 'Hitman makes the most fun when trying different strategies. Thats why savegames are very important. Quickly saving your current progress and test different strategies is a lot of fun.'  
        }
      ] },
      { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, p: [
        {
          'de': 'Sprache: Java mit Swing als Grafik Bibliothek.',
          'en': 'Language: Javas with Swing as Graphics Library.'
        },
        {
          'de': 'Dieses Projekt hatte über 6.338 Zeilen Code.',
          'en': 'This Projects Code had over 6.338 lines of Code.'
        },
        {
          'de': 'Primäre IDE: IntelliJ IDEA.',
          'en': 'Primary IDE: IntelliJ IDEA.'
        }
      ] },
      { title: { 'de': 'Besonderheiten / Probleme / Herrausforderungen', 'en': 'Special Challenges / Problems' }, image: 'right', image_url: './../../assets/projects/hitman/end2.PNG', image_alt: { '*': 'Hitman Ending Screen' }, p: [
        { 
          'de': 'Dieses Spiel war das erste, das eine höhere Framerate benötigte. Durch das durchgehende neuzeichnen der Welt und Interfaces kam es zu einem Flackern zwischen neuen Frames. Im Nachhinein hätte man neue Frames zwischenrendern sollen und dann auf einmal auf dem Monitor anzeigen lassen sollen. Dinge, die man erst lernt, wenn man sie mal selbst getestet hat :D',
          'en': 'This game was the first that requiered a semy high framerate. Trying to make my own szene renderer introduced flickering when rapidly redrawing the world and Interaces. In hindsight, a buffered rendering step could have prevented this, by rendering the frame image at once - but thats just something you learn after you tried things :D'
        },
        {
          'de': 'Movement - Der heilige Gral eines Spiels. Jedes Spiel fühlt sich anders an, manche besser, manche schlecter - meins ist deutlich letztes :D Kombiniert mit dem Flackern ist es nur minimal spielbar. Sanftete Animationen und Bewegungen hätten da einiges rausgeholt.',
          'en': 'Movement - the holy grail of Gaming. Every game feeld different, some better, some worse - mine is definitely the later. Combined with the flickering - its barely playable. Smoother Animations and movements would have helped a lot.'
        },
        { 
          'de': 'Leider ist das Hitman Game deeeutlich kleiner ausgefallen als ich es wollte. Vieles hat mit den technischen Flacker Problemen zu tun, aber auch mit der Deadline. Trotzdem war es (mit einem anderen Projekt) das mit ABSTAND beste aus der Stufe und das macht mich trotzdem stolz :)',
          'en': 'Sadly, did this game turn out a lot smaller than i wanted it to. Many technical Problems, like the flickering, but also the short Deadline reduces the amount of content i could add on my own. But anyways, was this project (and one other) BY FAR the best project of the entire class - and that makes me still proud :)'
        }
      ] },
      { title: { '*': 'Download Code' }, p: [
        {
          '*': '<a href="./../../assets/projects/hitman/download.rar">Code (without copyrighted images/sounds)</a>'
        }
      ] }
    ] },
    { name: { '*': 'YouTube Clicker Game'}, hash: 'youtubeclicker', status: 100, start: 'Sep 2015', end: 'Jul 2016', details: [
      { title: { 'en': 'Overview', 'de': 'Überblick' }, p: [
        {
          'de': 'Das YouTube Clicker Spiel war ebenfalls ein Schulprojekt aus dem 1. meiner letzten 3 Abiturjahre. Dieses war sehr simpel und war einem bekannten Idle-Game namens "Cookie Clicker" nachempfunden.',
          'en': 'The YouTube Clicker Game was also a school project from my first of 3 last years of my A Levels. This game was very simple and based on a popular Idle-Game called "Cookie Clicker".'
       }
      ] },
      { title: { '*': 'Gameplay' }, images: [
        { url: './../../assets/projects/youtubeclicker/gameplay1.PNG', alt: { '*': 'YouTube Clicker Gameplay' } },
        { url: './../../assets/projects/youtubeclicker/gameplay2.PNG', alt: { '*': 'YouTube Clicker Gameplay' } },
        { url: './../../assets/projects/youtubeclicker/gameplay3.PNG', alt: { '*': 'YouTube Clicker Gameplay' } },
        { url: './../../assets/projects/youtubeclicker/gameplay4.PNG', alt: { '*': 'YouTube Clicker Gameplay' } },
        { url: './../../assets/projects/youtubeclicker/gameplay5.PNG', alt: { '*': 'YouTube Clicker Gameplay' } }
      ], p: [
        { 
          'de': 'Im Spiel YouTube Clicker spielt man einen YouTube Newcommer, der Abonennten, Views und Geld sammeln will. Dazu kann der User im bekannter "Clicker-Game-Genre" Stil auf einen großen Abo Knopf drücken und mit jedem Klick einen Abonnent, etwas Geld und Views sammeln.',
          'en': 'In YouTube Clicker you play an upcomming YouTuber whos trying to grow his reach by collecting Subscriptions, views and money. In tru "Clicker-Game-Genre" style there is a big button that can be manually clicked to collect currencies.'  
        },
        { 
          'de': 'YouTube Clicker ist ein "Idle-Game" - das bedeutet, dass das Spiel sich zum großteil selbst spielt und der Nutzer nur Entscheidungen über Budges und Events angibt. Dazu kann der Spieler Upgrades mit Geld kaufen und so über Zeit automatisch weitere Reichweite kaufen.',
          'en': 'YouTube Clicker is also an Idle-Game - that means, the game can play itself and the user only directs the Game how to play itself or accepts additional Event Challenges. The User an buy Upgrades with his earned Money to automate collection of further reach.'
        },
        {
          'de': 'Es tauchen auch zufällig Events auf - diese können Produkt Platzierungen beinhalten, die extra Geld einbringen - oder andere bekannt YouTube können auftauchen und Autogramme verteilen, die deine Reichweite boosten.',
          'en': 'Events can also randomly appear providing Product Placement oportunities to ear extra money - or famous YouTubers can appear and sign autographs to boost your reach.'
        },
        { 
          'de': 'Der Spielfortschritt konnte hier erstmalig abgespeichert werden, sodass in der Zukunft am alten Stand weitergespielt werden konnte. Geplant war einmal den Fortschritt zwischen dem Spielen zu interpolieren - aber das wurde doch rausgelassen.',
          'en': 'The players progress could also be saved here for the first time! Restarting the game would continue on the last progress the player was at. There was also a Interpolation-System planned, to tried to calculate the automated gain of funds in the passed time, but that was scrapped.'
        }
      ] },
      { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, p: [
        { 
          'de': 'Sprache: Java mit Swing als Grafik Bibliothek.',
          'en': 'Language: Java with Swing as Graphics Library.'
        },
        { 
          'de': 'Dieses Projekt hatte über 1.747 Zeilen Code.',
          'en': 'This Project had over 1.747 lines of Code.'
        },
        { 
          'de': 'Primäre IDE: IntelliJ IDEA.',
          'en': 'Primary IDE: IntelliJ IDEA.'
        }
      ] },
      { title: { 'de': 'Besonderheiten / Probleme / Herrausforderungen', 'en': 'Special Challenges / Problems' }, p: [
        { 
          'de': 'Dieses Projekt stelle mich vor neue Herrausforderungen der Nutzerinteraktion. Klarzumachen was anklickbar, was noch nicht und wieso ist, addiert mit den limitierten Fähigkeiten brachte ein recht ... bescheidendes User Interface hervor :D Dadurch habe ich aber auch gelernt, wie wichtig kleine Animationen, Hover Effekte usw. sind und der Lesbarkeit eines Interfaces helfen.',
          'en': 'This Project also put up new challenges about Userinfaces. Making clear what you can interact with, what you cant yet and why, added with my limited Skillset at the time resulted in at rather ... prototype looking User Interface :D But this taught me how important small animations and hover effects are and improve the readability of an Interface.'
        },
        { 
          'de': 'Das YouTube Clicker Spiel war auch meine erste Erfahrung mit Speicherständen. Spielernamen, Abo-, Views- und Gelddaten, sowie Anzahl erhaltener Autogrammkarten und Upgradestufen wurden in einer .txt Datei gespeichert - allerdings ohne Parsing Schema und musste fest im Programmcode eingetragen werden.',
          'en': 'The YouTube Clicker Game was also the first time I had to deal with saving a players progress. Playernames, Subscriptions, Views and Money aswell as Eventdata and Upgradelevels were saved into .txt Files - this was purely hardcoded without any parsing Schema, which made YouTuber Event Data tricky.'
        }
      ] },
      { title: { '*': 'Download Code' }, p: [
        {
          '*': '<a href="./../../assets/projects/youtubeclicker/download.rar">Code (without images)</a>'
        }
      ] }
    ] },
    { name: { 'de': 'MATHE WAHRSCHEINLICHKEIT SPIEL', 'en': 'MATH PROBABILITY GAME'}, hash: 'mathgame', status: 100, start: 'Sep 2015', end: 'Nov 2015', details: [
      { title: { 'de': 'Überblick', 'en': 'Overview' }, image:'right', image_url: './../../assets/projects/kugelspiel/menu.PNG', image_alt: { 'de': 'Kugelspiel Menu', 'en': 'Marble Game Menu' }, p: [
        {
          'de': 'Zum Begin meiner 3 Abitur Jahre wollte ich meinem Informatiklehrer beweisen was ich bisher auf dem Kasten hatte - dazu habe ich mir ein zuvor im Matheunttericht besprochenes Problem genommen und es in ein Spiel umgewandelt. Meine damaligen Fähigkeiten haben sich nur auf Konsolenanwendungen begrenzt, aber ich habe gegen Ende des Jahres nochmal eine grafische Version erstellt.',
          'en': 'At the start of my 3 year A Levels segment, I wanted to impres my teacher showing what I was already able to do. For this I used a previously talked about topic in maths class and turned it into a game. My skills at that time only covered Consolea pplications, but I made a graphical version later that year too.'
        }
      ] }, 
      { title: { '*': 'Gameplay' }, images_mode: 'height', images: [
        { url: './../../assets/projects/kugelspiel/settings1.PNG', alt: { 'de': 'Kugelspiel Einstellungen', 'en': 'Marble Game Settings' } },
        { url: './../../assets/projects/kugelspiel/gameplay1.PNG', alt: { 'de': 'Kugelspiel Gameplay', 'en': 'Marble Game Gameplay' } },
        { url: './../../assets/projects/kugelspiel/gameplay2.PNG', alt: { 'de': 'Kugelspiel Gameplay', 'en': 'Marble Game Gameplay' } }
      ], p: [
        {
          'de': 'Das Spielprinzip basiert auf einem Mathematik-Problem. Dabei werden pro Zug 2 Kugeln aus einem Sack mit schwarzen und weißen Kugeln gezogen. Werden 2 gleichfarbige Kugeln gezogen, wird dem Sack eine schwarze Kugel hinzugefügt, die beiden gezogenen Kugeln werden aus dem Spiel genommen. Werden 2 unterschiedliche Farben gezogen, wird die weiße Kugel zurück in den Sack gegeben und die Schwarze aus dem Spiel genommen. Frage ist, welche Farbe am Ende übrig bleibt.',
          'en': 'The game is based on a maths-problems, which involves white and black marbles. Every turn, 2 marbles are pulled out of a bowl - if they are the same color, a black marble is added to the bowl and the other 2 discarded - if they are different colors, the black marble is discarded and the white marble is added back into the bow. Question is: Which color remains at the end?'
        },
        {
          'de': 'Die erste Version wurde rein über die Consoleneingabe gesteuert. Mit dem Text "regeln" ließ sich das Spielprinzip, wie oben, anzeigen lassen, mit dem Text "einstellungen" die Anzahl Kugeln pro Farbe ändern und mit dem Text "starten" spielte der Computer Automatisch das Spiel bis nur eine Farbe übrig blieb.',
          'en': 'The first Version was controlled purly by Consoleinput. With the text "regeln" (rules in german) a popup would explain what this game was about. With the text "einstellungen" (settins in german) a user could change the amount of marbles of each color. And with the text "starten" (start in german) the computer would run the game until no marbles of a color would remain.'
        }
      ] }, 
      { title: { 'de': 'Grafik Upgrade', 'en': 'Graphic Upgrade' }, images: [
        { url: './../../assets/projects/kugelspiel/settings2.PNG' },
        { url: './../../assets/projects/kugelspiel/gameplay3.PNG' },
        { url: './../../assets/projects/kugelspiel/gameplay4.PNG' },
        { url: './../../assets/projects/kugelspiel/gameplay5.PNG' }
      ], p: [
        {
          'de': 'Später habe ich mein im Unterricht gelerntes Wissen genutzt, um aus meiner frühen Konsolenanwendung eine Grafische Anwendung zu machen. Diese nutzte Bilder, mehrere Fenster und Eingabefelder um mit dem Spiel zu interagieren.',
          'en': 'Later, I used my newly learned skill in class to rebuild this game into a graphicly based application. This one used images, multiple windows and buttons to control the game.'
        },
        {
          'de': 'Ebenfalls war diese Version nun auch mehr ein Spiel als die Konsolenanwendung, da nun nicht immer der Computer automatisch spielte, sondern nun auch der Nutzer selbst jede Runde aktivieren konnte.',
          'en': 'This Version was also more game-like than the Consoleapplication, because now the user could controll each turn and not only let the computer run through them at lightspeed.'
        }
      ] }, 
      { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, image_url: './../../assets/projects/kugelspiel/menu2.PNG', image: 'right', image_alt: { 'de': 'Kugelspiel Menu', 'en': 'Marble Game Menu' }, p: [
        {
          'de': 'Sprache: Java mit AWT als Grafik Bibliothek.',
          'en': 'Language: Java with AWT as Graphic Library.'
        },
        {
         'de': 'Dieses Projekt hatte 222 Zeilen Code (Grafik Upgrade: 532 Zeilen)',
         'en': ''
        },
        {
         'de': 'Primäre IDE: Eclipse',
         'en': 'Primary IDE: Eclipse'
        }
      ] }
    ] },
    { name: { '*': 'Image Maze Solver'}, hash: 'mazesolver', status: 100, start: '2017', end: '2017',
      custom_html: {
        scripts: ['./../../assets/projects/maze/code.js', 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'],
        html: `
          <div id="MazeSolverDemoWrapper">
            <h2>Interactive Demo</h2>
            <h3>Drag an Image (from the left or from you local machine) over the canvas (on the right).</h3>
            <h5>Tip: Use Edge - its much more performant at this than chrome or firefox.</h4>
            <h5>Tip 2: Generate your own Mazes <a href="https://keesiemeijer.github.io/maze-generator/#generate" target="_blank">here</a> - !!!Important: Wall Thickness "1" and Maze entries: "Top and Bottom"!!!</h4>
            <div id="MazeSolverDemoScaler">
              <input id="scaleSlider" type="range" value="30" min="1" step="1" max="100" oninput="resize()"/>
            </div>
            <div id="MazeSolverDemoUIWrapper">
              <div id="MazeSolverDemoExamples">
                <img src="./../../assets/projects/maze/Maze_0.png" title="Example Maze 1" alt="Example Maze 1" />
                <img src="./../../assets/projects/maze/Maze_1.png" title="Example Maze 2" alt="Example Maze 2" />
                <img src="./../../assets/projects/maze/Maze_2.png" title="Example Maze 3" alt="Example Maze 3" />
                <img src="./../../assets/projects/maze/Maze_3.png" title="Example Maze 4" alt="Example Maze 4" />
              </div>
              <div id="MazeSolverDiv">Might have to reload :/</div>
            </div>
          </div>
        `,
        style: './../../assets/projects/maze/style.css'
      },
      details: [
        { title: { 'en': 'Overview', 'de': 'Überblick' }, image: 'right', image_url: './../../assets/projects/maze/demo.PNG', image_alt: { '*': 'Maze Demo' }, p: [
          {
            'de': '2017 habe ich viele kleine Mini-Projekte gestartet - dieses Projekt wurde von einem <a href="https://www.youtube.com/watch?v=rop0W4QDOUI" target="_blank">Computerphile Video</a> inspiriert. Im Video wird ein Labyrinth-Löse-Alogrythmus besprochen - diese Idee habe ich, wie im Video vorgeschlagen, selbst umgesetzt.',
            'en': 'In 2017 I started a lot of small mini projects - this project was inspired by a <a href="https://www.youtube.com/watch?v=rop0W4QDOUI" target="_blank">Computerphile Video</a>. In the video, a Maze solving Algorythm is talked about - i made my own version of this idea.'
          },
          {
            'de': 'Das Prinzip des Algorythmus basiert auf einem Labyrinth als Bild-Datei, mit weißen Pixel als Wege und schwarzen Pixel als Wände - weiße Randpixel sind Start/Ziel. Der Algorythmus geht dabei jede Pixel-Reihe durch und versucht Kreuzungen zu finden und diese mit anderen Kreuzungen zu verbinden. Daraus ergibt sich ein Baum, den man deutlich einfacher nach dem Zielpfad durchsuchen kann.',
            'en': 'The algorythm takes in a Maze as an image file with white pixels as paths and black pixels as walls - white border pixels also represent the start / finish. The algorythm walks down every row looking for intersections and connecting them to others. This results in a Tree-graph that can be search way easier.'
          }
        ] },
        { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, p: [
          { 
            'de': 'Sprache: Javascript.',
            'en': 'Language: Javascript.'
          },
          { 
            'de': 'Dieses Projekt hatte über 355 Zeilen Code.',
            'en': 'This Project had over 355 lines of Code.'
          },
          { 
            'de': 'Primäre IDE: Atom.',
            'en': 'Primary IDE: Atom.'
          }
        ] },
        { title: { '*': 'Download Code' }, p: [
          {
            '*': '<a href="./../../assets/projects/maze/download.rar">Download Code</a>'
          }
        ] }
      ]
    },
    { name: { '*': 'TV Backlight / LED Strip Controller'}, hash: 'tvbacklight', status: 100, start: 'Late 2017', end: 'Late 2017', details: [
      { title: { 'en': 'Overview', 'de': 'Überblick' }, image: 'right', image_url: './../../assets/projects/tvbacklight/2.jpg', image_width: '15rem', image_alt: { '*': 'TV Backlight' }, p: [
        {
          'de': 'Indirektes Licht hat mir schon immer sehr angetan - im Zuge meines Smart Home Prototypen habe ich einen LED Strip Controller gebaut um meinem Fernseher ein indirektes Rücklicht zu geben.',
          'en': 'Idirect Lighting was always something I loved - while prototyping my Smart Home Project I build an LED Strip Controller to give my TV an indirect backlight.'
        },
        {
          'de': 'Ein Arduino Yun diente hier als Microcontroller, der mithilfe von NPN Transistoren einen 12V LED Strip steuerte. Mithilfe der Analogen Outputs des Arduinos konnten die Transistoren in 265 Schritten angesteuert werden - dies ergibt über 16 Millionen verschiedene Farbenmöglichkeiten.',
          'en': 'An Arduino Yun was used as an Microcontroller which controlled an 12V LED Strip with NPN Transistors. The 8 Bit Analog Outputs of the Arduino allowed over 16 Million colors.'
        },
        {
          'de': 'Der Arduino Yun besteht zu 50% aus einem Microcontroller und zu 50% aus einem Linux MiniPC. Mithilfe der zusätzlichen WLAN Funktion lässt sich ein Webserver auf dem Arduino hosten, der mit dem Microcontroller Code interagieren kann.',
          'en': 'The Arduino Yun is 50% a Microcontroller and 50% a Linus Mini PC. Using the additional WiFi Chip allowed the ability to host a Webserver that was able to interact with the Arduino Code to controll the LED Strip from any Browser.'
        }
      ] },
      { title: { '*': 'Features' }, image: 'left', video_url: './../../assets/projects/tvbacklight/Vid2.webm', image_width: '15rem', image_alt: { '*': 'TV Backlight' }, p: [
        {
          'de': '<b style="border-bottom: 1px solid white; line-height: 2;">Konstante Farbe (Mode 0)</b>: </br> Stellt eine konstate Farbe auf dem LED Strip dar. Dies kann entweder durch 11 vorgelegte Text-Farben eingestellt werden oder eine eigene Farbe durch einen RGB-Hex Wert.',
          'en': '<b style="border-bottom: 1px solid white; line-height: 2;">Constant Color (Mode 0)</b>: </br> Displays a constant Color on the LED Strip. This can be set by one of 11 preset Color Strings or a custom Color by an RGB-Hex code.'
        },
        {
          'de': '<b style="border-bottom: 1px solid white; line-height: 2;">Rainbow / Harter Farbwechsel (Mode 1)</b>: </br> Wechselt zufällig zwischen 11 Farben hin und her (ohne zwischenblenden).',
          'en': '<b style="border-bottom: 1px solid white; line-height: 2;">Rainbow / Hard Color Changing (Mode 1)</b>: </br> Rotates randonly between 11 preset colors (without blending).'
        },
        {
          'de': '<b style="border-bottom: 1px solid white; line-height: 2;">Breathing Effect (Mode 2)</b>: </br> Lässt eine eingestellte Farbe wie einen Herzschlag in er der Helligkeit pulsieren. Intensität und Länge sind ebenfalls zufällig.',
          'en': '<b style="border-bottom: 1px solid white; line-height: 2;">Breathing Effect (Mode 2)</b>: </br> Pulsates a set colors brightness randomly like a heartbeat. Intensity and Duration are also random.'
        },
        {
          'de': '<b style="border-bottom: 1px solid white; line-height: 2;">Sanfter Farbwechsel (Mode 3 / X)</b>: </br> Blendet sanft zwischen 2 Farben hin und her.',
          'en': '<b style="border-bottom: 1px solid white; line-height: 2;">Sanfter Farbwechsel (Mode 3 / X)</b>: </br> Transitions smooth between 2 colors back and forth.'
        }
      ] },
      { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, image: 'right', image_url: './../../assets/projects/tvbacklight/hardware_text.jpg', image_alt: { '*': 'TV Backlight Hardware' }, p: [
        { 
          'de': 'Sprache: Arduinos eigene Version von C / C++.',
          'en': 'Language: Arduino custom version of C / C++.'
        },
        { 
          'de': 'Dieses Projekt hatte über 587 Zeilen Code.',
          'en': 'This Project had over 587 lines of Code.'
        },
        { 
          'de': 'Primäre IDE: Arduino IDE.',
          'en': 'Primary IDE: Arduino IDE.'
        }
      ] },
      { title: { '*': 'Download Code' }, image: 'left', image_url: './../../assets/projects/tvbacklight/webinterface.PNG', image_width: '15rem', image_alt: { '*': 'TV Backlight WebInterface' }, p: [
        {
          '*': '<a href="./../../assets/projects/tvbacklight/download.rar">Download Code & Webinterface</a>'
        }
      ] }
    ] },
    { name: { '*': 'Google Data Visualizer'}, hash: 'googledataviz', status: 90, start: '2019', end: '2019', details: [
      { title: { 'en': 'Overview', 'de': 'Überblick' }, image: 'right', image_url: './../../assets/projects/googledata/blurred1.PNG', image_alt: { '*': 'Google Data Dump' }, p: [
        {
          'de': 'Da ich damals vor kurzem ein paar Daten verloren hatte, wurde durch durch ein <a href="https://www.youtube.com/watch?v=hLjht9uJWgw" target="_blank">YouTube Video</a> inspiriert nachzuschauen welche Bilder / Videos noch bei Google gespeichert sind. Mein Program geht hierbei alle .json Dateien des "Google Fotos" Ordner durch und extrahiert alle URLs. Diese Bilder / Video URLs werden in der Konsole ausgegeb und falls verfügbar heruntergeladen.',
          'en': 'When I lost some data, I got inspired by a  <a href="https://www.youtube.com/watch?v=hLjht9uJWgw" target="_blank">YouTube Video</a> to check what images / videos are still saved on google servers. My program checks all .json files in the "Google Fotos" Folder and extracts all URLs. These Images / Videos are then downloaded, if available.'
        },{
          'de': '"Leider" hat Google später den Daten eine Authentifizierung hinzugefügt, sodass nur der Nutzer der Daten diese herunterladen kann. Gut für die Sicherheit - schlecht für meine Automatisierung :D',
          'en': '"Sadly" Google added an Authentication step, so only the user of the data can download it. Good for Security - Bad for my Automation :D'
        }
      ] },
      { title: { 'de': 'Technische Informationen', 'en': 'Technical Details' }, image: 'left', image_url: './../../assets/projects/googledata/blurred2.PNG', image_alt: { '*': 'Google Data Dump' }, p: [
        { 
          'de': 'Sprache: C#',
          'en': 'Language: C#'
        },
        { 
          'de': 'Dieses Projekt hatte über 150 Zeilen Code.',
          'en': 'This Project had over 150 lines of Code.'
        },
        { 
          'de': 'Primäre IDE: Visual Studio 2017.',
          'en': 'Primary IDE: Visual Studio 2017.'
        }
      ] },
      { title: { '*': 'Download Code' }, p: [
        {
          '*': '<a href="./../../assets/projects/googledata/Program.cs">Download Code</a>'
        }
      ] }
    ] }
  ];

  active_projects = this.projects.filter(elt => elt.active === true);
  inactive_projects = this.projects.filter(elt => elt.active !== true);

  visible_project: ProjectComponent;

  constructor(
    private langService: LangService,
    private route: ActivatedRoute,
    private titleService: Title
  ) { 
    this.langService.langEvents.subscribe(() => this.setTitle());
    this.setTitle();
  }

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      let project = this.projects.find(elt => elt.hash === fragment);
      if(project) project.show = true;
    })
  }

  closeOtherProjects(project: ProjectComponent) {
    if(this.visible_project && this.visible_project !== project && this.visible_project.wrapper.nativeElement.classList.contains('show')) this.visible_project.hideProject();
    this.visible_project = project;
  }

  showEnlargeImage(url: string){
    this.imageEnlargerWrapper.nativeElement.querySelector('img').src = url;
    this.imageEnlargerWrapper.nativeElement.querySelector('img').style.backgroundColor = 'var(--color-dark)';
    this.imageEnlargerWrapper.nativeElement.style.display = 'block';

    let elt = this.imageEnlargerWrapper.nativeElement;
    while(elt.tagName !== "BODY") elt = elt.parentElement;
    elt.style.overflow = 'hidden';
    elt.style.paddingRight = (window.innerWidth - document.documentElement.clientWidth) + 'px';
  }
  showEnlargeImageEvent(e: MouseEvent){
    this.imageEnlargerWrapper.nativeElement.querySelector('img').src = (e.target as any).src;
    this.imageEnlargerWrapper.nativeElement.querySelector('img').style.backgroundColor = 'var(--color-dark)';
    this.imageEnlargerWrapper.nativeElement.style.display = 'block';

    let elt = this.imageEnlargerWrapper.nativeElement;
    while(elt.tagName !== "BODY") elt = elt.parentElement;
    elt.style.overflow = 'hidden';
    elt.style.paddingRight = (window.innerWidth - document.documentElement.clientWidth) + 'px';
  }
  hideEnlargedImage(e: MouseEvent){
    if((e.target as Element).tagName === 'IMG') {
      let style = (((e.target as any).style) as CSSStyleDeclaration);
      let last_color = style.backgroundColor;
      style.backgroundColor = last_color === '' || last_color === 'var(--color-dark)' ? 'white' : 'var(--color-dark)';
      return;
    }

    this.imageEnlargerWrapper.nativeElement.style.display = 'none';

    let elt = this.imageEnlargerWrapper.nativeElement;
    while(elt.tagName !== "BODY") elt = elt.parentElement;
    elt.style.overflow = 'unset';
    elt.style.paddingRight = 'unset';
  }

  setTitle() {
    const translations: LANGOPTIONS = {
      'de': 'Projekte',
      'en': 'Projects'
    };
    this.titleService.setTitle(translations[this.lang] + " - Tim Klenk.de");
  }

  get lang() {
    return this.langService.lang;
  }
}
