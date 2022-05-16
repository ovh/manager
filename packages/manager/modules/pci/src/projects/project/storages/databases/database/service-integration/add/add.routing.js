import Database from '../../../../../../../components/project/storages/databases/database.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.service-integration.add',
    {
      url: '/add',
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseServiceIntegrationAddComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToServiceIntegration) =>
          goBackToServiceIntegration,
        servicesList: /* @ngInject */ (DatabaseService, projectId) =>
          DatabaseService.getAllDatabases(projectId).then((databases) =>
            databases
              .map((db) => new Database(db))
              .filter((db) => db.isActive()),
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
