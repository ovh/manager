const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: false,
    }),
  ],
};
