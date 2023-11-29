// import "./app.css";
import App from "./App.svelte";

function findElementId() {
  return (
    document.getElementById("previewplaceholder") ||
    document.getElementsByName("submitpreview")[0]
  );
}

const app = new App({
  target: document.querySelector(".qr-footer"),
  anchor: findElementId(),
  hydrate: false,
});

export default app;
