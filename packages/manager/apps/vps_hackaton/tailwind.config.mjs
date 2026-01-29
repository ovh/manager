import config from '@ovh-ux/manager-tailwind-config';

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@ovh-ux/muk/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
};
