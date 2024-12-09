export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.test-bgp-peering', {
    url: '/test-bgp-peering',
    views: {
      modal: {
        component: 'cloudConnectTestBgpPeering',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      vRackId: /* @ngInject */ ($transition$) => $transition$.params().vRackId,
      breadcrumb: () => null,
    },
  });
};
