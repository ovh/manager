export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training', {
    url: '/training',
    component: 'pciProjectTraining',
    redirectTo: (transition) =>
      transition
        .injector()
        .get('$q')
        .all([
          transition.injector().getAsync('isAuthorized'),
          transition.injector().getAsync('jobList'),
          transition.injector().getAsync('dataList'),
        ])
        .then(([isAuthorized, jobList, dataList]) => {
          if (
            !isAuthorized ||
            (jobList.length === 0 && dataList.length === 0)
          ) {
            return { state: 'pci.projects.project.training.onboarding' };
          }

          return { state: 'pci.projects.project.training.jobs' };
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
      jobList: /* @ngInject */ (PciProjectTrainingJobService, projectId) =>
        PciProjectTrainingJobService.getAll(projectId),
      dataList: /* @ngInject */ (PciProjectTrainingDataService, projectId) =>
        PciProjectTrainingDataService.getAll(projectId),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      allUsers: /* @ngInject */ (PciProjectTrainingService, projectId) => () =>
        PciProjectTrainingService.getAllUsers(projectId),
      pricesCatalog: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getPricesFromCatalog(projectId),
      regions: /* @ngInject */ (PciProjectTrainingService, projectId) => () =>
        PciProjectTrainingService.getRegions(projectId),
      refreshState: /* @ngInject */ ($state) => () => $state.reload(),
    },
  });
};
