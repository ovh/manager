import baseConfig from '@ovh-ux/manager-tailwind-config';

/** @type {import('tailwindcss').Config} */
export const metricsToCustomerTwConfig = {
  ...baseConfig,
  content: [
    ...(baseConfig.content ?? []),    
  ],
  safelist: [
    {
      pattern: /(col|row)-span-(1|2|3|4|5|6)/,
      variants: ['sm', 'md', 'lg', 'xl'],
    },
  ],
};

export default metricsToCustomerTwConfig;
