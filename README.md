# SchoolPortal

Een modern leerling- en docentenportaal gebouwd met Next.js, TypeScript en React.

## In deze versie

### Leerling
- Dashboard met dagoverzicht, cijfers, huiswerk en berichten
- Weekrooster
- Huiswerk afvinken
- Toetsenoverzicht
- Cijferoverzicht en gemiddelde
- Absenties
- Vakken
- Berichten
- Bestanden
- Profiel
- Instellingen + dark mode

### Docent
- Docentendashboard
- Eigen rooster
- Klassenoverzicht
- Aanwezigheid interactief registreren
- Opdrachtenoverzicht
- Cijfers invoeren en opslaan (prototype state)
- Berichten
- Bestanden
- Profiel
- Instellingen + dark mode

## Starten

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

## Architectuur

De huidige versie is bewust een volledig interactieve frontend-prototype met lokale state. De volgende stap is het aansluiten van Supabase voor echte authenticatie, rollen, PostgreSQL-data, realtime berichten, uploads en persistentie.

## Belangrijk

SchoolPortal is een zelfstandig project en gebruikt geen afgeschermde Somtoday-code, logo's of ongeautoriseerde API-toegang.
