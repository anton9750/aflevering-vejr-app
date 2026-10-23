// VIEW - sætter HTML ind på siden

import { nowSection, forecastSection, daySection } from "../components/organisms.js";
import { showWeatherEffect } from "../helpers/weatherEffect.js";

const app = document.getElementById("app");
const status = document.getElementById("status");
const title = document.getElementById("title");


export function showStatus(text) {
  status.textContent = text;
}


// name er null, når vi bruger brugerens egen position
export function showPlace(name) {
  if (name) {
    title.textContent = "Vejr i " + name;
  } else {
    title.textContent = "Vejret hvor du er";
  }
}


export function render(weather, selectedDay, onDayClick) {

  // husk om brugeren stod på en dag-knap, så fokus ikke forsvinder
  const hadFocus = document.activeElement !== null && document.activeElement.classList.contains("day-card");

  try {
    showWeatherEffect(weather.now.code);
  } catch (error) {
    console.warn("Vejreffekten kunne ikke vises:", error);
  }

  app.innerHTML =
    nowSection(weather.now) +
    forecastSection(weather.days, selectedDay) +
    daySection(weather.days[selectedDay]);

  // klik på en dag
  const buttons = document.querySelectorAll(".day-card");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      onDayClick(Number(button.dataset.day));
    });
  });

  if (hadFocus) {
    buttons[selectedDay].focus();
  }
}
