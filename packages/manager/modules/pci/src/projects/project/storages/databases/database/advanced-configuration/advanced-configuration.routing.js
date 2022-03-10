export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.advanced-configuration';
  $stateProvider.state(stateName, {
    url: '/advanced-configuration',
    views: {
      databaseView: 'ovhManagerPciProjectDatabaseAdvancedConfiguration',
    },
    resolve: {
      breadcrumb: () => false,
      goBack: /* @ngInject */ (database, goToDatabase) => (message, type) =>
        goToDatabase(database, message, type),
      advancedConfigurationList: /* @ngInject */ (
        database,
        DatabaseService,
        projectId,
      ) =>
        DatabaseService.getAdvancedConfigurationList(
          projectId,
          database.engine,
          database.id,
        ),
      advancedConfiguration: /* @ngInject */ (
        database,
        DatabaseService,
        projectId,
      ) =>
        DatabaseService.getAdvancedConfiguration(
          projectId,
          database.engine,
          database.id,
        ),
    },
    atInternet: {
      ignore: true,
    },
  });
};
