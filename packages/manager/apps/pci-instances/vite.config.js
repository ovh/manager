import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { getObservabilityToCustomerConfig } from '@ovh-ux/observability-to-customer/vite-config';
import tailwindcss from 'tailwindcss';

const observabilityToCustomerConfig = getObservabilityToCustomerConfig();
const baseConfig = getBaseConfig(observabilityToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  root: '',
  css: {
    ...baseConfig.css,
    postcss: {
      plugins: [tailwindcss],
    },
  },
  resolve: {
    ...baseConfig.resolve,
  },
});
