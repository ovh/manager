export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.users.show-secret',
    {
      url: '/show-secret',
      params: {
        user: null,
        type: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseUsersShowSecretComponent',
        },
      },
      layout: 'modal',
      resolve: {
        user: /* @ngInject */ ($transition$) => $transition$.params().user,
        type: /* @ngInject */ ($transition$) => $transition$.params().type,
        secretKeyAndAccess: /* @ngInject */ (
          DatabaseService,
          projectId,
          database,
          user,
        ) =>
          DatabaseService.getUserCertificate(
            projectId,
            database.engine,
            database.id,
            user.id,
          ),
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
      },
    },
  );
};
