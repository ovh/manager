import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

const baseConfig = getBaseConfig();
const repoRoot = resolve(process.cwd(), '../../../..');

export default defineConfig({
  ...baseConfig,
  root: resolve(process.cwd()),
  resolve: {
    ...baseConfig.resolve,
    alias: {
      ...baseConfig.resolve?.alias,
      react: resolve(repoRoot, 'node_modules/react'),
      'react-dom': resolve(repoRoot, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(repoRoot, 'node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': resolve(repoRoot, 'node_modules/react/jsx-dev-runtime'),
    },
  },
});
