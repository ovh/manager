const config = {
  aapi: {
    url: 'http://localhost:8080',
  },
};

export = {
  context: ['/engine/2api'],
  target: config.aapi.url,
  changeOrigin: true,
  pathRewrite: {
    '^/engine/2api/': '/',
  },
  secure: false,
  logLevel: 'debug',
};
