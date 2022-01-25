import map from 'lodash/map';

import {
  DATABASES_GUIDES_URL,
  NODES_PER_ROW,
  SHELL_NAMES,
} from './databases.constants';
import { WARNING_DATE } from '../../../../components/project/warning-message/warning.constants';
import Database from '../../../../components/project/storages/databases/database.class';
import Node from '../../../../components/project/storages/databases/node.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases', {
    url: '/databases?id',
    component: 'ovhManagerPciProjectDatabases',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('databases')
        .then((databases) =>
          databases.length === 0
            ? { state: 'pci.projects.project.storages.databases.onboarding' }
            : false,
        ),
    resolve: {
      databaseGuideUrl: () => DATABASES_GUIDES_URL,
      goToAddDatabase: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.databases.add', { projectId }),
      databaseId: /* @ngInject */ ($transition$) => $transition$.params().id,
      databases: /* @ngInject */ (
        $q,
        DatabaseService,
        getDatabaseObject,
        projectId,
      ) =>
        DatabaseService.getAllDatabases(projectId).then((databases) =>
          $q.all(map(databases, (database) => getDatabaseObject(database))),
        ),
      showPaymentWarning: /* @ngInject */ () => (databases) => {
        const oldDb = databases.some(
          (db) =>
            SHELL_NAMES[db.engine] &&
            SHELL_NAMES[db.engine] !== 'mongo' &&
            moment(db.createdAt).isBefore(
              moment(WARNING_DATE.DB_CREATION_DATE, WARNING_DATE.DATE_FORMAT),
            ),
        );
        return (
          oldDb &&
          moment().isBefore(
            moment(WARNING_DATE.WARNING_END_DATE, WARNING_DATE.DATE_FORMAT),
          )
        );
      },

      getDatabaseObject: /* @ngInject */ (getNodes) => (database) =>
        getNodes(database).then(
          (nodes) =>
            new Database({
              ...database,
              nodes,
            }),
        ),

      getNodes: /* @ngInject */ (DatabaseService, getNodeObject, projectId) => (
        database,
      ) =>
        DatabaseService.getNodes(
          projectId,
          database.engine,
          database.id,
        ).then((nodes) => map(nodes, (node) => getNodeObject(node))),

      getNodeObject: () => (node) => new Node(node),

      engines: /* @ngInject */ (DatabaseService, projectId) =>
        DatabaseService.getEngines(projectId),

      newDatabases: () => ({}),

      goToDatabases: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.storages.databases';

        const promise = $state.go(
          state,
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, state));
        }

        return promise;
      },

      databaseLink: /* @ngInject */ ($state, projectId) => (database) =>
        $state.href('pci.projects.project.storages.databases.dashboard', {
          projectId,
          databaseId: database.id,
        }),

      goToDatabase: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        database,
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const stateName =
          'pci.projects.project.storages.databases.dashboard.general-information';

        const promise = $state.go(
          stateName,
          {
            projectId,
            databaseId: database.id,
          },
          {
            reload,
          },
        );
        return message
          ? promise.then(() => {
              CucCloudMessage.flushMessages(`${stateName}-${database.id}`);
              CucCloudMessage[type](message, `${stateName}-${database.id}`);
            })
          : promise;
      },
      goToConfirmDeleteDatabase: /* @ngInject */ ($state) => (
        database,
        linkedServices,
      ) =>
        $state.go('pci.projects.project.storages.databases.confirm-delete', {
          database,
          linkedServices,
        }),
      goToDeleteDatabase: /* @ngInject */ ($state, projectId) => (database) =>
        $state.go('pci.projects.project.storages.databases.delete', {
          projectId,
          database,
        }),
      goToEditName: /* @ngInject */ ($state, projectId) => (databaseId) =>
        $state.go('pci.projects.project.storages.databases.name', {
          projectId,
          databaseId,
        }),
      goToUpgradePlan: /* @ngInject */ ($state, projectId) => (databaseId) =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-plan',
          {
            projectId,
            databaseId,
          },
        ),
      goToUpgradeVersion: /* @ngInject */ ($state, projectId) => (databaseId) =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-version',
          {
            projectId,
            databaseId,
          },
        ),
      goToUpgradeNode: /* @ngInject */ ($state, projectId) => (databaseId) =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-node',
          {
            projectId,
            databaseId,
          },
        ),
      goBack: /* @ngInject */ (goToDatabases) => (message, type) =>
        goToDatabases(message, type),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_database_list_title'),

      databasesTrackPrefix: () =>
        'PublicCloud::pci::projects::project::storages::databases',

      privateNetworks: /* @ngInject */ (DatabaseService, projectId) =>
        DatabaseService.getPrivateNetworks(projectId),

      trackDatabases: /* @ngInject */ (
        databasesTrackPrefix,
        trackClick,
        trackPage,
      ) => (complement, type = 'action', prefix = true) => {
        const name = `${
          prefix ? `${databasesTrackPrefix}::` : ''
        }${complement}`;
        switch (type) {
          case 'action':
          case 'navigation':
            trackClick(name, type);
            break;
          case 'page':
            trackPage(name);
            break;
          default:
            trackClick(name);
        }
      },

      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        atInternet.trackClick({
          name: hit,
          type,
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackPage({
          name: hit,
        });
      },

      nodesPerRow: () => NODES_PER_ROW,
    },
  });
};
