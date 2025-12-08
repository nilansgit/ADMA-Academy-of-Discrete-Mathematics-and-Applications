/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf8f5',
        },
      },
    },
  },
  plugins: [],
}

