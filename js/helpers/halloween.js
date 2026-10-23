// Halloween-tema, som kun kan slås til i oktober

const STORAGE_KEY = "vejr-halloween";
const OCTOBER = 9; // getMonth() tæller fra 0, så oktober er 9


export function setupHalloween() {

  const button = document.getElementById("halloween-toggle");

  if (!button) {
    return;
  }

  // uden for oktober: ingen knap og intet tema
  if (new Date().getMonth() !== OCTOBER) {
    setTheme(button, false);
    return;
  }

  button.hidden = false;

  setTheme(button, loadChoice());

  button.addEventListener("click", function () {
    const on = !document.body.classList.contains("halloween");

    setTheme(button, on);
    saveChoice(on);
  });
}


function setTheme(button, on) {
  document.body.classList.toggle("halloween", on);
  button.setAttribute("aria-pressed", on);
}


function loadChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch (error) {
    return false;
  }
}


function saveChoice(on) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch (error) {
    // valget huskes bare ikke til næste gang
  }
}
