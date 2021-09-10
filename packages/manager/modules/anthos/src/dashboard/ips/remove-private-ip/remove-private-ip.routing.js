export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips.remove-private-ip', {
    url: '/remove-private-ip',
    params: { privateIp: null },
    views: {
      modal: {
        component: 'anthosDashboardIpsRemovePrivateIp',
      },
    },
    layout: 'modal',
    onEnter: /* @ngInject */ ($transition$, goBack) => {
      if (!$transition$.params().privateIp) goBack(null);
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,

      privateIp: /* @ngInject */ ($transition$) => {
        return $transition$.params().privateIp;
      },

      removePrivateIpHitTracking: () => {
        return 'delete-ip-range';
      },
    },
  });
};
