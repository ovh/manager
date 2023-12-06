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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('load_balancer_pools_detail_info_tab_title'),
        goToEditName: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information.edit-name',
          ),
        goToAddMemberManually: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.create',
          ),
        goToAddMemberFromInstances: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.add-ip-instance',
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
