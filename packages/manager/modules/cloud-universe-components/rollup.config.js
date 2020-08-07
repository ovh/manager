import path from 'path';
import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig(
  {
    input: './src/index.js',
  },
  {
    lessTildeImporter: {
      paths: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../../../node_modules'),
      ],
    },
  },
);

export default [config.es()];
