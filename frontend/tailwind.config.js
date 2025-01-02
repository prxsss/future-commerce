import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // kanit: ['Kanit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: ['light', 'dark', 'winter', 'black', 'dracula'],
  },
  plugins: [daisyui],
};
