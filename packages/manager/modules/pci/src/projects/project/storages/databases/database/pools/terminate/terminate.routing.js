export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.pools.terminate',
    {
      url: '/:poolId/terminate',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabasePoolsAddEditComponent',
        },
      },
      params: {
        poolId: null,
      },
      layout: 'modal',
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
