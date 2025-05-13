export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.hosts.order-legacy',
    {
      url: '/order-legacy',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterHostOrderLegacy',
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
        datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'managed_baremetal_datacenters_datacenter_host_order_legacy',
          ),
      },
    },
  );
};
