module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    borderRadius: {
      basic: '5px',
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'blue': '#11B3FE',
      'blue-hover': '#0095E0',
      'grey': '#F6F7F8',
     }),
    fontFamily: {
      'serif' : ['Vollkorn', '"Times New Roman"', 'serif']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
