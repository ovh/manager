export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.pools.edit',
    {
      url: '/:poolId/edit',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabasePoolsEditComponent',
        },
      },
      layout: 'modal',
      params: {
        poolId: null,
      },
      resolve: {
        breadcrumb: () => null,
        poolId: /* @ngInject */ ($transition$) => $transition$.params().poolId,
        pool: /* @ngInject */ (pools, poolId) =>
          pools.find((pool) => pool.id === poolId),
        goBack: /* @ngInject */ (goBackToPools) => goBackToPools,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
