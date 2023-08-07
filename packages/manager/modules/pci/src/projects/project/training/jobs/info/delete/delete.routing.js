export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.info.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'ovhManagerPciProjectTrainingDeleteJob',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (jobId, goBackToJob, goToJobs) => (
        message = false,
        type = 'success',
      ) => {
        if (type === 'success' && message) {
          return goToJobs(message, type);
        }
        return goBackToJob(jobId, message, type);
      },
      breadcrumb: () => null,
    },
  });
};
