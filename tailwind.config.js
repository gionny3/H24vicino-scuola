/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/**/*.ejs",
  ],
  theme: {
    screens: {
      sm: '500px',
      md: '760px',
      lg: '976px',
      hxl:'1050px', // half xl
      xl: '1440px',
      xxl:'1600px',
      xs: '390px',
      xxs: '340px',
      xxxs:"280px",
  },
  plugins: [],
  fontFamily:{
    'roboto':['roboto','sans-serif']
  }
}
}