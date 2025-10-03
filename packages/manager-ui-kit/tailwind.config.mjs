/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '0',
      sm: '36em',
      md: '48em',
      lg: '62em',
      xl: '75em',
      xxl: '87.5em',
    },
  },
  corePlugins: {
    preflight: false,
  },
};
