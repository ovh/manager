import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list',
    {
      url: '',
      views: {
        loadbalancerPoolsDetailMembersView:
          'octaviaLoadBalancerPoolsDetailMembersList',
      },
      resolve: {
        breadcrumb: () => null,
        members: /* ngInject */ (
          OctaviaLoadBalancerPoolsService,
          projectId,
          region,
          poolId,
        ) =>
          OctaviaLoadBalancerPoolsService.getPoolMembers(
            projectId,
            region,
            poolId,
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
