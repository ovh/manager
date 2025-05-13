export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.license.enable-legacy', {
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
