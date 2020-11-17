export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.datastores.order', {
    resolve: {
      goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
    },
    url: '/order',
    views: {
      'pccDatacenterView@app.managedBaremetal.datacenter':
        'ovhManagerDedicatedCloudDatacenterDatastoreOrder',
    },
  });
};
