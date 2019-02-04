import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: 'src/index.js',
});

const outputs = [config.es()];

if (process.env.BUILD === 'production') {
  outputs.push(config.cjs());
  outputs.push(
    config.umd({
      output: {
        globals: {
          '@ovh-ux/ng-ovh-http': 'ngOvhHttp',
          '@ovh-ux/ng-ovh-sso-auth': 'ngOvhSsoAuth',
          angular: 'angular',
        },
      },
    }),
  );
}

export default outputs;
