const merge = require('webpack-merge');
const devServer = require('@ovh-ux/manager-webpack-dev-server');
const common = require('./webpack.common');
const prodConfig = require('./webpack.prod');

module.exports = (opts, env) => {
  const commonConfig = common(opts);
  const devConfig = devServer.config(env);
  const config = merge(commonConfig, env.production ? prodConfig : devConfig);

  return {
    commonConfig,
    devConfig,
    prodConfig,
    config,
  };
};
