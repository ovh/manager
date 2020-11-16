export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.datastores.order-legacy',
    {
      url: '/order-legacy',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrderLegacy',
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
      },
    },
  );
};
