export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.query-statistics',
    {
      url: '/query-statistics?page&pageSize',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseQueryStatisticsComponent',
      },
      params: {
        page: {
          value: '1',
          squash: true,
        },
        pageSize: {
          value: '10',
          squash: true,
        },
      },
      resolve: {
        queryStatistics: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
          paginationNumber,
          paginationSize,
        ) => {
          return DatabaseService.getQueryStatistics(
            projectId,
            database.engine,
            database.id,
            paginationSize,
            paginationNumber,
          );
        },
        paginationNumber: /* @ngInject */ ($transition$) =>
          parseInt($transition$.params().page, 25),
        paginationSize: /* @ngInject */ ($transition$) =>
          parseInt($transition$.params().pageSize, 25),
        onListParamsChange: /* @ngInject */ ($state) => (params) =>
          $state.go('.', params, {
            notify: false,
          }),
        goBackToQueryStatistics: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.query-statistics';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_allowed_query-statistics'),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
