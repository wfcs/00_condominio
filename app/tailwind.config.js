/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          1: '#03045e',
          2: '#0077b6',
          3: '#00b4d8',
          4: '#90e0ef',
          5: '#caf0f8',
        },
        neutral: {
          surface: '#f8f9fa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
