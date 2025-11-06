export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.dashboard.zertoDatacenterSelection',
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
