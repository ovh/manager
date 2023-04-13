import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import rollupConfig from '@ovh-ux/component-rollup-config';

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line
const __dirname = dirname(__filename); // eslint-disable-line

const config = rollupConfig(
  {
    input: './src/index.js',
  },
  {
    lessTildeImporter: {
      paths: [
        resolve(__dirname, 'node_modules'),
        resolve(__dirname, '../../node_modules'),
      ],
    },
  },
);

const outputs = [config.es()];

if (process.env.BUILD === 'production') {
  outputs.push(config.cjs());
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
