<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";

  import { debounce } from "./scripts/helpers";
  import { onDestroy } from "svelte";
  import tagsStore from "./store/tags.store";

  // ELEMENTS
  const currentUsername = document
    .querySelector("form span.ljuser")
    .getAttribute("lj:user");
  const regex = /(?:https:\/\/)?(?:([^.]+)\.)?dreamwidth\.org/;
  const currentComm = window.location.href.match(regex)[1];
  const textarea = document.querySelector("textarea");

  // VARIABLES
  const unsub = tagsStore.subscribe((data) => console.log(data));
  let isClicked = false;

  // FUNCTIONS
  const clickIcon = () => {
    isClicked = !isClicked;
    tagsStore.getByUsername(currentUsername);
  };

  // EVENT LISTENERS
  textarea.addEventListener(
    "keyup",
    debounce(async (e) => {
      const currentData = e.target.value;
      console.log(currentUsername);
      const result = await tagsStore.getByUsername(currentUsername);
      if (result) {
        tagsStore.setByUsername(
          currentComm,
          currentUsername,
          currentData,
          result
        );
      } else {
        tagsStore.setByUsername(currentComm, currentUsername, currentData);
      }
    }, 1000)
  );

  onDestroy(() => unsub());
</script>

<Icon {clickIcon} />
<Popup bind:isClicked records={tagsStore} />

<style>
  .qr-footer {
    z-index: 2;
    position: static;
  }
</style>
