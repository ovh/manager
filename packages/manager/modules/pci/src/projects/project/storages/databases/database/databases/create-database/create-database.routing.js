export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.databases.create-database',
    {
      url: '/create-database',
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseDatabasesCreateDatabaseComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
