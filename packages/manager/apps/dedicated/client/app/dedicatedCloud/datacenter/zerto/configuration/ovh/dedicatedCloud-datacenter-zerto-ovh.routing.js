export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.ovh',
    {
      url: '/ovh',
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedCloud.details.datacenter.details.zerto': {
          component: 'dedicatedCloudDatacenterZertoOvh',
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep',
    },
  );
};
