export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving.onboarding', {
    url: '/onboarding',
    component: 'pciProjectServingOnboarding',

    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('namespaces')
        .then((namespaces) => {
          if (namespaces.length > 0) {
            return { state: 'pci.projects.project.serving' };
          }
          return false;
        }),

    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      addNamespace: /* @ngInject */ ($state, projectId) => () => {
        $state.go(
          'pci.projects.project.serving.add',
          {
            projectId,
          },
          {
            reload: true,
          },
        );
      },
    },
  });
};
