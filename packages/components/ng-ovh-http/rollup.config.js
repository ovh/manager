import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: 'src/ovh-angular-http.js',
});

export default [
  config.cjs(),
  config.umd({
    output: {
      globals: {
        angular: 'angular',
      },
    },
  }),
];
