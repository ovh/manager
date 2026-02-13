const TARGET = {
  eu: 'https://manager.eu.ovhcloud.com',
  ca: 'https://manager.ca.ovhcloud.com',
  us: 'https://manager.us.ovhcloud.com',
};

module.exports = (region, config = {}) => ({
  target: config.host ? `https://${config.host}` : TARGET[region.toLowerCase()],
  context: ['/engine', '/auth'],
  changeOrigin: true,
  logLevel: 'silent',
});
