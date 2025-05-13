export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.onboarding', {
    url: '/onboarding',
    views: {
      'content@pci.projects.project.training': 'pciProjectTrainingOnboarding',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      submitJobLink: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      createAuthorization: /* @ngInject */ (
        $state,
        PciProjectTrainingService,
        projectId,
      ) => () =>
        PciProjectTrainingService.createAuthorization(projectId).then(
          (hasBeenAuthorized) => {
            if (hasBeenAuthorized) {
              $state.go(
                'pci.projects.project.training.dashboard',
                {
                  projectId,
                },
                {
                  reload: true,
                },
              );
            } else {
              $state.go(
                'pci.projects.project.training.onboarding',
                {
                  projectId,
                },
                {
                  reload: true,
                },
              );
            }
          },
        ),
    },
  });
};
