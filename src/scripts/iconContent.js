import {
  loadStorage,
  injectIcon,
  injectRecordEventListeners,
  grabElements,
  debounce,
  createTag,
} from "./iconHelpers";
import storeProxy from "./store";

const elements = grabElements();
let { username, textarea, prevTextArea, dwrpTools } = elements;

export function registerIcon() {
  injectIcon(storeProxy.data);
  injectRecordEventListeners({ ...elements, value: [] });
  storeProxy.data = loadStorage(username);

  /*
  WAITS A SET AMT OF INACTIVE TIME,
  THEN SAVES TEXTAREA VALUE
  IN LOCAL STORAGE
  */
  textarea.addEventListener(
    "keyup",
    debounce((e) => {
      console.log(e.target.value);
      prevTextArea = e.target.value;
      const result = createTag(e.target.value);
      if (result.id) {
        console.log([...storeProxy.data, result]);

        storeProxy.data = [...storeProxy.data, result];
      } else {
        console.log(result);
      }
    }, 3500)
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
        } else {
          console.log(result);
        }
      });
    });
  }
}

export { username, textarea, prevTextArea, dwrpTools };
