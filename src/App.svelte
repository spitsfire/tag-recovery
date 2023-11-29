<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";
  import { records } from "./store/records.store";
  import { onDestroy } from "svelte";

  const username = document
    .querySelector("form span.ljuser")
    .getAttribute("lj:user");
  const textarea = document.querySelector("textarea");
  let prevTextArea = textarea.value;
  const unsub = records.subscribe(() => console.log("subscribed"));
  records.set(loadStorage(username));
  let isClicked = false;

  // FUNCTIONS
  function clickIcon() {
    isClicked = !isClicked;
  }

  function createTag(data) {
    try {
      const newTag = { tag: data, timestamp: new Date().getTime() };
      records.update((value) => [...value, newTag]);
      return true;
    } catch (err) {
      return err;
    }
  }

  function viewTag(data) {
    textarea.value = data;
  }

  function selectTag(data, index) {
    prevTextArea = data;
    textarea.value = prevTextArea;
    isClicked = false;
    shiftTags(index);
    setStorage();
  }

  function reset() {
    textarea.value = prevTextArea;
  }

  function loadStorage() {
    const result = JSON.parse(localStorage.getItem(username));
    if (result) {
      return result;
    } else {
      localStorage.setItem(username, JSON.stringify([]));
      return [];
    }
  }

  function setStorage() {
    localStorage.setItem(username, JSON.stringify($records));
  }

  function shiftTags(index) {
    records.update((value) => value.unshift(value.splice(index, 1)[0]));
  }

  function debounce(callback, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        callback.apply(this, args);
      }, wait);
    };
  }

  // LIFECYCLE
  onDestroy(() => unsub());

  // EVENT LISTENERS
  textarea.addEventListener(
    "keyup",
    debounce((e) => {
      prevTextArea = e.target.value;
      const result = createTag(e.target.value);
      if (result === true) {
        setStorage();
      } else {
        console.log(result);
      }
    }, 5000)
  );
</script>

<Icon {clickIcon} />
<Popup bind:isClicked records={$records} {viewTag} {selectTag} {reset} />

<style>
  .qr-footer {
    z-index: 2;
    position: static;
  }
</style>
