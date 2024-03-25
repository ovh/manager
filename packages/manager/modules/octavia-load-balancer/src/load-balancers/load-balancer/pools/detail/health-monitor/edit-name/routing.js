export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.health-monitor.edit-name',
    {
      url: '/edit-name',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailHealthMonitorEditName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
