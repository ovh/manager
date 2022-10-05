export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.onboarding', {
    url: '/onboarding',
    component: 'pciProjectAIDashboardOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('aiItems')
        .then((items) =>
          Object.values(items).reduce(
            (acc, itemArray) => acc + itemArray.length,
            0,
          ) > 0
            ? { state: 'pci.projects.project.ai-dashboard' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
