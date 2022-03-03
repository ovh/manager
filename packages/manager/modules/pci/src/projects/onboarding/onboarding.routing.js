export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.onboarding', {
    url: '/onboarding',
    component: 'pciProjectsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .get('publicCloud')
        .getDefaultProject()
        .then((projectId) =>
          projectId
            ? {
                state: 'pci.projects.project',
                params: {
                  projectId,
                },
              }
            : null,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
