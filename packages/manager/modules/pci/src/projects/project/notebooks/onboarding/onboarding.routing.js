export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.onboarding', {
    url: '/onboarding',
    component: 'pciProjectNotebooksOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('notebooks')
        .then((notebooks) =>
          notebooks.length > 0
            ? { state: 'pci.projects.project.notebooks' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
