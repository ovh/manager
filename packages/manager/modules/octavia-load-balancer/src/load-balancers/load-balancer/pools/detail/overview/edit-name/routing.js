export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.general-information.edit-name',
    {
      url: '/edit-name',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailOverviewEditName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information',
            {},
            reload
              ? { reload: 'octavia-load-balancer.loadbalancer.pools.detail' }
              : null,
          ),
      },
    },
  );
};
