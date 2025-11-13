import odsPreset from '@datatr-ux/uxlib/tailwind.preset';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@datatr-ux/uxlib/dist/components/ui/**/*.{js,jsx,ts,tsx}',
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
