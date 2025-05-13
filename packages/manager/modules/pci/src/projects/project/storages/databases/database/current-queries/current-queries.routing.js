export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.current-queries';
  $stateProvider.state(stateName, {
    url: '/current-queries',
    views: {
      databaseView: 'ovhManagerPciProjectDatabaseCurrentQueries',
    },
    resolve: {
      breadcrumb: () => false,
      goBack: /* @ngInject */ (database, goToDatabase) => (message, type) =>
        goToDatabase(database, message, type),
    },
    atInternet: {
      ignore: true,
    },
  });
};
