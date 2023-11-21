<script>
  export let isClicked;
  export let records;
  export let selectTag;
  export let reset;
  export let viewTag;

  import { formatDate } from "./../scripts/helpers";

  const constantClasses = "wrap";
  const visible = `${constantClasses} visible`;
  const hide = `${constantClasses} hide`;
</script>

<div class={isClicked ? visible : hide}>
  <div id="tag-storage-container">
    <table role="grid">
      <tbody>
        {#if records === []}
          <tr>
            <td><p>Loading....</p></td>
          </tr>
        {:else}
          {#each records.reverse() as record, index}
            <tr
              on:mouseover={() => viewTag(record.tag)}
              on:focus={() => viewTag(record.tag)}
              on:mouseleave={reset}
              on:focusout={reset}
              on:click={() => selectTag(record.tag, index)}
            >
              <td class="tag-text">{record.tag}</td>
              <td class="timestamp">{formatDate(new Date(record.timestamp))}</td
              >
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  .visible {
    display: block;
  }
  .hide {
    display: none;
  }
  .wrap {
    position: relative;
  }
  .tag-text {
    font-family: monospace, "Courier New", Courier;
    width: 350px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .timestamp {
    width: 200px;
    text-align: right;
    margin-right: 10px;
  }
  #tag-storage-container {
    margin: 0 auto;
    padding: 0.2em;
    width: 550px;
    height: 250px;
    position: absolute;
    z-index: 3;
    top: -270px;
    border-radius: 8px;
    background-color: white;
    overflow-y: scroll;
    overflow-x: hidden;
    border: 1px solid rgba(0, 0, 0, 0.085);
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  #tag-storage-container table {
    width: 100%;
    table-layout: fixed;
  }
  #tag-storage-container table tr {
    border-bottom: 1px rgba(0, 9, 40, 0.085);
    border-top: 1px rgba(0, 9, 40.085);
  }
  #tag-storage-container table tr:nth-child(even) {
    background-color: rgba(0, 9, 40, 0.04);
  }
  #tag-storage-container table tr:hover,
  #tag-storage-container table tr:nth-child(even):hover {
    background-color: rgba(0, 9, 40, 0.07);
  }
</style>
