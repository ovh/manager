export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.ovh',
    {
      url: '/ovh',
      abstract: true,
      views: {
        'progressTrackerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvh',
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep',
    },
  );
};
