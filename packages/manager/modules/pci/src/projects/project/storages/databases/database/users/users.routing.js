import map from 'lodash/map';
import User from '../../../../../../components/project/storages/databases/user.class';
import isFeatureActivated from '../../features.constants';
import { SECRET_TYPE } from '../../databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.users',
    {
      url: '/users',
      views: {
        databaseView: 'pciProjectsProjectUsers',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_projects_project_users_title'),
        users: /* @ngInject */ (DatabaseService, database, projectId) =>
          DatabaseService.getUsers(
            projectId,
            database.engine,
            database.id,
          ).then((users) => {
            const mappedUsers = map(users, (u) => new User(u));
            mappedUsers.forEach((u) => {
              if (u.isProcessing()) {
                DatabaseService.pollUserStatus(
                  projectId,
                  database.engine,
                  database.id,
                  u.id,
                ).then((userInfos) => {
                  u.updateData({ ...userInfos, rolesArray: userInfos.roles });
                });
              }
            });
            return mappedUsers;
          }),
        addUser: /* @ngInject */ (
          $state,
          database,
          projectId,
          trackDashboard,
        ) => () => {
          trackDashboard('users::add_a_user');
          return $state.go(
            'pci.projects.project.storages.databases.dashboard.users.add',
            {
              projectId,
              databaseId: database.id,
            },
          );
        },
        deleteUser: /* @ngInject */ (
          $state,
          database,
          projectId,
          trackDashboard,
        ) => (user) => {
          trackDashboard('users::options_menu::delete_user');
          return $state.go(
            'pci.projects.project.storages.databases.dashboard.users.delete',
            {
              projectId,
              databaseId: database.id,
              userId: user.id,
            },
          );
        },

        showKey: /* @ngInject */ (
          $state,
          database,
          projectId,
          trackDashboard,
        ) => {
          if (isFeatureActivated('showKey', database.engine)) {
            return (user) => {
              trackDashboard('users::options_menu::show_key');
              return $state.go(
                'pci.projects.project.storages.databases.dashboard.users.show-secret',
                {
                  projectId,
                  databaseId: database.id,
                  user,
                  type: SECRET_TYPE.key,
                },
              );
            };
          }
          return null;
        },
        showUserInformations: /* @ngInject */ (
          $state,
          database,
          projectId,
          trackDashboard,
        ) => {
          if (isFeatureActivated('showUserInformations', database.engine)) {
            return (user) => {
              trackDashboard('users::options_menu::show_informations');
              return $state.go(
                'pci.projects.project.storages.databases.dashboard.users.informations',
                {
                  projectId,
                  databaseId: database.id,
                  user,
                },
              );
            };
          }
          return null;
        },

        showCert: /* @ngInject */ (
          $state,
          database,
          projectId,
          trackDashboard,
        ) => {
          if (isFeatureActivated('showCert', database.engine)) {
            return (user) => {
              trackDashboard('dashboard::users::options_menu::show_cert');
              return $state.go(
                'pci.projects.project.storages.databases.dashboard.users.show-secret',
                {
                  projectId,
                  databaseId: database.id,
                  user,
                  type: SECRET_TYPE.cert,
                },
              );
            };
          }
          return null;
        },

        isActionDisabled: /* @ngInject */ (database) => () =>
          !database.isActive(),

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
        goToUsers: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'pci.projects.project.storages.databases.dashboard.users',
            {
              projectId,
            },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() =>
              CucCloudMessage[type](message, 'pci.projects.project.users'),
            );
          }

          return promise;
        },

        goToModifyPassword: /* @ngInject */ (
          $state,
          projectId,
          trackDashboard,
        ) => (user) => {
          trackDashboard('users::options_menu::modify_password');
          return $state.go(
            'pci.projects.project.storages.databases.dashboard.users.modify-password',
            {
              projectId,
              user,
            },
          );
        },

        guideUrl: () => null,
        hideRolesMatrix: () => true,
        onDestroy: /* @ngInject */ (DatabaseService, users, database) => () =>
          users.forEach((u) =>
            DatabaseService.stopPollingUserStatus(database.id, u.id),
          ),
      },
    },
  );
};
