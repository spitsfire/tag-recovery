<script>
  export let isClicked;
  console.log(isClicked);
  if (isClicked) {
    console.log("I changed");
  }
</script>

<div id="tag-storage-container" class={isClicked ? "visible" : "hide"}>
  <h1>Blah</h1>
</div>

<style>
  .visible {
    display: inline-block;
  }
  .hide {
    display: none;
  }
  #tag-storage-container {
    width: 100px;
    height: 100px;
    position: relative;
  }
</style>
