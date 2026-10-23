
## Kilder

- Vejrdata: [Open-Meteo.com](https://open-meteo.com/)
- Skrifttype i Halloween-tema: [Creepster](https://fonts.google.com/specimen/Creepster) (Google Fonts)
=======


Appen er bygget efter **MVC**:

- **Model** (`model/model.js`) – henter data fra API'et og laver det om til en enkel struktur: `{ now, updated, days: [{ date, max, min, hours: [...] }] }`.
- **View** (`views/view.js`) – tegner siden ud fra data. Den kender ikke til API'et.
- **Controller** (`controller.js`) – styrer flowet: finder positionen, beder modellen om data, giver det til viewet og reagerer på klik.

HTML'en er delt op efter **Atomic Design**: *atoms* → *molecules* → *organisms*, så små dele kan genbruges.

### Flowet, når siden åbner

```
main.js
  └─ start()
       ├─ getLocation()        → Promise med { latitude, longitude } (eller Aalborg)
       ├─ getWeather(location) → gemt data fra samme time, ellers fetch fra Open-Meteo
       ├─ render()             → sektionerne sættes ind på siden
       └─ timer til næste hele time → gentag
```

### Caching

| Hvad | Hvor | Strategi |
|---|---|---|
| Appens filer (HTML, CSS, JS, ikoner) | Service worker | *Stale-while-revalidate* – vis cachen med det samme, hent ny version i baggrunden |
| Vejrdata | Service worker | *Network first* – prøv nettet, brug cachen hvis offline |
| Vejrdata | `localStorage` | Genbruges i samme hele time og samme sted, så API'et ikke kaldes for tit |

Når filer ændres, skal `STATIC_CACHE` i `sw.js` have et nyt versionsnummer, så brugerne får den nye version.

---

## API

```
https://api.open-meteo.com/v1/forecast
  ?latitude=…&longitude=…
  &current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code
  &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum
  &hourly=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m
  &timezone=auto&forecast_days=5&wind_speed_unit=ms
```

Vejrkoderne følger WMO-standarden og oversættes i `helpers/weatherCodes.js`.

---

## Udgivelse (GitHub Pages)

1. Push projektet til et GitHub-repository på `main`.
2. Gå til **Settings → Pages → Source** og vælg **GitHub Actions**.
3. Workflowet i `.github/workflows/deploy.yml` udgiver siden automatisk ved hvert push.

Siden ligger derefter på `https://<brugernavn>.github.io/<repo>/`. Fordi GitHub Pages bruger `https`, virker service worker, installation og geolocation også på mobilen.

---

## Teknologier

- HTML, CSS og JavaScript (ES-moduler) – ingen frameworks eller build-step
- Geolocation API, Fetch API, `localStorage`
- Service Worker og Cache API (PWA)
- CSS-animationer, `@property` og `conic-gradient` (roterende kant)
- GitHub Actions + GitHub Pages

