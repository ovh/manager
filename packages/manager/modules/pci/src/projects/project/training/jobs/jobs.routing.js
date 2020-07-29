export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs', {
    url: '/jobs',
    component: 'pciProjectTrainingJobsComponent',
    redirectTo: {
      state: 'pci.projects.project.training.jobs.list',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_title'),
      job: /* @ngInject */ (PciProjectTrainingJobsService, projectId) => (
        jobId,
      ) => PciProjectTrainingJobsService.get(projectId, jobId),
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
      submitJobLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
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
      getClassForState: /* @ngInject */ () => (state) => {
        switch (state) {
          case 'CANCELLED':
          case 'FAILED':
            return 'oui-status_error';
          case 'CANCELLING':
          case 'INTERRUPTED':
            return 'oui-status_warning';
          case 'SUCCEEDED':
            return 'oui-status_success';
          case 'QUEUING':
          case 'QUEUED':
          case 'RUNNING':
            return 'oui-status_info';
          default:
            return 'oui-status_info';
        }
      },
    },
  });
};
