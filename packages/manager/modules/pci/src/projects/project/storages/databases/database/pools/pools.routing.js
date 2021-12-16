export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.pools',
    {
      url: '/pools',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabasePoolsComponent',
      },
      resolve: {
        pools: /* @ngInject */ (DatabaseService, projectId, databaseId) => {
          return DatabaseService.getPools(projectId, databaseId);
        },
        users: /* @ngInject */ (
          pools,
          DatabaseService,
          database,
          projectId,
        ) => {
          if (pools.length === 0) return [];
          return DatabaseService.getUsers(
            projectId,
            database.engine,
            database.id,
          );
        },
        postgresDatabases: /* @ngInject */ (
          projectId,
          databaseId,
          database,
          pools,
          DatabaseService,
        ) => {
          if (pools.length === 0) return [];
          return DatabaseService.getServiceDatabases(
            projectId,
            database.engine,
            databaseId,
          );
        },
        goBackToPools: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.pools';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_pools_title'),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
