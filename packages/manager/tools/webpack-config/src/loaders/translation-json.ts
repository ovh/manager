import config from '@ovh-ux/component-rollup-config';

export = function translationsJson(source) {
  return config.translationNormalize(source);
};
