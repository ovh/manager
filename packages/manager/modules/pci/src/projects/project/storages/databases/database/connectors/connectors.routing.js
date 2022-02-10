export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.connectors';
  $stateProvider.state(stateName, {
    url: '/connectors',
    views: {
      databaseView: 'ovhManagerPciProjectDatabaseConnectors',
    },
    resolve: {
      breadcrumb: () => false,
      goBackToConnectors: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state =
          'pci.projects.project.storages.databases.dashboard.connectors';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },
      goToAdd: /* @ngInject */ ($state, trackDashboard) => () => {
        trackDashboard('connectors::add', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.list',
        );
      },
      connectorsList: /* @ngInject */ (database, DatabaseService, projectId) =>
        DatabaseService.getConnectors(projectId, database.engine, database.id),
    },
    atInternet: {
      ignore: true,
    },
  });
};
