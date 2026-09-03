export default {
  content: [
    "./index.html",
    "./installed.html",
    "./whats-new.html",
    "./src/scripts/popup.js",
    "./src/scripts/whatsNew.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a170c0",
        plum: "#68498d",
        ink: "#423c5e",
        violet: "#af6ec3",
        lilac: "#d5bee6",
        blush: "#fdcfc1",
        coral: "#f5735e",
        sand: "#f2c289",
        paper: "#fbf8fd",
        band: "#f3ecfa",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Karla", "sans-serif"],
      },
    },
  },
  plugins: [],
};
