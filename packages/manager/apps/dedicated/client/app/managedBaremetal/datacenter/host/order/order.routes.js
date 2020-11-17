export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.hosts.order', {
    resolve: {
      goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
    },
    url: '/order',
    views: {
      'pccDatacenterView@app.managedBaremetal.datacenter':
        'ovhManagerDedicatedCloudDatacenterHostOrder',
    },
  });
};
