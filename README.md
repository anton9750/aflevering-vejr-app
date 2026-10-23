Vejrdata: Open-Meteo.com
Appen er bygget efter MVC:

Model (model/model.js) – henter data fra API'et og laver det om til en enkel struktur: { now, updated, days: [{ date, max, min, hours: [...] }] }.
View (views/view.js) – tegner siden ud fra data. Den kender ikke til API'et.
Controller (controller.js) – styrer flowet: finder positionen, beder modellen om data, giver det til viewet og reagerer på klik.
Teknologier
HTML, CSS og JavaScript (ES-moduler) – ingen frameworks eller build-step
Geolocation API, Fetch API, localStorage
Service Worker og Cache API (PWA)
CSS-animationer, @property og conic-gradient (roterende kant)
GitHub Actions + GitHub Pages


link til figma design: https://www.figma.com/design/7pFMd2JjJIYoFWCqh4RV0N/Untitled?node-id=1-2&p=f