const path = require('path');
const rollupConfig = require('@ovh-ux/component-rollup-config');

const config = rollupConfig({
  input: 'src/index.js',
}, {
  lessTildeImporter: {
    paths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../../../node_modules'),
    ],
  },
});

const outputs = [config.es({
  output: {
    sourcemap: false,
  },
})];

if (process.env.BUILD === 'production') {
  outputs.push(config.cjs());
}

module.exports = outputs;
