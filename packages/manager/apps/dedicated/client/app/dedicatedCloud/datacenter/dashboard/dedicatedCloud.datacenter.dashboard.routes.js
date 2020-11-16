export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.dashboard', {
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter':
        'ovhManagerDedicatedCloudDatacenterDashboard',
    },
  });
};
