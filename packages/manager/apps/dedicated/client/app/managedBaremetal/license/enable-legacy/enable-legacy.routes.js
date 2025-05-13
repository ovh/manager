export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.license.enable-legacy', {
    url: '/enable-legacy',
    views: {
      modal: {
        component: 'dedicatedCloudLicenseEnableLegacy',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
