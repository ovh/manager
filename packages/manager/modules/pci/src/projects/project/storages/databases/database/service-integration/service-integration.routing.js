import { DATABASE_TYPES } from '../../databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.service-integration',
    {
      url: '/service-integration',
      views: {
        databaseView:
          'ovhManagerPciStoragesDatabaseServiceIntegrationComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_service_integration_tab_title'),
        goBackToServiceIntegration: /* @ngInject */ (
          $state,
          CucCloudMessage,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.service-integration';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        kafkaServicesList: /* @ngInject */ (DatabaseService, projectId) =>
          DatabaseService.getDatabases(projectId, DATABASE_TYPES.KAFKA),
        serviceIntegrationList: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
        ) =>
          DatabaseService.getIntegrations(
            projectId,
            database.engine,
            database.id,
          ),
        addableServicesList: /* @ngInject */ (
          kafkaServicesList,
          serviceIntegrationList,
        ) =>
          kafkaServicesList.filter(
            (k) => !serviceIntegrationList.find((i) => i.serviceId === k.id),
          ),
        goToAddServiceIntegration: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.service-integration.add',
            {
              projectId,
              databaseId,
            },
          ),
        refreshServiceIntegration: /* @ngInject */ (
          $state,
          CucCloudMessage,
        ) => (message = false, type = 'success') => {
          const state =
            'pci.projects.project.storages.databases.dashboard.service-integration';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToDeleteServiceIntegration: /* @ngInject */ ($state) => (
          serviceIntegration,
        ) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.service-integration.delete',
            {
              integration: serviceIntegration,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
