/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src ෆෝල්ඩරයේ ඇති සියලු JS, JSX, TS, TSX files scan කරනවා
    "./public/index.html", // public ෆෝල්ඩරයේ index.html scan කරනවා
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};