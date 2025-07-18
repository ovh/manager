import configGenerator from '@ovh-ux/component-rollup-config';

const config = configGenerator({
  input: './src/index.js',
});

export default [
  config.es(),
  config.cjs(),
  config.umd({
    output: {
      inlineDynamicImports: true,
      globals: {
        angular: 'angular',
        jquery: '$',
      },
    },
  }),
];
