export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.datastores.order-legacy',
    {
      url: '/order-legacy',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrderLegacy',
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'managed_baremetal_datacenters_datacenter_datastores_order_legacy',
          ),
      },
    },
  );
};
