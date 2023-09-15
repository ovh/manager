export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.info', {
    url: '/:jobId',
    views: {
      'content@pci.projects.project.training':
        'pciProjectTrainingJobsInfoComponent',
    },
    resolve: {
      breadcrumb: /* @ngInject */ (jobId) => jobId,
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      jobInfo: /* @ngInject */ ($state, projectId, jobId) =>
        $state.href('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      jobLogs: /* @ngInject */ ($state, projectId, jobId) =>
        $state.href('pci.projects.project.training.jobs.info.logs', {
          projectId,
          jobId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToJobKill: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.kill', {
          projectId,
          jobId,
          previousState: 'info',
        }),
      goToJobResubmit: /* @ngInject */ ($state, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.resubmit', {
          jobId,
          previousState: 'info',
        }),
      goToJobDelete: /* @ngInject */ ($state, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.info.delete', {
          jobId,
        }),
      goToUsersAndTokens: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
      goBackToJob: /* @ngInject */ ($state) => (jobId, reload = false) =>
        $state.go(
          'pci.projects.project.training.jobs.info',
          {
            jobId,
          },
          {
            reload,
          },
        ),
    },
  });
};
