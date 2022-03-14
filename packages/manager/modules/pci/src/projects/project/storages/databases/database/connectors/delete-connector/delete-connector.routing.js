export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.connectors.delete',
    {
      url: '/delete/:connectorId',
      params: {
        connectorId: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseDeleteConnectorComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToConnectors) => goBackToConnectors,
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
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
