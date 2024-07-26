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

export default outputs;
