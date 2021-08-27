export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.databases.create-database',
    {
      url: '/upgrade-version',
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
