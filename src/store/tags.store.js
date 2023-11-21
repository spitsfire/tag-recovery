import { writable } from "svelte/store";
import { loadStorage, setStorage } from "./../scripts/helpers";

function createTags() {
  const { subscribe, set, update } = writable([]);
  return {
    subscribe,
    load: async (username) => {
      const result = await loadStorage(username);
      if (result) {
        set(result);
      }
    },
    save: async (comm, username, data, userStorage = undefined) => {
      const newTag = { tag: data, timestamp: new Date().getTime() };
      await setStorage(comm, username, newTag, userStorage);
      update((tags) => [...tags, newTag]);
      await loadStorage(username);
    },
    shift: (allTags, index) => {
      const temp = allTags;
      temp.unshift(temp.splice(index, 1)[0]);
      update((tags) => [...temp]);
    },
  };
}

export const tags = createTags();
