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
      console.log('ZM:: onEnter', $transition$.params());
      if (!$transition$.params().privateIp) goBack(null);
    },
    resolve: {
      breacrumb: /* @ngInject */ () => false,

      privateIp: /* @ngInject */ ($transition$) => {
        return $transition$.params().privateIp;
      },
    },
  });
};
