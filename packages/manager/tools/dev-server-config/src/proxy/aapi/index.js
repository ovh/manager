const config = {
  aapi: {
    url: 'http://localhost:8080',
  },
};

module.exports = {
  context: ['/engine/2api/billing/services'],
  target: config.aapi.url,
  changeOrigin: true,
  pathRewrite: {
    '^/engine/2api/': '/',
  },
  secure: false,
  logLevel: 'debug',
};
