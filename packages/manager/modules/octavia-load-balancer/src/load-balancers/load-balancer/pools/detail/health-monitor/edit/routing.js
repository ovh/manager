export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.edit',
    {
      url: '/edit',
      component: 'octaviaLoadBalancerPoolsDetailHealthMonitorEdit',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
