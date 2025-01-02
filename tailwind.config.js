/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'hextech': {
          primary: '#64ffda',
          secondary: '#00b4d8',
          accent: '#d946ef',
          dark: '#0f172a',
          light: '#1e293b',
        }
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'hextech': '0 0 20px rgba(100, 255, 218, 0.2)',
        'hextech-lg': '0 0 30px rgba(100, 255, 218, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 