import { start } from "./controller.js";
import { setupHalloween } from "./helpers/halloween.js";

setupHalloween();

start();

registerServiceWorker();

// vis loaderen i et sekund, og fad den så ud
setTimeout(function () {
  const loader = document.getElementById("loader");

  if (loader) {
    loader.classList.add("hidden");
  }
}, 1000);


async function registerServiceWorker() {

  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    // appen virker stadig, bare ikke offline
    console.warn("Service worker kunne ikke registreres:", error);
  }
}
