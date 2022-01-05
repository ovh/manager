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
        users: /* @ngInject */ (DatabaseService, database, projectId) => {
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
          DatabaseService,
        ) => {
          return DatabaseService.getServiceDatabases(
            projectId,
            database.engine,
            databaseId,
          );
        },
        goToAddPool: /* @ngInject */ ($state, trackDashboard) => () => {
          trackDashboard('pools::add_pool', 'action');
          $state.go(
            'pci.projects.project.storages.databases.dashboard.pools.add',
          );
        },
        goToInformation: /* @ngInject */ ($state, trackDashboard) => (pool) => {
          trackDashboard('pools::entry_menu::information', 'action');
          $state.go(
            'pci.projects.project.storages.databases.dashboard.pools.information',
            { poolId: pool.id },
          );
        },
        goToModify: /* @ngInject */ ($state, trackDashboard) => (pool) => {
          trackDashboard('pools::entry_menu::modify', 'action');
          $state.go(
            'pci.projects.project.storages.databases.dashboard.pools.edit',
            { poolId: pool.id },
          );
        },
        goToTerminate: /* @ngInject */ ($state, trackDashboard) => (pool) => {
          trackDashboard('pools::entry_menu::delete', 'action');
          $state.go(
            'pci.projects.project.storages.databases.dashboard.pools.terminate',
            { poolId: pool.id },
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
