export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.drp.ovh', {
    url: '/ovh',
    abstract: true,
    views: {
      'progressTrackerView@app.managedBaremetal.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOvh',
      },
    },
    redirectTo: 'app.managedBaremetal.datacenter.drp.ovh.mainPccStep',
  });
};
