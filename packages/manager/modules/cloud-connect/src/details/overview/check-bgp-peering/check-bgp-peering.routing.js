import {
  TRACKING_PREFIX,
  DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
} from '../../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.check-bgp-peering', {
    url:
      '/check-bgp-peering?{popConfigId:int}&{extraConfigId:int}&{dcConfigId:int}&{isExtra:bool}',
    views: {
      modal: {
        component: 'cloudConnectCheckBgpPeering',
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}cloud-connect::pop-up::check::bgp-peering`,
      ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
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
