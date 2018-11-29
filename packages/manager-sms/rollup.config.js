import rollupConfig from '@ovh-ux/component-rollup-config';
import path from 'path';

const config = rollupConfig({
  input: 'index.js',
}, {
  lessTildeImporter: {
    paths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
  },
});

export default [
  config.cjs(),
  config.umd({
    output: {
      globals: {
        angular: 'angular',
        telecomUniverseComponents: '@ovh-ux/telecom-universe-components',
      },
    },
  }),
];
