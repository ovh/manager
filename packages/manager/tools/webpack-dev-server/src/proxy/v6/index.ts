const TARGET = {
  eu: 'https://www.ovh.com',
  ca: 'https://ca.ovh.com',
  us: 'https://us.ovhcloud.com',
};

export = region => ({
  target: TARGET[region],
  context: ['/engine', '/auth'],
  changeOrigin: true,
  logLevel: 'silent',
});
