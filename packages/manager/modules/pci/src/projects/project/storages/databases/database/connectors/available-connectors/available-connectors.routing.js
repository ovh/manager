export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.connectors.available-connectors';
  $stateProvider.state(stateName, {
    url: '/available-connectors',
    views: {
      modal: {
        component: 'ovhManagerPciProjectDatabaseAvailableConnectors',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => false,
      goBack: /* @ngInject */ (goBackToConnectors) => goBackToConnectors,
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
          'pci.projects.project.storages.databases.dashboard.connectors.add',
          { availableConnectorId },
        );
      },
    },
    atInternet: {
      ignore: true,
    },
  });
};
