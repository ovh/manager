export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'cloud-connect.details.overview.remove-datacenter-configuration',
    {
      url: '/datacenter/:datacenterId/remove',
      views: {
        modal: {
          component: 'cloudConnectDetailsRemoveDatacenterConfiguration',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        datacenter: /* @ngInject */ (cloudConnect, datacenterId) =>
          cloudConnect.getDcConfiguration(datacenterId),
        popId: /* @ngInject */ (cloudConnect) =>
          cloudConnect.getFirstPopConfiguration().id,
        breadcrumb: () => null,
      },
    },
  );
};
