<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";

  import { debounce } from "./scripts/helpers";
  import { onDestroy } from "svelte";
  import { tags } from "./store/tags.store";

  // ELEMENTS
  const currentUsername = document
    .querySelector("form span.ljuser")
    .getAttribute("lj:user");
  const regex = /(?:https:\/\/)?(?:([^.]+)\.)?dreamwidth\.org/;
  const currentComm = window.location.href.match(regex)[1];
  const textarea = document.querySelector("textarea");
  let prevTextArea = textarea.value;

  // VARIABLES
  const unsub = tags.subscribe((data) => console.log(data));
  let isClicked = false;

  // FUNCTIONS
  const clickIcon = () => {
    isClicked = !isClicked;
    tags.load(currentUsername);
  };

  const selectTag = (data, index) => {
    textarea.value = data;
  };

  const reset = () => {
    textarea.value = prevTextArea;
  };

  // EVENT LISTENERS
  textarea.addEventListener(
    "keyup",
    debounce(async (e) => {
      const currentData = e.target.value;
      prevTextArea = e.target.value;
      if ($tags) {
        tags.save(currentComm, currentUsername, currentData, $tags);
      } else {
        tags.save(currentComm, currentUsername, currentData);
      }
    }, 1000)
  );

  onDestroy(() => unsub());
</script>

<Icon {clickIcon} />
<Popup bind:isClicked records={$tags} {selectTag} {reset} />

<style>
  .qr-footer {
    z-index: 2;
    position: static;
  }
</style>
