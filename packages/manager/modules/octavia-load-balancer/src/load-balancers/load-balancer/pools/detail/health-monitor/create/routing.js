import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX as TRACKING_POOL_PREFIX } from '../../../constants';
import { TRACKING_HEALTH_MONITOR_PREFIX } from '../constants';
import { TRACKING_HIT_PREFIX } from './constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.create',
    {
      url: '/create',
      component: 'octaviaLoadBalancerPoolsDetailHealthMonitorCreate',
      resolve: {
        breadcrumb: () => null,
        trackAddAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
        trackAddPage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_POOL_PREFIX}::${TRACKING_HEALTH_MONITOR_PREFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
