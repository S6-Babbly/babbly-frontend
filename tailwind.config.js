/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7e50dc',
        secondary: '#120a2f',
        textColor: '#f2f0f4',
      },
      backgroundColor: {
        'primary-light': '#7e50dc',
        'primary-dark': '#120a2f',
      }
    },
  },
  plugins: [],
} 