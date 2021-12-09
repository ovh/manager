export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.replications.delete-replication',
    {
      url: '/delete-replication',
      params: {
        replication: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseReplicationsDeleteReplicationComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToReplications) => goBackToReplications,
        replication: /* @ngInject */ ($transition$) =>
          $transition$.params().replication,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
