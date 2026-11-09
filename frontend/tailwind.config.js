/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cric: {
          green: '#009270',
          darkgreen: '#00674f',
          lightgreen: '#e6f7f2',
          red: '#e02020',
          yellow: '#f5a623',
          bg: '#0e1621',
          card: '#17212b',
          cardHover: '#1e2c3a',
          border: '#232e3c',
          muted: '#8e9fac',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
