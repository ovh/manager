export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding', {
    url: '/onboarding',
    component: 'octaviaLoadBalancerOnboarding',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
