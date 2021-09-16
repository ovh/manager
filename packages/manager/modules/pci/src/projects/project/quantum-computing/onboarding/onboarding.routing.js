export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quantum-computing.onboarding', {
    url: '/onboarding',
    component: 'pciProjectQuantumComputingOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('notebooks')
        .then((notebooks) =>
          notebooks.length > 0
            ? { state: 'pci.projects.project.quantum-computing' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
