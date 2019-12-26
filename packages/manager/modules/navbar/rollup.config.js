import path from 'path';
import rollupConfig from '@ovh-ux/component-rollup-config';

const config = rollupConfig(
  {
    input: 'src/index.js',
  },
  {
    lessTildeImporter: {
      paths: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../../../node_modules'),
      ],
    },
  },
);

const outputs = [
  config.es({
    output: {
      globals: {
        Tour: 'Tour',
      },
    },
  }),
];

if (process.env.BUILD === 'production') {
  outputs.push(
    config.cjs({
      output: {
        globals: {
          Tour: 'Tour',
        },
      },
    }),
  );
  outputs.push(
    config.umd({
      output: {
        globals: {
          angular: 'angular',
          Tour: 'Tour',
        },
      },
    }),
  );
}

export default outputs;
