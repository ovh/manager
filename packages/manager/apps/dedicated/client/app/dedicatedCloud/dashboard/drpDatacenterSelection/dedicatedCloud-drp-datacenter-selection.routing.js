export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.drpDatacenterSelection', {
    url: '/drpDatacenterSelection',
    views: {
      modal: {
        component: 'dedicatedCloudDrpDatacenterSelection',
      },
    },
    layout: 'modal',
  });
};
