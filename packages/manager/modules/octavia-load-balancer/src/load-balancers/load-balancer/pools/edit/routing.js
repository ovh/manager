import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX } from '../constants';
import { TRACKING_NAME } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools.edit', {
    url: '/:poolId/edit',
    views: {
      loadbalancerPoolsView: 'octaviaLoadBalancerPoolsEdit',
    },
    resolve: {
      breadcrumb: () => null,
      poolId: /* @ngInject */ ($transition$) => $transition$.params().poolId,
      pool: /* @ngInject */ (
        OctaviaLoadBalancerPoolsService,
        projectId,
        region,
        poolId,
      ) => OctaviaLoadBalancerPoolsService.getPool(projectId, region, poolId),
      goBack: /* @ngInject */ ($state, poolId) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancer.pools.detail',
          {
            poolId,
          },
          reload
            ? { reload: 'octavia-load-balancer.loadbalancer.pools.detail' }
            : null,
        ),
      trackEditAction: /* @ngInject */ (trackAction) => (hit) =>
        trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
      trackEditPage: /* @ngInject */ (trackPage) => (hit) =>
        trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
    },
  });
};
