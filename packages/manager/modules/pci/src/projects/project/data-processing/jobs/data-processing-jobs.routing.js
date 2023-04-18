import { DATA_PROCESSING_TRACKING_PREFIX } from '../data-processing.constants';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing.jobs', {
    url: '/jobs?id',
    component: 'pciProjectDataProcessingJobs',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('data_processing_jobs'),
      submitJob: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.data-processing.jobs.submit-job', {
          projectId,
        }),
      showJob: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go(
          'pci.projects.project.data-processing.jobs.job-details.dashboard',
          {
            projectId,
            jobId,
          },
          {
            reload: true,
          },
        ),
      showJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing.jobs',
          { projectId },
          {
            reload: true,
          },
        ),
      terminateJob: /* @ngInject */ ($state, projectId) => (jobId, jobName) => {
        $state.go('pci.projects.project.data-processing.jobs.terminate', {
          projectId,
          jobId,
          jobName,
        });
      },
      jobId: /* @ngInject */ ($transition$) => $transition$.params().id,
      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'dataProcessing'),
    },
    atInternet: {
      rename: `${DATA_PROCESSING_TRACKING_PREFIX}::jobs`,
    },
  });
