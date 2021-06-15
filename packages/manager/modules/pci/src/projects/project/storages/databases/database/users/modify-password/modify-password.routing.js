export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.users.modify-password',
    {
      url: '/modify-password',
      params: {
        user: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseUsersModifyPasswordComponent',
        },
      },
      layout: 'modal',
      resolve: {
        user: /* @ngInject */ ($transition$) => $transition$.params().user,
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
      },
    },
  );
};
