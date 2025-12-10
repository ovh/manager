/** @type {import('tailwindcss').Config} */

export const observabilityTailwindConfig = {
  safelist: [
    {
      pattern: /(col|row)-span-(1|2|3|4|5|6)/,
      variants: ['sm', 'md', 'lg', 'xl'],
    },
  ],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};

export default observabilityTailwindConfig;
