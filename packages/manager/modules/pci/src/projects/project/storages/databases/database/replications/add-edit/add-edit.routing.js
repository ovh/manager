import { DATABASE_TYPES } from '../../../databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'pci.projects.project.storages.databases.dashboard.replications.add',
      {
        url: '/add',
        component: 'ovhManagerPciProjectDatabaseReplicationsAddEdit',
        resolve: {
          breadcrumb: () => null, // Hide breadcrumb
          goBack: /* @ngInject */ (goBackToReplications) =>
            goBackToReplications,
          isUpdate: /* @ngInject */ () => false,
          kafkaSource: (projectId, DatabaseService) =>
            DatabaseService.getDatabases(projectId, DATABASE_TYPES.KAFKA),
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
        component: 'ovhManagerPciProjectDatabaseReplicationsAddEdit',
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
