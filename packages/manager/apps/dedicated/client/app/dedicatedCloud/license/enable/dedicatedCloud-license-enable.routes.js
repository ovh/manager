export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.license.enable', {
    url: '/enable',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('usesLegacyOrder')
        .then((usesLegacyOrder) =>
          usesLegacyOrder
            ? {
                state: 'app.dedicatedClouds.license.enable-legacy',
              }
            : false,
        ),
    views: {
      modal: {
        component: 'dedicatedCloudLicenseEnable',
      },
    },
    layout: 'modal',
  });
};
