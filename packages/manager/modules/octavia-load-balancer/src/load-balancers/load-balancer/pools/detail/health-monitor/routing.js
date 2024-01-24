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
            healthMonitor.length === 0
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
        goToHealthMonitorEdition: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.edit',
          ),
        goToHealthMonitorDeletion: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.delete',
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
      },
    },
  );
};
