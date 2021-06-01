import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: './src/index.js',
});

export default [config.es()];
