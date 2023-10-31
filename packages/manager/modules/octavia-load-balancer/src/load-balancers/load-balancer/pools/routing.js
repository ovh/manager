export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools', {
    url: '/pools',
    views: {
      loadbalancerView: 'octaviaLoadBalancerPools',
    },
    resolve: {
      breadcrumb: () => 'pools',
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.pools.list',
  });
};
