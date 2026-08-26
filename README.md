# SchoolPortal v2

SchoolPortal is een uitgebreid leerling- en docentenportaal dat volledig als **statische GitHub Pages-app** draait. Er is geen npm, Node.js, Next.js of server nodig.

## GitHub Pages

Stel de repository in op:

- **Settings → Pages**
- **Deploy from a branch**
- Branch: `main`
- Folder: `/ (root)`

De app gebruikt alleen HTML, CSS en vanilla JavaScript.

## Architectuur

```text
SchoolPortal/
├── index.html
├── portal-data.js
├── portal-core.js
├── portal-pages.js
├── portal-actions.js
├── portal-v2.css
├── .nojekyll
└── README.md
```

### `index.html`
De applicatie-shell: sidebar, topbar, zoekveld, modal en alle scriptimports.

### `portal-data.js`
De uitgebreide demo-datalaag met vakken, docenten, leerlingen, rooster, cijfers, huiswerk, toetsen, berichten, absenties, bestanden, opdrachten en standaardinstellingen.

### `portal-core.js`
De applicatie-engine: state, localStorage, routing, rolwissel, thema, zoeken, modals, helpers, import/export en algemene rendering.

### `portal-pages.js`
Alle leerling- en docentpagina's en grote UI-renderers.

### `portal-actions.js`
Alle interactieve functies: toevoegen, verwijderen, afvinken, cijfers opslaan, aanwezigheid registreren, berichten versturen, opdrachten beheren, mededelingen plaatsen, mentor-notities en meer.

### `portal-v2.css`
De complete responsive UI-laag met dark mode, meerdere accentkleuren, desktop/tablet/mobiel, animaties, modals, tabellen, rooster, berichteninterface en printweergave.

## Leerlingfuncties

- Dashboard
- Weekrooster
- Roosterwijzigingen en lesuitval
- Huiswerk bekijken, toevoegen, afvinken, filteren en verwijderen
- Toetsen en herinneringen
- Cijfers, wegingen en gewogen gemiddeldes
- Gemiddelde per vak
- Absenties en lokale ziekmeldingen
- Vakkenoverzicht
- Mededelingen
- Berichten en gesprekken
- Bestandenoverzicht
- Profiel wijzigen
- Dark mode
- Accentkleuren
- Compacte modus
- Lokale backup exporteren/importeren

## Docentfuncties

- Docentdashboard
- Eigen weekrooster
- Klassenoverzicht
- Aanwezigheid per leerling registreren
- Iedereen in één keer aanwezig zetten
- Opdrachten aanmaken
- Publiceren/depubliceren
- Inleverstatus bekijken
- Cijfers invoeren en verwijderen
- Mentorklasoverzicht
- Leerlingdetails
- Mentornotities
- Mededelingen publiceren, vastzetten en verwijderen
- Berichten
- Bestanden
- Profiel en instellingen

## Opslag

SchoolPortal gebruikt `localStorage` onder de sleutel:

```text
schoolportal-v2-state
```

Daardoor blijven wijzigingen na een refresh op hetzelfde apparaat bestaan.

Via **Instellingen → Lokale data** kan de gebruiker:

- een JSON-backup downloaden;
- een eerdere backup importeren;
- alle demo-data herstellen.

## Belangrijk over GitHub Pages

GitHub Pages is statische hosting. Daardoor kan deze versie **geen veilige echte gebruikersaccounts, privé-database of server-side rechten** aanbieden. De portal is wel volledig interactief als lokale demo/prototype.

Voor echte synchronisatie tussen leerlingen/docenten/apparaten kan later bijvoorbeeld Supabase worden gekoppeld, terwijl deze frontend grotendeels behouden kan blijven.
