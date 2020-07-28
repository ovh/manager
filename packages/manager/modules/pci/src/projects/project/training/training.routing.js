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
        ])
        .then(([isAuthorized, jobList]) => {
          if (!isAuthorized) {
            return { state: 'pci.projects.project.training.onboarding' };
          }
          if (jobList.length > 0) {
            return { state: 'pci.projects.project.training.jobs' };
          }
          return { state: 'pci.projects.project.training.jobs.submit' };
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
      jobInfoLink: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.href('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      dataLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.data.list', {
          projectId,
        }),
      installLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.install', {
          projectId,
        }),
      jobList: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getAllJobs(projectId),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      allUsers: /* @ngInject */ (PciProjectTrainingService, projectId) => () =>
        PciProjectTrainingService.getAllUsers(projectId),
      pricesCatalog: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getPricesFromCatalog(projectId),
      regions: /* @ngInject */ (PciProjectTrainingService, projectId) => () =>
        PciProjectTrainingService.getRegions(projectId),
    },
  });
};
