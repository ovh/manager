const TARGET = {
  eu: 'https://www.ovh.com/manager/fragments',
  ca: 'https://ca.ovh.com/manager/fragments',
  us: 'https://us.ovhcloud.com/manager/fragments',
  local: 'http://localhost:8888',
};

module.exports = (region, { local = false, registryUrl }) => ({
  target: registryUrl || TARGET[local ? 'local' : region.toLowerCase()],
  context: '/manager/fragments',
  pathRewrite:
    local || registryUrl
      ? {
          '^/manager/fragments/': '/',
        }
      : {},
  changeOrigin: true,
  logLevel: 'silent',
});
