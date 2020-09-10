export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremise', {
    url: '/onPremise',
    abstract: true,
    views: {
      'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOnPremise',
      },
    },
    redirectTo: 'app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep',
  });
};
