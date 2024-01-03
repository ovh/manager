import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../constants';
import { TRACKING_SUFFIX as ADD_INSTANCES_TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list.add-ip-instance',
    {
      url: '/add-ip-instance',
      views: {
        'loadbalancerPoolsDetailMembersView@octavia-load-balancer.loadbalancer.pools.detail.members':
          'octaviaLoadBalancerPoolsDetailMembersAddIpInstance',
      },
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, reload ? { reload: '^' } : null),
        trackAddInstancesAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(
            `${TRACKING_HIT_PREFIX}::${ADD_INSTANCES_TRACKING_SUFFIX}::${hit}`,
          ),
        trackAddInstancesPage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(
            `${TRACKING_HIT_PREFIX}::${ADD_INSTANCES_TRACKING_SUFFIX}-${hit}`,
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::${ADD_INSTANCES_TRACKING_SUFFIX}`,
      },
    },
  );
};
