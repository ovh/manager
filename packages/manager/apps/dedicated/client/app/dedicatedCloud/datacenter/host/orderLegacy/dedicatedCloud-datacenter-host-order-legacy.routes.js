export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.hosts.order-legacy',
    {
      url: '/order-legacy',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterHostOrderLegacy',
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
        datacenterModel: /* @ngInject */ (datacenter) => datacenter.model,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_host_order_legacy',
          ),
      },
    },
  );
};
