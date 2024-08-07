import config from '@ovh-ux/manager-tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../../manager-components/src/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
};
