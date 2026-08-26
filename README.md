# SchoolPortal V3

SchoolPortal V3 is een uitgebreide **statische GitHub Pages-schoolportal** met twee duidelijk verschillende producten in één codebase:

- een rustige, eenvoudige leerlingomgeving;
- een veel uitgebreidere professionele docentenwerkruimte.

De applicatie gebruikt alleen HTML, CSS en vanilla JavaScript. Er is geen npm, Node.js, Next.js of server nodig om de frontend op GitHub Pages te draaien.

## GitHub Pages

Gebruik:

- **Settings → Pages**
- **Deploy from a branch**
- Branch: `main`
- Folder: `/ (root)`

## Actieve V3-bestanden

```text
SchoolPortal/
├── index.html
├── v3-data.js
├── v3-core.js
├── v3-student.js
├── v3-teacher.js
├── v3-app.js
├── v3-fixes.js
├── v3.css
├── .github/
│   └── workflows/
│       └── validate.yml
├── .nojekyll
└── README.md
```

### `v3-data.js`
Demo-database en localStorage-state. Bevat leerlingen, klassen, rooster, cijfers, presentie, opdrachten, toetsen, studiewijzers, berichten, notities en mededelingen.

### `v3-core.js`
Gedeelde helpers voor UI, datums, gemiddeldes, modals, zoeken, downloaden, toastmeldingen en state-acties.

### `v3-student.js`
De complete leerlingomgeving. De UI is bewust rustiger en eenvoudiger dan de docentkant.

### `v3-teacher.js`
De complete docentenwerkruimte met aparte navigatie, dashboard, beheerpagina's, tabellen, roosters, mentoraat en administratie.

### `v3-app.js`
Alle interactieve logica: CRUD, formulieren, drag/drop-rooster, presentie, cijfers, toetsen, opdrachten, berichten, notities, import/export en rolwissel.

### `v3-fixes.js`
Kleine event-delegationlaag voor extra robuustheid bij dynamisch gerenderde onderdelen.

### `v3.css`
Volledig nieuwe responsive UI voor leerling én docent, inclusief dark mode en mobiele layouts.

## Leerlingomgeving

De leerlingomgeving is bewust beperkt tot dagelijkse schoolzaken:

- Vandaag
- Rooster
- Studiewijzer
- Cijfers
- Berichten
- Registraties
- Profiel
- Instellingen
- Huiswerk afvinken
- Lesdetails openen
- Dark mode
- Mobiele bottom navigation
- Globaal zoeken

## Docentenomgeving

De docentkant is veel uitgebreider en heeft een compleet andere UI.

### Werkdag

- Vandaag-dashboard
- Roosterbeheer
- Lessen
- Persoonlijke afspraken
- Lesafspraken toevoegen, wijzigen en verwijderen
- Roosteritems met drag & drop verplaatsen
- Lesstatus zoals gewijzigd of uitgevallen

### Leerlingen & klassen

- Klassenoverzicht
- Nieuwe klassen maken
- Klassen bewerken
- Leerlingen zoeken
- Leerlingen aanmaken
- Leerlingen bewerken
- Leerlingen verwijderen
- Leerlingen naar andere klas verplaatsen
- CSV-demo import
- CSV export
- Leerlingdetailoverzicht
- Signalen/tags
- Contactgegevens en verzorgers

### Presentie

- Presentieregistratie per leerling
- Aanwezig
- Te laat
- Geoorloofd afwezig
- Ongeoorloofd afwezig
- Iedereen tegelijk aanwezig zetten
- Notitie per registratie
- Les afsluiten

### Resultaten

- Resultatenboek per klas
- Gewogen gemiddelden
- Resultaat invoeren
- Resultaat wijzigen
- Resultaat verwijderen
- Nieuwe toetskolommen
- Kleurcodering

### Onderwijs

- Toetsen plannen en bewerken
- Wegingen
- Concept/gepubliceerd
- Inleveropdrachten maken
- Inleverstatus volgen
- Nakijk-demo
- Herinneringen voor ontbrekende inleveringen
- Studiewijzers maken
- Studiewijzers bewerken
- Huiswerk, materiaal en toetsen aan studiewijzer toevoegen

### Mentoraat

- Mentordashboard
- Resultaten per mentorleerling
- Registraties per mentorleerling
- Signalen
- Notitieboek
- Privé/gedeelde notities
- Leerlingoverzicht

### School & beheer

- Communicatiecentrum
- Berichten naar klas, ouders of team
- Concepten en verzonden berichten
- Schoolmededelingen
- Bestanden-interface
- Administratiepagina
- Activiteitenlog
- JSON-back-up
- JSON-back-up herstellen
- Demo-data resetten
- Docentprofiel aanpassen

## Opslag

SchoolPortal V3 gebruikt localStorage:

```text
schoolportal-v3
```

Alle wijzigingen blijven dus op hetzelfde apparaat en in dezelfde browser bewaard.

## Automatische controle

De GitHub Actions-workflow `Validate SchoolPortal V3` draait automatisch bij iedere push en controleert onder andere de JavaScript-syntax met `node --check`.

## Belangrijke beperking van GitHub Pages

GitHub Pages is statische hosting. Hierdoor zijn de huidige accounts, rechten en gegevens **demo/lokaal**. Zonder externe backend kan een echte docentwijziging niet automatisch naar het apparaat van een echte leerling synchroniseren.

Voor productiegebruik kan later een externe backend zoals Supabase worden gekoppeld. De huidige frontendarchitectuur kan daarbij grotendeels behouden blijven.
