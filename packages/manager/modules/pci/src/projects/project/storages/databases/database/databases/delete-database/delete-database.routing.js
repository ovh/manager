export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.databases.delete-database',
    {
      url: '/delete-database',
      params: {
        dbInstance: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseDatabasesDeleteDatabaseComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToDatabase) => goBackToDatabase,
        dbInstance: /* @ngInject */ ($transition$) =>
          $transition$.params().dbInstance,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
