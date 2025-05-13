angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.configuration', {
    url: '/configuration',
    component: 'configuration',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = '';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      hideBreadcrumb: () => true,
      isOffersBannerActive: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('web:offers')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable('web:offers'),
          ),
    },
  });
});
