import template from './private-database-database.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database', {
    url: '/database',
    template,
    controller: 'PrivateDatabaseBDDsCtrl',
    redirectTo: 'app.private-database.dashboard.database.list',
    resolve: {
      goToDatabases: /* @ngInject */ ($state) => () =>
        $state.go('app.private-database.dashboard.database.list'),
      goToDumps: /* @ngInject */ ($state) => (database) =>
        $state.go('app.private-database.dashboard.database.dashboard.dump', {
          databaseName: database.databaseName,
        }),
      goToExtensions: /* @ngInject */ ($state) => () =>
        $state.go('app.private-database.dashboard.database.extension'),
      goToArchives: /* @ngInject */ ($state) => () =>
        $state.go('app.private-database.dashboard.database.archive.list'),
      goToArchivesDump: /* @ngInject */ ($state) => (database) =>
        $state.go(
          'app.private-database.dashboard.database.archive.dashboard.dump',
          {
            database: database.databaseName,
          },
        ),
      goToUsers: /* @ngInject */ ($state) => (database) =>
        $state.go('app.private-database.dashboard.database.dashboard.user', {
          databaseName: database.databaseName,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_database'),
    },
  });

  $stateProvider.state('app.private-database.dashboard.database.dashboard', {
    url: '/:databaseName',
    template: '<div ui-view></div>',
    redirectTo: 'app.private-database.dashboard.database',
    resolve: {
      databaseName: /* @ngInject */ ($transition$) =>
        $transition$.params().databaseName,
      breadcrumb: /* @ngInject */ (databaseName) => databaseName,
    },
  });
};
