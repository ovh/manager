const LABEU_API_TARGET = 'https://eu.api.build-ovh.com';

module.exports = {
  v2: {
    target: `${LABEU_API_TARGET}/v2`,
    context: ['/engine/api/v2'],
    changeOrigin: true,
    logLevel: 'silent',
  },
  v6: {
    target: `${LABEU_API_TARGET}/v1`,
    context: ['/engine/apiv6'],
    changeOrigin: true,
    logLevel: 'silent',
  },
};
