export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.indexes.delete-pattern',
    {
      url: '/delete-pattern',
      params: {
        pattern: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseIndexesDeletePatternComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToIndexes) => goBackToIndexes,
        pattern: /* @ngInject */ ($transition$) =>
          $transition$.params().pattern,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
