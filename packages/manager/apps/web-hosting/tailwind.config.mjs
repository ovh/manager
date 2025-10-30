import { createRequire } from 'node:module';
import path from 'node:path';

import baseConfig from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`;

const reactComponentsDir = pkgDir('@ovh-ux/muk');
const pciCommonDir = pkgDir('@ovh-ux/manager-pci-common');

const isPciConfig = '{{isPci}}';

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(reactComponentsDir),
];

export const pciTailwindConfig = [...baseTailwindConfig, toGlob(pciCommonDir)];

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: isPciConfig === 'true' ? pciTailwindConfig : baseTailwindConfig,
  corePlugins: {
    preflight: false,
  },
};
