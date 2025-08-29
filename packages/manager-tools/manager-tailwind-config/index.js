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
      sm: 'var(--ods-border-radius-sm, var(--ods-size-border-radius-01, 4px))',
      DEFAULT: 'var(--ods-border-radius-sm, var(--ods-size-border-radius-01, 4px))',
      md: 'var(--ods-border-radius-md, var(--ods-size-border-radius-02, 8px))',
      lg: 'var(--ods-border-radius-lg, var(--ods-size-border-radius-02, 16px))',
      full: '50%',
    },
  },
  plugins: [],
};

export default config;
