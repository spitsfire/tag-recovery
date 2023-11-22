<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";

  import { debounce, loadStorage } from "./scripts/helpers";
  import { records } from "./store/records.store";
  import { onMount } from "svelte";

  const regex = /(?:https:\/\/)?(?:([^.]+)\.)?dreamwidth\.org/;
  const session = { comm: undefined, username: undefined };
  let prevTextArea;
  let textarea;
  let currentRecords;
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
  };

  const reset = () => {
    textarea.value = prevTextArea;
  };

  // EVENT LISTENERS
  textarea.addEventListener(
    "keyup",
    debounce((e) => {
      const currentText = e.target.value;
      prevTextArea = e.target.value;
      setStorage(session, currentText);
    }, 5000)
  );

  // LIFECYCLE
  onMount(() => {
    session.username = document
      .querySelector("form span.ljuser")
      .getAttribute("lj:user");
    session.comm = window.location.href.match(regex)[1];
    textarea = document.querySelector("textarea");
    prevTextArea = textarea.value;
    const unsub = tags.subscribe((value) => (currentRecords = value));

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
