import config from '@ovh-ux/manager-tailwind-config';
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(
      path.dirname(import.meta.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
  corePlugins: {
    preflight: false,
  },
};
