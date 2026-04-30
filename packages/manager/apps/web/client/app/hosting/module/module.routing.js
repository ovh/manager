import template from './MODULE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.module', {
    url: '/module',
    controller: 'HostingTabModulesController',
    controllerAs: 'ctrlHostingTabModules',
    template,
    resolve: {
      isChangeOfferFeatureAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('web-hosting:change-offer')
          .then((featureAvailability) => {
            return featureAvailability.isFeatureAvailable(
              'web-hosting:change-offer',
            );
          }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_module'),
    },
  });
};
