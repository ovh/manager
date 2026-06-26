import baseConfig from '@ovh-ux/manager-tailwind-config';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`;

const reactComponentsDir = pkgDir('@ovh-ux/manager-react-components');
const backupAgentModuleDir = pkgDir('@ovh-ux/backup-agent');

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(reactComponentsDir),
  `${toGlob(backupAgentModuleDir)}`
];

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: baseTailwindConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      keyframes: {
        'ba-step2-slide': {
          '0%': { left: '-40%' },
          '100%': { left: '100%' },
        },
      },
      animation: {
        'ba-step2-slide': 'ba-step2-slide 1.5s ease-in-out infinite',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
