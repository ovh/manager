export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.users.informations',
    {
      url: '/informations',
      params: {
        user: null,
        type: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseUsersInformationsComponent',
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
