/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0d10',
          900: '#12151a',
          800: '#1a1f27',
          700: '#242b35',
          600: '#323b47',
        },
        paper: {
          100: '#f4efe6',
          200: '#e9e1d2',
        },
        amber: {
          400: '#e8b768',
          500: '#d99a3f',
        },
        teal: {
          400: '#5fb8ad',
          500: '#3f9187',
        },
        rose: {
          400: '#d98a95',
          500: '#c46b78',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
