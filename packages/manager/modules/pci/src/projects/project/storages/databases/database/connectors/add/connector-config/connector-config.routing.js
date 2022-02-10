import groupBy from 'lodash/groupBy';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.connectors.config',
    {
      url: '/add/:connectorId/config',
      component: 'ovhManagerPciStoragesDatabaseConnectorConfigComponent',
      params: {
        connectorId: null,
      },
      resolve: {
        breadcrumb: () => null,
        connectorId: /* @ngInject */ ($transition$) =>
          $transition$.params().connectorId,
        connectorConfig: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          connectorId,
        ) =>
          DatabaseService.getAvailableConnector(
            projectId,
            database.engine,
            database.id,
            connectorId,
          ).then((connectorInfo) =>
            DatabaseService.getAvailableConnectorConfiguration(
              projectId,
              database.engine,
              database.id,
              connectorId,
            ).then((connectorConfig) => ({
              ...connectorInfo,
              config: groupBy(connectorConfig, 'group'),
            })),
          ),
        goBack: /* @ngInject */ (goBackToConnectors) => goBackToConnectors,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
