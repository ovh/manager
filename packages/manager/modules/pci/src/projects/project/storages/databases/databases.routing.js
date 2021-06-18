import map from 'lodash/map';

import { DATABASES_GUIDES_URL, DATABASE_TYPES } from './databases.constants';
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
      /* The DATABASE_TYPES.MONGO_DB is to be removed when we have multiple engines
         The API will give us the engine data at that time and we will have a
         new API to give us all the databases (across engines) consolidated. */
      databases: /* @ngInject */ (
        $q,
        DatabaseService,
        getDatabaseObject,
        projectId,
      ) =>
        DatabaseService.getDatabases(
          projectId,
          DATABASE_TYPES.MONGO_DB,
        ).then((databases) =>
          $q.all(map(databases, (database) => getDatabaseObject(database))),
        ),

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
              CucCloudMessage.flushMessages(stateName);
              CucCloudMessage[type](message, stateName);
            })
          : promise;
      },

      goToDeleteDatabase: /* @ngInject */ ($state, projectId) => (database) =>
        $state.go('pci.projects.project.storages.databases.delete', {
          projectId,
          database,
        }),

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
    },
  });
};
