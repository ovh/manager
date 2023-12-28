const path = require('path');

let rootConfig = require('../../../../jest.config.js');

rootConfig.moduleNameMapper = {
  ...rootConfig.moduleNameMapper,
  '^@/(.*)$': `${path.dirname(__filename)}/src/$1`,
  setupFilesAfterEnv: ['./jest.setup.after.env.js'],
};

rootConfig = {
  ...rootConfig,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
}

module.exports = rootConfig;
