import browser from "webextension-polyfill";

/* opens a full tab (not the small popup) so first-run/update info is easy to notice */
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    browser.tabs.create({ url: browser.runtime.getURL("installed.html") });
  } else if (reason === "update") {
    browser.tabs.create({ url: browser.runtime.getURL("whats-new.html") });
  }
});
