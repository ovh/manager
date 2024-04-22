export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules',
    {
      url: '/:policyId/rules',
      views: {
        'octaviaLoadBalancerView@octavia-load-balancer':
          'octaviaLoadBalancerL7Rules',
      },
      resolve: {
        breadcrumb: () => 'L7 Rules',
        policyId: /* @ngInject */ ($transition$) =>
          $transition$.params().policyId,
        goToL7PoliciesListingPage: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
          ),
      },
      redirectTo:
        'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7rules.list',
    },
  );
};
