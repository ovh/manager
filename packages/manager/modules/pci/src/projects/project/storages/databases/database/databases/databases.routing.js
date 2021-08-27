export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.databases',
    {
      url: '/databases',
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseDatabasesComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_database_databases_title'),
        addDatabase: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.databases.create-database',
            {
              projectId,
              databaseId,
            },
          ),
      },
    },
  );
};
