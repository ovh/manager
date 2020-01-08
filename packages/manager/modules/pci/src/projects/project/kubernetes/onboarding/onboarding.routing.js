export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.onboarding', {
    url: '/onboarding',
    component: 'pciProjectKubernetesOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('kubernetes')
        .then((kubernetes) =>
          kubernetes.length > 0
            ? { state: 'pci.projects.project.kubernetes' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
