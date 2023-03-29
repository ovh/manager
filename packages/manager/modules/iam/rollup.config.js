import path from 'path';
import rollupConfig from '@ovh-ux/component-rollup-config';
import rollupAlias from '@rollup/plugin-alias';

const config = rollupConfig({
  input: 'src/index.js',
  plugins: [
    rollupAlias({
      entries: [
        {
          find: '@iam/components',
          replacement: path.resolve('./src/components'),
        },
        {
          find: '@iam/constants',
          replacement: path.resolve('./src/constants'),
        },
        {
          find: '@iam/resolves',
          replacement: path.resolve('./src/resolves'),
        },
        {
          find: '@iam/routes',
          replacement: path.resolve('./src/routes'),
        },
        {
          find: '@iam/services',
          replacement: path.resolve('./src/services'),
        },
      ],
    }),
  ],
});

export default [config.es()];
