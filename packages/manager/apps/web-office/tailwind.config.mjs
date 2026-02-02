import { createRequire } from 'node:module';
import path from 'path';

import config from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(path.dirname(require.resolve('@ovh-ux/muk')), '**/*.{js,jsx,ts,tsx,cjs}'),
  ],
};
