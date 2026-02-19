import config from '@ovh-ux/manager-tailwind-config';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) =>
  `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx,cjs,mjs}`;

const mukDir = pkgDir('@ovh-ux/muk');
const managerReactComponentsDir = pkgDir('@ovh-ux/manager-react-components');

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    ...(config.content ?? []),
    './src/**/*.{js,jsx,ts,tsx}',
    toGlob(mukDir),
    toGlob(managerReactComponentsDir),
  ],
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'md:grid-cols-2',
    'md:grid-cols-4',
    'col-span-1',
    'col-span-4',
    'md:col-span-1',
    'md:col-span-2',
    'md:col-span-3',
    'md:col-span-4',
  ],
  corePlugins: {
    preflight: false,
  },
};
