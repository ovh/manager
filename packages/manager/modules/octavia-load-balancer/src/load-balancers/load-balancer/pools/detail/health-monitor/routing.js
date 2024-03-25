import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../../../constants';
import { TRACKING_SUFFIX as TRACKING_POOL_PREFIX } from '../../constants';
import { TRACKING_HEALTH_MONITOR_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor',
    {
      url: '/health-monitor',
      views: {
        loadbalancerPoolsDetailView:
          'octaviaLoadBalancerPoolsDetailHealthMonitor',
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('healthMonitor')
          .then((healthMonitor) =>
            !healthMonitor
              ? {
                  state:
                    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.create',
                }
              : false,
          ),
      resolve: {
        breadcrumb: /* @ngInject */ () => 'Health Monitor',
        healthMonitor: /* ngInject */ (
          OctaviaLoadBalancerHealthMonitorService,
          projectId,
          region,
          poolId,
        ) =>
          OctaviaLoadBalancerHealthMonitorService.getHealthMonitor(
            projectId,
            region,
            poolId,
          ),
        goToHealthMonitorEdition: /* @ngInject */ (
          $state,
          trackAction,
        ) => () => {
          trackAction('edit');
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.edit',
          );
        },
        goToHealthMonitorDeletion: /* @ngInject */ (
          $state,
          trackAction,
        ) => () => {
          trackAction('delete');
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.delete',
          );
        },
        goToEditName: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.edit-name',
          ),
        goToDashboard: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.health-monitor',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor',
                }
              : null,
          ),
        goToPool: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.pools.detail.general-information',
                }
              : null,
          ),
        trackBase: () =>
          `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_POOL_PREFIX}::${TRACKING_HEALTH_MONITOR_PREFIX}`,
        trackAction: /* @ngInject */ (atInternet, trackBase) => (hit) =>
          atInternet.trackClick({
            name: `${trackBase}::${hit}`,
            type: 'action',
          }),
        trackPage: /* @ngInject */ (atInternet, trackBase) => (hit) =>
          atInternet.trackPage({
            name: `${trackBase}::${hit}`,
          }),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_POOL_PREFIX}::${TRACKING_HEALTH_MONITOR_PREFIX}`,
      },
    },
  );
};
