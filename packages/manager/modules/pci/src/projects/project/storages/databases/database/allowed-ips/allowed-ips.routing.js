export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.allowed-ips',
    {
      url: '/allowed-ips',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseAllowedIpsComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_allowed_ips'),
        goBackToAllowedIps: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.allowed-ips';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToAddIp: /* @ngInject */ ($state) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.allowed-ips.add',
          ),
        goToDeleteIpBlock: /* @ngInject */ ($state) => (ipToDelete) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.allowed-ips.delete',
            {
              ipToDelete,
            },
          ),
        goToUpdateIp: /* @ngInject */ ($state) => (allowedIp) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.allowed-ips.update',
            {
              allowedIp,
            },
          ),
      },
    },
  );
};
