import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX as TRACKING_POOL_PREFIX } from '../../../constants';
import { TRACKING_HEALTH_MONITOR_PREFIX } from '../constants';
import { TRACKING_HIT_PREFIX } from './constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.edit',
    {
      url: '/edit',
      component: 'octaviaLoadBalancerPoolsDetailHealthMonitorEdit',
      resolve: {
        breadcrumb: () => null,
        trackEditAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
        trackEditPage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_POOL_PREFIX}::${TRACKING_HEALTH_MONITOR_PREFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
