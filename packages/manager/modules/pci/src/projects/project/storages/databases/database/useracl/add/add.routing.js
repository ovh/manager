export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.useracl.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseUserAclAdd',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        goBack: /* @ngInject */ (goBackToUserAcl) => goBackToUserAcl,
        usersList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getUsers(projectId, database.engine, database.id),
        permissionsList: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
        ) =>
          DatabaseService.getPermissions(
            projectId,
            database.engine,
            database.id,
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
