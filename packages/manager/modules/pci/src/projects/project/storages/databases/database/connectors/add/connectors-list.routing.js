export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.connectors.list';
  $stateProvider.state(stateName, {
    url: '/connectors-list',
    views: {
      modal: {
        component: 'ovhManagerPciProjectDatabaseConnectorsList',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => false,
      goBack: /* @ngInject */ (database, goBackToConnectors) => (
        message,
        type,
      ) => goBackToConnectors(database, message, type),
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
    },
    atInternet: {
      ignore: true,
    },
  });
};
