const path = require('path');

const rootConfig = require('../../../../jest.config.js');

rootConfig.moduleNameMapper = {
  ...rootConfig.moduleNameMapper,
  '^@/(.*)$': `${path.dirname(__filename)}/src/$1`,
};

module.exports = rootConfig;
