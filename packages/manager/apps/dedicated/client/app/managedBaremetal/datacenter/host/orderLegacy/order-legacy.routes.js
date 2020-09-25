export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.hosts.order-legacy', {
    url: '/order-legacy',
    views: {
      'pccDatacenterView@app.managedBaremetal.datacenter':
        'ovhManagerDedicatedCloudDatacenterHostOrderLegacy',
    },
    resolve: {
      goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
      datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
    },
  });
};
