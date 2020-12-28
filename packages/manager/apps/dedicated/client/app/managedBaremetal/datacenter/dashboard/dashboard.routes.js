export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.dashboard', {
    views: {
      'pccDatacenterView@app.managedBaremetal.datacenter':
        'ovhManagerDedicatedCloudDatacenterDashboard',
    },
  });
};
