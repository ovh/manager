export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.maintenances',
    {
      url: '/maintenances',
      views: {
        databaseView: 'ovhManagerPciProjectDatabaseMaintenances',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_maintenances'),
        maintenances: /* @ngInject */ (DatabaseService, database, projectId) =>
          DatabaseService.getMaintenances(
            projectId,
            database.engine,
            database.id,
          ),
        goBacktoGeneralInformation: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () => {
          $state.go('pci.projects.project.storages.databases.dashboard', {
            projectId,
            databaseId,
          });
        },
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
