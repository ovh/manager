export const momentConfiguration = /* @ngInject */ (TranslateServiceProvider) => {
  const defaultLanguage = TranslateServiceProvider.getUserLocale(true);
  moment.locale(defaultLanguage);
};

export default {
  momentConfiguration,
};
