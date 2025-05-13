export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.connectors.tasks',
    {
      url: '/:connectorId/tasks',
      component: 'ovhManagerPciStoragesDatabaseConnectorTasksComponent',
      params: {
        connectorId: null,
      },
      resolve: {
        breadcrumb: () => null,
        connectorId: /* @ngInject */ ($transition$) =>
          $transition$.params().connectorId,
        connector: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          connectorId,
        ) =>
          DatabaseService.getConnector(
            projectId,
            database.engine,
            database.id,
            connectorId,
          ).then((connector) =>
            DatabaseService.getConnectorTasks(
              projectId,
              database.engine,
              database.id,
              connector.id,
            ).then((tasks) => {
              connector.setTasks(tasks);
              return connector;
            }),
          ),
        availableConnector: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          connector,
        ) =>
          DatabaseService.getAvailableConnector(
            projectId,
            database.engine,
            database.id,
            connector.connectorId,
          ).then((availableConnector) => {
            connector.setConnectorInfofmation(availableConnector);
          }),
        goToEdit: /* @ngInject */ ($state, trackDashboard) => (connector) => {
          trackDashboard('connectors::tasks::modify_connector', 'action');
          $state.go(
            'pci.projects.project.storages.databases.dashboard.connectors.edit',
            {
              connectorId: connector.id,
            },
          );
        },
        goBack: /* @ngInject */ (goBackToConnectors, trackDashboard) => () => {
          trackDashboard('connectors::tasks::go_back_to_connectors', 'action');
          return goBackToConnectors();
        },
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
