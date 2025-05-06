import path from 'path';
import config from '@ovh-ux/manager-tailwind-config';
import odsPlugin from '@datatr-ux/ods-tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-pci-common')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    plugins: [
      odsPlugin,
      'tailwindcss-animate',
      '@datatr-ux/ods-tailwind-config',
    ],
  },
  plugins: ['tailwindcss-animate', '@datatr-ux/ods-tailwind-config'],
};
