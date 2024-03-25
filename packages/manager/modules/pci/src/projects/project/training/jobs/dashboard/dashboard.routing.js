export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.dashboard', {
    url: '/:jobId',
    component: 'ovhManagerPciProjectJobsDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (job) => job.id,
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      goToUsersAndTokens: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
      job: /* @ngInject */ (jobList, jobId) => {
        return jobList.find(({ id }) => id === jobId);
      },
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      generalInformationLink: /* @ngInject */ ($state, projectId, jobId) =>
        $state.href(
          'pci.projects.project.training.jobs.dashboard.general-information',
          {
            projectId,
            jobId,
          },
        ),
      attachDataLink: /* @ngInject */ ($state, projectId, jobId) =>
        $state.href(
          'pci.projects.project.training.jobs.dashboard.attach-data',
          {
            projectId,
            jobId,
          },
        ),
      logsLink: /* @ngInject */ ($state, projectId, jobId) =>
        $state.href('pci.projects.project.training.jobs.dashboard.logs', {
          projectId,
          jobId,
        }),
    },
    redirectTo:
      'pci.projects.project.training.jobs.dashboard.general-information',
  });
};
