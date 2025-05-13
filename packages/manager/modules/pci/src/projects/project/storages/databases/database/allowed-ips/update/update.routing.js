export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.allowed-ips.update',
    {
      url: '/update',
      params: {
        allowedIp: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabasesAllowedIp',
        },
      },
      layout: 'modal',
      resolve: {
        allowedIp: /* @ngInject */ ($transition$) =>
          $transition$.params().allowedIp,
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAllowedIps) => goBackToAllowedIps,
      },
    },
  );
};
