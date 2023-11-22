import { TRACKING_NAME } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools.list', {
    url: '',
    views: {
      loadbalancerPoolsView: 'octaviaLoadBalancerPoolsList',
    },
    resolve: {
      breadcrumb: () => null,
      pools: /* ngInject */ (
        OctaviaLoadBalancerPoolsService,
        projectId,
        region,
      ) => OctaviaLoadBalancerPoolsService.getPools(projectId, region),
      goToPoolCreation: /* @ngInject */ ($state, trackAction) => () => {
        trackAction('add');
        $state.go('octavia-load-balancer.loadbalancer.pools.create');
      },
      goToPoolDeletion: /* @ngInject */ ($state, trackAction) => (pool) => {
        trackAction('delete');
        $state.go('octavia-load-balancer.loadbalancer.pools.list.delete', {
          poolId: pool.id,
          poolName: pool.name,
        });
      },
      getPoolDetailLink: /* @ngInject */ ($state) => (pool) =>
        $state.href('octavia-load-balancer.loadbalancer.pools.detail', {
          poolId: pool.id,
        }),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
