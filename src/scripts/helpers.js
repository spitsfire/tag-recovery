import { records } from "./../store/records.store";
/* 
WAITS FOR KEYUP EVENT TIMEOUT
IF KEYUP RESUMES, TIMEOUT IS RESET
*/
export const debounce = (callback, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
};

/* 
RETIREVES STORAGE OBJECT 
BY CURRENT USER'S COMMUNITY SUBDOMAIN
*/
export const loadStorage = (username) => {
  const result = JSON.parse(localStorage.getItem(username));
  if (result) {
    return result;
  } else {
    return undefined;
  }
};
/* 
FILTERS CURRENT USER'S COMMUNITY SUBDOMAIN
BY USERNAME
*/
export const filterByUsername = (storage, username) => {
  return storage.filter((tag) => tag.username === username);
};
/*
ADDS NEW TAG TO RECORDS STORE
*/
export const createTag = (data) => {
  const newTag = { tag: data, timestamp: new Date() };
  records.update((value) => [...value, data]);
};

/* 
SAVES LATEST STORE BY
CURRENT USER'S COMMUNITY SUBDOMAIN
*/
export const setStorage = ({ comm, username }, newTag) => {
  if ($records) {
    const tempStorage = [...$records];
    tempStorage.push(newTag);
    localStorage.setItem(username, JSON.stringify(tempStorage));
  } else {
    localStorage.setItem(username, JSON.stringify([newTag]));
  }
};

export const formatDate = (date) => {
  const hh = date.getHours() % 12 || 12;
  const min =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const mer = date.getHours() >= 12 ? "pm" : "am";
  const localDate = `${hh}:${min}${mer} - ${mm}/${dd}`;
  return localDate;
};
