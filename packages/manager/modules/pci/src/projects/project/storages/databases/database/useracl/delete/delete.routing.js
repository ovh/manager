export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.useracl.delete',
    {
      url: '/delete',
      params: {
        user: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseUserAclDeleteComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToUserAcl) => goBackToUserAcl,
        user: /* @ngInject */ ($transition$) => $transition$.params().user,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
