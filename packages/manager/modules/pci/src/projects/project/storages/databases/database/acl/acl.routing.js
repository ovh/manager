export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.acl',
    {
      url: '/acl',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseAclComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_database_acl_title'),
        goBackToAcl: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state = 'pci.projects.project.storages.databases.dashboard.acl';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        aclList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getServiceAcl(
            projectId,
            database.engine,
            database.id,
          ),
        goToAddAcl: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.acl.add',
            {
              projectId,
              databaseId,
            },
          ),
        refreshAcl: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const state = 'pci.projects.project.storages.databases.dashboard.acl';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        deleteAcl: /* @ngInject */ (DatabaseService, database, projectId) => (
          aclId,
        ) =>
          DatabaseService.deleteServiceAcl(
            projectId,
            database.engine,
            database.id,
            aclId,
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
