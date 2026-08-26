# SchoolPortal

Een volledig statisch schoolportaal-prototype voor **GitHub Pages**. Er is geen npm, Node.js, Next.js of backend nodig.

## Starten met GitHub Pages

1. Open deze repository op GitHub.
2. Ga naar **Settings → Pages**.
3. Kies bij **Build and deployment**: `Deploy from a branch`.
4. Branch: `main`.
5. Folder: `/ (root)`.
6. Klik **Save**.

Daarna wordt de site gepubliceerd via GitHub Pages.

## Bestanden

- `index.html` – de complete applicatie-shell
- `style.css` – responsive design, dark mode en animaties
- `script.js` – alle pagina's en interactieve functies
- `.nojekyll` – zorgt dat GitHub Pages de bestanden rechtstreeks serveert

## Ingebouwde onderdelen

### Leerling
Dashboard, rooster, huiswerk, toetsen, cijfers, absenties, vakken, berichten, bestanden, profiel en instellingen.

### Docent
Dashboard, rooster, klassen, aanwezigheid registreren, opdrachten aanmaken, cijfers invoeren, berichten, bestanden, profiel en instellingen.

## Opslag

Deze GitHub Pages-versie gebruikt `localStorage`. Daardoor blijven onder andere afgevinkt huiswerk, ingevoerde cijfers, aanwezigheid, instellingen en aangemaakte demo-opdrachten op hetzelfde apparaat bewaard na een refresh.

GitHub Pages is een statische host en heeft zelf geen privé-database of serverlogin. Voor accounts die tussen verschillende apparaten synchroniseren is later een externe backend nodig, bijvoorbeeld Supabase. De huidige site werkt zonder zo'n backend volledig als interactieve demo/prototype.
