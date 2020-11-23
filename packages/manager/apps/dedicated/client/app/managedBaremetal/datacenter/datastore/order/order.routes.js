export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.datastores.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'managed_baremetal_datacenters_datacenter_datastores_order',
          ),
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterDatastoreOrder',
      },
    },
  );
};
