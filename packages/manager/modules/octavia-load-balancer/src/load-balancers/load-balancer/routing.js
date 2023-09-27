export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer', {
    url: '/:region/:loadbalancerId',
    component: 'octaviaLoadBalancer',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      region: /* @ngInject */ ($transition$) => $transition$.params().region,
      loadbalancerId: /* @ngInject */ ($transition$) =>
        $transition$.params().loadbalancerId,
      // TODO: retrieve loadbalancer info (or do like databases)
      loadbalancer: () => ({ name: 'test' }),
      breadcrumb: /* @ngInject */ (loadbalancerId) => loadbalancerId,
      generalInformationLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.general-information', {
          projectId,
          region,
          loadbalancerId,
        }),
      listenersLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.listeners', {
          projectId,
          region,
          loadbalancerId,
        }),
      poolsLink: /* @ngInject */ ($state, projectId, region, loadbalancerId) =>
        $state.href('octavia-load-balancer.loadbalancer.pools', {
          projectId,
          region,
          loadbalancerId,
        }),
      statisticsLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.statistics', {
          projectId,
          region,
          loadbalancerId,
        }),
      certificatesLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.certificates', {
          projectId,
          region,
          loadbalancerId,
        }),
    },
    atInternet: {
      ignore: true,
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.listeners',
  });
};
