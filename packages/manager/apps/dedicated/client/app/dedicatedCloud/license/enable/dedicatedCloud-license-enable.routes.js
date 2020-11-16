export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.license.enable', {
    url: '/enable',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('usesLegacyOrder')
        .then((usesLegacyOrder) =>
          usesLegacyOrder
            ? {
                state: 'app.dedicatedCloud.details.license.enable-legacy',
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
