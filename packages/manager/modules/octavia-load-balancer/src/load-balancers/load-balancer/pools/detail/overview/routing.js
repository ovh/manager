export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.general-information',
    {
      url: '/general-information',
      views: {
        loadbalancerPoolsDetailView: 'octaviaLoadBalancerPoolsDetailOverview',
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => 'General informations',
        goToEditName: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information.edit-name',
          ),
        goToDelete: /* @ngInject */ ($state) => (pool) => {
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information.delete',
            {
              poolId: pool.id,
              poolName: pool.name,
            },
          );
        },
      },
    },
  );
};
