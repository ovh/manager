export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.loadbalancer.onboarding', {
    url: '/onboarding',
    component: 'pciProjectLoadBalancerOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('loadBalancers')
        .then((lb) =>
          lb.length > 0
            ? { state: 'pci.projects.project.loadbalancer' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
