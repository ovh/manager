/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
/* eslint-enable @typescript-eslint/no-var-requires  */

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'manifest.json')),
);

module.exports = {
  publicPath: `/manager/fragments/${manifest.name}/${manifest.version}/`,
  css: { extract: false },
  configureWebpack: {
    output: {
      libraryExport: 'default',
      jsonpFunction: `wpJsonp${manifest.name.replace(
        /[^\w]/g,
        '',
      )}${new Date().getTime()}`,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './manifest.json'),
            to: 'manifest.json',
          },
        ],
      }),
      // Workaround as filename configuration gets overwritten in lib mode
      // See https://github.com/vuejs/vue-cli/issues/3543
      new WebpackShellPlugin({
        onBuildExit: ['cp ./dist/index.umd.js ./dist/index.js'],
      }),
    ],
  },
};
