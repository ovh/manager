import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const baseConfig = getBaseConfig({ isLABEU: true});

export default defineConfig({
  ...baseConfig,
  resolve: {
    ...baseConfig.resolve,
    dedupe: [
      '@ovhcloud/ods-common-core',
      '@ovhcloud/ods-common-testing',
      '@ovhcloud/ods-common-theming',
      '@ovhcloud/ods-components',
      '@ovhcloud/ods-theme-blue-jeans',
      'i18next',
      'react',
      'react-dom',
      'react-i18next',
      'react-router-dom',
    ],
  },
});
