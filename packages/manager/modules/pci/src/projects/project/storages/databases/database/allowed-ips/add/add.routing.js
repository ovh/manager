export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.allowed-ips.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabasesAllowedIp',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAllowedIps) => goBackToAllowedIps,
        existingIps: /* @ngInject */ (allowedIps) =>
          allowedIps.map((allowedIp) => allowedIp.ip),
      },
    },
  );
};
