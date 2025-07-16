export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.dashboard.zertoDatacenterSelection',
    {
      url: '/zertoDatacenterSelection',
      views: {
        modal: {
          component: 'dedicatedCloudZertoDatacenterSelection',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
