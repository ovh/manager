export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.dashboard.drpDatacenterSelection',
    {
      url: '/drpDatacenterSelection',
      views: {
        modal: {
          component: 'dedicatedCloudDrpDatacenterSelection',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
