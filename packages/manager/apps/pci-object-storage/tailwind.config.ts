import odsPreset from '@datatr-ux/uxlib/tailwind.preset';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../../../node_modules/@datatr-ux/uxlib/**/*.{js,jsx,ts,tsx}',
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
