import { writable } from "svelte/store";

const tags = writable([]);

export default {
  subscribe: tags.subscribe,
  getByUsername: (username) => {
    console.log(username);
    const result = JSON.parse(localStorage.getItem(username));
    if (result) {
      console.log(result);
      return result;
    } else {
      return undefined;
    }
  },
  setByUsername: (comm, username, data, userStorage = undefined) => {
    console.log("if userStorage", userStorage);
    const newTag = { tag: data, timestamp: Date.now() };
    if (userStorage) {
      const tempStorage = [...userStorage];
      tempStorage.push(newTag);
      console.log("if currStorage. tempStorage", tempStorage);
      localStorage.setItem(username, JSON.stringify(tempStorage));
    } else {
      console.log("else", newTag);
      // const newEntry = { [username]: [newTag] };
      localStorage.setItem(username, JSON.stringify([newTag]));
    }
  },
};
