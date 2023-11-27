import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';
import { MEMBER_DELETE_TRACKING_HIT_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list.delete',
    {
      url: '/delete?memberId&memberName',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailMembersDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        memberId: /* ngInject */ ($transition$) =>
          $transition$.params().memberId,
        memberName: /* ngInject */ ($transition$) =>
          $transition$.params().memberName,
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
        trackDeleteAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(
            `${TRACKING_HIT_PREFIX}::${MEMBER_DELETE_TRACKING_HIT_SUFFIX}::${hit}`,
          ),
        trackDeletePage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(
            `${TRACKING_HIT_PREFIX}::${MEMBER_DELETE_TRACKING_HIT_SUFFIX}-${hit}`,
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::${MEMBER_DELETE_TRACKING_HIT_SUFFIX}`,
      },
    },
  );
};
