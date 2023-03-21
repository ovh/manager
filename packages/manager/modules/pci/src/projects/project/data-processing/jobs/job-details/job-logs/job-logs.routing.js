import { DATA_PROCESSING_TRACKING_PREFIX } from '../../../data-processing.constants';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.jobs.job-details.logs',
    {
      url: '/logs',
      component: 'pciProjectDataProcessingJobLogs',
      resolve: {
        // retrieve job id from url params
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          jobId,
        ) => dataProcessingService.getJob(projectId, jobId),
        logContainer: /* @ngInject */ (
          PciStoragesContainersService,
          projectId,
          jobId,
        ) =>
          PciStoragesContainersService.getAll(projectId, false).then(
            (containers) => {
              const logContainer = containers.find(
                (storage) => storage.name === 'odp-logs',
              );
              if (logContainer) {
                return PciStoragesContainersService.getContainer(
                  projectId,
                  logContainer.id,
                ).then(({ objects }) => {
                  return {
                    ...logContainer,
                    objects: objects.filter((object) =>
                      object.name.includes(jobId),
                    ),
                  };
                });
              }
              return null;
            },
          ),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('data_processing_details_logs_title'), // update breadcrumb with "/ Logs"

        /**
         * Redirect to the object storage and project provided while including a filter on the job id
         */
        redirectToObjectStorage: /* @ngInject */ ($state, jobId) => (
          projectId,
          containerId,
        ) =>
          $state.go(
            'pci.projects.project.storages.object-storage.objects.object',
            {
              projectId,
              containerId,
              defaultCriteria: [
                {
                  property: 'name',
                  operator: 'contains',
                  value: jobId,
                },
              ],
            },
          ),
      },
      atInternet: {
        rename: `${DATA_PROCESSING_TRACKING_PREFIX}::jobs::job-details::logs`,
      },
    },
  );
