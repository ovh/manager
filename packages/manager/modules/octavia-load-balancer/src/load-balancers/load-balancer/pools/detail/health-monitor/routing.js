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
      },
    },
  );
};
