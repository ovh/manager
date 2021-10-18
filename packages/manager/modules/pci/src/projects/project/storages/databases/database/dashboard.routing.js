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
        return DatabaseService.getDatabaseDetails(
          projectId,
          db.engine,
          databaseId,
        ).then((details) => {
          db.updateData({
            ...db,
            ...details,
          });
          return db;
        });
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
      databasesLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.databases',
          {
            projectId,
            databaseId,
          },
        ),
      aclLink: ($state, databaseId, projectId) =>
        $state.href('pci.projects.project.storages.databases.dashboard.acl', {
          projectId,
          databaseId,
        }),
      userAclLink: ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.useracl',
          {
            projectId,
            databaseId,
          },
        ),
      topicsLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.topics',
          {
            projectId,
            databaseId,
          },
        ),
      indexesLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.indexes',
          {
            projectId,
            databaseId,
          },
        ),
      serviceIntegrationLink: /* @ngInject */ ($state, databaseId, projectId) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.service-integration',
          {
            projectId,
            databaseId,
          },
        ),
      isFeatureActivated: /* @ngInject */ (engine) => (feature) =>
        isFeatureActivated(feature, engine.name),
    },
    redirectTo:
      'pci.projects.project.storages.databases.dashboard.general-information',
  });
};
