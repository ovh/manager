import { createRequire } from 'node:module';
import path from 'node:path';
import baseConfig from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx,css}`;

const reactComponentsDir = pkgDir('@ovh-ux/muk');

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    ...(baseConfig.content ?? []),
    './src/**/*.{js,jsx,ts,tsx,css}',
    toGlob(reactComponentsDir),
  ],
  corePlugins: {
    preflight: false,
  },
};

