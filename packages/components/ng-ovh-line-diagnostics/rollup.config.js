import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: './src/index.js',
});

const outputs = [
  config.es({
    output: {
      sourcemap: false,
    },
  }),
];

if (process.env.BUILD === 'production') {
  outputs.push(config.cjs());
  outputs.push(
    config.umd({
      output: {
        inlineDynamicImports: true,
        globals: {
          angular: 'angular',
        },
      },
    }),
  );
}

export default outputs;
