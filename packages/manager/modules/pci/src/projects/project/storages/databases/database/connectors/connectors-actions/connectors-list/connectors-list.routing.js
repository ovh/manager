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
        ).then((connectors) =>
          connectors.sort((a, b) => a.name.localeCompare(b.name)),
        ),
      goToConnectorConfig: /* @ngInject */ ($state, trackDashboard) => (
        availableConnectorId,
      ) => {
        trackDashboard('connectors::add', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.config',
          { availableConnectorId },
        );
      },
    },
    atInternet: {
      ignore: true,
    },
  });
};
