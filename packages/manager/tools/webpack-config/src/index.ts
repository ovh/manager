import merge from 'webpack-merge';
import devServer from '@ovh-ux/manager-webpack-dev-server';
import common from './webpack.common';
import prodConfig from './webpack.prod';

export = (opts, env:any = {}) => {
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
