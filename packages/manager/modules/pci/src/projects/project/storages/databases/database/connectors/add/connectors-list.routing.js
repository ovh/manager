export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.connectors.list';
  $stateProvider.state(stateName, {
    url: '/add/list',
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
      goToConnectorConfig: /* @ngInject */ ($state, trackDashboard) => (
        connectorId,
      ) => {
        trackDashboard('connectors::add', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.config',
          { connectorId },
        );
      },
    },
    atInternet: {
      ignore: true,
    },
  });
};
