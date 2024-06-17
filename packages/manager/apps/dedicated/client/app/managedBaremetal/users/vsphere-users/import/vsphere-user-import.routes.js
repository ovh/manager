export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.import', {
    url: '/import',
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserImport',
      },
    },
    layout: { name: 'modal', backdrop: 'static' },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
