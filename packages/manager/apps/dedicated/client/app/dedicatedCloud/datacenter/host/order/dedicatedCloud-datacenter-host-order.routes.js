export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.hosts.order', {
    resolve: {
      goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
    },
    url: '/order',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter':
        'ovhManagerDedicatedCloudDatacenterHostOrder',
    },
  });
};
