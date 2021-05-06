export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.delete',
    {
      url: '/delete',
      params: {
        database: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabasesDeleteDatabase',
        },
      },
      layout: 'modal',
      resolve: {
        database: /* @ngInject */ ($transition$) =>
          $transition$.params().database,
        goBack: /* @ngInject */ (database, goToDatabases, goToDatabase) => (
          message = false,
          type = 'success',
        ) => {
          if (type === 'success' && message) {
            return goToDatabases(message, type);
          }
          return goToDatabase(database, message, type);
        },
        breadcrumb: () => null,
        trackingPrefix: () => 'dashboard::general_information',
      },
    },
  );
};
