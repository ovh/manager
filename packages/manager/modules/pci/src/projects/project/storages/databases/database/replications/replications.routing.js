import { DATABASE_TYPES } from '../../databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.replications',
    {
      url: '/replications',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseReplicationsComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_replications_tab_title'),
        goBackToReplications: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.replications';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        replicationsList: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
        ) =>
          DatabaseService.getReplications(
            projectId,
            database.engine,
            database.id,
          ),
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
        goToAddReplications: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.replications.add',
            {
              projectId,
              databaseId,
            },
          ),
        goToEditReplications: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => (replication) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.replications.add',
            {
              projectId,
              databaseId,
              replication,
            },
          ),
        refreshReplications: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const state =
            'pci.projects.project.storages.databases.dashboard.replications';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToDeleteReplications: /* @ngInject */ ($state) => (user) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.replications.delete',
            {
              user,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
