const typeEnum = require('@commitlint/config-angular-type-enum');
const types = [...typeEnum.value(), 'sync', 'release'];

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [2, 'always', types],
  },
};
