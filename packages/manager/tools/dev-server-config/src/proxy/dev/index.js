module.exports = ({ context, target, pathRewrite, headers }) => ({
  target,
  context,
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/',
    '^/apiv6/': '/',
    '^/engine/api/': '/',
    '^/engine/apiv6/': '/',
    ...(pathRewrite || {}),
  },
  headers,
  secure: false,
  logLevel: 'debug',
});
