import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: 'src/angular-uirouter-title.js',
});

export default [
  config.cjs(),
  config.umd({
    output: {
      globals: {
        jquery: '$',
        angular: 'angular',
      },
    },
  }),
];
