export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.indexes.create-pattern',
    {
      url: '/create-pattern',
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseIndexesCreatePatternComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToIndexes) => goBackToIndexes,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
