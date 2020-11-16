export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.onPremise',
    {
      url: '/onPremise',
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedCloud.details.datacenter.details.drp': {
          component: 'dedicatedCloudDatacenterDrpOnPremise',
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.drp.onPremise.ovhPccStep',
    },
  );
};
