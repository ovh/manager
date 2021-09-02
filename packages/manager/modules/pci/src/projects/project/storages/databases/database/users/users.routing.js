import find from 'lodash/find';
import set from 'lodash/set';

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
        users: /* @ngInject */ (DatabaseService, database, projectId, roles) =>
          DatabaseService.getUsers(
            projectId,
            database.engine,
            database.id,
          ).then((users) =>
            roles
              ? users.map((user) =>
                  set(
                    user,
                    'roles',
                    user.roles?.map((role) => find(roles, { name: role })),
                  ),
                )
              : users,
          ),
        addUser: /* @ngInject */ (
          $state,
          database,
          projectId,
          trackDatabases,
        ) => () => {
          trackDatabases('dashboard::users::add_a_user');
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
          trackDatabases,
        ) => (user) => {
          trackDatabases('dashboard::users::options_menu::delete_user');
          return $state.go(
            'pci.projects.project.storages.databases.dashboard.users.delete',
            {
              projectId,
              databaseId: database.id,
              userId: user.id,
            },
          );
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
          trackDatabases,
        ) => (user) => {
          trackDatabases('dashboard::users::options_menu::modify_password');
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
      },
    },
  );
};
