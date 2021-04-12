/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');

const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'manifest.json')));

module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default',
      jsonpFunction: `wpJsonp${manifest.name.replace(/[^\w]/g, '')}${new Date().getTime()}`,
    },
    plugins: [
      new WebpackShellPlugin({
        onBuildExit: ['cp ./dist/index.umd.js ./dist/index.js'],
      }),
    ],
  },
  css: { extract: false },
  publicPath: `/manager/fragments/${manifest.name}/${manifest.version}/`,
};
