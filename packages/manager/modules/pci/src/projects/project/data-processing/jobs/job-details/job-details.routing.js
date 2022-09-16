export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.jobs.job-details',
    {
      url: '/:jobId',
      views: {
        'content@pci.projects.project.data-processing':
          'pciProjectDataProcessingJobDetails',
      },
      redirectTo:
        'pci.projects.project.data-processing.jobs.job-details.dashboard',
      resolve: {
        // retrieve job id from url params
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          jobId,
        ) => dataProcessingService.getJob(projectId, jobId),
        terminateJob: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go(
            'pci.projects.project.data-processing.jobs.job-details.dashboard.terminate',
            {
              projectId,
              jobId: job.id,
              jobName: job.name,
            },
          );
        },
        breadcrumb: /* @ngInject */ (job) => job.name, // update breadcrumb with job id
      },
    },
  );
