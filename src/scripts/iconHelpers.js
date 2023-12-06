import { recordsCss } from "./css";
import { recordsHtml, iconHtml } from "./html";
import { prevTextArea, textarea, username } from "./iconContent";
import { nanoid } from "nanoid";
import storeProxy from "./store";

/*
FILTERS THRU RECORDS
BASED ON AMT OF DAYS PASSED IN
*/
function checkExpByDays(data, amt) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - amt);
  const filteredData = data.filter(
    (record) => new Date(record.timestamp) > targetDate
  );
  return filteredData;
}

function findElementId() {
  return (
    document.getElementById("previewplaceholder") ||
    document.getElementsByName("submitpreview")[0]
  );
}

/* 
=======================
|       EXPORTS       |
=======================
*/

export function grabElements() {
  const username = document
    .querySelector("form span.ljuser")
    .getAttribute("lj:user");
  const textarea = document.querySelector("textarea");
  let dwrpTools = document.querySelectorAll("input.custom-button");
  let prevTextArea = textarea.value;

  return { username, textarea, prevTextArea, dwrpTools };
}

/* 
RETIREVES STORAGE OBJECT 
BY CURRENT USER
IF NO STORAGE,
CREATES EMPTY STARTER
*/
export function loadStorage(username) {
  const result = JSON.parse(localStorage.getItem(username));
  if (result) {
    const filteredResult = checkExpByDays(result, 5);
    return filteredResult;
  } else {
    localStorage.setItem(username, JSON.stringify([]));
    return [];
  }
}

/*
SAVES CURRENT STORE VALUE
TO STORAGE
*/
export function setStorage(username, value) {
  localStorage.setItem(username, JSON.stringify(value));
}

export function injectIcon(data) {
  const style = document.createElement("style");
  style.innerHTML = recordsCss();
  document.getElementsByTagName("head")[0].appendChild(style);

  const iconNode = document.createElement("div");
  iconNode.id = "tag-recovery-container";
  iconNode.innerHTML = iconHtml();

  const recordsNode = document.createElement("div");
  recordsNode.id = "records-wrap";
  recordsNode.className = "hide";
  recordsNode.innerHTML = recordsHtml(data);

  /*
  WHEN ICON IS CLICKED
  RECORD CONTAINER IS OPENED/CLOSED
  */
  iconNode.addEventListener("click", () => {
    recordsNode.className === "hide"
      ? (recordsNode.className = "visible")
      : (recordsNode.className = "hide");
  });

  const anchor = findElementId();
  anchor.after(iconNode, recordsNode);
}

export function injectRecordEventListeners({
  username,
  textarea,
  prevTextArea,
  value,
}) {
  const recordsNode = document.getElementById("records-wrap");
  const recordsEl = document.querySelectorAll("#records-table tr");
  if (recordsEl.length < 2 && recordsEl[0].children[0].id === "no-texts") {
    return;
  }
  recordsEl.forEach((record) => {
    const sameRecord = value.filter((r) => r.id === record.id);
    record.addEventListener("click", (e) => {
      selectTag(username, textarea, prevTextArea, sameRecord[0]);
      recordsNode.className =
        recordsNode.className === "hide"
          ? (recordsNode.className = "visible")
          : (recordsNode.className = "hide");
    });
    record.addEventListener("mouseover", (e) =>
      viewTag(textarea, sameRecord[0].tag)
    );
    record.addEventListener("mouseout", (e) => reset());
  });
}

/*
ADDS NEW TAG TO RECORDS STORE
*/
export function createTag(data) {
  try {
    const newTag = {
      id: nanoid(),
      tag: data,
      timestamp: new Date().getTime(),
    };
    return newTag;
  } catch (err) {
    return err;
  }
}

/*
UPDATES TEXTAREA WITH THE CURRENTLY VIEWED
OR "FOCUSED" ON TAG
*/
function viewTag(textarea, data) {
  textarea.value = data;
}

/*
TAKES THE SELECTED TAG 
AND MOVES IT TO THE FRONT AS THE LATEST TAG
*/
function selectTag(username, textarea, prevTextArea, record) {
  prevTextArea = record.tag;
  textarea.value = prevTextArea;
  storeProxy.data = shiftTags(record, storeProxy.data);
}

/*
MOVES THE SLECTED TAG
TO THE TOP OF THE ARRAY
AND UPDATES ITS TIMESTAMP
*/
function shiftTags(record, data) {
  record.timestamp = new Date().getTime();
  const filteredArray = data.filter((d) => d.id !== record.id);
  filteredArray.push(record);
  return filteredArray;
}
/*
RESETS THE TEXTAREA
TO ITS PREVIOUS VALUE
*/
function reset() {
  textarea.value = prevTextArea;
}

/* 
WAITS FOR KEYUP EVENT TIMEOUT
IF KEYUP RESUMES, TIMEOUT IS RESET
*/
export function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}
