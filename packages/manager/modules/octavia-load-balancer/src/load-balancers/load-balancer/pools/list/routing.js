import { TRACKING_NAME } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools.list', {
    url: '/list',
    views: {
      loadbalancerPoolsView: 'octaviaLoadBalancerPoolsList',
    },
    resolve: {
      breadcrumb: () => null,
      pools: /* ngInject */ (
        OctaviaLoadBalancerPoolsService,
        projectId,
        region,
        loadbalancerId,
      ) =>
        OctaviaLoadBalancerPoolsService.getPools(
          projectId,
          region,
          loadbalancerId,
        ),
      goToPoolCreation: /* @ngInject */ ($state, trackAction) => () => {
        trackAction('add');
        $state.go('octavia-load-balancer.loadbalancer.pools.create');
      },
      goToPoolEditionFromList: /* @ngInject */ (
        goToPoolEdition,
        trackAction,
      ) => (pool) => {
        trackAction('edit');
        goToPoolEdition(pool);
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
      goToPoolMembers: /* @ngInject */ ($state, trackAction) => (pool) => {
        trackAction('members');
        $state.go(
          'octavia-load-balancer.loadbalancer.pools.detail.members.list',
          {
            poolId: pool.id,
          },
        );
      },
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
