export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.delete',
    {
      url: '/delete',
      component: 'octaviaLoadBalancerPoolsDetailHealthMonitorDelete',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
