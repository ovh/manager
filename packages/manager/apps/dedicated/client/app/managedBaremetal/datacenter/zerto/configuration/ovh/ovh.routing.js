export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh',
    {
      url: '/ovh',
      abstract: true,
      views: {
        'progressTrackerView@app.managedBaremetal.details.datacenters.datacenter.zerto': {
          component: 'dedicatedCloudDatacenterZertoOvh',
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh.mainPccStep',
    },
  );
};
