import configGenerator from '@ovh-ux/component-rollup-config';

const config = configGenerator({
  input: './src/index.js',
});

export default [config.es()];
