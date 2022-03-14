import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.connectors';
  $stateProvider.state(stateName, {
    url: '/connectors',
    views: {
      databaseView: 'ovhManagerPciProjectDatabaseConnectors',
    },
    resolve: {
      breadcrumb: () => false,
      goBackToConnectors: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state =
          'pci.projects.project.storages.databases.dashboard.connectors';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },
      goToEdit: /* @ngInject */ ($state, trackDashboard) => (connector) => {
        trackDashboard('connectors::edit', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.edit',
          {
            connectorId: connector.id,
          },
        );
      },
      goToDelete: /* @ngInject */ ($state, trackDashboard) => (connector) => {
        trackDashboard('connectors::delete', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.delete',
          {
            connectorId: connector.id,
          },
        );
      },
      goToAdd: /* @ngInject */ ($state, trackDashboard) => () => {
        trackDashboard('connectors::add', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.available-connectors',
        );
      },
      goToTasks: /* @ngInject */ ($state, trackDashboard) => (connector) => {
        trackDashboard('connectors::tasks', 'action');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.connectors.tasks',
          {
            connectorId: connector.id,
          },
        );
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
        ),
      connectorsList: /* @ngInject */ (
        database,
        DatabaseService,
        projectId,
        availableConnectors,
        $q,
      ) =>
        DatabaseService.getConnectors(
          projectId,
          database.engine,
          database.id,
        ).then((connectors) =>
          $q.all(
            map(connectors, (connector) => {
              return DatabaseService.getConnectorTasks(
                projectId,
                database.engine,
                database.id,
                connector.id,
              ).then((tasks) => {
                const connectorInfo = availableConnectors.find(
                  (c) => c.id === connector.connectorId,
                );
                connector.setConnectorInfofmation(connectorInfo);
                connector.setTasks(tasks);
                return connector;
              });
            }),
          ),
        ),
    },
    atInternet: {
      ignore: true,
    },
  });
};
