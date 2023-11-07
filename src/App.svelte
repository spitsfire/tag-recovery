<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";
  import {
    debounce,
    setStorageByComm,
    getStorageByComm,
  } from "./scripts/helpers";

  // ELEMENTS
  const currentUsername = document
    .querySelector("form span.ljuser")
    .getAttribute("lj:user");
  const regex = /(?:https:\/\/)?(?:([^.]+)\.)?dreamwidth\.org/;
  const currentComm = window.location.href.match(regex)[1];
  const textarea = document.querySelector("textarea");

  let isClicked = false;
  const clickIcon = () => {
    console.log("was clicked", !isClicked);
    isClicked = !isClicked;
  };

  textarea.addEventListener(
    "keyup",
    debounce((e) => {
      const currentData = e.target.value;
      console.log(currentUsername);
      const result = getStorageByComm(currentUsername);
      if (result) {
        setStorageByComm(currentComm, currentUsername, currentData, result);
      } else {
        setStorageByComm(currentComm, currentUsername, currentData);
      }
    }, 1000)
  );
</script>

<Popup bind:isClicked />
<Icon {clickIcon} />
