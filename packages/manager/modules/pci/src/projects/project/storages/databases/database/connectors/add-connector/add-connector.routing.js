export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.connectors.add',
    {
      url: '/:availableConnectorId/add',
      component: 'ovhManagerPciStoragesDatabaseAddConnectorComponent',
      params: {
        availableConnectorId: null,
      },
      resolve: {
        breadcrumb: () => null,
        availableConnectorId: /* @ngInject */ ($transition$) =>
          $transition$.params().availableConnectorId,
        connectorConfiguration: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          availableConnectorId,
        ) =>
          DatabaseService.getAvailableConnectorConfiguration(
            projectId,
            database.engine,
            database.id,
            availableConnectorId,
          ),
        transformsConfiguration: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          availableConnectorId,
        ) =>
          DatabaseService.getAvailableConnectorTransformsConfiguration(
            projectId,
            database.engine,
            database.id,
            availableConnectorId,
          ),
        availableConnector: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          availableConnectorId,
          connectorConfiguration,
          transformsConfiguration,
        ) =>
          DatabaseService.getAvailableConnector(
            projectId,
            database.engine,
            database.id,
            availableConnectorId,
          ).then((availableConnector) => {
            availableConnector.setConfiguration(
              connectorConfiguration,
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
