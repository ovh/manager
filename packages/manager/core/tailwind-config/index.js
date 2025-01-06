const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        0: '0',
        1: '0.0625rem',
        2: '0.125rem',
        3: '0.25rem',
        4: '0.5rem',
        5: '0.75rem',
        6: '1rem',
        7: '1.25rem',
        8: '1.5rem',
        9: '2rem',
        10: '2.5rem',
        11: '3rem',
      },
    },
    screens: {
      xs: '0',
      sm: '36em',
      md: '48em',
      lg: '62em',
      xl: '75em',
      xxl: '87.5em',
      // not work with ods var in media queries
      // 'xs': 'var(--ods-breakpoint-xs)',
    },
    borderRadius: {
      none: '0',
      sm: 'var(--ods-border-radius-sm)',
      DEFAULT: 'var(--ods-border-radius-sm)',
      md: 'var(--ods-border-radius-md)',
      lg: 'var(--ods-border-radius-lg)',
      full: '50%',
    },
  },
  plugins: [],
};

export default config;
