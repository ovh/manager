export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.connectors.edit',
    {
      url: '/edit/:connectorId/config',
      component: 'ovhManagerPciStoragesDatabaseEditConnectorConfigComponent',
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
          ).then((availableConnector) =>
            DatabaseService.getAvailableConnectorConfiguration(
              projectId,
              database.engine,
              database.id,
              availableConnector.id,
            ).then((connectorConfig) => {
              availableConnector.setConfiguration(connectorConfig);
              return availableConnector;
            }),
          ),
        goBack: /* @ngInject */ (goBackToConnectors) => goBackToConnectors,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
