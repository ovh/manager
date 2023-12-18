import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';
import { TRACKING_CHAPTER_1 } from '../../../../../../octavia-load-balancer.constants';

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
          `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::add-manually`,
        memberAddInstanceLink: /* @ngInject */ ($state) => () =>
          $state.href(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.add-ip-instance',
          ),
        trackMemberAddInstanceAction: () =>
          `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::add-instances`,
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
        goToMemberDeletion: /* @ngInject */ ($state, trackAction) => (
          member,
        ) => {
          trackAction(`${TRACKING_HIT_PREFIX}::delete`);
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list.delete',
            {
              memberId: member.id,
              memberName: member.name,
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
