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
    console.log(result);
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
SAVES NEW TEXTAREA DATA 
BY CURRENT USER'S COMMUNITY SUBDOMAIN
*/
export const setStorage = (comm, username, newTag, userStorage) => {
  if (userStorage) {
    const tempStorage = [...userStorage];
    tempStorage.push(newTag);
    localStorage.setItem(username, JSON.stringify(tempStorage));
  } else {
    console.log("else", newTag);
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
