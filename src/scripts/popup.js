import browser from "webextension-polyfill";
import { ICON_SVGS, loadSettings } from "./settings";
import { injectBackgroundColor } from "./pageChrome";
import "../styles/whats-new.css";

function getElements() {
  const expDaysNode = document.getElementById("expiration");
  const debounceWaitNode = document.getElementById("debounceWait");
  const iconNodes = document.querySelectorAll('input[name="logo"]');

  return { expDaysNode, debounceWaitNode, iconNodes };
}

function injectOptionsEventListeners() {
  const { expDaysNode, debounceWaitNode, iconNodes } = getElements();
  expDaysNode.addEventListener("change", (e) =>
    browser.storage.local.set({ expDays: Number(e.target.value) }),
  );
  debounceWaitNode.addEventListener("change", (e) =>
    browser.storage.local.set({ debounceWait: Number(e.target.value) }),
  );
  iconNodes.forEach((iconNode) =>
    iconNode.addEventListener("change", (e) => {
      if (e.target.checked) {
        browser.storage.local.set({ icon: ICON_SVGS[e.target.value] });
      }
    }),
  );
}
async function injectOptionsValues({ expDays, debounceWait, icon }) {
  const { expDaysNode, debounceWaitNode, iconNodes } = getElements();
  expDaysNode.value = expDays;
  debounceWaitNode.value = debounceWait;
  iconNodes.forEach((iconNode) => {
    iconNode.checked = ICON_SVGS[iconNode.value] === icon;
  });
}

function registerPopup(settings) {
  injectBackgroundColor();
  injectOptionsValues(settings);
  injectOptionsEventListeners();
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    loadSettings(browser)
      .then((settings) => registerPopup(settings))
      .catch((err) => console.log(err));
  }
};
