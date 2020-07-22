export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training', {
    url: '/training',
    component: 'pciProjectTraining',
    redirectTo: (transition) =>
      transition
        .injector()
        .get('$q')
        .all([transition.injector().getAsync('isAuthorized')])
        .then(([isAuthorized]) => {
          if (isAuthorized) {
            return { state: 'pci.projects.project.training.install' };
          }
          return { state: 'pci.projects.project.training.onboarding' };
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_title'),
      isAuthorized: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.isAuthorized(projectId),
      jobsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs.list', {
          projectId,
        }),
      dataLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.data.list', {
          projectId,
        }),
      installLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.install', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      allUsers: /* @ngInject */ (PciProjectTrainingService, projectId) => () =>
        PciProjectTrainingService.getAllUsers(projectId),
      allRegions: /* @ngInject */ (PciProjectTrainingService) => () =>
        PciProjectTrainingService.getAllRegions(),
    },
  });
};
