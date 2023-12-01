export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.add-ip-instance',
    {
      url: '/add-ip-instance',
      views: {
        loadbalancerPoolsDetailMembersView:
          'octaviaLoadBalancerPoolsDetailMembersAddIpInstance',
      },
      resolve: {
        breadcrumb: () => null,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
