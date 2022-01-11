import map from 'lodash/map';
import User from '../../../../../../components/project/storages/databases/user.class';
import { SECRET_TYPE } from '../../databases.constants';
import { STATUS } from '../../../../../../components/project/storages/databases/databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.users',
    {
      url: '/users',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseUsersComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_users_title'),
        users: /* @ngInject */ (DatabaseService, database, projectId) => {
          // Poll the database status
          if (database.isProcessing()) {
            DatabaseService.pollDatabaseStatus(
              projectId,
              database.engine,
              database.id,
            ).then((databaseInfo) => database.updateData(databaseInfo));
          }
          // Get and return the users
          return DatabaseService.getUsers(
            projectId,
            database.engine,
            database.id,
          ).then((usersResponse) => {
            const users = map(usersResponse, (u) => new User(u));
            // Poll every processing user status
            users.forEach((user) => {
              if (user.isProcessing()) {
                DatabaseService.pollUserStatus(
                  projectId,
                  database.engine,
                  database.id,
                  user.id,
                ).then((userInfos) => {
                  // If the user is deleted, remove it from the array
                  // else, update data
                  if (userInfos.status === STATUS.DELETING) {
                    users.splice(users.indexOf(user), 1);
                  } else {
                    user.updateData({
                      ...userInfos,
                      rolesArray: userInfos.roles,
                    });
                  }
                });
              }
            });
            return users;
          });
        },
        roles: /* @ngInject */ (DatabaseService, database, projectId) =>
          DatabaseService.getRoles(
            projectId,
            database.engine,
            database.id,
          ).then((roles) =>
            roles.map((role, index) => {
              return {
                id: index,
                name: role,
              };
            }),
          ),
        goToAddUser: /* @ngInject */ ($state, database, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.users.add',
            {
              projectId,
              databaseId: database.id,
            },
          ),
        goToDeleteUser: /* @ngInject */ ($state, database, projectId) => (
          user,
        ) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.users.delete',
            {
              projectId,
              databaseId: database.id,
              userId: user.id,
            },
          ),
        goToModifyPassword: /* @ngInject */ ($state, projectId) => (user) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.users.modify-password',
            {
              projectId,
              user,
            },
          ),
        goToShowKey: /* @ngInject */ ($state, database, projectId) => (user) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.users.show-secret',
            {
              projectId,
              databaseId: database.id,
              user,
              type: SECRET_TYPE.key,
            },
          ),
        goToUserInformations: /* @ngInject */ ($state, database, projectId) => (
          user,
        ) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.users.informations',
            {
              projectId,
              databaseId: database.id,
              user,
            },
          ),
        goToShowCert: /* @ngInject */ ($state, database, projectId) => (user) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.users.show-secret',
            {
              projectId,
              databaseId: database.id,
              user,
              type: SECRET_TYPE.cert,
            },
          ),
        goToUsers: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.users';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        stopPollingUsersStatus: /* @ngInject */ (
          DatabaseService,
          databaseId,
          users,
        ) => () => {
          users.forEach((user) =>
            DatabaseService.stopPollingUserStatus(databaseId, user.id),
          );
        },
        stopPollingDatabaseStatus: /* @ngInject */ (
          DatabaseService,
          databaseId,
        ) => () => {
          DatabaseService.stopPollingDatabaseStatus(databaseId);
        },
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
