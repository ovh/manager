export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise',
    {
      url: '/onPremise',
      abstract: true,
      views: {
        'progressTrackerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOnPremise',
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise.ovhPccStep',
    },
  );
};
