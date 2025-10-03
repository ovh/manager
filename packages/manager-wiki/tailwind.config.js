/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.storybook/**/*.{js,jsx,ts,tsx,mdx}',
    './stories/**/*.{js,jsx,ts,tsx,mdx}',
    '../manager-ui-kit/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '0',
      sm: '36em',
      md: '48em',
      lg: '62em',
      xl: '75em',
      xxl: '87.5em',
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
