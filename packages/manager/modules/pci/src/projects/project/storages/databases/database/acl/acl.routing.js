export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.acl',
    {
      url: '/acl',
      cache: false,
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
        addAcl: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.acl.add',
            {
              projectId,
              databaseId,
            },
          ),
        deleteAcl: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
        ) => () =>
          DatabaseService.deleteServiceAcl(
            projectId,
            database.engine,
            database.id,
          ),
      },
    },
  );
};
