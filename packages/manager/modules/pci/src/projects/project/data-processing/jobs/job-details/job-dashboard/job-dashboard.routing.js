import { DATA_PROCESSING_TRACKING_PREFIX } from '../../../data-processing.constants';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.jobs.job-details.dashboard',
    {
      url: '/dashboard',
      component: 'pciProjectDataProcessingJobDetailsDashboard',
      resolve: {
        // retrieve job id from url params
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          jobId,
        ) => dataProcessingService.getJob(projectId, jobId),
        notebooks: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getNotebooks(projectId),
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
        showNotebook: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go('pci.projects.project.data-processing.notebooks.details', {
            projectId,
            notebookId: job.notebook,
          });
        },
        showBillingConsole: /* @ngInject */ ($state, projectId) => () => {
          $state.go('pci.projects.project.billing', {
            projectId,
          });
        },
        browseObjectStorage: /* @ngInject */ ($state, projectId) => (
          containerId,
        ) => {
          $state.go(
            'pci.projects.project.storages.object-storage.objects.object',
            {
              projectId,
              containerId,
            },
          );
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('data_processing_details_dashboard_label'), // update breadcrumb with "Dashboard"
      },
      atInternet: {
        rename: `${DATA_PROCESSING_TRACKING_PREFIX}::jobs::job-details::dashboard`,
      },
    },
  );
