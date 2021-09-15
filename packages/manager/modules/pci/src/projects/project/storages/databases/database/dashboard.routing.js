import find from 'lodash/find';
import isFeatureActivated from '../features.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.dashboard', {
    url: '/:databaseId',
    component: 'ovhManagerPciProjectDatabase',
    resolve: {
      allowedIpsLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.allowed-ips',
          {
            projectId,
            databaseId,
          },
        ),
      allowedIps: /* @ngInject */ (DatabaseService, database, projectId) =>
        DatabaseService.getIpRestrictions(
          projectId,
          database.engine,
          database.id,
        ),
      backupsLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.backups',
          {
            projectId,
            databaseId,
          },
        ),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      databaseId: /* @ngInject */ ($transition$) =>
        $transition$.params().databaseId,
      dashboardTrackPrefix: (database) =>
        `PublicCloud::pci::projects::project::storages::databases::dashboard::${database.engine}::`,
      trackDashboard: /* @ngInject */ (
        dashboardTrackPrefix,
        trackDatabases,
      ) => (complement, type = 'action') =>
        trackDatabases(dashboardTrackPrefix + complement, type, false),
      database: /* @ngInject */ (
        databaseId,
        databases,
        projectId,
        DatabaseService,
      ) => {
        const db = find(databases, { id: databaseId });
        if (isFeatureActivated('certificate', db.engine) && !db.certificate) {
          DatabaseService.getCertificate(projectId, db.engine, databaseId).then(
            (data) => {
              db.certificate = data;
              return data;
            },
          );
        }
        return db;
      },
      engine: /* @ngInject */ (database, engines) =>
        find(engines, { name: database.engine }),
      breadcrumb: /* @ngInject */ (database) => database.description,
      generalInformationLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.general-information',
          {
            projectId,
            databaseId,
          },
        ),
      usersLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href('pci.projects.project.storages.databases.dashboard.users', {
          projectId,
          databaseId,
        }),
      logsLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href('pci.projects.project.storages.databases.dashboard.logs', {
          projectId,
          databaseId,
        }),
      metricsLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.metrics',
          {
            projectId,
            databaseId,
          },
        ),
    },
    redirectTo:
      'pci.projects.project.storages.databases.dashboard.general-information',
  });
};
