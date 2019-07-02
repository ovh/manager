import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: './src/index.js',
});

export default [
  config.cjs(),
  config.es(),
  config.umd({
    output: {
      globals: {
        angular: 'angular',
      },
    },
  }),
];
