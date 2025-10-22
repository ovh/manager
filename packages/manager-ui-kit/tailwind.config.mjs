/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '0',
      sm: '36em',
      md: '48em',
      lg: '62em',
      xl: '75em',
      xxl: '87.5em',
    },
    extend: {
      borderRadius: {
        'ods-border-radius-xs': 'var(--ods-border-radius-xs)',
        'ods-border-radius-sm': 'var(--ods-border-radius-sm)',
        'ods-border-radius-md': 'var(--ods-border-radius-md)',
        'ods-border-radius-lg': 'var(--ods-border-radius-lg)',
      },
      colors: {
        'ods-color-primary-500': 'var(--ods-color-primary-500)',
        'ods-color-success-500': 'var(--ods-color-success-500)',
        'ods-color-warning-700': 'var(--ods-color-warning-700)',
      },
      fontFamily: {
        'ods-font-family-default': 'var(--ods-font-family-default)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
