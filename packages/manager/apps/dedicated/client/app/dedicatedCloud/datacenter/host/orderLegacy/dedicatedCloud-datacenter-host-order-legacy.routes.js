export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.hosts.order-legacy', {
    url: '/order-legacy',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter':
        'ovhManagerDedicatedCloudDatacenterHostOrderLegacy',
    },
    resolve: {
      goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
      datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
    },
  });
};
