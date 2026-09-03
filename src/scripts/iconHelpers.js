import { recordsCss } from "./css";
import { createIcon, renderRecords } from "./html";

/* cheap, non-throwing check so pages without a comment form are silently skipped */
export function hasCommentForm() {
  return !!document.querySelector("textarea#body, textarea#draft");
}

function grabSelectedTextArea() {
  if (document.querySelector("textarea#body")) {
    return document.querySelector("textarea#body");
  } else if (document.querySelector("textarea#draft")) {
    return document.querySelector("textarea#draft");
  } else {
    throw new Error(
      "Could not find appropriate textarea. Report bug to Tag Recovery developer.",
    );
  }
}

/* #cookieuser always holds the browser's logged-in user, unlike lj:user spans which can reference other posters/commenters */
function grabLoggedInUsername() {
  const cookieUserInput = document.querySelector(
    "input[name='cookieuser']#cookieuser",
  );
  if (cookieUserInput && cookieUserInput.value) {
    return cookieUserInput.value;
  }
  /* the usertype=cookieuser radio only exists when DW itself considers this browser logged in */
  const pageThinksLoggedIn = document.querySelector(
    "input[name='usertype'][value='cookieuser']",
  );
  if (!pageThinksLoggedIn) {
    return null;
  }
  throw new Error(
    "Could not find logged-in username (#cookieuser). Report bug to Tag Recovery developer.",
  );
}

export function grabElements() {
  const username = grabLoggedInUsername();
  if (!username) {
    return null;
  }
  const textarea = grabSelectedTextArea();
  let dwrpTools = document.querySelectorAll("input.custom-button");
  let prevTextArea = textarea.value;
  return { username, textarea, prevTextArea, dwrpTools };
}

/*
FILTERS THRU RECORDS
BASED ON AMT OF DAYS PASSED IN
*/
function checkExpByDays(data, amt) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - amt);
  const filteredData = data.filter(
    (record) => new Date(record.timestamp) > targetDate,
  );
  return filteredData;
}

function findElementId() {
  if (document.getElementById("previewplaceholder")) {
    return document.getElementById("previewplaceholder");
  } else if (document.getElementsByName("submitpreview")[0]) {
    return document.getElementsByName("submitpreview")[0];
  } else if (document.getElementById("prop_taglist")) {
    return document.getElementById("prop_taglist");
  } else if (document.querySelector(".qr-footer")) {
    /* last resort: drop it inside the footer itself rather than beside a specific control */
    return document.querySelector(".qr-footer");
  } else {
    throw new Error(
      "Could not find appropriate placement for Tag Recovery icon. Report bug to Tag Recovery developer.",
    );
  }
}

/*
SHOWS A SMALL, DISMISSIBLE BADGE
WHEN INJECTION FAILS SO IT ISN'T SILENTLY SWALLOWED
*/
export function showErrorBadge(message) {
  console.error(message);
  if (document.getElementById("tag-recovery-error")) {
    return;
  }
  const badge = document.createElement("div");
  badge.id = "tag-recovery-error";
  badge.style.cssText =
    "position:fixed;bottom:12px;right:12px;z-index:99999;max-width:320px;" +
    "background:#b30000;color:#fff;font-size:12px;font-family:sans-serif;" +
    "padding:8px 28px 8px 10px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.3);";
  badge.textContent = `Tag Recovery: ${message}`;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "\u00d7";
  closeBtn.setAttribute("aria-label", "Dismiss Tag Recovery error");
  closeBtn.style.cssText =
    "position:absolute;top:2px;right:6px;background:none;border:none;" +
    "color:#fff;font-size:14px;line-height:1;cursor:pointer;";
  closeBtn.addEventListener("click", () => badge.remove());

  badge.appendChild(closeBtn);
  document.body.appendChild(badge);
}

/*
RETIREVES STORAGE OBJECT
BY CURRENT USER
IF NO STORAGE,
CREATES EMPTY STARTER
*/
export function loadStorage(username, expDaysValue) {
  const result = JSON.parse(localStorage.getItem(username));
  if (result) {
    const filteredResult = checkExpByDays(result, expDaysValue);
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

export function injectIcon(data, iconSvg) {
  const style = document.createElement("style");
  style.textContent = recordsCss();
  document.getElementsByTagName("head")[0].appendChild(style);

  const iconNode = document.createElement("div");
  iconNode.id = "tag-recovery-container";
  iconNode.appendChild(createIcon(iconSvg));

  const recordsNode = document.createElement("div");
  recordsNode.id = "records-wrap";
  recordsNode.className = "hide";
  renderRecords(data, recordsNode);

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
  textarea,
  prevTextArea,
  value,
  storeProxy,
}) {
  const recordsNode = document.getElementById("records-wrap");
  const recordsEl = document.querySelectorAll("#records-table tr");
  if (recordsEl.length === 0) {
    return;
  }
  if (recordsEl.length < 2 && recordsEl[0].children[0].id === "no-texts") {
    return;
  }
  recordsEl.forEach((record) => {
    const sameRecord = value.filter((r) => r.id === record.id);
    record.addEventListener("click", () => {
      selectTag(textarea, sameRecord[0], storeProxy);
      recordsNode.className =
        recordsNode.className === "hide"
          ? (recordsNode.className = "visible")
          : (recordsNode.className = "hide");
    });
    record.addEventListener("mouseover", () =>
      viewTag(textarea, sameRecord[0].tag),
    );
    record.addEventListener("mouseout", () => reset(textarea, prevTextArea));
  });
}

/*
ADDS NEW TAG TO RECORDS STORE
*/
export function createTag(data) {
  try {
    const newTag = {
      id: (Math.random() + 1).toString(36).substring(2),
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
function selectTag(textarea, record, storeProxy) {
  textarea.value = record.tag;
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
function reset(textarea, prevTextArea) {
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
