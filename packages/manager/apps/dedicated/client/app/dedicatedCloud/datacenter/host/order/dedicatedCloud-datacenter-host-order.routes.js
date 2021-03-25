export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.hosts.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_host_order',
          ),
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterHostOrder',
      },
    },
  );
};
