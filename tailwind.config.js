// tailwind.config.js
const rippleui = require("rippleui");

module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [rippleui],
};
