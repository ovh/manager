import { DIAGNOSTIC_TRACKING_PREFIX } from '../../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.check-bgp-peering', {
    url:
      '/check-bgp-peering?{popConfigId:int}&{extraConfigId:int}&{dcConfigId:int}&{isExtra:boolean}',
    views: {
      modal: {
        component: 'cloudConnectCheckBgpPeering',
      },
    },
    atInternet: {
      rename: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::pop-up::check::bgp-peering`,
      level2: 99,
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
