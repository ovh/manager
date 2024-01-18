export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.create',
    {
      url: '/create',
      component: 'octaviaLoadBalancerPoolsDetailHealthMonitorCreate',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
