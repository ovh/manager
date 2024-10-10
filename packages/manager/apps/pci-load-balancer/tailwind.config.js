import config from '@ovh-ux/manager-tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../../manager-react-components/src/**/*.{js,jsx,ts,tsx}',
    '../../modules/manager-pci-common/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-tile': '0 0 6px 0 rgba(0,14,156,.2)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
