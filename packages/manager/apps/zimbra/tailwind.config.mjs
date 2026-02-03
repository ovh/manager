import { createRequire } from 'node:module';
import path from 'path';

import config from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
      colors: {
        'color-primary-050': 'var(--ods-color-primary-050)',
        'color-primary-100': 'var(--ods-color-primary-100)',
        'color-primary-500': 'var(--ods-color-primary-500)',
      },
    },
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(path.dirname(require.resolve('@ovh-ux/muk')), '**/*.{js,jsx,ts,tsx,cjs}'),
  ],
};
