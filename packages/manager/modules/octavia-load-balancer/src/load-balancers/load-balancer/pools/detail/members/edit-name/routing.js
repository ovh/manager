import { TRACKING_HIT_PREFIX } from '../constants';
import { MEMBER_EDIT_NAME_TRACKING_HIT_SUFFIX } from './constants';
import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list.edit-name',
    {
      url: '/edit-name?memberId&memberName',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailMemberEditName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        memberName: /* ngInject */ ($transition$) =>
          $transition$.params().memberName,
        memberId: /* ngInject */ ($transition$) =>
          $transition$.params().memberId,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.pools.detail.members.list',
                }
              : null,
          ),
        trackEditMemberPage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(
            `${TRACKING_HIT_PREFIX}::${MEMBER_EDIT_NAME_TRACKING_HIT_SUFFIX}-${hit}`,
          ),
        trackEditMemberAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(
            `${TRACKING_HIT_PREFIX}::${MEMBER_EDIT_NAME_TRACKING_HIT_SUFFIX}::${hit}`,
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::${MEMBER_EDIT_NAME_TRACKING_HIT_SUFFIX}`,
      },
    },
  );
};
