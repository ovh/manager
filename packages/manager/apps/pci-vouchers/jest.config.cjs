const path = require('path');

const rootConfig = require('../../../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    '^@/(.*)$': `${path.dirname(__filename)}/src/$1`,
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules/(?!lodash-es|@ovhcloud|@stencil|axios|@bundled-es-modules)',
  ],
};
