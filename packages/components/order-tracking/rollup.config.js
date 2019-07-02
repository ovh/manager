import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig({
  input: 'src/index.js',
});

const outputs = [config.es()];

if (process.env.BUILD === 'production') {
  outputs.push(config.cjs());
}

export default outputs;
