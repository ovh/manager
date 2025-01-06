module.exports = {
  context: ['http://gw2sdev-docker.ovh.net:11556'],
  target: config.aapi.url,
  changeOrigin: true,
  pathRewrite: {},
  secure: false,
  logLevel: 'debug',
};
