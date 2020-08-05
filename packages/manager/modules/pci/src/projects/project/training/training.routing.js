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

          return { state: 'pci.projects.project.training.dashboard' };
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_title'),
      isAuthorized: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.isAuthorized(projectId),
      jobsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs', {
          projectId,
        }),
      jobInfo: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      jobKill: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.kill', {
          projectId,
          jobId,
        }),
      jobInfoLink: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.href('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      billingLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing', {
          projectId,
        }),
      goToJobSubmit: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      submitJobLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      goToDataCreate: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.data.add', {
          projectId,
        }),
      dataLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.data', {
          projectId,
        }),
      installLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.install', {
          projectId,
        }),
      dashboardLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.dashboard', {
          projectId,
        }),
      goToDashboard: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.dashboard',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.training.dashboard',
            ),
          );
        }

        return promise;
      },
      goToRegistryAttach: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.attach-registry', {
          projectId,
        }),
      registryAttachLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.dashboard.attach-registry', {
          projectId,
        }),
      goToRegistryDetach: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.detach-registry', {
          projectId,
        }),
      registryDetachLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.dashboard.detach-registry', {
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
      trainingFeatures: /* @ngInject */ (
        PciProjectTrainingService,
        projectId,
      ) => PciProjectTrainingService.getFeatures(projectId),
      registry: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getRegistry(projectId),
      deleteRegistry: /* @ngInject */ (
        PciProjectTrainingService,
        projectId,
      ) => () => PciProjectTrainingService.deleteRegistry(projectId),
      saveRegistry: /* @ngInject */ (PciProjectTrainingService, projectId) => (
        url,
        username,
        password,
      ) =>
        PciProjectTrainingService.saveRegistry(
          projectId,
          url,
          username,
          password,
        ),
      userLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.users', {
          projectId,
        }),
    },
  });
};
