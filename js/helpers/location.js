// Finder brugerens position - eller bruger Aalborg, hvis det ikke lykkes

const AALBORG = { latitude: 57.05, longitude: 9.92, name: "Aalborg" };


// returnerer et promise, der altid ender med en position (aldrig en fejl)
export function getLocation() {

  return new Promise(function (resolve) {

    if (!("geolocation" in navigator)) {
      resolve(AALBORG);
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          resolve({
            // 2 decimaler (ca. 1 km) er rigeligt til vejret
            latitude: Number(position.coords.latitude.toFixed(2)),
            longitude: Number(position.coords.longitude.toFixed(2)),
            name: null
          });
        },
        function (error) {
          // brugeren sagde nej, ingen signal, eller det tog for lang tid
          console.warn("Position ikke fundet, bruger Aalborg:", error.message);
          resolve(AALBORG);
        },
        { timeout: 10000, maximumAge: 30 * 60 * 1000 }
      );
    } catch (error) {
      // fx hvis browseren blokerer geolocation helt
      console.warn("Geolocation fejlede, bruger Aalborg:", error);
      resolve(AALBORG);
    }
  });
}
