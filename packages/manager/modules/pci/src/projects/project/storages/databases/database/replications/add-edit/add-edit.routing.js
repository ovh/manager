export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'pci.projects.project.storages.databases.dashboard.replications.add',
      {
        url: '/add',
        component: 'ovhManagerPciProjectDatabaseReplicationsAddEditComponent',
        resolve: {
          breadcrumb: () => null, // Hide breadcrumb
          goBack: /* @ngInject */ (goBackToReplications) =>
            goBackToReplications,
          isUpdate: /* @ngInject */ () => false,
        },
        atInternet: {
          ignore: true,
        },
      },
    )
    .state(
      'pci.projects.project.storages.databases.dashboard.replications.edit',
      {
        url: '/edit',
        component: 'ovhManagerPciProjectDatabaseReplicationsAddEditComponent',
        params: {
          replication: null,
        },
        resolve: {
          breadcrumb: () => null, // Hide breadcrumb
          goBack: /* @ngInject */ (goBackToReplications) =>
            goBackToReplications,
          isUpdate: () => true,
          replication: /* @ngInject */ ($transition$) =>
            $transition$.params().replication,
        },
        atInternet: {
          ignore: true,
        },
      },
    );
};
