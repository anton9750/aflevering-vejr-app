// ATOMS - de mindste dele

import { getWeatherType } from "../helpers/weatherCodes.js";
import { getDirectionName } from "../helpers/windDirection.js";

// vises når API'et mangler en værdi (null)
const MISSING = "–";


export function weatherText(code) {
  return getWeatherType(code).text;
}


export function weatherIcon(code) {
  return getWeatherType(code).icon;
}


export function temperature(value) {
  if (value == null) {
    return MISSING;
  }
  return Math.round(value) + "°";
}


// viser nedbøren med type, fx "1.2 mm regn", "0.5 cm sne" eller begge
export function rain(value) {

  if (value == null || value.total == null) {
    return MISSING;
  }

  const parts = [];

  if (value.rain > 0) {
    parts.push(value.rain.toFixed(1) + " mm regn");
  }

  if (value.snow > 0) {
    parts.push(value.snow.toFixed(1) + " cm sne");
  }

  // nedbør, der hverken er regn eller sne (fx slud eller hagl)
  if (parts.length === 0 && value.total > 0) {
    parts.push(value.total.toFixed(1) + " mm nedbør");
  }

  if (parts.length === 0) {
    return "Ingen nedbør";
  }

  return parts.join(" + ");
}


export function wind(speed, degrees) {

  if (speed == null) {
    return MISSING;
  }

  if (degrees == null) {
    return speed.toFixed(1) + " m/s";
  }

  const name = getDirectionName(degrees);

  // pilen peger derhen hvor vinden blæser hen
  const arrow = '<span class="arrow" style="transform: rotate(' + (degrees + 180) + 'deg)" aria-hidden="true">↑</span>';

  return speed.toFixed(1) + " m/s " + arrow + " " + name;
}


// navn på ugedag, fx "ons." eller "onsdag"
export function weekday(date, format) {
  // kl. 12 så datoen ikke rykker en dag i andre tidszoner
  return new Date(date + "T12:00").toLocaleDateString("da-DK", { weekday: format });
}
