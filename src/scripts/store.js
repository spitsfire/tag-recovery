import { renderRecords } from "./html";
import { injectRecordEventListeners } from "./iconHelpers";

/* one store per registerIcon() call, scoped to the elements grabbed for that page load */
export function createStore(elements) {
  const store = { data: [], expDays: undefined };
  const storeProxy = new Proxy(store, {
    get(obj, prop) {
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      if (prop === "data") {
        localStorage.setItem(elements.username, JSON.stringify(value));
        const recordsNode = document.getElementById("records-wrap");
        renderRecords(value, recordsNode);
        injectRecordEventListeners({ ...elements, value, storeProxy });
      }
      return true;
    },
  });
  return storeProxy;
}
