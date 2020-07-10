import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: './src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'navbar',
  },
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env']],
    }),
    resolve(),
    terser(),
  ],
};
