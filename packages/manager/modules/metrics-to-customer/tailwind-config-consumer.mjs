import { createRequire } from 'node:module';
import path from 'node:path';

import baseConfig from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx,mjs,cjs}`;

const mukDir = pkgDir('@ovh-ux/muk');

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(mukDir),
];

/** @type {import('tailwindcss').Config} */
export const metricsToCustomerTwConfig = {
  ...baseConfig,
  content: baseTailwindConfig,
  safelist: [
    {
      pattern: /(col|row)-span-(1|2|3|4|5|6)/,
      variants: ['sm', 'md', 'lg', 'xl'],
    },
  ],
};

export default metricsToCustomerTwConfig;
