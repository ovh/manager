export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.pools.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabasePoolsAddComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToPools) => goBackToPools,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
