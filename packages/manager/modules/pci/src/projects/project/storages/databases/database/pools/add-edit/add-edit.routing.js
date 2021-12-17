export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.databases.dashboard.pools.add', {
      url: '/add',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabasePoolsAddEditComponent',
        },
      },
      layout: 'modal',
      resolve: {
        isUpdate: () => false,
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToPools) => goBackToPools,
      },
      atInternet: {
        ignore: true,
      },
    })
    .state('pci.projects.project.storages.databases.dashboard.pools.edit', {
      url: '/:poolId/edit',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabasePoolsAddEditComponent',
        },
      },
      layout: 'modal',
      params: {
        poolId: null,
      },
      resolve: {
        isUpdate: () => true,
        breadcrumb: () => null,
        poolId: /* @ngInject */ ($transition$) => $transition$.params().poolId,
        pool: /* @ngInject */ (pools, poolId) =>
          pools.find((pool) => pool.id === poolId),
        goBack: /* @ngInject */ (goBackToPools) => goBackToPools,
      },
      atInternet: {
        ignore: true,
      },
    });
};
