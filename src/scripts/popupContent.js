import {
  injectBackgroundColor,
  injectLogo,
  injectOptionsValues,
  injectOptionsEventListeners,
} from "./popupHelpers";

// const elements = getElements();
// let { expDaysNode } = elements;

// const storage = loadStorage();
// let { expDays } = storage;

export function registerPopup() {
  injectBackgroundColor();
  injectLogo();
  injectOptionsValues();
  injectOptionsEventListeners();
}
