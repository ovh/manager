import find from 'lodash/find';
import isFeatureActivated from '../features.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.dashboard', {
    url: '/:databaseId',
    component: 'ovhManagerPciProjectDatabase',
    resolve: {
      allowedIpsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.allowed-ips',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      allowedIps: /* @ngInject */ (DatabaseService, database, projectId) =>
        isFeatureActivated('allowedIpsTab', database.engine)
          ? DatabaseService.getIpRestrictions(
              projectId,
              database.engine,
              database.id,
            )
          : [],
      backupsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.backups',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      poolsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href('pci.projects.project.storages.databases.dashboard.pools', {
          projectId,
          type,
          databaseId,
        }),
      queryStatisticsLink: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
        type,
      ) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.query-statistics',
          {
            projectId,
            type,
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
      generalInformationLink: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
        type,
      ) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.general-information',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      usersLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href('pci.projects.project.storages.databases.dashboard.users', {
          projectId,
          type,
          databaseId,
        }),
      logsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href('pci.projects.project.storages.databases.dashboard.logs', {
          projectId,
          type,
          databaseId,
        }),
      metricsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.metrics',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      databasesLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.databases',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      aclLink: ($state, databaseId, projectId, type) =>
        $state.href('pci.projects.project.storages.databases.dashboard.acl', {
          projectId,
          type,
          databaseId,
        }),
      userAclLink: ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.useracl',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      topicsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.topics',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      indexesLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.indexes',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      serviceIntegrationLink: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
        type,
      ) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.service-integration',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      replicationsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.replications',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      currentQueriesLink: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
        type,
      ) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.current-queries',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      namespacesLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.namespaces',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      connectorsLink: /* @ngInject */ ($state, databaseId, projectId, type) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.connectors',
          {
            projectId,
            type,
            databaseId,
          },
        ),
      advancedConfigurationLink: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
        type,
      ) =>
        $state.href(
          'pci.projects.project.storages.databases.dashboard.advanced-configuration',
          {
            projectId,
            type,
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
