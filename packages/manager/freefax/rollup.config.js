import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: 'src/index.js',
});

const outputs = [];

outputs.push(config.cjs());

if (process.env.BUILD === 'production') {
  outputs.push(
    config.umd({
      output: {
        globals: {
          angular: 'angular',
        },
      },
    }),
  );
}

export default outputs;
