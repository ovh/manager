export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.check-bgp-peering', {
    url:
      '/check-bgp-peering?{popConfigId:int}&{extraConfigId:int}&{dcConfigId:int}&{isExtra:boolean}',
    views: {
      modal: {
        component: 'cloudConnectCheckBgpPeering',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      breadcrumb: () => null,
      isExtra: /* @ngInject */ ($transition$) => $transition$.params().isExtra,
      dcConfigId: /* @ngInject */ ($transition$) =>
        $transition$.params().dcConfigId,
      extraConfigId: /* @ngInject */ ($transition$) =>
        $transition$.params().extraConfigId,
      popConfigId: /* @ngInject */ ($transition$) =>
        $transition$.params().popConfigId,
    },
  });
};
