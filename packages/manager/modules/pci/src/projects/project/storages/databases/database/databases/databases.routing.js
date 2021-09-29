export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.databases',
    {
      url: '/databases',
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseDatabasesComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_databases_tab_title'),
        goBackToDatabase: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.databases';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        databasesList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getServiceDatabases(
            projectId,
            database.engine,
            database.id,
          ),
        addDatabase: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.databases.create-database',
            {
              projectId,
              databaseId,
            },
          ),
        deleteDatabase: /* @ngInject */ ($state) => (dbInstance) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.databases.delete-database',
            {
              dbInstance,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
