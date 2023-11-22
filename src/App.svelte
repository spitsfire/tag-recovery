<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";

  import {
    createTag,
    debounce,
    loadStorage,
    setStorage,
    shiftTags,
  } from "./scripts/helpers";
  import { records } from "./store/records.store";
  import { onMount } from "svelte";

  // const regex = /(?:https:\/\/)?(?:([^.]+)\.)?dreamwidth\.org/;
  let username;
  // let comm;
  let prevTextArea;
  let textarea;
  let isClicked = false;

  // FUNCTIONS
  const clickIcon = () => {
    isClicked = !isClicked;
    records.set(loadStorage(currentUsername));
  };

  const viewTag = (data) => {
    textarea.value = data;
  };

  const selectTag = (data, index) => {
    prevTextArea = data;
    textarea.value = prevTextArea;
    isClicked = false;
    shiftTags(index);
    setStorage(username);
  };

  const reset = () => {
    textarea.value = prevTextArea;
  };

  // EVENT LISTENERS
  textarea.addEventListener(
    "keyup",
    debounce((e) => {
      prevTextArea = e.target.value;
      const result = createTag(e.target.value);
      if (result === true) {
        setStorage(username);
      } else {
        console.log(result);
      }
    }, 5000)
  );

  // LIFECYCLE
  onMount(() => {
    username = document
      .querySelector("form span.ljuser")
      .getAttribute("lj:user");
    // comm = window.location.href.match(regex)[1];
    textarea = document.querySelector("textarea");
    prevTextArea = textarea.value;
    const unsub = records.subscribe((value) => (currentRecords = value));
    records.set(loadStorage(username));

    return () => unsub();
  });
</script>

<Icon {clickIcon} />
<Popup bind:isClicked records={$records} {viewTag} {selectTag} {reset} />

<style>
  .qr-footer {
    z-index: 2;
    position: static;
  }
</style>
