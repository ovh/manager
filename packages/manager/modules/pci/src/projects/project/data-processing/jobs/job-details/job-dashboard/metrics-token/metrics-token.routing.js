import { DATA_PROCESSING_TRACKING_PREFIX } from '../../../../data-processing.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.jobs.job-details.dashboard.metrics-token',
    {
      url: '/metrics',
      views: {
        modal: {
          component: 'pciProjectDataProcessingMetricsTokenModal',
        },
      },
      layout: 'modal',
      params: {
        jobId: null,
        projectId: null,
      },
      resolve: {
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        metricsToken: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getMetricsToken(projectId),
        goBack: /* @ngInject */ ($state, projectId, jobId) => () =>
          $state.go(
            'pci.projects.project.data-processing.jobs.job-details.dashboard',
            {
              projectId,
              jobId,
            },
            {
              reload: false,
            },
          ),
      },
      atInternet: {
        rename: `${DATA_PROCESSING_TRACKING_PREFIX}::jobs::job-details::dashboard::metrics-token`,
      },
    },
  );
};
