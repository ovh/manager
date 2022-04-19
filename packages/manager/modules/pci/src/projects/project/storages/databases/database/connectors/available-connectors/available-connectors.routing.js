import { AVAILABLE_CONNECTOR_TYPES } from '../../../../../../../components/project/storages/databases/connectors.constants';

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
      goBack: /* @ngInject */ (goBackToConnectors, trackDashboard) => () => {
        trackDashboard('connectors::add_a_connector_cancel', 'action');
        return goBackToConnectors();
      },
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
          connectors
            .filter((connector) => connector.latest)
            .sort((a, b) => {
              // Put sources connectors first, then order by name
              if (a.type === b.type) {
                return a.name.localeCompare(b.name);
              }
              return a.type === AVAILABLE_CONNECTOR_TYPES.SINK ? 1 : -1;
            }),
        ),
      goToConnectorConfig: /* @ngInject */ (
        $state,
        trackDashboard,
        trackDatabases,
      ) => (connector) => {
        trackDashboard('connectors::add_a_connector_confirm', 'action');
        trackDatabases(
          `databases_Kafka_Connect_add_a_connector::${
            connector.type
          }::${connector.name
            .replace(/[^a-zA-Z0-9_]/g, '_')
            .toLowerCase()}::confirm`,
          'action',
          false,
        );
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.add',
          { availableConnectorId: connector.id },
        );
      },
    },
    atInternet: {
      ignore: true,
    },
  });
};
