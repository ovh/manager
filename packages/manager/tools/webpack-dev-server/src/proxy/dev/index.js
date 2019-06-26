module.exports = ({ context, nic, target }) => ({
  target,
  context,
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/',
    '^/apiv6/': '/',
    '^/engine/api/': '/',
    '^/engine/apiv6/': '/',
  },
  headers: {
    'X-Ovh-Nic': nic,
  },
  secure: false,
  logLevel: 'debug',
});
