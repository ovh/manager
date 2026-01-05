const TARGET = 'https://metrics-for-manager.gra.technicalapis.ovh.net';

module.exports = {
  target: TARGET,
  context: ['/api/metrics'],
  changeOrigin: true,
  pathRewrite: {
    '^/api/metrics': '/m4m-single-endpoint-proxy/api/v1',
  },
  secure: false,
  logLevel: 'debug',
  cookieRewrite: true,
};
