import odsPlugin from '@datatr-ux/ods-tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../../../node_modules/@datatr-ux/uxlib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Override colors for ODS17 theme
        'primary-50': '#f5feff',
        heading: '#4d5693',
      },
      borderRadius: {
        // Override radiuses for ODS17 theme
        sm: '0.25rem',
        DEFAULT: '0.25rem',
        md: '0.5rem',
        lg: '0.5rem',
      },
    },
  },
  plugins: [odsPlugin],
};
