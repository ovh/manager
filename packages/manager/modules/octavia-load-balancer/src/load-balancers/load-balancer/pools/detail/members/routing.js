export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members',
    {
      url: '/members',
      views: {
        loadbalancerPoolsDetailView: 'octaviaLoadBalancerPoolsDetailMembers',
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => 'Members',
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('octavia-load-balancer.loadbalancer.pools.list'),
      },
      redirectTo:
        'octavia-load-balancer.loadbalancer.pools.detail.members.list',
    },
  );
};
