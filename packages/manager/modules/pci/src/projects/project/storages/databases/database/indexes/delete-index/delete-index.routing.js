export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.indexes.delete-index',
    {
      url: '/delete-index',
      params: {
        index: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseIndexesDeleteIndexComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToIndexes) => goBackToIndexes,
        index: /* @ngInject */ ($transition$) => $transition$.params().index,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
