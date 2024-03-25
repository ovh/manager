export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs', {
    url: '/jobs?id',
    component: 'pciProjectTrainingJobsComponent',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_title'),
      pricesCatalog: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getPricesFromCatalog(projectId),
      getCatalogEntryF: /* @ngInject */ (pricesCatalog) => (resourceId) => {
        return pricesCatalog[`ai-training.${resourceId}.minute.consumption`];
      },
      getPrice: /* @ngInject */ (getCatalogEntryF) => (qty, resourceId) => {
        return getCatalogEntryF(resourceId).priceInUcents * 60 * qty;
      },
      getTax: /* @ngInject */ (getCatalogEntryF) => (qty, resourceId) =>
        getCatalogEntryF(resourceId).tax * 60 * qty,
      regions: /* @ngInject */ (PciProjectTrainingJobService, projectId) =>
        PciProjectTrainingJobService.getRegions(projectId),
      jobId: /* @ngInject */ ($transition$) => $transition$.params().id,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId) => (
        jobId,
      ) => PciProjectTrainingJobService.get(projectId, jobId),
      goToJobs: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.jobs',
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
              'pci.projects.project.training.jobs',
            ),
          );
        }

        return promise;
      },
      goToJob: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        job,
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const stateName =
          'pci.projects.project.training.jobs.dashboard.general-information';
        const promise = $state.go(
          stateName,
          {
            projectId,
            jobId: job.id,
          },
          {
            reload,
          },
        );
        return message
          ? promise.then(() => {
              CucCloudMessage.flushMessages(stateName);
              CucCloudMessage[type](message, stateName);
            })
          : promise;
      },
      jobInfo: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.dashboard', {
          projectId,
          jobId,
        }),
      jobResubmit: /* @ngInject */ ($state) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.resubmit', {
          jobId,
        }),
      jobKill: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.kill', {
          projectId,
          jobId,
        }),
      deleteJob: /* @ngInject */ ($state) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.delete', {
          jobId,
        }),
      jobInfoLink: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.href('pci.projects.project.training.jobs.dashboard', {
          projectId,
          jobId,
        }),
      goToJobSubmit: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      jobList: /* @ngInject */ (
        PciProjectTrainingJobService,
        projectId,
        isAuthorized,
      ) => {
        if (!isAuthorized) {
          return [];
        }
        return PciProjectTrainingJobService.getAll(projectId);
      },
      refreshState: /* @ngInject */ ($state) => () => $state.reload(),
      goToUsersAndTokens: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
    },
  });
};
