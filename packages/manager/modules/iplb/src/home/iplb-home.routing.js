import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.home', {
    url: '/home',
    params: {
      serviceName: null,
    },
    views: {
      iplbHeader: {
        template: IplbHeaderTemplate,
        controller: 'IpLoadBalancerDashboardHeaderCtrl',
        controllerAs: 'ctrl',
      },
      iplbContent: {
        component: 'ovhManagerIplbHomeComponent',
      },
    },
    translations: {
      value: ['.', '../zone', '../vrack'],
      format: 'json',
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goToCipherChange: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('network.iplb.detail.home.cipher', { serviceName }),
      goToFailoverIp: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('network.iplb.detail.home.failover-ip', { serviceName }),
      goToNatIpDetail: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('network.iplb.detail.home.nat-ip-detail', { serviceName }),
      goToUpdateQuota: /* @ngInject */ ($state, serviceName) => (quota) =>
        $state.go('network.iplb.detail.home.update-quota', {
          serviceName,
          quota,
        }),
      goBack: /* @ngInject */ ($state) => (reload = false) => {
        return $state.go(
          'network.iplb.detail.home',
          {},
          {
            reload,
          },
        );
      },
    },
  });
};
