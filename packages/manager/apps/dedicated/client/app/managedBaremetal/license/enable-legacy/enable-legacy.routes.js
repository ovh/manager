export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.license.enable-legacy', {
    url: '/enable-legacy',
    views: {
      modal: {
        component: 'dedicatedCloudLicenseEnableLegacy',
      },
    },
    layout: 'modal',
  });
};
