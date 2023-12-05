export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list.add-ip-instance',
    {
      url: '/add-ip-instance',
      views: {
        'loadbalancerPoolsDetailMembersView@octavia-load-balancer.loadbalancer.pools.detail.members':
          'octaviaLoadBalancerPoolsDetailMembersAddIpInstance',
      },
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, reload ? { reload: '^' } : null),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
