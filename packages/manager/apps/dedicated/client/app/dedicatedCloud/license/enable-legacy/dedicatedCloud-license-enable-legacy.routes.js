export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.license.enable-legacy', {
    url: '/enable-legacy',
    views: {
      modal: {
        component: 'dedicatedCloudLicenseEnableLegacy',
      },
    },
    layout: 'modal',
  });
};
