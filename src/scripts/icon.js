import browser from "webextension-polyfill";
import {
  grabElements,
  hasCommentForm,
  loadStorage,
  injectIcon,
  injectRecordEventListeners,
  createTag,
  debounce,
  showErrorBadge,
} from "./iconHelpers";
import { createStore } from "./store";
import { loadSettings } from "./settings";

async function registerIcon(settings, elements) {
  const { expDays, debounceWait, icon } = settings;
  const { username, textarea, prevTextArea, dwrpTools } = elements;
  const storeProxy = createStore(elements);
  storeProxy.expDays = expDays;
  injectIcon(storeProxy.data, icon);
  injectRecordEventListeners({
    textarea,
    prevTextArea,
    dwrpTools,
    value: [],
    storeProxy,
  });
  storeProxy.data = loadStorage(username, storeProxy.expDays);

  /*
  WAITS A SET AMT OF INACTIVE TIME,
  THEN SAVES TEXTAREA VALUE
  IN LOCAL STORAGE
  */
  textarea.addEventListener(
    "keyup",
    debounce((e) => {
      try {
        const prevTextArea = e.target.value;
        if (prevTextArea.length < 1) {
          return;
        }
        const result = createTag(e.target.value);
        if (result.id) {
          storeProxy.data = [...storeProxy.data, result];
        } else {
          throw new Error(
            "Error occured. Tag was unsuccessfully created. Report bug to Tag Recovery developer.",
          );
        }
      } catch (err) {
        console.error(err.message);
      }
    }, debounceWait),
  );
  if (dwrpTools) {
    /*
    DETECTS USE OF DWRP TOOL BUTTONS
    AND SAVES LATEST TEXTAREA INJECTION
    TO LOCAL STORAGE
    */
    dwrpTools.forEach((btn) => {
      btn.addEventListener("click", () => {
        const result = createTag(textarea.value);
        if (result.id) {
          storeProxy.data = [...storeProxy.data, result];
        }
      });
    });
  }
}

function load() {
  if (!hasCommentForm()) {
    return;
  }
  loadSettings(browser)
    .then((settings) => {
      const elements = grabElements();
      if (!elements) {
        return;
      }
      return registerIcon(settings, elements);
    })
    .catch((err) => showErrorBadge(err.message));
}

const entries = performance.getEntriesByType("navigation");
const entryTypes = entries.map((entry) => entry.type);
if (entryTypes.includes("reload") || entryTypes.includes("navigate")) {
  load();
}
