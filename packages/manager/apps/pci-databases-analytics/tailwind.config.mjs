import path from 'path';
import { createRequire } from 'node:module';
import odsPreset from '@datatr-ux/uxlib/tailwind.preset';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-pci-common')),
      '**/*.{js,jsx,ts,tsx}',
    ),
    './node_modules/@datatr-ux/uxlib/dist/components/ui/**/*.{js,jsx,ts,tsx}',
    './../../../../node_modules/@datatr-ux/uxlib/dist/components/ui/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [odsPreset],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
