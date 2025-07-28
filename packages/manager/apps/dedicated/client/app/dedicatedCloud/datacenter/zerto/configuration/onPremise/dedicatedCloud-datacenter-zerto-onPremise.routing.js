export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.onPremise',
    {
      url: '/onPremise',
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedCloud.details.datacenter.details.zerto': {
          component: 'dedicatedCloudDatacenterZertoOnPremise',
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.onPremise.ovhPccStep',
    },
  );
};
