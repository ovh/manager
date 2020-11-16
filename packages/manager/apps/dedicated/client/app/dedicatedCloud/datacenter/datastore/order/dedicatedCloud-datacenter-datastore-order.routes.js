export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.datastores.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_datastores_order',
          ),
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrder',
      },
    },
  );
};
