import config from '@ovh-ux/manager-tailwind-config';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
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
  corePlugins: {
    preflight: false,
  },
  theme: {
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
    animation: {
      'fade-in': 'fade-in 0.3s ease-in-out forwards',
    },
    extend: {
      screens: {
        customTabs: '470px',
      },
    },
  },
};
