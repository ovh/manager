import { TRACKING_NAME } from '../../../constants';
import { TRACKING_SUFFIX } from '../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.general-information',
    {
      url: '/general-information',
      views: {
        loadbalancerPoolsDetailView: 'octaviaLoadBalancerPoolsDetailOverview',
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => 'General informations',
        goToEditName: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information.edit-name',
          ),
        goToDelete: /* @ngInject */ ($state) => (pool) => {
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information.delete',
            {
              poolId: pool.id,
              poolName: pool.name,
            },
          );
        },
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
