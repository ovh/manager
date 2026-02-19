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
  safelist: ['grid-cols-1', 'grid-cols-2'],
  corePlugins: {
    preflight: false,
  },
};
