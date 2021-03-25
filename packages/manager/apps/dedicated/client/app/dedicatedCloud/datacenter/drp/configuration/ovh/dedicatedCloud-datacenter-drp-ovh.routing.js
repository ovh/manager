export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.ovh',
    {
      url: '/ovh',
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedCloud.details.datacenter.details.drp': {
          component: 'dedicatedCloudDatacenterDrpOvh',
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.drp.ovh.mainPccStep',
    },
  );
};
