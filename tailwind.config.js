/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy900: '#060919',
        navy: '#152852',
        hubblue: '#2d4ebf',
        lime: '#d2e718',
        hubcyan: '#00e4ff',
        gray100: '#f5f5f5',
        gray150: '#ebebeb',
        gray200: '#ecedf0',
        muted: '#a7a4a4',
        body: '#797979',
        ondark: '#d6d6d6',
        placeholder: '#c4c4c4',
      },
      fontFamily: {
        luxenta: ['Luxenta', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
