export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.datastores.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrder',
      },
    },
  );
};
