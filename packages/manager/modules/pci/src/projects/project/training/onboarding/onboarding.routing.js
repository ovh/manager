export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.onboarding', {
    url: '/onboarding',
    component: 'pciProjectTrainingOnboarding',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      createProject: /* @ngInject */ (
        $state,
        PciProjectTrainingService,
        projectId,
      ) => () =>
        PciProjectTrainingService.createAuthorization(projectId).then(
          (hasBeenAuthorized) => {
            if (hasBeenAuthorized) {
              $state.go(
                'pci.projects.project.training.install',
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
