/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nardo: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#92a6b0',
          600: '#7a8a93',
          700: '#5f6b73',
          800: '#3c4043',
          900: '#202124',
        },
        accent: {
          cyan: '#00bcd4',
          cyanLight: '#4dd0e1',
          cyanDark: '#0097a7',
          black: '#000000',
          white: '#ffffff',
          grey: '#9e9e9e',
          greyLight: '#e0e0e0',
          greyDark: '#616161',
          cream: '#fafafa',
          charcoal: '#424242',
        },
      },
    },
  },
  plugins: [],
} 