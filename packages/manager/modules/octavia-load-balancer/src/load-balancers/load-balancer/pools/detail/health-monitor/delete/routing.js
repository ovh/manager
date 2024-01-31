export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailHealthMonitorDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
