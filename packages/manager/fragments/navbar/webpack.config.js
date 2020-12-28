const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'manifest.json')),
);

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    filename: 'index.js',
    jsonpFunction: `wpJsonp${manifest.name.replace(
      /[^\w]/g,
      '',
    )}${new Date().getTime()}`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: `/manager/fragments/${manifest.name}/${manifest.version}/`,
  },
};
