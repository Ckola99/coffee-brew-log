/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        roast: {
          50: '#faf6f1',
          100: '#f0e6d8',
          400: '#b98a5a',
          600: '#8a5a2e',
          800: '#4a2f18',
        },
      },
    },
  },
  plugins: [],
};
