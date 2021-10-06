export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.useracl',
    {
      url: '/useracl',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseUserAclComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_database_useracl_title'),
        goBackToUserAcl: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.useracl';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        aclState: () => true,
        setAclState: () => (value) => value,
        usersList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getUsers(projectId, database.engine, database.id),
        goToAddUserAcl: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.useracl.add',
            {
              projectId,
              databaseId,
            },
          ),
        goToManagerUsers: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () =>
          $state.go('pci.projects.project.storages.databases.dashboard.users', {
            projectId,
            databaseId,
          }),
        refreshUserAcl: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const state =
            'pci.projects.project.storages.databases.dashboard.useracl';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToDeleteUserAcl: /* @ngInject */ ($state) => (acl) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.useracl.delete',
            {
              acl,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
