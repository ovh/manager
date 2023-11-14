import { TRACKING_HIT_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools.detail', {
    url: '/:poolId',
    views: {
      'octaviaLoadBalancerView@octavia-load-balancer':
        'octaviaLoadBalancerPoolsDetail',
    },
    resolve: {
      poolId: /* @ngInject */ ($transition$) => $transition$.params().poolId,
      pool: /* @ngInject */ (
        OctaviaLoadBalancerPoolsService,
        projectId,
        region,
        poolId,
      ) => OctaviaLoadBalancerPoolsService.getPool(projectId, region, poolId),
      breadcrumb: /* @ngInject */ (pool) => pool.name,
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      generalInformationPoolsDetailLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
        poolId,
      ) =>
        $state.href(
          'octavia-load-balancer.loadbalancer.pools.detail.general-information',
          {
            projectId,
            region,
            loadbalancerId,
            poolId,
          },
        ),
      healthMonitorPoolsDetailLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
        poolId,
      ) =>
        $state.href(
          'octavia-load-balancer.loadbalancer.pools.detail.health-monitor',
          {
            projectId,
            region,
            loadbalancerId,
            poolId,
          },
        ),
      membersPoolsDetailLink: /* @ngInject */ (
        $state,
        projectId,
        region,
        loadbalancerId,
        poolId,
      ) =>
        $state.href('octavia-load-balancer.loadbalancer.pools.detail.members', {
          projectId,
          region,
          loadbalancerId,
          poolId,
        }),
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancer.pools',
          {},
          reload
            ? { reload: 'octavia-load-balancer.loadbalancer.pools' }
            : null,
        ),
      trackDetailAction: /* @ngInject */ (trackAction) => (hit) =>
        trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
      trackDetailPage: /* @ngInject */ (trackPage) => (hit) =>
        trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
    },
    redirectTo:
      'octavia-load-balancer.loadbalancer.pools.detail.general-information',
  });
};
