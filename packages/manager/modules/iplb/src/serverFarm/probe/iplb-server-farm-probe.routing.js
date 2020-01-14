export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.server-farm.add.probe', {
      url: '/probe',
      params: {
        edition: null,
        farm: null,
      },
      views: {
        modal: {
          component: 'iplbServerFarmProbe',
        },
      },
      layout: 'modal',
      resolve: {
        /* @ngInject */
        availableProbes: (IpLoadBalancerServerFarmService, serviceName) =>
          IpLoadBalancerServerFarmService.getAvailableFarmProbes(serviceName),
        edition: /* @ngInject */ ($transition$) =>
          $transition$.params().edition,
        farm: /* @ngInject */ ($transition$) => $transition$.params().farm,
      },
    })
    .state('network.iplb.detail.server-farm.update.probe', {
      url: '/probe',
      params: {
        edition: null,
        farm: null,
      },
      views: {
        modal: {
          component: 'iplbServerFarmProbe',
        },
      },
      layout: 'modal',
      resolve: {
        /* @ngInject */
        availableProbes: (IpLoadBalancerServerFarmService, serviceName) =>
          IpLoadBalancerServerFarmService.getAvailableFarmProbes(serviceName),
        edition: /* @ngInject */ ($transition$) =>
          $transition$.params().edition,
        farm: /* @ngInject */ ($transition$) => $transition$.params().farm,
      },
    });
};
