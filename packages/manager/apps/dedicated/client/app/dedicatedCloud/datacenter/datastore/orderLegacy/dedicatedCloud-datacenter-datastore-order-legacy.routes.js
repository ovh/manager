export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedClouds.datacenter.datastores.order-legacy',
    {
      url: '/order-legacy',
      views: {
        'pccDatacenterView@app.dedicatedClouds.datacenter':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrderLegacy',
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
      },
    },
  );
};
