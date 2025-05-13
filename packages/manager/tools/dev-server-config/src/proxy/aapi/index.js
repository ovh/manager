const bffHostHeader = {
  EU: 'www.ovh.com',
  CA: 'ca.ovh.com',
  US: 'us.ovhcloud.com',
};

const config = {
  aapi: {
    url: 'http://localhost:8080',
  },
};

module.exports = {
  context: ['/engine/2api'],
  target: config.aapi.url,
  changeOrigin: true,
  pathRewrite: {
    '^/engine/2api/': '/',
  },
  secure: false,
  logLevel: 'debug',
  headers: {
    Host: bffHostHeader[process.env.REGION ?? 'EU'],
  },
};
