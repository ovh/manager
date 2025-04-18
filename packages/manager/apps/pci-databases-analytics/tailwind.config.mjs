import odsPlugin from '@datatr-ux/ods-tailwind-config';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-pci-common')),
      '**/*.{js,jsx,ts,tsx}',
    ),
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
