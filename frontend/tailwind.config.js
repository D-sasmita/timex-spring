/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          gray: "#4a4a4a",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          gray: "#4a4a4a",
          brass: "#a9812f",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};