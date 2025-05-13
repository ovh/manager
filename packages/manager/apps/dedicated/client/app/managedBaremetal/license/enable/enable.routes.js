export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.license.enable', {
    url: '/enable',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('usesLegacyOrder')
        .then((usesLegacyOrder) =>
          usesLegacyOrder
            ? {
                state: 'app.managedBaremetal.details.license.enable-legacy',
              }
            : false,
        ),
    views: {
      modal: {
        component: 'dedicatedCloudLicenseEnable',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
