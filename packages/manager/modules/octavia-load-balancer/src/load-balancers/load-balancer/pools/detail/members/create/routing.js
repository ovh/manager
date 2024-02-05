import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';
import { TRACKING_SUFFIX as ADD_MANUALLY_TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list.create',
    {
      url: '/create',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailMembersCreate',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
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
        trackCreateAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(
            `${TRACKING_HIT_PREFIX}::${ADD_MANUALLY_TRACKING_SUFFIX}::${hit}`,
          ),
        trackCreatePage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(
            `${TRACKING_HIT_PREFIX}::${ADD_MANUALLY_TRACKING_SUFFIX}-${hit}`,
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::${ADD_MANUALLY_TRACKING_SUFFIX}`,
      },
    },
  );
};
