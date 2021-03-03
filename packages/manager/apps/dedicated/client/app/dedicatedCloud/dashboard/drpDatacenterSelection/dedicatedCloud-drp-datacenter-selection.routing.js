export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.dashboard.drpDatacenterSelection',
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
