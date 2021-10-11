export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.indexes',
    {
      url: '/indexes',
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseIndexesComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_indexes_tab_title'),
        goBackToIndexes: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.indexes';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        refreshIndexes: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const state =
            'pci.projects.project.storages.databases.dashboard.indexes';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        indexesList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getIndexes(projectId, database.engine, database.id),
        patternsList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getPatterns(projectId, database.engine, database.id),
        deleteIndex: /* @ngInject */ ($state) => (index) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.indexes.delete-index',
            {
              index,
            },
          ),
        deletePattern: /* @ngInject */ ($state) => (pattern) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.indexes.delete-pattern',
            {
              pattern,
            },
          ),
        addPattern: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.indexes.create-pattern',
            {
              projectId,
              databaseId,
            },
          ),
      },
    },
  );
};
