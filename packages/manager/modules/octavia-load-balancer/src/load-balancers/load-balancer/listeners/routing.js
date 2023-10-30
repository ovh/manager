export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners', {
    url: '/listeners',
    views: {
      loadbalancerView: 'octaviaLoadBalancerListeners',
    },
    resolve: {
      breadcrumb: () => 'listeners',
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.listeners.list',
  });
};
