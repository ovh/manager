export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise',
    {
      url: '/onPremise',
      abstract: true,
      views: {
        'progressTrackerView@app.managedBaremetal.details.datacenters.datacenter.zerto': {
          component: 'dedicatedCloudDatacenterZertoOnPremise',
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.ovhPccStep',
    },
  );
};
