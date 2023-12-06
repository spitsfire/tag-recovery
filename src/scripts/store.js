import {
  grabElements,
  loadStorage,
  injectRecordEventListeners,
} from "./iconHelpers";
import { recordsHtml } from "./html";

const elements = grabElements();
const { username } = elements;

const store = { data: loadStorage(username), expDays: 5 };
const storeProxy = new Proxy(store, {
  get(obj, prop) {
    return obj[prop];
  },
  set(obj, prop, value) {
    localStorage.setItem(username, JSON.stringify(value));
    obj[prop] = value;
    const recordsNode = document.getElementById("records-wrap");
    recordsNode.innerHTML = recordsHtml(value);
    injectRecordEventListeners({ ...elements, value: value });
    return true;
  },
});

export default storeProxy;
