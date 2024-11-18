import config from '@ovh-ux/manager-tailwind-config';
import path from 'path';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  theme: {
    ...config.theme,
    // border radius vars have been renamed in ODS 18
    borderRadius: {
      ...config.borderRadius,
      sm: 'var(--ods-border-radius-sm)',
      DEFAULT: 'var(--ods-border-radius-sm)',
      md: 'var(--ods-border-radius-md)',
      lg: 'var(--ods-border-radius-md)',
    },
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-react-components')),
      '**/*.{js,jsx,ts,tsx}',
    ),
    path.join(
      path.dirname(require.resolve('@ovh-ux/manager-pci-common')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
  corePlugins: {
    preflight: false,
  },
};
