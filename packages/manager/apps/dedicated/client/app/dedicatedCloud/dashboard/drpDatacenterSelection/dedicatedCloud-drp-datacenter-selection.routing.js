export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.dashboard.drpDatacenterSelection', {
    url: '/drpDatacenterSelection',
    views: {
      modal: {
        component: 'dedicatedCloudDrpDatacenterSelection',
      },
    },
    layout: 'modal',
  });
};
