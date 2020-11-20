export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.hosts.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterHostOrder',
      },
    },
  );
};
