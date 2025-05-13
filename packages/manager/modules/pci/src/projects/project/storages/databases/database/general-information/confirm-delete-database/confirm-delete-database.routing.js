export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.confirm-delete',
    {
      url: '/confirm-delete',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseConfirmDelete',
        },
      },
      params: {
        database: null,
        linkedServices: [],
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        database: /* @ngInject */ ($transition$) =>
          $transition$.params().database,
        linkedServices: /* @ngInject */ ($transition$) =>
          $transition$.params().linkedServices,
        goBack: /* @ngInject */ (database, goToDatabases, goToDatabase) => (
          message = false,
          type = 'success',
        ) => {
          if (type === 'success' && message) {
            return goToDatabases(message, type);
          }
          return goToDatabase(database, message, type);
        },
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
