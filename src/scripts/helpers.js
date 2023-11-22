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
  try {
    const newTag = { tag: data, timestamp: new Date().getTime() };
    records.update((value) => [...value, data]);
    return true;
  } catch (err) {
    return err;
  }
};
/*
TAKES THE SELECTED TAG 
AND MOVES IT TO THE FRONT AS THE LATEST TAG
*/
export const shiftTags = (index) => {
  records.update((value) => value.unshift(value.splice(index, 1)[0]));
};
/* 
SAVES LATEST STORE BY
CURRENT USER'S COMMUNITY SUBDOMAIN
*/
export const setStorage = (username) => {
  localStorage.setItem(username, JSON.stringify($records));
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
