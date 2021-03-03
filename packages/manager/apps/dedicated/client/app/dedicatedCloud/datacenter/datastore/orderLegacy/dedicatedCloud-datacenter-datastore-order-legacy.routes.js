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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_datastores_order_legacy',
          ),
      },
    },
  );
};
