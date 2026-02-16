/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,pages,hooks,App,services}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f0faff', '100': '#e0f3ff', '200': '#cce9ff', '300': '#b8deff', '400': '#a3d1ff', '500': '#8ec1ff', '600': '#79aeff', '700': '#649aff', '800': '#5083ff', '900': '#3b6aff', '950': '#264fff'
        },
      }
    }
  },
  plugins: [],
}
