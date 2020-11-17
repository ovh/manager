export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.datacenter.datastores.order-legacy',
    {
      url: '/order-legacy',
      views: {
        'pccDatacenterView@app.managedBaremetal.datacenter':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrderLegacy',
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
      },
    },
  );
};
