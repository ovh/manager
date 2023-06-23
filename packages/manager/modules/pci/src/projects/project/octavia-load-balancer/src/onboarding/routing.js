export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.octavia-load-balancer.onboarding',
    {
      url: '/onboarding',
      component: 'octaviaLoadBalancerOnboarding',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
