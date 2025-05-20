import path from 'path';
import config from '@ovh-ux/manager-tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};
