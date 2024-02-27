/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    screens: {
      'xs': '0',
      'sm': '36em',
      'md': '48em',
      'lg': '62em',
      'xl': '75em',
      'xxl': '87.5em',
      // not work with ods var in media queries
      // 'xs': 'var(--ods-breakpoint-xs)',
    },
    spacing: {
      0: '0',
      1: 'var(--ods-size-01)',
      2: 'var(--ods-size-02)',
      3: 'var(--ods-size-03)',
      4: 'var(--ods-size-04)',
      5: 'var(--ods-size-05)',
      6: 'var(--ods-size-06)',
      7: 'var(--ods-size-07)',
      8: 'var(--ods-size-08)',
      9: 'var(--ods-size-09)',
      10: 'var(--ods-size-10)',
      11: 'var(--ods-size-11)',
    },
    borderRadius: {
      none: '0',
      sm: 'var(--ods-size-border-radius-01)',
      DEFAULT: 'var(--ods-size-border-radius-01)',
      md: 'var(--ods-size-border-radius-02)',
      lg: 'var(--ods-size-border-radius-02)',
      full: '50%'
    }
  },
  plugins: [],
};
