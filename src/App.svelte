<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";
  // import { debounce, setStorageByComm } from "./scripts/helpers";

  // ELEMENTS
  const currentUsername = document.querySelectorAll("form span.ljuser")[0];
  const regex = /(?:https:\/\/)?(?:([^.]+)\.)?dreamwidth\.org/;
  const currentComm = window.location.href.match(regex)[1];
  const textarea = document.querySelector("textarea");

  let isClicked = false;
  const clickIcon = () => {
    console.log("was clicked", !isClicked);
    isClicked = !isClicked;
  };

  // textarea.addEventListener(
  //   "keyup",
  //   debounce((e) => {
  //     const currentData = e.target.value;
  //     setStorageByComm(currentComm, currentUsername, currentData);
  //   }, 5000)
  // );
</script>

<Popup bind:isClicked />
<Icon {clickIcon} />
