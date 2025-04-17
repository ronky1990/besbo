/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A2BE2', // Purple
          dark: '#6A1CB7',
          light: '#A64DFF',
        },
        secondary: {
          DEFAULT: '#121212', // Dark black
          light: '#1E1E1E',
          dark: '#0A0A0A',
        },
        accent: {
          DEFAULT: '#E0AAFF', // Light purple
          dark: '#C77DFF',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 