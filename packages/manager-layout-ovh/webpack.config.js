const merge = require('webpack-merge');
const devServer = require('@ovh-ux/manager-webpack-dev-server');
const common = require('./webpack.common.js');
const prod = require('./webpack.prod.js');

module.exports = (opts, env = {}) => merge(common, env.production ? prod : devServer.config(env));
