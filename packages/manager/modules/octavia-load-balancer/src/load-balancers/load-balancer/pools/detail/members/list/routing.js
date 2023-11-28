import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list',
    {
      url: '/list',
      views: {
        loadbalancerPoolsDetailMembersView:
          'octaviaLoadBalancerPoolsDetailMembersList',
      },
      resolve: {
        breadcrumb: () => null,
        members: /* ngInject */ (
          OctaviaLoadBalancerMembersService,
          projectId,
          region,
          poolId,
        ) =>
          OctaviaLoadBalancerMembersService.getMembers(
            projectId,
            region,
            poolId,
          ),
        memberCreationLink: /* @ngInject */ ($state) => () =>
          $state.href(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.create',
          ),
        membersPageTracking: () =>
          `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::add`,
        goToMemberDeletion: /* @ngInject */ ($state) => (member) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.delete',
            {
              memberId: member.id,
              memberName: member.name,
            },
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
