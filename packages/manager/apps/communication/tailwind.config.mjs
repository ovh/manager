import config from '@ovh-ux/manager-tailwind-config';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx,cjs}',
    path.join(
      path.dirname(require.resolve('@ovh-ux/muk')),
      '**/*.{js,jsx,ts,tsx,cjs}',
    ),
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx,cjs}',
    ),
  ],
  corePlugins: {
    preflight: false,
  },
};
