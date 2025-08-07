const componentRollupConfig = require('@ovh-ux/component-rollup-config');

const common = Object.assign(componentRollupConfig.common);

module.exports = function translationsJson(source) {
  return common.translationNormalize(source);
};
