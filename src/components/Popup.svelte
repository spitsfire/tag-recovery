<script>
  import TailwindCss from "./tailwindCSS.svelte";
  export let isClicked;
  export let records;

  console.log(records);

  const constantClasses = "container mx-auto px-4 rounded";
  const visible = `${constantClasses} visible`;
  const hide = `${constantClasses} hide`;
</script>

<TailwindCss />
<div class="wrap">
  <div id="tag-storage-container" class={isClicked ? visible : hide}>
    <table class="hover:table-fixed">
      <tbody>
        {#if !records}
          <tr>
            <td><p>Loading....</p></td>
          </tr>
        {:else}
          {#each records.reverse() as record}
            <tr>
              <td>{record.tag}</td>
              <td>{record.timestamp}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  .visible {
    float: left;
  }
  .hide {
    display: none;
  }
  .wrap {
    position: relative;
  }
  #tag-storage-container {
    width: 400px;
    height: 200px;
    position: absolute;
    z-index: 3;
    top: -250px;
    background-color: gray;
  }
</style>
