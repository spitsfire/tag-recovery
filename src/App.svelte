<script>
  import Icon from "./components/Icon.svelte";
  import Popup from "./components/Popup.svelte";
  import { records } from "./store/records.store";
  import { onDestroy } from "svelte";
  import { nanoid } from "nanoid";

  const username = document
    .querySelector("form span.ljuser")
    .getAttribute("lj:user");
  const textarea = document.querySelector("textarea");
  let prevTextArea = textarea.value;
  const unsub = records.subscribe((data) => console.log(data));
  // the store
  records.set(loadStorage(username));
  let isClicked = false;

  /* 
  =======================
  |      FUNCTIONS      |
  =======================
  */

  /*
  TOGGLES ISCLICKED BOOLEAN
  TO TURN ON/OFF POPUP COMPONENT
  */
  function clickIcon() {
    isClicked = !isClicked;
  }

  /*
  ADDS NEW TAG TO RECORDS STORE
  */
  function createTag(data) {
    try {
      const newTag = {
        id: nanoid(),
        tag: data,
        timestamp: new Date().getTime(),
      };
      records.update((value) => {
        value.push(newTag);
        return value;
      });
      return true;
    } catch (err) {
      return err;
    }
  }

  /*
  UPDATES TEXTAREA WITH THE CURRENTLY VIEWED
  OR "FOCUSED" ON TAG
  */
  function viewTag(data) {
    textarea.value = data;
  }

  /*
  TAKES THE SELECTED TAG 
  AND MOVES IT TO THE FRONT AS THE LATEST TAG
  */
  function selectTag(record) {
    prevTextArea = record.tag;
    textarea.value = prevTextArea;
    clickIcon();
    shiftTags(record);
    setStorage();
  }

  /*
  RESETS THE TEXTAREA
  TO ITS PREVIOUS VALUE
  */
  function reset() {
    textarea.value = prevTextArea;
  }

  /* 
  RETIREVES STORAGE OBJECT 
  BY CURRENT USER
  IF NO STORAGE,
  CREATES EMPTY STARTER
  */
  function loadStorage() {
    const result = JSON.parse(localStorage.getItem(username));
    if (result) {
      const filteredResult = checkExpByDays(result, 2);
      return filteredResult;
    } else {
      localStorage.setItem(username, JSON.stringify([]));
      return [];
    }
  }

  /* 
  SAVES LATEST STORE BY CURRENT USER
  */
  function setStorage() {
    localStorage.setItem(username, JSON.stringify($records));
  }

  /*
  MOVES THE SLECTED TAG
  TO THE TOP OF THE ARRAY
  AND UPDATES ITS TIMESTAMP
  */
  function shiftTags(record) {
    record.timestamp = new Date().getTime();
    records.update((value) => {
      const filteredArray = value.filter((v) => v.id !== record.id);
      filteredArray.push(record);
      return filteredArray;
    });
  }

  /*
  FILTERS THRU RECORDS
  BASED ON AMT OF DAYS PASSED IN
  */
  function checkExpByDays(data, amt) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - amt);
    const filteredData = data.filter(
      (record) => new Date(record.timestamp) > targetDate
    );
    return filteredData;
  }

  /* 
  WAITS FOR KEYUP EVENT TIMEOUT
  IF KEYUP RESUMES, TIMEOUT IS RESET
  */
  function debounce(callback, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        callback.apply(this, args);
      }, wait);
    };
  }

  /* 
  =======================
  |      LIFECYCLE      |
  =======================
*/

  onDestroy(() => unsub());

  /* 
  =======================
  |   EVENT LISTENERS   |
  =======================
  */

  /*
  WAITS A SET AMT OF INACTIVE TIME,
  THEN SAVES TEXTAREA VALUE
  IN LOCAL STORAGE
  */
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
