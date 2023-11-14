/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
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
  },
  plugins: [],
}
