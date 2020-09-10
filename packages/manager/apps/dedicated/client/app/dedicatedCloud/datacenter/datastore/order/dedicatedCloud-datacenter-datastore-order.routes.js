export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.datastores.order', {
    resolve: {
      goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
    },
    url: '/order',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter':
        'ovhManagerDedicatedCloudDatacenterDatastoreOrder',
    },
  });
};
