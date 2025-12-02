import config from '@ovh-ux/manager-tailwind-config';
import observabilityTailwindConfig from '@ovh-ux/observability-to-customer/tailwind.config';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  ...observabilityTailwindConfig,
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
    path.join(
      path.dirname(require.resolve('@ovh-ux/observability-to-customer')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
  corePlugins: {
    preflight: false,
  },
};
