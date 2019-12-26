angular
  .module('managerApp')
  .config((TranslateServiceProvider, ovhDocUrlProvider) => {
    ovhDocUrlProvider.setUserLocale(TranslateServiceProvider.getUserLocale());
    ovhDocUrlProvider.setUrlPrefix('/engine/2api');
  });
