export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.hosts.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'managed_baremetal_datacenters_datacenter_host_order',
          ),
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterHostOrder',
      },
    },
  );
};
