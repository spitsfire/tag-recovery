import whiteLogo from "./../assets/img/main-logo-white-transparent.svg";

/* 
RETIREVES STORAGE OBJECT 
BY CURRENT USER
IF NO STORAGE,
CREATES EMPTY STARTER
*/
export function loadStorage() {
  const result = JSON.parse(localStorage.getItem("expDays"));
  if (result) {
    return { expDays: result };
  } else {
    localStorage.setItem("expDays", JSON.stringify(5));
    return { expDays: 5 };
  }
}

/*
SAVES CURRENT STORE VALUE
TO STORAGE
*/
export function setStorage(option, value) {
  localStorage.setItem(option, JSON.stringify(value));
}

export function injectBackgroundColor() {
  document.querySelector("body").id = "tag-recovery-body";
  const body = document.getElementById("tag-recovery-body");
  body.style.backgroundColor = "#af6ec3";
}

export function injectLogo() {
  const logo = document.querySelector("#logo-container img");
  logo.src = whiteLogo;
}

export function getElements() {
  const expDaysNode = document.getElementById("expiration");

  return { expDaysNode };
}

export function injectOptionsEventListeners() {
  const { expDaysNode } = getElements();
  expDaysNode.addEventListener("change", (e) =>
    setStorage("expDays", e.target.value)
  );
}
export function injectOptionsValues() {
  const { expDaysNode } = getElements();
  const { expDays } = loadStorage();
  expDaysNode.value = expDays;
}
