export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.drpDatacenterSelection', {
    url: '/drpDatacenterSelection',
    views: {
      modal: {
        component: 'dedicatedCloudDrpDatacenterSelection',
      },
    },
    layout: 'modal',
  });
};
