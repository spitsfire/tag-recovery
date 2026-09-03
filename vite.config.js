import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import { createRequire } from "module";
import vitePluginRunCommandOnDemand from "./vite-plugins";

const require = createRequire(import.meta.url);

function loadManifest(target) {
  const base = require("./manifests/base.json");
  const overlay = require(`./manifests/${target}.json`);
  return { ...base, ...overlay };
}

export default defineConfig(() => {
  const target = process.env.TARGET === "firefox" ? "firefox" : "chrome";
  const manifest = loadManifest(target);

  return {
    base: "./",
    plugins: [
      crx({ manifest, browser: target }),
      vitePluginRunCommandOnDemand({}),
    ],
    build: {
      outDir: `dist/${target}`,
      rollupOptions: {
        input: {
          index: "index.html",
          installed: "installed.html",
          whatsNew: "whats-new.html",
        },
      },
    },
  };
});
