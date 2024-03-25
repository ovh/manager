export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.jobs.dashboard.general-information',
    {
      url: '/general-information',
      views: {
        jobView: 'ovhManagerPciProjectJobGeneralInformation',
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        goBack: /* @ngInject */ (job, goToJob) => (message, type) => {
          return goToJob(job, message, type);
        },
        goToAttachData: /* @ngInject */ ($state, projectId) => () =>
          $state.go(
            'pci.projects.project.training.jobs.dashboard.attach-data',
            {
              projectId,
            },
          ),
        goToJobDelete: /* @ngInject */ ($state, projectId, jobId) => () =>
          $state.go(
            'pci.projects.project.training.jobs.dashboard.general-information.delete',
            {
              projectId,
              jobId,
            },
          ),
        goToJobKill: /* @ngInject */ ($state, projectId, jobId) => () =>
          $state.go(
            'pci.projects.project.training.jobs.dashboard.general-information.kill',
            {
              projectId,
              jobId,
            },
          ),
        goToJobResubmit: /* @ngInject */ ($state, projectId, jobId) => () =>
          $state.go(
            'pci.projects.project.training.jobs.dashboard.general-information.resubmit',
            {
              projectId,
              jobId,
            },
          ),
      },
    },
  );
};
