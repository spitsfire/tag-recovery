// import "./app.css";
import App from "./App.svelte";

const app = new App({
  target: document.querySelector(".qr-footer"),
  anchor: document.getElementById("previewplaceholder"),
  hydrate: true,
});

export default app;