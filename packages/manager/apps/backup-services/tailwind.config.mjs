import baseConfig from '@ovh-ux/manager-tailwind-config';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`;

const reactComponentsDir = pkgDir('@ovh-ux/manager-react-components');

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(reactComponentsDir),
];

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: baseTailwindConfig,
  corePlugins: {
    preflight: false,
  },
};
