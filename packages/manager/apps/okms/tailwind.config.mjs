import { createRequire } from 'node:module';
import path from 'path';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
    path.join(path.dirname(require.resolve('@ovh-ux/muk')), '**/*.{js,jsx,ts,tsx,cjs}'),
    path.join(path.dirname(require.resolve('@ovh-ux/logs-to-customer')), '**/*.{js,jsx,ts,tsx}'),
  ],
  theme: {
    screens: {
      xs: '0',
      sm: '36em',
      md: '48em',
      lg: '62em',
      xl: '75em',
      xxl: '87.5em',
    },
  },
  corePlugins: {
    preflight: false,
  },
};
