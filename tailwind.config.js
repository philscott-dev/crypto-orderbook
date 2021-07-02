module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        75: '75px',
        6: '6px',
      },
      height: {
        6: '6px',
        24: '24px',
      },
      direction: {
        rtl: 'rtl',
        ltr: 'ltr',
      },
    },
    colors: {
      white: {
        100: '#fcfcfc',
      },
      black: {
        700: '#000000',
        600: '#0f131e',
      },
      gray: {
        400: '#1c222e',
        300: '#2a3240',
        200: '#595f6d',
      },
      green: {
        400: '#0f2b2c',
        300: '#178d5d',
        200: '#199f67',
      },
      red: {
        400: '#2f1822',
        300: '#a90a17',
        200: '#d12a34',
      },
      purple: {
        300: '#4525d0',
      },
    },
  },
  variants: {
    extend: {},
  },
}
