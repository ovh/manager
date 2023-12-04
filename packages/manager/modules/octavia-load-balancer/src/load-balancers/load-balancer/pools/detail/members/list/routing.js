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
        memberAddLink: /* @ngInject */ ($state) => () =>
          $state.href(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.create',
          ),
        trackMemberAddAction: () =>
          `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::add`,
        memberAddInstanceLink: /* @ngInject */ ($state) => () =>
          $state.href(
            'octavia-load-balancer.loadbalancer.pools.detail.members.add-ip-instance',
          ),
        trackMemberAddInstanceAction: () =>
          `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::add-instances`,
        goToMemberEdition: /* @ngInject */ ($state, trackAction) => (
          member,
        ) => {
          trackAction(`${TRACKING_HIT_PREFIX}::edit`);
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.edit-name',
            {
              memberId: member.id,
              memberName: member.name,
            },
          );
        },
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
