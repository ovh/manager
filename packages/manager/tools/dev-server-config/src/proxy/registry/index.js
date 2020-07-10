const TARGET = {
  eu: 'https://www.ovh.com/manager/fragments',
  ca: 'https://ca.ovh.com/manager/fragments',
  us: 'https://us.ovhcloud.com/manager/fragments',
  local: 'http://localhost:8888',
};

module.exports = (region, local = false) => ({
  target: TARGET[local ? 'local' : region.toLowerCase()],
  context: '/manager/fragments',
  pathRewrite: local
    ? {
        '^/manager/fragments/': '/',
      }
    : {},
  changeOrigin: true,
  logLevel: 'silent',
});
