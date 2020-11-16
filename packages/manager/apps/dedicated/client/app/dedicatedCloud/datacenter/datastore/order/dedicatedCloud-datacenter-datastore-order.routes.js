export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.datastores.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrder',
      },
    },
  );
};
