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
      const newTag = { tag: data, timestamp: Date.now() };
      await setStorage(comm, username, newTag, userStorage);
      update((tags) => [...tags, newTag]);
      loadStorage(username);
    },
  };
}

export const tags = createTags();
