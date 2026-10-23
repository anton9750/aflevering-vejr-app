<<<<<<< HEAD
<p align="center">
  <img src="icons/icon-192.png" alt="Vejr-appens ikon" width="96">
</p>

<h1 align="center">Vejr – lokalt vejr</h1>

<p align="center">
  En vejr-app, der viser vejret <b>der hvor du er</b> – lige nu, de næste 5 dage og time for time.<br>
  Lavet i ren HTML, CSS og JavaScript og kan installeres som en app (PWA).
</p>

---

## Intro

Når du åbner appen, spørger den om lov til at bruge din position. Siger du ja, får du vejret for præcis dér, hvor du står. Siger du nej – eller kan positionen ikke findes – viser appen vejret i **Aalborg** i stedet.

Vejrdata kommer fra [Open-Meteo](https://open-meteo.com/), som er gratis og ikke kræver en API-nøgle. Appen er bygget uden frameworks og bruger kun browserens egne værktøjer: Geolocation API, Fetch API, `localStorage` og en service worker.

## Funktionalitet

### 📍 Vejret hvor du er
Appen bruger `navigator.geolocation.getCurrentPosition()` til at finde din position. Den er pakket ind i et Promise, der altid giver en position tilbage – din egen eller Aalborg som fallback. Overskriften viser, hvilken der bruges: *"Vejret hvor du er"* eller *"Vejr i Aalborg"*.

### 🌤️ Lige nu
Den aktuelle temperatur, vejrtype (fx *Delvist skyet*), vindhastighed med en pil for vindretningen og nedbør.

### 📅 5 dages udsigt
Et kort for hver af de næste 5 dage med ikon, højeste/laveste temperatur og nedbør. Klik på en dag for at vælge den.

### 🕒 Time for time
Den valgte dag vist hver 3. time med tid, vejr, temperatur, nedbør og vind.

### ⏱️ Opdatering hver hele time
For ikke at kalde API'et for tit gemmes svaret i `localStorage` sammen med tidspunkt og position. Data genbruges, så længe det er samme hele time og samme sted. Mens siden er åben, hentes nyt vejr automatisk kl. 10:00, 11:00, 12:00 osv. Under statuslinjen står, hvornår data er fra.

### 📴 Virker offline
En service worker gemmer appens filer og det seneste vejr. Uden internet åbner appen stadig og viser det sidst hentede vejr.

### 📲 Kan installeres
Med manifest og ikoner kan appen installeres på computer og mobil og åbner så i sit eget vindue med eget ikon.

### 🌧️ Vejreffekter
Baggrunden følger vejret: regndråber falder, når det regner, og solstråler glider hen over skærmen, når det er klart.

### 🎃 Halloween-tema (kun i oktober)
I oktober dukker en knap op øverst til højre. Den slår et orange/sort tema til med græskarlygter i siderne og en uhyggelig, flimrende overskrift. Valget huskes, og temaet forsvinder af sig selv efter oktober.

### ✨ Design og tilgængelighed
- Farverigt design i grøn, blå og orange med en roterende farvekant om sektionerne
- Animeret loader, når siden åbner
- Responsivt layout til både mobil og computer
- Animationer slås fra, hvis brugeren har valgt *"reducer bevægelse"*
- Fejl håndteres med `try/catch`, så brugeren får en forståelig besked

## Sådan kører du den

Appen skal køres fra en webserver (ikke ved at åbne filen direkte), fordi moduler, service worker og geolocation kræver `localhost` eller `https`.

- **VS Code:** højreklik på `index.html` → **Open with Live Server**
- **Python:** `python -m http.server 8000` og åbn `http://localhost:8000/`

> 💡 Tilføj `?fx=rain` eller `?fx=sun` til adressen for at se vejreffekterne uanset vejret.

## Opbygning

Koden følger **MVC** og **Atomic Design**:

```
js/
├── main.js           Startpunkt
├── controller.js     Binder model og view sammen
├── model/model.js    Henter og omformer vejrdata
├── views/view.js     Tegner siden
├── components/       atoms → molecules → organisms
└── helpers/          position, vejrkoder, vindretning, effekter, halloween
```

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

## Kilder

- Vejrdata: [Open-Meteo.com](https://open-meteo.com/)
- Skrifttype i Halloween-tema: [Creepster](https://fonts.google.com/specimen/Creepster) fra Google Fonts
>>>>>>> 14d6492b40535484118901044243c8795efb9c83
