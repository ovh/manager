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
      goToEdit: /* @ngInject */ ($state, trackDashboard) => (connector) => {
        trackDashboard('connectors::edit', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.edit',
          {
            connectorId: connector.id,
          },
        );
      },
      goToDelete: /* @ngInject */ ($state, trackDashboard) => (connector) => {
        trackDashboard('connectors::delete', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.delete',
          {
            connectorId: connector.id,
          },
        );
      },
      goToAdd: /* @ngInject */ ($state, trackDashboard) => () => {
        trackDashboard('connectors::add', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.list',
        );
      },
      availableConnectors: /* @ngInject */ (
        database,
        DatabaseService,
        projectId,
      ) =>
        DatabaseService.getAvailableConnectors(
          projectId,
          database.engine,
          database.id,
        ),
      connectorsList: /* @ngInject */ (
        database,
        DatabaseService,
        projectId,
        availableConnectors,
      ) =>
        DatabaseService.getConnectors(
          projectId,
          database.engine,
          database.id,
        ).then((connectors) =>
          connectors.map((connector) => {
            const connectorInfo = availableConnectors.find(
              (c) => c.id === connector.connectorId,
            );
            return {
              ...connector,
              connectorInfo,
            };
          }),
        ),
    },
    atInternet: {
      ignore: true,
    },
  });
};
