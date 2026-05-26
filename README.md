# Truckonomics

Truckonomics ist ein Vercel-Projekt fuer einen deutschen TCO-Rechner fuer Diesel- und Elektro-LKW.

Live: https://truckonomics.vercel.app

## Technik

- Frontend: React, TypeScript, Vite, Tailwind CSS
- API: Vercel Serverless Functions in `api/`
- Build-Ausgabe: `dist/public`

## Lokal starten

```bash
npm install
npm run dev:vercel
```

`npm run dev:vercel` nutzt die Vercel CLI per `npx`, damit Frontend und `/api/*` lokal wie auf Vercel laufen.
Fuer reine Frontend-Arbeit ohne API reicht `npm run dev`.

## Deploy

Das Projekt ist auf Vercel ausgelegt. Vercel fuehrt aus:

```bash
npm run build
```

Die statischen Dateien landen in `dist/public`. Alle nicht-API-Routen werden per `vercel.json` auf die App zurueckgeschrieben.

## API-Endpunkte

- `POST /api/calculate-tco`: berechnet den TCO-Vergleich.
- `POST /api/leads`: nimmt Beratungsanfragen entgegen.

Fuer den Lead-Versand werden optional diese Environment Variables genutzt:

- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `RESEND_API_KEY`
