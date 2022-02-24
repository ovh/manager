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
        connectorConfiguration: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          connector,
        ) =>
          DatabaseService.getAvailableConnectorConfiguration(
            projectId,
            database.engine,
            database.id,
            connector.connectorId,
          ),
        transformsConfiguration: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          connector,
        ) =>
          DatabaseService.getAvailableConnectorTransformsConfiguration(
            projectId,
            database.engine,
            database.id,
            connector.connectorId,
          ),
        availableConnector: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          connector,
          connectorConfiguration,
          transformsConfiguration,
        ) =>
          DatabaseService.getAvailableConnector(
            projectId,
            database.engine,
            database.id,
            connector.connectorId,
          ).then((availableConnector) => {
            availableConnector.setConfiguration(
              connectorConfiguration.filter(
                (config) =>
                  config.name !== 'name' && config.name !== 'connector.class',
              ),
              transformsConfiguration,
            );
            return availableConnector;
          }),
        goBack: /* @ngInject */ (goBackToConnectors) => goBackToConnectors,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
