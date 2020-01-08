angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    ['product', 'alldom'].forEach((stateType) => {
      $stateProvider.state(`app.domain.${stateType}.optin`, {
        url: '/optin',
        views: {
          domainView: 'domainOptin',
        },
        translations: { value: ['.'], format: 'json' },
      });
    });
  },
);
