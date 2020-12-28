export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.drp.onPremise', {
    url: '/onPremise',
    abstract: true,
    views: {
      'progressTrackerView@app.managedBaremetal.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOnPremise',
      },
    },
    redirectTo: 'app.managedBaremetal.datacenter.drp.onPremise.ovhPccStep',
  });
};
