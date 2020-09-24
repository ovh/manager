import { STATUS } from '../../../enterprise-cloud-database.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'enterprise-cloud-database.service.details.restored-instances',
    {
      component:
        'enterpriseCloudDatabaseServiceDetailsRestoredInstancesComponent',
      url: '/restored-instances',
      resolve: {
        endPoints: /* @ngInject */ (
          clusterId,
          enterpriseCloudDatabaseService,
        ) => enterpriseCloudDatabaseService.getEndpointsWithDetails(clusterId),
        goBackToRestore: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = STATUS.SUCCESS,
          clusterId = null,
        ) => {
          const reload = message && type === STATUS.SUCCESS;
          const state =
            'enterprise-cloud-database.service.details.restored-instances';
          const promise = $state.go(
            state,
            {
              clusterId,
            },
            {
              reload,
            },
          );
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToDelete: /* @ngInject */ ($state) => (instanceId) =>
          $state.go(
            'enterprise-cloud-database.service.details.restored-instances.delete',
            { instanceId },
          ),
        refreshRestoredInstances: /* @ngInject */ (
          $state,
          enterpriseCloudDatabaseService,
        ) => () => {
          enterpriseCloudDatabaseService.resetRestoredInstancesCache();
          return $state.reload();
        },
        restoredInstances: /* @ngInject */ (
          clusterId,
          enterpriseCloudDatabaseService,
        ) => enterpriseCloudDatabaseService.getRestoreList(clusterId),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('enterprise_cloud_database_restored_instances'),
      },
    },
  );
};
