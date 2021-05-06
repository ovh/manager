export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.allowed-ips.delete',
    {
      url: '/delete',
      params: {
        ipToDelete: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseAllowedIpsDeleteComponent',
        },
      },
      layout: 'modal',
      resolve: {
        ipToDelete: /* @ngInject */ ($transition$) =>
          $transition$.params().ipToDelete,
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAllowedIps) => goBackToAllowedIps,
      },
    },
  );
};
