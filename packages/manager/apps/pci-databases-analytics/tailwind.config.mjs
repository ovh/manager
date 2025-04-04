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
        border: '#E5E5E5',
        transparent: '#ffffff00',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.25rem',
        md: '0.5rem',
        lg: '0.5rem',
      },
    },
  },
  plugins: [odsPlugin],
};
